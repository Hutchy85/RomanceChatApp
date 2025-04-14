export interface EmotionalState {
  affection_wife: number;
  trust_wife: number;
  mood_wife: string;
  memories_wife: Record<string, boolean>;
  character_name: string;
}

export interface Message {
  id: string;
  text: string;
  type: 'system' | 'user' | 'wife';
  timestamp: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  theme: string;
  image: string;
}

export interface SavedSession {
  id: string;
  date: string;
  storyId: string;
  characterName: string;
  emotionalState: {
    affection_wife: number;
    trust_wife: number;
    mood_wife: string;
  };
  messages?: Message[];
}
