import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { UserProfileContext } from '../../contexts/UserProfileContext';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function ProfileGate({ navigation }: Props) {
  const { profile, isProfileLoaded } = useContext(UserProfileContext)!;

  useEffect(() => {
    if (isProfileLoaded) {
      if (profile) {
        navigation.replace('StorySelection');
      } else {
        navigation.replace('UserProfile');
      }
    }
  }, [isProfileLoaded, profile]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}