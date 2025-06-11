import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories as importedStories } from '../../data/stories/index';
import { Story } from '../../types/index';
import { storySessionManager, StorySession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../styles';
import { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } from '../../utils/AudioManager';


type StorySelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StorySelection'>;
};

// Extended Story type to include session information
type StoryWithSessionInfo = Story & { 
  hasSession: boolean;
  latestSession?: StorySession;
  sessionCount: number;
};

const StorySelectionScreen: React.FC<StorySelectionScreenProps> = ({ navigation }) => {
  const [stories, setStories] = useState<StoryWithSessionInfo[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isProcessingStoryAction, setIsProcessingStoryAction] = useState<string | null>(null);

  const loadStorySessionStates = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      // Initialize the session manager if not already done
      await storySessionManager.initialize();

      const storiesWithStates = await Promise.all(
        importedStories.map(async (story) => {
          const sessions = storySessionManager.getSessionsForStory(story.id);
          const latestSession = sessions.length > 0 ? sessions[0] : undefined; // Sessions are sorted by lastPlayedAt

          return {
            ...story,
            hasSession: sessions.length > 0,
            latestSession,
            sessionCount: sessions.length,
          };
        })
      );
      setStories(storiesWithStates);
    } catch (error) {
      console.error("Error loading story session states:", error);
      Alert.alert("Error", "Could not load story information. Please try again later.");
      // Fallback to stories without session info
      setStories(importedStories.map(story => ({ 
        ...story, 
        hasSession: false, 
        sessionCount: 0 
      })));
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    loadStorySessionStates();
    playBackgroundMusic();
  });

  return () => {
    unsubscribe();
  };
}, [navigation, loadStorySessionStates]);

  const handleStartStory = async (storyId: string) => {
    setIsProcessingStoryAction(storyId);
    try {
      // Create a new session
      const sessionId = await storySessionManager.createSession(storyId);
      
      // Store the session ID for navigation
      await AsyncStorage.setItem('lastOpenedSession', sessionId);
      
      navigation.navigate('StoryScene', { 
        storyId, 
        sessionId, // Pass the session ID
        isPrologue: true 
      });
    } catch (error) {
      console.error('Error starting new story:', error);
      Alert.alert('Error', 'Could not start the story. Please try again.');
    } finally {
      setIsProcessingStoryAction(null);
      // Refresh session states after action
      loadStorySessionStates();
    }
  };

  const handleContinueStory = async (story: StoryWithSessionInfo) => {
    if (!story.latestSession) {
      Alert.alert('Error', 'No saved session found for this story.');
      return;
    }

    setIsProcessingStoryAction(story.id);
    try {
      // Update the session's last played time
      await storySessionManager.updateSession(story.latestSession.id, {
        lastPlayedAt: new Date().toISOString()
      });

      // Store the session ID for navigation
      await AsyncStorage.setItem('lastOpenedSession', story.latestSession.id);
      
      // Navigate to the appropriate screen based on the current scene
      if (story.latestSession.currentSceneId === 'chat') {
        navigation.navigate('Chat', {
          storyId: story.id,
          sessionId: story.latestSession.id,
          sceneId: story.latestSession.currentSceneId,
          // resumeFromCheckpoint or other Chat params if needed
        });
      } else {
        navigation.navigate('StoryScene', {
          storyId: story.id,
          sessionId: story.latestSession.id,
          sceneId: story.latestSession.currentSceneId,
          // isPrologue or other StoryScene params if needed
        });
      }
    } catch (error) {
      console.error('Error continuing story:', error);
      Alert.alert('Error', 'Could not continue the story. Please try again.');
    } finally {
      setIsProcessingStoryAction(null);
    }
  };

  const handleViewDashboard = () => {
    navigation.navigate('StoryDashboard');
  };

  const handleShowSessionOptions = (story: StoryWithSessionInfo) => {
    if (story.sessionCount <= 1) {
      // If only one session, continue directly
      handleContinueStory(story);
      return;
    }

    // Show alert with session options
    Alert.alert(
      'Multiple Sessions Found',
      `You have ${story.sessionCount} saved sessions for "${story.title}". What would you like to do?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue Latest', 
          onPress: () => handleContinueStory(story) 
        },
        { 
          text: 'View All Sessions', 
          onPress: () => navigation.navigate('SessionSelection', { storyId: story.id }) 
        }
      ]
    );
  };

  const renderStoryItem = ({ item }: { item: StoryWithSessionInfo }) => {
    const imageSource = imageMap[item.image as keyof typeof imageMap] || require('../../assets/images/defaultImage.png');
    const isCurrentStoryProcessing = isProcessingStoryAction === item.id;

    return (
      <View style={commonStyles.storyCard}>
        <Image
          source={imageSource}
          style={commonStyles.storyImage}
          resizeMode="cover"
        />
        <View style={commonStyles.storyDetails}>
          <Text style={commonStyles.storyTitle}>{item.title}</Text>
          <Text style={commonStyles.storyDescription}>{item.description}</Text>
          <View style={commonStyles.storyMeta}>
            <Text style={commonStyles.storyMetaText}>Duration: {item.duration}</Text>
            <Text style={commonStyles.storyMetaText}>Theme: {item.theme}</Text>
            {item.hasSession && (
              <Text style={commonStyles.storyMetaText}>
                {item.sessionCount} saved session{item.sessionCount > 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {item.hasSession && (
            <TouchableOpacity
              style={[
                commonStyles.buttonSuccess,
                isCurrentStoryProcessing && commonStyles.buttonDisabled,
                { marginBottom: 12 }
              ]}
              onPress={() => handleShowSessionOptions(item)}
              disabled={isCurrentStoryProcessing}
            >
              {isCurrentStoryProcessing ? (
                <ActivityIndicator color={commonStyles.buttonText?.color || "#fff"} />
              ) : (
                <Text style={commonStyles.buttonText}>
                  {item.sessionCount > 1 ? 'Continue Story...' : 'Continue Story'}
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              item.hasSession ? commonStyles.buttonSecondary : commonStyles.buttonPrimary,
              isCurrentStoryProcessing && commonStyles.buttonDisabled
            ]}
            onPress={() => handleStartStory(item.id)}
            disabled={isCurrentStoryProcessing}
          >
            {isCurrentStoryProcessing && !item.hasSession ? (
              <ActivityIndicator color={commonStyles.buttonText?.color || "#fff"} />
            ) : (
              <Text style={commonStyles.buttonText}>
                {item.hasSession ? 'New Story' : 'Start Story'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoadingSessions && !stories.length) {
    return (
      <SafeAreaView style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={commonStyles.sectionTitle?.color || "#000"} />
        <Text style={{ marginTop: 10 }}>Loading stories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: commonStyles.container?.backgroundColor || '#fff' }}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.subtitle}>
          Choose a story to begin your interactive romance experience
        </Text>

        <TouchableOpacity
          style={[commonStyles.buttonSecondary, { marginBottom: 16 }]}
          onPress={handleViewDashboard}
        >
          <Text style={commonStyles.buttonText}>View Your Progress</Text>
        </TouchableOpacity>

        <Text style={commonStyles.sectionTitle}>Available Stories</Text>
        {isLoadingSessions && stories.length > 0 && (
          <ActivityIndicator size="small" color={commonStyles.sectionTitle?.color || "#000"} style={{marginVertical: 10}}/>
        )}
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={stories.length === 0 ? commonStyles.listContainer : { paddingBottom: 20 }}
          ListEmptyComponent={
            !isLoadingSessions ? (
              <View style={commonStyles.emptyListContainer}>
                <Text style={commonStyles.emptyListText}>No stories available at the moment.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default StorySelectionScreen;