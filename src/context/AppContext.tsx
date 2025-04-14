import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmotionalState, SavedSession, Message } from '../types';
import apiClient from '../api/apiClient';

// Define the context state interface
interface AppContextState {
  // Current story and emotional state
  currentStoryId: string | null;
  emotionalState: EmotionalState | null;
  messages: Message[];
  
  // Saved sessions
  savedSessions: SavedSession[];
  
  // Loading states
  isLoading: boolean;
  
  // Methods
  setCurrentStoryId: (storyId: string) => Promise<void>;
  initializeEmotionalState: (storyId: string) => Promise<EmotionalState>;
  updateEmotionalState: (newState: EmotionalState) => Promise<void>;
  addMessage: (text: string, type: 'system' | 'user' | 'wife') => void;
  generateResponse: (userMessage: string) => Promise<void>;
  saveConversation: () => Promise<boolean>;
  loadSavedSessions: () => Promise<void>;
  continueSession: (sessionId: string) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearCurrentSession: () => Promise<void>;
}

// Create the context with a default value
const AppContext = createContext<AppContextState | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [currentStoryId, setCurrentStoryIdState] = useState<string | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load initial data from AsyncStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load current story ID
        const storyId = await AsyncStorage.getItem('currentStoryId');
        if (storyId) {
          setCurrentStoryIdState(storyId);
          
          // Load emotional state
          const emotionalStateJson = await AsyncStorage.getItem('emotionalState');
          if (emotionalStateJson) {
            setEmotionalState(JSON.parse(emotionalStateJson));
          }
          
          // Load messages
          const messagesJson = await AsyncStorage.getItem('messages');
          if (messagesJson) {
            setMessages(JSON.parse(messagesJson));
          }
        }
        
        // Load saved sessions
        await loadSavedSessions();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem('messages', JSON.stringify(messages))
        .catch(error => console.error('Error saving messages:', error));
    }
  }, [messages]);
  
  // Method to set current story ID
  const setCurrentStoryId = async (storyId: string) => {
    try {
      await AsyncStorage.setItem('currentStoryId', storyId);
      setCurrentStoryIdState(storyId);
    } catch (error) {
      console.error('Error setting current story ID:', error);
    }
  };
  
  // Method to initialize emotional state for a story
  const initializeEmotionalState = async (storyId: string): Promise<EmotionalState> => {
    try {
      // Fetch initial state from API
      const initialState = await apiClient.getInitialState(storyId);
      
      // Save to state and AsyncStorage
      setEmotionalState(initialState);
      await AsyncStorage.setItem('emotionalState', JSON.stringify(initialState));
      
      // Clear existing messages
      setMessages([]);
      await AsyncStorage.removeItem('messages');
      
      // Add initial system message
      addMessage(`You are now chatting with ${initialState.character_name}. Type a message to begin your conversation.`, 'system');
      
      return initialState;
    } catch (error) {
      console.error('Error initializing emotional state:', error);
      throw error;
    }
  };
  
  // Method to update emotional state
  const updateEmotionalState = async (newState: EmotionalState) => {
    try {
      setEmotionalState(newState);
      await AsyncStorage.setItem('emotionalState', JSON.stringify(newState));
    } catch (error) {
      console.error('Error updating emotional state:', error);
    }
  };
  
  // Method to add a message
  const addMessage = (text: string, type: 'system' | 'user' | 'wife') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  // Method to generate a response from the AI
  const generateResponse = async (userMessage: string) => {
    if (!emotionalState || !currentStoryId) {
      throw new Error('Emotional state or story ID not initialized');
    }
    
    try {
      // Add user message
      addMessage(userMessage, 'user');
      
      // Generate response from API
      const response = await apiClient.generateReply(userMessage, emotionalState);
      
      // Add wife's response
      addMessage(response.reply, 'wife');
      
      // Update emotional state
      await updateEmotionalState(response.updated_state);
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('Sorry, there was an error processing your message. Please try again.', 'system');
    }
  };
  
  // Method to save the current conversation
  const saveConversation = async (): Promise<boolean> => {
    if (!emotionalState || !currentStoryId) {
      return false;
    }
    
    try {
      // Create saved session object
      const savedSession: SavedSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        storyId: currentStoryId,
        characterName: emotionalState.character_name,
        emotionalState: {
          affection_wife: emotionalState.affection_wife,
          trust_wife: emotionalState.trust_wife,
          mood_wife: emotionalState.mood_wife
        },
        messages: messages
      };
      
      // Add to saved sessions
      const updatedSessions = [...savedSessions, savedSession];
      setSavedSessions(updatedSessions);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
      
      // Add confirmation message
      addMessage('Conversation saved successfully.', 'system');
      
      return true;
    } catch (error) {
      console.error('Error saving conversation:', error);
      addMessage('Failed to save conversation. Please try again.', 'system');
      return false;
    }
  };
  
  // Method to load saved sessions
  const loadSavedSessions = async () => {
    try {
      const sessionsJson = await AsyncStorage.getItem('savedSessions');
      if (sessionsJson) {
        setSavedSessions(JSON.parse(sessionsJson));
      }
    } catch (error) {
      console.error('Error loading saved sessions:', error);
    }
  };
  
  // Method to continue a saved session
  const continueSession = async (sessionId: string): Promise<boolean> => {
    try {
      // Find the session
      const session = savedSessions.find(s => s.id === sessionId);
      if (!session) {
        return false;
      }
      
      // Set current story ID
      await setCurrentStoryId(session.storyId);
      
      // If session has messages, restore them
      if (session.messages && session.messages.length > 0) {
        setMessages(session.messages);
        await AsyncStorage.setItem('messages', JSON.stringify(session.messages));
      } else {
        // Clear existing messages
        setMessages([]);
        await AsyncStorage.removeItem('messages');
      }
      
      // Get full emotional state from API or use fallback
      try {
        const fullState = await apiClient.getInitialState(session.storyId);
        
        // Update with saved values
        const restoredState: EmotionalState = {
          ...fullState,
          affection_wife: session.emotionalState.affection_wife,
          trust_wife: session.emotionalState.trust_wife,
          mood_wife: session.emotionalState.mood_wife
        };
        
        // Save to state and AsyncStorage
        setEmotionalState(restoredState);
        await AsyncStorage.setItem('emotionalState', JSON.stringify(restoredState));
      } catch (error) {
        console.error('Error fetching full state, using fallback:', error);
        
        // Use fallback state
        const fallbackState = apiClient['getFallbackInitialState'](session.storyId);
        
        // Update with saved values
        const restoredState: EmotionalState = {
          ...fallbackState,
          affection_wife: session.emotionalState.affection_wife,
          trust_wife: session.emotionalState.trust_wife,
          mood_wife: session.emotionalState.mood_wife
        };
        
        // Save to state and AsyncStorage
        setEmotionalState(restoredState);
        await AsyncStorage.setItem('emotionalState', JSON.stringify(restoredState));
      }
      
      return true;
    } catch (error) {
      console.error('Error continuing session:', error);
      return false;
    }
  };
  
  // Method to delete a saved session
  const deleteSession = async (sessionId: string) => {
    try {
      // Filter out the session to delete
      const updatedSessions = savedSessions.filter(s => s.id !== sessionId);
      
      // Update state
      setSavedSessions(updatedSessions);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };
  
  // Method to clear current session
  const clearCurrentSession = async () => {
    try {
      // Clear state
      setCurrentStoryIdState(null);
      setEmotionalState(null);
      setMessages([]);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('currentStoryId');
      await AsyncStorage.removeItem('emotionalState');
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };
  
  // Context value
  const contextValue: AppContextState = {
    currentStoryId,
    emotionalState,
    messages,
    savedSessions,
    isLoading,
    setCurrentStoryId,
    initializeEmotionalState,
    updateEmotionalState,
    addMessage,
    generateResponse,
    saveConversation,
    loadSavedSessions,
    continueSession,
    deleteSession,
    clearCurrentSession
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
