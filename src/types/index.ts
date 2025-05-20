import { ReactNode } from 'react';

export type Message = {
  id: string;
  text?: string;
  image?: number;
  type: 'user' | 'assistant' | 'system';
  timestamp: string;
  name?: string;
  avatar?: number;
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
