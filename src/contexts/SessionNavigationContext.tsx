import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { storySessionManager } from '../data/sessionstorage';
import { useNavigation } from '@react-navigation/native';
import { CharacterStats, DEFAULT_CHARACTER_STATS, StorySession } from '../types';
import { stories } from '../data/stories'; // Import your stories data

interface SessionNavigationContextType {
  currentSession: StorySession | null;
  setCurrentSession: (session: StorySession | null) => void;
  
  // Session management methods
  createNewSession: (storyId: string, characterName?: string) => Promise<string>;
  loadSession: (sessionId: string) => Promise<StorySession | null>;
  updateCurrentSession: (updates: Partial<StorySession>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  
  // Character stats management
  updateCharacterStats: (updates: Partial<CharacterStats>) => Promise<void>;
  initializeCharacterStats: (initialStats?: Partial<CharacterStats>) => Promise<void>;
  
  // Navigation state
  isLoading: boolean;
  error: string | null;
  
  // Session utilities
  getSessionsForStory: (storyId: string) => StorySession[];
  canResumeSession: (session: StorySession) => boolean;
  getSessionProgress: (session: StorySession) => number; // 0-100
}

const SessionNavigationContext = createContext<SessionNavigationContextType | null>(null);

interface SessionNavigationProviderProps {
  children: ReactNode;
}

export const SessionNavigationProvider: React.FC<SessionNavigationProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<StorySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the session manager
  useEffect(() => {
    const initializeSessionManager = async () => {
      try {
        setIsLoading(true);
        await storySessionManager.initialize();
      } catch (err) {
        setError('Failed to initialize session manager');
        console.error('Session manager initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSessionManager();
  }, []);

  // Create a new session
  const createNewSession = useCallback(async (storyId: string, characterName?: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const sessionId = await storySessionManager.createSession(storyId, characterName);
      const newSession = storySessionManager.getSession(sessionId);
      
      if (newSession) {
        setCurrentSession(newSession);
        
        // Initialize character stats for new session
        await initializeCharacterStats(DEFAULT_CHARACTER_STATS);
      }
      
      return sessionId;
    } catch (err) {
      const errorMessage = 'Failed to create new session';
      setError(errorMessage);
      console.error('Create session error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load an existing session
  const loadSession = useCallback(async (sessionId: string): Promise<StorySession | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const session = storySessionManager.getSession(sessionId);
      
      if (session) {
        setCurrentSession(session);
        
        // Update last played time
        await storySessionManager.updateSession(sessionId, {
          lastPlayedAt: new Date().toISOString(),
        });
      } else {
        setError('Session not found');
      }
      
      return session;
    } catch (err) {
      const errorMessage = 'Failed to load session';
      setError(errorMessage);
      console.error('Load session error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the current session
  const updateCurrentSession = useCallback(async (updates: Partial<StorySession>): Promise<void> => {
    if (!currentSession) {
      throw new Error('No current session to update');
    }

    try {
      await storySessionManager.updateSession(currentSession.id, updates);
      
      // Update local state
      const updatedSession = storySessionManager.getSession(currentSession.id);
      if (updatedSession) {
        setCurrentSession(updatedSession);
      }
    } catch (err) {
      const errorMessage = 'Failed to update session';
      setError(errorMessage);
      console.error('Update session error:', err);
      throw new Error(errorMessage);
    }
  }, [currentSession]);

  // Initialize character stats with default values
  const initializeCharacterStats = useCallback(async (initialStats: Partial<CharacterStats> = {}) => {
    if (!currentSession) {
      throw new Error('No current session to initialize stats for');
    }

    const stats: CharacterStats = {
      ...DEFAULT_CHARACTER_STATS,
      ...initialStats,
    };

    try {
      await updateCurrentSession({
        characterStats: stats,
      });
    } catch (error) {
      const errorMessage = 'Failed to initialize character stats';
      setError(errorMessage);
      console.error('Initialize character stats error:', error);
      throw new Error(errorMessage);
    }
  }, [currentSession, updateCurrentSession]);

  // Update character stats
  const updateCharacterStats = useCallback(async (updates: Partial<CharacterStats>) => {
    if (!currentSession) {
      throw new Error('No current session to update stats for');
    }

    try {
      const currentStats = currentSession.characterStats || DEFAULT_CHARACTER_STATS;
      const updatedStats: CharacterStats = {
        ...currentStats,
        ...updates,
      };

      // Clamp numeric values between 0 and 100
      Object.keys(updatedStats).forEach(key => {
        const value = updatedStats[key];
        if (typeof value === 'number') {
          updatedStats[key] = Math.max(0, Math.min(100, value));
        }
      });

      await updateCurrentSession({
        characterStats: updatedStats,
      });
    } catch (error) {
      const errorMessage = 'Failed to update character stats';
      setError(errorMessage);
      console.error('Update character stats error:', error);
      throw new Error(errorMessage);
    }
  }, [currentSession, updateCurrentSession]);

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await storySessionManager.deleteSession(sessionId);
      
      // Clear current session if it was deleted
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (err) {
      const errorMessage = 'Failed to delete session';
      setError(errorMessage);
      console.error('Delete session error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession?.id]);

  // Get sessions for a specific story
  const getSessionsForStory = useCallback((storyId: string): StorySession[] => {
    return storySessionManager.getSessionsForStory(storyId);
  }, []);

  // Check if a session can be resumed
  const canResumeSession = useCallback((session: StorySession): boolean => {
    return session.choices.length > 0 && !session.isCompleted;
  }, []);

  // Calculate session progress (0-100)
  const getSessionProgress = useCallback((session: StorySession): number => {
    if (session.isCompleted) return 100;
    
    // This is a simple progress calculation - you might want to make it more sophisticated
    // based on your story structure
    const totalScenes = 50; // You'd get this from your story data
    const visitedScenes = session.scenesVisited.length;
    
    return Math.min(Math.round((visitedScenes / totalScenes) * 100), 95); // Cap at 95% until completed
  }, []);

  const contextValue: SessionNavigationContextType = useMemo(() => ({
      currentSession,
      setCurrentSession,
      createNewSession,
      loadSession,
      updateCurrentSession,
      deleteSession,
      updateCharacterStats,
      initializeCharacterStats,
      isLoading,
      error,
      getSessionsForStory,
      canResumeSession,
      getSessionProgress,
  }), [currentSession, isLoading, error, createNewSession, loadSession, updateCurrentSession, deleteSession, updateCharacterStats, initializeCharacterStats, getSessionsForStory, canResumeSession, getSessionProgress]);

  return (
    <SessionNavigationContext.Provider value={contextValue}>
      {children}
    </SessionNavigationContext.Provider>
  );
};

// Hook to use the session navigation context
export const useSessionNavigation = (): SessionNavigationContextType => {
  const context = useContext(SessionNavigationContext);
  
  if (!context) {
    throw new Error('useSessionNavigation must be used within a SessionNavigationProvider');
  }
  
  return context;
};

// Hook for session-aware navigation with automatic session management
export const useSessionAwareNavigation = () => {
  const navigation = useNavigation<any>();
  const sessionContext = useSessionNavigation();

  return {
    // Navigate to story selection
    navigateToStorySelection: () => {
      navigation.navigate('StorySelection');
    },

    // Navigate to story with session selection
    navigateToStory: (storyId: string, storyTitle?: string) => {
      navigation.navigate('SessionSelection', { storyId, storyTitle });
    },

    // Start a completely new session
    startNewSession: async (storyId: string, characterName?: string) => {
      try {
        const sessionId = await sessionContext.createNewSession(storyId, characterName);
        
        // Navigate to character customization or directly to story
        navigation.navigate('CharacterCustomization', {
          storyId,
          sessionId,
          isNewSession: true,
        });
        
        return sessionId;
      } catch (error) {
        console.error('Failed to start new session:', error);
        throw error;
      }
    },

    // Resume an existing session
    resumeSession: async (sessionId: string) => { 
  try {
    const session = await sessionContext.loadSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Load the story for this session
    const story = stories.find(s => s.id === session.storyId);
    if (!story) throw new Error('Story not found');

    // Find the current scene by ID
    const scene = story.scenes.find(s => s.id === session.currentSceneId);
    if (!scene) throw new Error('Scene not found');

    if (session.choices.length === 0) {
      // Brand new session - start with prologue
      navigation.navigate('StoryScene', {
        storyId: session.storyId,
        sessionId: session.id,
        sceneId: 'prologue',
        isPrologue: true,
      });
    } else {
      // Navigate based on scene type
      if (scene.type === 'chat') {
        navigation.navigate('Chat', {
          storyId: session.storyId,
          sessionId: session.id,
          sceneId: scene.id,
        });
      } else {
        navigation.navigate('StoryScene', {
          storyId: session.storyId,
          sessionId: session.id,
          sceneId: scene.id,
        });
      }
    }
  } catch (error) {
    console.error('Failed to resume session:', error);
    throw error;
  }
},


    // Navigate to session management
    manageSession: (sessionId: string, storyId: string) => {
      navigation.navigate('SessionDetails', { sessionId, storyId });
    },

    // Navigate to progress dashboard
    navigateToDashboard: () => {
      navigation.navigate('StoryDashboard');
    },

    // Navigate to save manager
    navigateToSaveManager: () => {
      navigation.navigate('SaveManager');
    },

    // Context utilities
    ...sessionContext,
  };
};

// Export the CharacterStats interface for use in other components
export type { CharacterStats };