import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories as importedStories } from '../../data/stories/index';
import { Story } from '../../types/index';
import { storySessionManager, StorySession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, enhancedStyles, } from '../../styles';
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

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
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

       Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

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
  }, [fadeAnim, slideAnim]);

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

  const renderStoryItem = ({ item, index }: { item: StoryWithSessionInfo; index: number }) => {
    const imageSource = imageMap[item.image as keyof typeof imageMap] || require('../../assets/images/defaultImage.png');
    const isCurrentStoryProcessing = isProcessingStoryAction === item.id;

    // Staggered animation for each item
    const itemAnimatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 50],
          })
        }
      ]
    };

    return (
      <Animated.View 
        style={[
          enhancedStyles.storyCard,
          itemAnimatedStyle,
          { 
            // Stagger animation based on index
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + (index * 10)],
                })
              }
            ]
          }
        ]}
      >
        {/* Enhanced image container with overlay */}
        <View style={enhancedStyles.imageContainer}>
          <Image
            source={imageSource}
            style={enhancedStyles.storyImage}
            resizeMode="cover"
          />
          
          {/* Story status badge */}
          {item.hasSession && (
            <View style={enhancedStyles.statusBadge}>
              <Text style={enhancedStyles.statusBadgeText}>IN PROGRESS</Text>
            </View>
          )}
        </View>

        <View style={enhancedStyles.storyDetails}>
          {/* Enhanced title with better typography */}
          <Text style={enhancedStyles.storyTitle}>{item.title}</Text>
          <Text style={enhancedStyles.storyDescription} numberOfLines={3}>
            {item.description}
          </Text>

          {/* Enhanced button styling */}
          <View style={enhancedStyles.buttonContainer}>
            {item.hasSession && (
              <TouchableOpacity
                style={[
                  enhancedStyles.continueButton,
                  isCurrentStoryProcessing && enhancedStyles.buttonDisabled,
                ]}
                onPress={() => handleShowSessionOptions(item)}
                disabled={isCurrentStoryProcessing}
              >
                {isCurrentStoryProcessing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={enhancedStyles.continueButtonText}>
                      {item.sessionCount > 1 ? '📚 Continue Story...' : '▶️ Continue Story'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                item.hasSession ? enhancedStyles.newStoryButton : enhancedStyles.startButton,
                isCurrentStoryProcessing && enhancedStyles.buttonDisabled
              ]}
              onPress={() => handleStartStory(item.id)}
              disabled={isCurrentStoryProcessing}
            >
              {isCurrentStoryProcessing && !item.hasSession ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[
                  enhancedStyles.buttonText,
                  item.hasSession && enhancedStyles.newStoryButtonText
                ]}>
                  {item.hasSession ? '🔄 New Story' : '🚀 Start Story'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (isLoadingSessions && !stories.length) {
    return (
      <SafeAreaView style={[commonStyles.container, enhancedStyles.loadingContainer]}>
        <View style={enhancedStyles.loadingContent}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={enhancedStyles.loadingText}>Loading your romance stories...</Text>
          <Text style={enhancedStyles.loadingSubtext}>Preparing your next adventure ✨</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={enhancedStyles.container}>
      <Animated.View style={[enhancedStyles.content, { opacity: fadeAnim }]}>
        {/* Enhanced header */}
        <View style={enhancedStyles.header}>
          <Text style={enhancedStyles.subtitle}>
            Choose a story to begin your interactive romance experience
          </Text>
        </View>

        {/* Enhanced section title */}
        <View style={enhancedStyles.sectionHeader}>
          <Text style={enhancedStyles.sectionTitle}>Available Stories</Text>
          {isLoadingSessions && stories.length > 0 && (
            <ActivityIndicator size="small" color="#E91E63" />
          )}
        </View>

        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={enhancedStyles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoadingSessions ? (
              <View style={enhancedStyles.emptyListContainer}>
                <Text style={enhancedStyles.emptyListText}>📚 No stories available at the moment.</Text>
                <Text style={enhancedStyles.emptyListSubtext}>Check back soon for new romantic adventures!</Text>
              </View>
            ) : null
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default StorySelectionScreen;