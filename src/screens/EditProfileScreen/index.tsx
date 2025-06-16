import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { UserProfileContext } from '../../contexts/UserProfileContext';
import type { StackNavigationProp } from '@react-navigation/stack';

type EditProfileScreenProps = {
  navigation: StackNavigationProp<any>;
};

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { profile, updateProfile, clearProfile } = useContext(UserProfileContext)!;

  const [playerName, setPlayerName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    if (profile) {
      setPlayerName(profile.playerName);
      setPartnerName(profile.partnerName);
    }
  }, [profile]);

  const saveProfile = () => {
    updateProfile({
      playerName,
      partnerName,
      pronouns: { subject: 'they', object: 'them', possessive: 'their' },
    });
    navigation.goBack();
  };

  const deleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            navigation.reset({
              index: 0,
              routes: [{ name: 'ProfileGate' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Edit your name:</Text>
      <TextInput value={playerName} onChangeText={setPlayerName} style={{ borderBottomWidth: 1, marginBottom: 12 }} />
      <Text>Edit your partner's name:</Text>
      <TextInput value={partnerName} onChangeText={setPartnerName} style={{ borderBottomWidth: 1, marginBottom: 12 }} />

      <Button title="Save Changes" onPress={saveProfile} />
      <View style={{ height: 16 }} />
      <Button title="Delete Profile" onPress={deleteProfile} color="red" />
    </View>
  );
}
