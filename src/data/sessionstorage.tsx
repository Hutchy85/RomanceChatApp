import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';

export const hasSavedSession = async (storyId: string): Promise<boolean> => {
  try {
    const session = await AsyncStorage.getItem(`session_${storyId}`);
    return session !== null;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

export const getLastOpenedSession = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('lastOpenedSession');
  } catch (error) {
    console.error('Error getting lastOpenedSession:', error);
    return null;
  }
};

export const clearLastOpenedSession = async () => {
  try {
    await AsyncStorage.removeItem('lastOpenedSession');
    console.log('lastOpenedSession cleared');
  } catch (error) {
    console.error('Error clearing lastOpenedSession:', error);
  }
};

export const saveSession = async (storyId: string, messages: Message[]) => {
  try {
    const sessionKey = `session_${storyId}`;
    await AsyncStorage.setItem(sessionKey, JSON.stringify(messages));
    console.log('Session saved for', storyId);
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const loadSession = async (storyId: string): Promise<Message[] | null> => {
  try {
    const sessionKey = `session_${storyId}`;
    const session = await AsyncStorage.getItem(sessionKey);
    if (session !== null) {
      console.log('Session loaded for', storyId);
      return JSON.parse(session);
    }
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

export const clearSession = async (storyId: string) => {
  try {
    const sessionKey = `session_${storyId}`;
    await AsyncStorage.removeItem(sessionKey);
    console.log('Session cleared for', storyId);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};
