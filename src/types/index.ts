import { ReactNode } from 'react';

export type Message = {
  id: string;
  text?: string;
  image?: number;
  type: 'user' | 'assistant' | 'system';
  timestamp: string;
  name?: string;
  avatar?: number;
  sender: string;
  content: string;
};

export interface ImageTrigger {
  keyword: string;
  images: string[];
}

export interface SceneTrigger {
  keyword: string;
  nextSceneIndex: string;
}

export interface Choice {
  text: string;
  nextSceneIndex?: string;
}

export interface Scene {
  id: string;
  type: 'chat' | 'story';
  text?: string;
  characterName?: string;
  systemPrompt?: string;
  imageTriggers?: ImageTrigger[];
  sceneTriggers?: SceneTrigger[];
  nextSceneIndex?: string;
  choices?: Choice[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  prologue: string;
  theme: string;
  image: string;
  scenes: Scene[];
}

export interface SavedSession {
  id: string;
  storyId: Story['id'];
  currentStep: number;
  date: string;
  messages?: Message[];
}
// Enhanced TypeScript types for the save system
export interface PlayerChoice {
  id: string;
  sceneId: string;
  choiceIndex: number;
  choiceText: string;
  timestamp: string;
  consequences?: string[]; // Tags for what this choice affected
  effects?: Partial<CharacterStats>; // direct stat effects
}

export interface CharacterStats {
  affection: number;
  trust: number;
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'romantic';
  relationship_level: number;
  [key: string]: number | string; // Allow custom stats
}

export interface StoryMemory {
  id: string;
  type: 'event' | 'dialogue' | 'achievement' | 'secret';
  title: string;
  description: string;
  sceneId: string;
  timestamp: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface SessionCheckpoint {
  sceneId: string;
  timestamp: string;
  characterStats: CharacterStats;
  recentChoices: PlayerChoice[]; // Last 5 choices for context
  storyFlags: Record<string, boolean>;
}

export interface StorySession {
  id: string; // Unique session ID
  storyId: string;
  version: number; // For migration compatibility
  
  // Core state
  currentSceneId: string;
  startedAt: string;
  lastPlayedAt: string;
  isCompleted: boolean;
  
  // Character and story state
  characterStats: CharacterStats;
  storyFlags: Record<string, boolean>; // Generic flags for branching logic
  customVariables: Record<string, any>; // For story-specific data
  
  // History tracking
  choices: PlayerChoice[];
  memories: StoryMemory[];
  messages: Message[]; // Your existing message type
  
  // Performance optimization
  checkpoints: SessionCheckpoint[]; // Periodic saves for quick recovery
  
  // Metadata
  totalPlayTime: number; // in seconds
  choiceCount: number;
  scenesVisited: string[];
  
  // Future-proofing
  cloudSyncStatus?: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncedAt?: string;
  cloudVersion?: number;
}

export interface SaveMetadata {
  version: string;
  createdAt: string;
  lastModified: string;
  deviceId?: string;
  appVersion: string;
}

export interface GameSave {
  metadata: SaveMetadata;
  sessions: Record<string, StorySession>; // sessionId -> session data
  globalSettings?: Record<string, any>;
}