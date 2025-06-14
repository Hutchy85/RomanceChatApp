import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { UserProfileContext } from '../../contexts/UserProfileContext';



import type { StackNavigationProp } from '@react-navigation/stack';

type UserProfileScreenProps = {
  navigation: StackNavigationProp<any>;
};

export default function UserProfileScreen({ navigation }: UserProfileScreenProps) {
  const { updateProfile } = useContext(UserProfileContext)!;

  const [playerName, setPlayerName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const saveProfile = () => {
    updateProfile({
      playerName,
      partnerName,
      pronouns: { subject: 'they', object: 'them', possessive: 'their' },
    });
    navigation.navigate('StorySelection');
  };

  return (
    <View>
      <Text>What’s your name?</Text>
      <TextInput value={playerName} onChangeText={setPlayerName} />
      <Text>Your partner's name?</Text>
      <TextInput value={partnerName} onChangeText={setPartnerName} />
      <Button title="Save" onPress={saveProfile} />
    </View>
  );
}
