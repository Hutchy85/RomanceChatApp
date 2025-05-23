import React from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories/index';
import { commonStyles } from '../../styles';

type StorySceneRouteProp = RouteProp<RootStackParamList, 'StoryScene'>;
type StorySceneNavigationProp = StackNavigationProp<RootStackParamList, 'StoryScene'>;

type Props = {
  route: StorySceneRouteProp;
  navigation: StorySceneNavigationProp;
};

const StorySceneScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId, sceneId, isPrologue } = route.params;
  const story = stories.find(s => s.id === storyId);
  
  // If this is a prologue view, we'll use the story's prologue content
  // Otherwise, we'll find the specific scene as before
  const scene = isPrologue ? null : story?.scenes.find(s => s.id === sceneId);

  if (!story) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.errorText}>Story not found</Text>
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
            
            <View style={commonStyles.card}>
              {prologueContent.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={commonStyles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
            
            <TouchableOpacity 
              style={commonStyles.buttonPrimary}
              onPress={() => {
                // Find the first scene (typically chat scene)
                const firstSceneId = story.scenes[0].id;
                navigation.navigate('Chat', { 
                  storyId, 
                  sceneId: firstSceneId, 
                  startNewSession: true 
                });
              }}
            >
              <Text style={commonStyles.buttonText}>Begin Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={commonStyles.buttonOutline}
              onPress={() => navigation.goBack()}
            >
              <Text style={commonStyles.buttonTextOutline}>Back to Stories</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For regular scene view (original functionality)
  if (!scene) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.errorText}>Scene not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.coloredTitle}>{story.title}</Text>
          <Text style={commonStyles.paragraph}>{scene.text || 'No scene text provided.'}</Text>

          {scene.choices && scene.choices.length > 0 && (
            <View>
              {scene.choices.map((choice, idx) => (
                <TouchableOpacity 
                  key={choice.text + idx} 
                  style={commonStyles.buttonPrimary}
                  onPress={() => {
                    if (choice.nextSceneIndex !== undefined && choice.nextSceneIndex !== null) {
                      const nextScene = story.scenes.find(s => s.id === choice.nextSceneIndex);
                      if (nextScene) {
                        if (nextScene.type === 'chat') {
                          navigation.navigate('Chat', { storyId, sceneId: nextScene.id, startNewSession: true });
                        } else {
                          navigation.navigate('StoryScene', { storyId, sceneId: nextScene.id });
                        }
                      }
                    }
                  }}
                >
                  <Text style={commonStyles.buttonText}>{choice.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!scene.choices?.length && scene.nextSceneIndex !== undefined && (
            <TouchableOpacity 
              style={commonStyles.buttonPrimary}
              onPress={() => {
                const nextScene = story.scenes.find(s => s.id === scene.nextSceneIndex);
                if (nextScene) {
                  if (nextScene.type === 'chat') {
                    navigation.navigate('Chat', { storyId, sceneId: nextScene.id, startNewSession: true });
                  } else {
                    navigation.navigate('StoryScene', { storyId, sceneId: nextScene.id });
                  }
                }
              }}
            >
              <Text style={commonStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={commonStyles.buttonOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonTextOutline}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StorySceneScreen;