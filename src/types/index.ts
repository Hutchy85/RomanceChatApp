export type Message = {
  id: string;
  text?: string;
  image?: number;
  type: 'user' | 'assistant' | 'system';
  timestamp: string;
  name?: string;
  avatar?: number;
};

export interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  theme: string;
  image: string;
  prologue: string;
  characterName: string;
  systemPrompt: string;
}

export interface SavedSession {
  id: string;
  storyId: Story['id'];
  currentStep: number;
  date: string;
  messages?: Message[];
}
