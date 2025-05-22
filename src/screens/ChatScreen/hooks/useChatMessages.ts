import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { Message, Scene } from '../../../types';
import { createId } from '../../../utils/createId';
import imageMap from '../../../data/imageMap'; // Import imageMap

export const useChatMessages = (flatListRef: React.RefObject<FlatList>) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const createMessage = (text: string, sender: 'user' | 'ai', currentScene: Scene | null): Message => {
    return {
      id: createId(),
      text: text,
      sender: sender,
      sceneName: currentScene?.name || 'Unknown Scene',
      timestamp: new Date().toISOString(),
      // Add name and avatar based on sender and currentScene
      name: sender === 'user' ? 'You' : currentScene?.characterName || 'Assistant',
      avatar: sender === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
  };

  const addMessage = (text: string, sender: 'user' | 'ai', currentScene: Scene | null) => {
    const newMessage = createMessage(text, sender, currentScene);
    setMessages(prevMessages => [...prevMessages, newMessage]);
    scrollToEnd();
    return newMessage; // Return the new message
  };

  const addImageMessage = (uri: string, sender: 'user' | 'ai', currentScene: Scene | null) => {
    const newMessage: Message = {
      id: createId(),
      imageUrl: uri,
      sender: sender,
      sceneName: currentScene?.name || 'Unknown Scene',
      timestamp: new Date().toISOString(),
      // Add name and avatar based on sender and currentScene
      name: sender === 'user' ? 'You' : currentScene?.characterName || 'Assistant',
      avatar: sender === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    scrollToEnd();
    return newMessage; // Return the new message
  };

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return {
    messages,
    setMessages, // Exposing setMessages for useChatSession to load existing messages
    addMessage,
    addImageMessage,
    createMessage, // Exposing createMessage if needed externally, though addMessage is primary
    // scrollToEnd is not returned as it's an internal utility triggered by addMessage/addImageMessage
  };
};
