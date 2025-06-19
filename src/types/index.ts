import { ReactNode } from 'react';

export type Message = {
  id: string;
  text?: string;
  image?: number;
  sender: string; // replaces 'type', dynamic character id e.g. 'wife', 'mike', 'user', 'system'
  timestamp: string;
  name?: string; // optional override if you want to name in message-specific way
  avatar?: number; // image reference id or URI for avatar
};

export interface Scene {
  id: string;
  type: 'story' | 'chat';
  text?: string; // for story scenes
  characterName?: string; // for chat scenes
  systemPrompt?: string; // for chat scenes
  imageTriggers?: ImageTrigger[]; // for chat scenes
  sceneTriggers?: SceneTrigger[]; // for chat scenes
  choices?: Choice[]; // for story scenes
  nextSceneIndex?: string; // for story scenes
  effects?: Partial<CharacterStats>; // for story scenes
  backgroundImageKey?: string; // optional background image key for scenes
}

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
  effects?: Partial<CharacterStats>;
  consequences?: string[];
}

/* Removed duplicate Scene interface definition to resolve duplicate identifier error */

export interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  prologue: string;
  theme: string;
  image: string;
  scenes: Scene[];
  backgroundImageKey?: string;
  musicTrack?: string;

}

export interface SavedSession {
  id: string;
  storyId: Story['id'];
  currentStep: number;
  date: string;
  messages?: Message[];
}
export interface CharacterStats {
  affection: number;
  trust: number;
  mood?: 'happy' | 'neutral' | 'sad' | 'angry' | 'romantic';
  relationship_level?: number;
  respect?: number;
  friendship?: number;
  [key: string]: number | string | undefined; // Allow custom stats
}

// Default stats for new sessions
export const DEFAULT_CHARACTER_STATS: CharacterStats = {
  affection: 50,
  trust: 50,
  mood: 'neutral',
  relationship_level: 1,
};

export interface UserProfile {
  playerName: string;
  partnerName: string;
  pronouns: {
    subject: string; // he/she/they
    object: string;  // him/her/them
    possessive: string; // his/her/their
  };
}

export interface PlayerChoice {
  id: string;
  sceneId: string;
  choiceIndex: number;
  choiceText: string;
  timestamp: string;
  consequences?: string[];
  effects?: Partial<CharacterStats>;
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
  recentChoices: PlayerChoice[];
  storyFlags: Record<string, boolean>;
}

export interface StorySession {
  id: string;
  storyId: string;
  version: number;
  currentSceneId: string;
  startedAt: string;
  lastPlayedAt: string;
  isCompleted: boolean;
  characterStats: CharacterStats;
  storyFlags: Record<string, boolean>;
  customVariables: Record<string, any>;
  choices: PlayerChoice[];
  memories: StoryMemory[];
  messages: Message[];
  checkpoints: SessionCheckpoint[];
  totalPlayTime: number;
  choiceCount: number;
  scenesVisited: string[];
  cloudSyncStatus?: CloudSyncStatus;
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
  sessions: Record<string, StorySession>;
  globalSettings?: Record<string, any>;
}

export enum CloudSyncStatus {
  Synced = 'synced',
  Pending = 'pending',
  Conflict = 'conflict',
  Error = 'error',
}


export type SceneType = 'story' | 'chat';

export interface ImageTrigger {
  keyword: string;
  images: string[];
}

export interface SceneTrigger {
  keyword: string;
  nextSceneIndex: string;
}

export interface SceneBase {
  id: string;
  type: SceneType;
}

export interface ChatScene extends SceneBase {
  type: 'chat';
  characterName: string;
  systemPrompt: string;
  imageTriggers?: ImageTrigger[];
  sceneTriggers?: SceneTrigger[];
}

export interface StoryScene extends SceneBase {
  type: 'story';
  text: string;
  choices?: Choice[];
  nextSceneIndex?: string;
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