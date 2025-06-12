import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { storySessionManager } from '../../data/sessionstorage';
import { colors, commonStyles } from '../../styles';

type SaveManagerScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SaveManager'>;
  route: RouteProp<RootStackParamList, 'SaveManager'>;
};

const SaveManagerScreen: React.FC<SaveManagerScreenProps> = ({ navigation }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      await storySessionManager.initialize();
      const allSessionsObj = storySessionManager['gameSave']?.sessions || {};
      const allSessions = Object.values(allSessionsObj)
        .sort((a: any, b: any) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime());
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Could not load save data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (session: any) => {
    navigation.navigate('StoryScene', {
      storyId: session.storyId,
      sessionId: session.id,
      sceneId: session.currentSceneId,
    });
  };

  const handleDelete = (sessionId: string) => {
    Alert.alert(
      'Delete Save',
      'Are you sure you want to delete this save?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storySessionManager.deleteSession(sessionId);
            loadSessions();
          },
        },
      ]
    );
  };

  const renderSessionItem = ({ item }: { item: any }) => (
    <View style={commonStyles.saveItem}>
      <Text style={commonStyles.saveTitle}>
        {item.customVariables.characterName || 'Unnamed Hero'} — {item.storyId}
      </Text>
      <Text style={commonStyles.saveDetails}>
        Last Played: {new Date(item.lastPlayedAt).toLocaleString()}
      </Text>
      <Text style={commonStyles.saveDetails}>
        Play Time: {item.totalPlayTime} sec — Scenes: {item.scenesVisited.length}
      </Text>
      <View style={commonStyles.buttonRow}>
        <TouchableOpacity
          style={commonStyles.buttonPrimary}
          onPress={() => handleLoad(item)}
        >
          <Text style={commonStyles.buttonText}>Load</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.buttonSecondary}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={commonStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleExport = async () => {
    const exportedData = await storySessionManager.exportSaveData();
    console.log('Exported Save Data:', exportedData);
    Alert.alert('Save Data Exported', 'Check console log for output.');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Your Saved Games</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSessionItem}
          contentContainerStyle={commonStyles.savesList}
          ListEmptyComponent={
            <Text style={commonStyles.messageText}>No saves yet.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={commonStyles.buttonPrimary}
        onPress={handleExport}
      >
        <Text style={commonStyles.buttonText}>Export Save Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={commonStyles.buttonSecondary}
        onPress={() => navigation.goBack()}
      >
        <Text style={commonStyles.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SaveManagerScreen;
