import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface UserProfileContextType {
  profile: UserProfile | null;
  isProfileLoaded: boolean;
  updateProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}


export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      setIsProfileLoaded(true);
    };
    loadProfile();
  }, []);

  const updateProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const clearProfile = async () => {
    setProfile(null);
    await AsyncStorage.removeItem('userProfile');
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, isProfileLoaded, updateProfile, clearProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
