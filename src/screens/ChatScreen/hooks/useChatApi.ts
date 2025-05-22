import { useState } from 'react';
import { getChatbotReply } from '../../../api/apiClient'; // Ensure this path is correct

export const useChatApi = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const fetchBotReply = async (
    chatHistory: { role: string; content: string }[]
  ): Promise<string> => {
    setIsSending(true);
    try {
      const reply = await getChatbotReply(chatHistory);
      return reply;
    } catch (error) {
      console.error('Error getting chatbot reply in useChatApi:', error);
      // Propagate the error to be handled by the caller
      throw error; 
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    fetchBotReply,
  };
};
