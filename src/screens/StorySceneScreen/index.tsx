import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories/index';

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
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Story not found</Text>
      </SafeAreaView>
    );
  }

  // For prologue view
  if (isPrologue) {
    const prologueContent = story.prologue;
    
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>{story.title}</Text>
          
          <View style={styles.prologueCard}>
            {prologueContent.split('\n\n').map((paragraph, index) => (
              <Text key={index} style={styles.prologueText}>
                {paragraph}
              </Text>
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.continueButton}
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
              <Text style={styles.continueButtonText}>Begin Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Stories</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For regular scene view (original functionality)
  if (!scene) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Scene not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.sceneText}>{scene.text || 'No scene text provided.'}</Text>

        {scene.choices && scene.choices.length > 0 && (
          <View>
            {scene.choices.map((choice, idx) => (
              <View key={choice.text + idx} style={styles.choiceButton}>
                <Button
                  title={choice.text}
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
                />
              </View>
            ))}
          </View>
        )}

        {!scene.choices?.length && scene.nextSceneIndex !== undefined && (
          <View style={styles.choiceButton}>
            <Button
              title="Continue"
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
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default StorySceneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ff6b6b',
  },
  sceneText: {
    fontSize: 18,
    lineHeight: 26,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  choiceButton: {
    marginVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  // Styles from PrologueScreen for consistency
  prologueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  prologueText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  backButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16,
  },
});