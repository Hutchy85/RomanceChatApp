import axios from 'axios';
import { EmotionalState } from '../types';

// Define the base URL for the API
// In a real app, this would be configured based on environment
const API_BASE_URL = 'http://localhost:8000/api';

// API response interfaces
interface GenerateReplyResponse {
  reply: string;
  updated_state: EmotionalState;
}

interface InitialStateResponse {
  state: EmotionalState;
}

/**
 * API client for interacting with the Romance Chat backend
 */
class ApiClient {
  /**
   * Generate a reply from the AI wife character
   * @param userMessage - The message sent by the user
   * @param currentState - The current emotional state
   * @param sceneContext - Optional context about the current scene
   * @returns Promise with the AI response and updated emotional state
   */
  async generateReply(
    userMessage: string, 
    currentState: EmotionalState, 
    sceneContext?: string
  ): Promise<GenerateReplyResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate_reply`, {
        user_message: userMessage,
        current_state: currentState,
        scene_context: sceneContext || null
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating reply:', error);
      
      // Return a fallback response in case of error
      return this.getFallbackResponse(userMessage, currentState);
    }
  }
  
  /**
   * Get the initial emotional state for a story
   * @param storyId - The ID of the story
   * @returns Promise with the initial emotional state
   */
  async getInitialState(storyId: string): Promise<EmotionalState> {
    try {
      const response = await axios.get<InitialStateResponse>(
        `${API_BASE_URL}/initial_state/${storyId}`
      );
      
      return response.data.state;
    } catch (error) {
      console.error('Error fetching initial state:', error);
      
      // Return a fallback initial state in case of error
      return this.getFallbackInitialState(storyId);
    }
  }
  
  /**
   * Save the current emotional state for a session
   * @param sessionId - The ID of the session
   * @param state - The emotional state to save
   * @returns Promise indicating success
   */
  async saveState(sessionId: string, state: EmotionalState): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/save_state/${sessionId}`, state);
      return true;
    } catch (error) {
      console.error('Error saving state:', error);
      return false;
    }
  }
  
  /**
   * Get the current emotional state for a session
   * @param sessionId - The ID of the session
   * @returns Promise with the current emotional state
   */
  async getCurrentState(sessionId: string): Promise<EmotionalState | null> {
    try {
      const response = await axios.get<{ state: EmotionalState }>(
        `${API_BASE_URL}/current_state/${sessionId}`
      );
      
      return response.data.state;
    } catch (error) {
      console.error('Error fetching current state:', error);
      return null;
    }
  }
  
  /**
   * Generate a fallback response when the API is unavailable
   * @param userMessage - The message sent by the user
   * @param currentState - The current emotional state
   * @returns Fallback response with reply and updated state
   */
  private getFallbackResponse(
    userMessage: string, 
    currentState: EmotionalState
  ): GenerateReplyResponse {
    const lowerMessage = userMessage.toLowerCase();
    let reply = '';
    let updatedState = { ...currentState };
    
    // Check for greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      if (currentState.mood_wife === 'happy' || currentState.mood_wife === 'excited' || currentState.mood_wife === 'hopeful') {
        reply = `Hi there! It's good to see you. How has your day been so far?`;
      } else if (currentState.mood_wife === 'sad') {
        reply = `Hey... I've been better, honestly. But I'm glad you're here.`;
      } else if (currentState.mood_wife === 'angry') {
        reply = `Hi. I'm still a bit upset about earlier, but I'm trying to move past it.`;
      } else if (currentState.mood_wife === 'concerned') {
        reply = `Hi... I've been thinking about us a lot today. Can we talk?`;
      } else {
        reply = `Hey there. How are you doing?`;
      }
    }
    // Check for apology
    else if (lowerMessage.includes('sorry') || lowerMessage.includes('apologize')) {
      if (currentState.trust_wife < 5) {
        reply = `I appreciate you saying that. It's going to take some time, but it's a start.`;
        updatedState.trust_wife = Math.min(10, currentState.trust_wife + 1);
        updatedState.mood_wife = 'hopeful';
      } else {
        reply = `Thank you for apologizing. That means a lot to me. I know we can work through this together.`;
        updatedState.affection_wife = Math.min(10, currentState.affection_wife + 1);
        updatedState.mood_wife = 'happy';
      }
    }
    // Default response
    else {
      reply = `I'm having trouble connecting right now, but I want you to know I'm listening. Can we continue this conversation a bit later?`;
    }
    
    return {
      reply,
      updated_state: updatedState
    };
  }
  
  /**
   * Get fallback initial state when the API is unavailable
   * @param storyId - The ID of the story
   * @returns Fallback initial emotional state
   */
  private getFallbackInitialState(storyId: string): EmotionalState {
    // Fallback initial states for different stories
    const initialStates: Record<string, EmotionalState> = {
      'rekindled-flame': {
        affection_wife: 5,
        trust_wife: 4,
        mood_wife: 'concerned',
        memories_wife: {
          recent_distance: true,
          takeout_surprise: true
        },
        character_name: 'Emily'
      },
      'new-beginnings': {
        affection_wife: 7,
        trust_wife: 8,
        mood_wife: 'hopeful',
        memories_wife: {
          supported_move: true,
          left_job_for_you: true
        },
        character_name: 'Sarah'
      },
      'anniversary-surprise': {
        affection_wife: 8,
        trust_wife: 9,
        mood_wife: 'excited',
        memories_wife: {
          first_anniversary_importance: true,
          parents_divorced_early: true
        },
        character_name: 'Olivia'
      }
    };
    
    return initialStates[storyId] || {
      affection_wife: 5,
      trust_wife: 5,
      mood_wife: 'neutral',
      memories_wife: {},
      character_name: 'Character'
    };
  }
}

// Export a singleton instance
export default new ApiClient();
