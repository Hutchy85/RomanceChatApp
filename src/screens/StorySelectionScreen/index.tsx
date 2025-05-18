import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories, Story } from '../../data/stories';
import { clearSession, clearLastOpenedSession } from '../../data/sessionstorage';
import { hasSavedSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { SafeAreaView } from 'react-native-safe-area-context';

type StorySelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StorySelection'>;
};

const StorySelectionScreen: React.FC<StorySelectionScreenProps> = ({ navigation }) => {

  const handleStartStory = async (storyId: string) => {
    try {
      await clearSession(storyId);
      await clearLastOpenedSession();
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('Prologue', { storyId });
    } catch (error) {
      console.error('Error starting new story:', error);
      navigation.navigate('Prologue', { storyId });
    }
  };

  const handleContinueStoryById = async (storyId: string) => {
    const exists = await hasSavedSession(storyId);
    if (exists) {
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('Chat', { storyId, sceneId: 'chat', startNewSession: false });

    } else {
      Alert.alert('No saved session', 'There is no saved session for this story.');
    }
  };

  const renderStoryItem = ({ item }: { item: Story }) => {
    // Use the image key from the story to fetch the image from the storyImages map
    const imageSource = imageMap[item.image as keyof typeof imageMap] || require('../../images/defaultImage.png');
  
    return (
      <View style={styles.storyCard}>
        <Image 
          source={imageSource} // Directly use the image from story data
          style={styles.storyImage}
          resizeMode="cover"
        />
        <View style={styles.storyDetails}>
          <Text style={styles.storyTitle}>{item.title}</Text>
          <Text style={styles.storyDescription}>{item.description}</Text>
          <View style={styles.storyMeta}>
            <Text style={styles.storyMetaText}>Duration: {item.duration}</Text>
            <Text style={styles.storyMetaText}>Theme: {item.theme}</Text>
          </View>
  
          {/* Start New Story Button */}
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => handleStartStory(item.id)}
          >
            <Text style={styles.startButtonText}>Start Story</Text>
          </TouchableOpacity>
  
          {/* Continue Story Button */}
          <TouchableOpacity 
            style={[styles.startButton, styles.continueButton]}
            onPress={() => handleContinueStoryById(item.id)}
          >
            <Text style={styles.startButtonText}>Continue Story</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Choose a story to begin your interactive romance experience
      </Text>

      <Text style={styles.sectionTitle}>Available Stories</Text>
      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  storyDetails: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  storyMetaText: {
    fontSize: 12,
    color: '#777',
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#4caf50',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StorySelectionScreen;