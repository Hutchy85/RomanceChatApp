import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories';

type StorySceneRouteProp = RouteProp<RootStackParamList, 'StoryScene'>;
type StorySceneNavigationProp = StackNavigationProp<RootStackParamList, 'StoryScene'>;

type Props = {
  route: StorySceneRouteProp;
  navigation: StorySceneNavigationProp;
};

const StorySceneScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId, sceneId } = route.params;
  const story = stories.find(s => s.id === storyId);
  const scene = story?.scenes.find(s => s.id === sceneId);

  if (!story) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Story not found</Text>
      </SafeAreaView>
    );
  }

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
  },
  sceneText: {
    fontSize: 18,
    lineHeight: 26,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    flexDirection: 'row',
  },
  choiceButton: {
    marginVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
