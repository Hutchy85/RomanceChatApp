import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError, ErrorType, getErrorMessage } from '../utils/errorHandling';
import { DEFAULT_CHARACTER_STATS } from '../types';
import { PlayerChoice,
  StoryMemory,
  SessionCheckpoint,
  StorySession,
  SaveMetadata,
  GameSave,
  Message,
  CloudSyncStatus,
  CharacterStats,
} from '../types';


// Enhanced save/load service
export class StorySessionManager {
  private static readonly SAVE_KEY = 'story_game_save';
  private static readonly BACKUP_KEY = 'story_game_save_backup';
  private static readonly VERSION = '2.0.0';
  private static readonly MAX_CHECKPOINTS = 10;
  private static readonly CHECKPOINT_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  private gameSave: GameSave | null = null;
  private lastCheckpointTime: number = 0;

  // Initialize or load the game save
  async initialize(): Promise<void> {
    try {
      await this.loadGameSave();
    } catch (error) {
      console.error('Failed to initialize save system:', error);
      // Create new save structure if none exists
      await this.createNewGameSave();
    }
  }

  // Create a new game save structure
  private async createNewGameSave(): Promise<void> {
    this.gameSave = {
      metadata: {
        version: StorySessionManager.VERSION,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        appVersion: '1.0.0', // You'd get this from your app config
      },
      sessions: {},
    };
    await this.saveGameSave();
  }

  // Load the complete game save
  private async loadGameSave(): Promise<void> {
    try {
      const saveData = await AsyncStorage.getItem(StorySessionManager.SAVE_KEY);
      
      if (!saveData) {
        throw new AppError('No save data found', ErrorType.STORAGE);
      }

      const parsed = JSON.parse(saveData) as GameSave;
      
      // Validate and potentially migrate save data
      await this.validateAndMigrateSave(parsed);
      
      this.gameSave = parsed;
    } catch (error) {
      // Try to load from backup
      await this.loadFromBackup();
    }
  }

  // Load from backup if main save fails
  private async loadFromBackup(): Promise<void> {
    try {
      const backupData = await AsyncStorage.getItem(StorySessionManager.BACKUP_KEY);
      
      if (!backupData) {
        throw new AppError('No backup data found', ErrorType.STORAGE);
      }

      const parsed = JSON.parse(backupData) as GameSave;
      await this.validateAndMigrateSave(parsed);
      
      this.gameSave = parsed;
      
      // Restore main save from backup
      await this.saveGameSave();
      
      console.log('Successfully restored from backup');
    } catch (error) {
      throw new AppError('Failed to load save data', ErrorType.STORAGE, true, error as Error);
    }
  }

  // Validate and migrate save data for version compatibility
  private async validateAndMigrateSave(save: GameSave): Promise<void> {
    // Add migration logic here as your app evolves
    if (!save.metadata || !save.sessions) {
      throw new AppError('Invalid save data structure', ErrorType.VALIDATION);
    }

    // Example migration from v1.0.0 to v2.0.0
    if (save.metadata.version === '1.0.0') {
      // Perform migration logic
      save.metadata.version = '2.0.0';
      console.log('Migrated save data from v1.0.0 to v2.0.0');
    }
  }

  // Save the complete game save with backup
  private async saveGameSave(): Promise<void> {
    if (!this.gameSave) return;

    try {
      // Create backup of current save before overwriting
      const currentSave = await AsyncStorage.getItem(StorySessionManager.SAVE_KEY);
      if (currentSave) {
        await AsyncStorage.setItem(StorySessionManager.BACKUP_KEY, currentSave);
      }

      // Update metadata
      this.gameSave.metadata.lastModified = new Date().toISOString();

      // Save new data
      const saveData = JSON.stringify(this.gameSave);
      await AsyncStorage.setItem(StorySessionManager.SAVE_KEY, saveData);

    } catch (error) {
      throw new AppError('Failed to save game data', ErrorType.STORAGE, true, error as Error);
    }
  }

  // Create a new story session
  async createSession(storyId: string, characterName?: string): Promise<string> {
    if (!this.gameSave) {
      await this.initialize();
    }

    const sessionId = `${storyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession: StorySession = {
      id: sessionId,
      storyId,
      version: 1,
      currentSceneId: 'prologue', // or your starting scene
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      isCompleted: false,
      characterStats: { ...DEFAULT_CHARACTER_STATS },
      storyFlags: {},
      customVariables: characterName ? { characterName } : {},
      choices: [],
      memories: [],
      messages: [],
      checkpoints: [],
      totalPlayTime: 0,
      choiceCount: 0,
      scenesVisited: ['prologue'],
    };

    this.gameSave!.sessions[sessionId] = newSession;
    await this.saveGameSave();

    return sessionId;
  }

  // Get a specific session
  getSession(sessionId: string): StorySession | null {
    return this.gameSave?.sessions[sessionId] || null;
  }

  // Get all sessions for a story
  getSessionsForStory(storyId: string): StorySession[] {
    if (!this.gameSave) return [];
    
    return Object.values(this.gameSave.sessions)
      .filter(session => session.storyId === storyId)
      .sort((a, b) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime());
  }

  // Update session data
  async updateSession(sessionId: string, updates: Partial<StorySession>): Promise<void> {
    if (!this.gameSave?.sessions[sessionId]) {
      throw new AppError(`Session ${sessionId} not found`, ErrorType.VALIDATION);
    }

    const session = this.gameSave.sessions[sessionId];
    
    // Merge updates
    Object.assign(session, updates, {
      lastPlayedAt: new Date().toISOString(),
    });

    // Create checkpoint if enough time has passed
    await this.maybeCreateCheckpoint(session);

    await this.saveGameSave();
  }

  // Record a player choice
  async recordChoice(sessionId: string, choice: Omit<PlayerChoice, 'timestamp'>): Promise<void> {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new AppError(`Session ${sessionId} not found`, ErrorType.VALIDATION);
    }

    const fullChoice: PlayerChoice = {
      ...choice,
      timestamp: new Date().toISOString(),
    };

    session.choices.push(fullChoice);
    session.choiceCount++;
    session.lastPlayedAt = new Date().toISOString();

    // Apply character stat effects if present
    if (choice.effects) {
      Object.entries(choice.effects).forEach(([key, value]) => {
        if (typeof value === 'number' && typeof session.characterStats[key] === 'number') {
          (session.characterStats[key] as number) += value;
        } else if (typeof value === 'string') {
          session.characterStats[key] = value;
        }
      });
    }

    // Add scene to visited list if not already there
    if (!session.scenesVisited.includes(choice.sceneId)) {
      session.scenesVisited.push(choice.sceneId);
    }

    await this.saveGameSave();
  }

  // Record a story memory/event
  async recordMemory(sessionId: string, memory: Omit<StoryMemory, 'timestamp'>): Promise<void> {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new AppError(`Session ${sessionId} not found`, ErrorType.VALIDATION);
    }

    const fullMemory: StoryMemory = {
      ...memory,
      timestamp: new Date().toISOString(),
    };

    session.memories.push(fullMemory);
    await this.saveGameSave();
  }

  // Update character stats
  async updateCharacterStats(sessionId: string, stats: Partial<CharacterStats>): Promise<void> {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new AppError(`Session ${sessionId} not found`, ErrorType.VALIDATION);
    }

    Object.assign(session.characterStats, stats);
    session.lastPlayedAt = new Date().toISOString();

    await this.saveGameSave();
  }

  // Create a checkpoint for quick recovery
  private async maybeCreateCheckpoint(session: StorySession): Promise<void> {
    const now = Date.now();
    
    if (now - this.lastCheckpointTime < StorySessionManager.CHECKPOINT_INTERVAL) {
      return;
    }

    const checkpoint: SessionCheckpoint = {
      sceneId: session.currentSceneId,
      timestamp: new Date().toISOString(),
      characterStats: { ...session.characterStats },
      recentChoices: session.choices.slice(-5),
      storyFlags: { ...session.storyFlags },
    };

    session.checkpoints.push(checkpoint);

    // Keep only the most recent checkpoints
    if (session.checkpoints.length > StorySessionManager.MAX_CHECKPOINTS) {
      session.checkpoints = session.checkpoints.slice(-StorySessionManager.MAX_CHECKPOINTS);
    }

    this.lastCheckpointTime = now;
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    if (!this.gameSave?.sessions[sessionId]) {
      throw new AppError(`Session ${sessionId} not found`, ErrorType.VALIDATION);
    }

    delete this.gameSave.sessions[sessionId];
    await this.saveGameSave();
  }

  // Get save summary for UI
  getSaveSummary(): { totalSessions: number; totalPlayTime: number; storiesStarted: number } {
    if (!this.gameSave) {
      return { totalSessions: 0, totalPlayTime: 0, storiesStarted: 0 };
    }

    const sessions = Object.values(this.gameSave.sessions);
    const uniqueStories = new Set(sessions.map(s => s.storyId));

    return {
      totalSessions: sessions.length,
      totalPlayTime: sessions.reduce((total, session) => total + session.totalPlayTime, 0),
      storiesStarted: uniqueStories.size,
    };
  }

  // Export save data (for backup or cloud sync)
  async exportSaveData(): Promise<string> {
    if (!this.gameSave) {
      await this.initialize();
    }
    return JSON.stringify(this.gameSave, null, 2);
  }

  // Import save data (for restore or cloud sync)
  async importSaveData(saveData: string): Promise<void> {
    try {
      const imported = JSON.parse(saveData) as GameSave;
      await this.validateAndMigrateSave(imported);
      
      this.gameSave = imported;
      await this.saveGameSave();
    } catch (error) {
      throw new AppError('Failed to import save data', ErrorType.VALIDATION, false, error as Error);
    }
  }

  // Clear all save data (for reset/debug)
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      StorySessionManager.SAVE_KEY,
      StorySessionManager.BACKUP_KEY,
    ]);
    
    this.gameSave = null;
    await this.createNewGameSave();
  }
}

// Singleton instance for easy access throughout your app
export const storySessionManager = new StorySessionManager();

// Re-export the CharacterStats type for convenience
export type { CharacterStats };