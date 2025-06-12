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