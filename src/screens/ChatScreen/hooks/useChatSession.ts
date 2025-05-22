import { useRef } from 'react';
import { Message } from '../../../types'; // Scene import removed
import { getSession, saveSession as saveSessionToFile } from '../../../utils/sessionManager';

export const useChatSession = (
  storyId: string,
  // setMessages is used to update the UI with messages loaded from an existing session.
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>, // from useChatMessages
) => {
  const chatHistory = useRef<{ role: string; content: string }[]>([]);

  const initializeChatHistory = (systemPrompt: string) => {
    chatHistory.current = [{ role: 'system', content: systemPrompt }];
  };

  const loadExistingSession = async (systemPrompt: string) => {
    initializeChatHistory(systemPrompt); 
    try {
      const existingMessages = await getSession(storyId);
      if (existingMessages.length > 0) {
        setMessages(existingMessages);
        existingMessages.forEach(msg => {
          chatHistory.current.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || (msg.imageUrl ? `Image: ${msg.imageUrl}` : 'No content'),
          });
        });
      }
    } catch (error) {
      console.error("Error loading session in useChatSession:", error);
      // Optionally, handle this error by setting some state or re-throwing
    }
  };

  const saveSession = async (messages: Message[]) => {
    try {
      await saveSessionToFile(storyId, messages);
    } catch (error) {
      console.error("Error saving session in useChatSession:", error);
      // Optionally, handle this error
    }
  };

  // This function is to update chatHistory when a new message is added.
  // It will be called from ChatScreen.tsx after a message is added via useChatMessages
  const updateChatHistory = (message: Message) => {
    chatHistory.current.push({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text || (message.imageUrl ? `Image: ${message.imageUrl}` : 'No content'),
    });
    // console.log('Chat history updated:', chatHistory.current);
  };


  return {
    chatHistory,
    loadSession: loadExistingSession,
    saveSession,
    initializeChatHistory, // Expose this to allow ChatScreen to set the initial prompt
    updateChatHistory, // Expose this to allow ChatScreen to update history
  };
};
