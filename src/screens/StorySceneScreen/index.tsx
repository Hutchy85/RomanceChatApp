import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories/index';
import { commonStyles } from '../../styles';
import { useSessionNavigation } from '../../contexts/SessionNavigationContext';

type StorySceneRouteProp = RouteProp<RootStackParamList, 'StoryScene'>;
type StorySceneNavigationProp = StackNavigationProp<RootStackParamList, 'StoryScene'>;

type Props = {
  route: StorySceneRouteProp;
  navigation: StorySceneNavigationProp;
};

const StorySceneScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId, sceneId, sessionId, isPrologue } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    currentSession,
    loadSession,
    updateCurrentSession,
    error: sessionError,
  } = useSessionNavigation();
  
  // Import the session manager directly for recording choices
  const { storySessionManager } = require('../../data/sessionstorage');

  const story = stories.find(s => s.id === storyId);
  
  // Load session if sessionId is provided but currentSession doesn't match
  useEffect(() => {
    const loadSessionIfNeeded = async () => {
      if (sessionId && (!currentSession || currentSession.id !== sessionId)) {
        try {
          setIsLoading(true);
          await loadSession(sessionId);
        } catch (error) {
          console.error('Failed to load session:', error);
          Alert.alert('Error', 'Failed to load session');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSessionIfNeeded();
  }, [sessionId, currentSession, loadSession]);

  // Update session when scene is visited (for tracking progress)
  useEffect(() => {
    const updateSessionProgress = async () => {
      if (currentSession && sceneId && !isPrologue) {
        try {
          // Add scene to visited scenes if not already there
          const updatedScenesVisited = currentSession.scenesVisited.includes(sceneId)
            ? currentSession.scenesVisited
            : [...currentSession.scenesVisited, sceneId];

          await updateCurrentSession({
            currentSceneId: sceneId,
            scenesVisited: updatedScenesVisited,
            lastPlayedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to update session progress:', error);
        }
      }
    };

    updateSessionProgress();
  }, [currentSession, sceneId, isPrologue, updateCurrentSession]);

  // Handle choice selection with session recording
  const handleChoiceSelection = async (choice: any, choiceIndex: number) => {
    if (!currentSession) {
      Alert.alert('Error', 'No active session found');
      return;
    }

    try {
      setIsLoading(true);

      // Record the choice in the session
      await storySessionManager.recordChoice(currentSession.id, {
        id: `${sceneId}_${choiceIndex}_${Date.now()}`,
        sceneId: sceneId || 'prologue',
        choiceIndex,
        choiceText: choice.text,
        consequences: choice.consequences || [],
      });

      // Navigate to next scene
      if (choice.nextSceneIndex !== undefined && choice.nextSceneIndex !== null) {
        const nextScene = story?.scenes.find(s => s.id === choice.nextSceneIndex);
        if (nextScene) {
          if (nextScene.type === 'chat') {
            navigation.navigate('Chat', { 
              storyId, 
              sceneId: nextScene.id, 
              sessionId: currentSession.id 
            });
          } else {
            navigation.navigate('StoryScene', { 
              storyId, 
              sceneId: nextScene.id, 
              sessionId: currentSession.id 
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to record choice:', error);
      Alert.alert('Error', 'Failed to save your choice');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continue button (for scenes without explicit choices)
  const handleContinue = async () => {
    if (!currentSession) {
      Alert.alert('Error', 'No active session found');
      return;
    }

    try {
      setIsLoading(true);

      const scene = story?.scenes.find(s => s.id === sceneId);
      if (scene?.nextSceneIndex !== undefined) {
        // Record automatic continuation as a choice
        await storySessionManager.recordChoice(currentSession.id, {
          id: `${sceneId}_continue_${Date.now()}`,
          sceneId: sceneId || 'prologue',
          choiceIndex: 0,
          choiceText: 'Continue',
          consequences: [],
        });

        const nextScene = story?.scenes.find(s => s.id === scene.nextSceneIndex);
        if (nextScene) {
          if (nextScene.type === 'chat') {
            navigation.navigate('Chat', { 
              storyId, 
              sceneId: nextScene.id, 
              sessionId: currentSession.id 
            });
          } else {
            navigation.navigate('StoryScene', { 
              storyId, 
              sceneId: nextScene.id, 
              sessionId: currentSession.id 
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to continue:', error);
      Alert.alert('Error', 'Failed to continue story');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle beginning story from prologue
  const handleBeginStory = async () => {
    if (!currentSession) {
      Alert.alert('Error', 'No active session found');
      return;
    }

    try {
      setIsLoading(true);

      // Record prologue completion
      await storySessionManager.recordChoice(currentSession.id, {
        id: `prologue_begin_${Date.now()}`,
        sceneId: 'prologue',
        choiceIndex: 0,
        choiceText: 'Begin Story',
        consequences: ['story_started'],
      });

      // Navigate to first scene
      const firstSceneId = story?.scenes[0].id;
      if (firstSceneId) {
        const firstScene = story.scenes[0];
        if (firstScene.type === 'chat') {
          navigation.navigate('Chat', { 
            storyId, 
            sceneId: firstSceneId, 
            sessionId: currentSession.id 
          });
        } else {
          navigation.navigate('StoryScene', { 
            storyId, 
            sceneId: firstSceneId, 
            sessionId: currentSession.id 
          });
        }
      }
    } catch (error) {
      console.error('Failed to begin story:', error);
      Alert.alert('Error', 'Failed to start story');
    } finally {
      setIsLoading(false);
    }
  };

  if (!story) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.errorText}>Story not found</Text>
          <TouchableOpacity 
            style={commonStyles.buttonOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonTextOutline}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.paragraph}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show session error if any
  if (sessionError) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.errorText}>Session Error: {sessionError}</Text>
          <TouchableOpacity 
            style={commonStyles.buttonOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonTextOutline}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // For prologue view
  if (isPrologue) {
    const prologueContent = story.prologue;
    
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <ScrollView contentContainerStyle={commonStyles.scrollContent}>
          <View style={commonStyles.container}>
            <Text style={commonStyles.coloredTitle}>{story.title}</Text>
            
            {/* Show session info if available */}
            {currentSession && (
              <Text style={[commonStyles.paragraph, { fontSize: 12, opacity: 0.7 }]}>
                Session: {currentSession.customVariables.characterName || 'New Adventure'}
              </Text>
            )}
            
            <View style={commonStyles.card}>
              {prologueContent.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={commonStyles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[commonStyles.buttonPrimary, isLoading && { opacity: 0.5 }]}
              onPress={handleBeginStory}
              disabled={isLoading || !currentSession}
            >
              <Text style={commonStyles.buttonText}>
                {isLoading ? 'Starting...' : 'Begin Story'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={commonStyles.buttonOutline}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={commonStyles.buttonTextOutline}>Back to Stories</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For regular scene view
  const scene = story?.scenes.find(s => s.id === sceneId);
  
  if (!scene) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.errorText}>Scene not found.</Text>
          <TouchableOpacity 
            style={commonStyles.buttonOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonTextOutline}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.coloredTitle}>{story.title}</Text>
          
          {/* Show session progress if available */}
          {currentSession && (
            <Text style={[commonStyles.paragraph, { fontSize: 12, opacity: 0.7 }]}>
              Progress: {currentSession.scenesVisited.length} scenes visited • 
              {currentSession.choices.length} choices made
            </Text>
          )}
          
          <Text style={commonStyles.paragraph}>{scene.text || 'No scene text provided.'}</Text>

          {/* Render choices */}
          {scene.choices && scene.choices.length > 0 && (
            <View>
              {scene.choices.map((choice, idx) => (
                <TouchableOpacity 
                  key={choice.text + idx} 
                  style={[commonStyles.buttonPrimary, isLoading && { opacity: 0.5 }]}
                  onPress={() => handleChoiceSelection(choice, idx)}
                  disabled={isLoading}
                >
                  <Text style={commonStyles.buttonText}>{choice.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Continue button for scenes without explicit choices */}
          {!scene.choices?.length && scene.nextSceneIndex !== undefined && (
            <TouchableOpacity 
              style={[commonStyles.buttonPrimary, isLoading && { opacity: 0.5 }]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={commonStyles.buttonText}>
                {isLoading ? 'Loading...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={commonStyles.buttonOutline}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonTextOutline}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StorySceneScreen;