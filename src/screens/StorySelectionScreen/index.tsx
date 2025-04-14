import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorySelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StorySelection'>;
};

// Story interface
interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  theme: string;
  image: string;
}

// Saved session interface
interface SavedSession {
  id: string;
  date: string;
  storyId: string;
  characterName: string;
  emotionalState: {
    affection_wife: number;
    trust_wife: number;
    mood_wife: string;
  };
}

// Mock data for stories
const stories: Story[] = [
  {
    id: 'rekindled-flame',
    title: 'Rekindled Flame',
    description: 'After five years of marriage, you and your wife Emily are going through a rough patch. Can you rekindle the flame that once burned so brightly between you?',
    duration: '30 minutes',
    theme: 'Rebuilding Trust',
    image: 'https://via.placeholder.com/300x200?text=Story+1'
  },
  {
    id: 'new-beginnings',
    title: 'New Beginnings',
    description: 'You and Sarah have just moved to a new city for your job. As you both navigate this new chapter in your lives, will your relationship grow stronger or face unexpected challenges?',
    duration: '45 minutes',
    theme: 'Adaptation & Growth',
    image: 'https://via.placeholder.com/300x200?text=Story+2'
  },
  {
    id: 'anniversary-surprise',
    title: 'Anniversary Surprise',
    description: "It's your first wedding anniversary with Olivia, and you've been planning a special surprise. But when unexpected events threaten your plans, how will you salvage this important milestone?",
    duration: '25 minutes',
    theme: 'Celebration & Spontaneity',
    image: 'https://via.placeholder.com/300x200?text=Story+3'
  }
];

const StorySelectionScreen: React.FC<StorySelectionScreenProps> = ({ navigation }) => {
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved sessions on component mount
  useEffect(() => {
    loadSavedSessions();
  }, []);

  // Function to load saved sessions from AsyncStorage
  const loadSavedSessions = async () => {
    try {
      const sessionsJson = await AsyncStorage.getItem('savedSessions');
      if (sessionsJson) {
        const sessions = JSON.parse(sessionsJson);
        setSavedSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading saved sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle starting a new story
  const handleStartStory = (storyId: string) => {
    // Save current story ID to AsyncStorage
    AsyncStorage.setItem('currentStoryId', storyId)
      .then(() => {
        // Navigate to prologue screen
        navigation.navigate('Prologue', { storyId });
      })
      .catch(error => {
        console.error('Error saving story ID:', error);
        // Navigate anyway even if saving fails
        navigation.navigate('Prologue', { storyId });
      });
  };

  // Function to handle continuing a saved session
  const handleContinueSession = (session: SavedSession) => {
    // Save current story ID and emotional state to AsyncStorage
    Promise.all([
      AsyncStorage.setItem('currentStoryId', session.storyId),
      AsyncStorage.setItem('emotionalState', JSON.stringify(session.emotionalState))
    ])
      .then(() => {
        // Navigate to chat screen with restore flag
        navigation.navigate('Chat', { 
          storyId: session.storyId,
          restore: true 
        });
      })
      .catch(error => {
        console.error('Error restoring session:', error);
        Alert.alert('Error', 'Failed to restore saved session. Please try again.');
      });
  };

  // Function to handle deleting a saved session
  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this saved conversation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Filter out the session to delete
            const updatedSessions = savedSessions.filter(
              session => session.id !== sessionId
            );
            
            // Update state
            setSavedSessions(updatedSessions);
            
            // Save to AsyncStorage
            AsyncStorage.setItem('savedSessions', JSON.stringify(updatedSessions))
              .catch(error => {
                console.error('Error deleting session:', error);
                Alert.alert('Error', 'Failed to delete session. Please try again.');
              });
          }
        }
      ]
    );
  };

  // Render a story item
  const renderStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity 
      style={styles.storyCard}
      onPress={() => handleStartStory(item.id)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
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
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => handleStartStory(item.id)}
        >
          <Text style={styles.startButtonText}>Start Story</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render a saved session item
  const renderSessionItem = ({ item }: { item: SavedSession }) => {
    // Find the story details
    const story = stories.find(s => s.id === item.storyId);
    
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>
            {story?.title || 'Unknown Story'} with {item.characterName}
          </Text>
          <Text style={styles.sessionDate}>Saved on: {item.date}</Text>
          <View style={styles.sessionState}>
            <Text style={styles.sessionStateText}>
              Mood: {capitalizeFirstLetter(item.emotionalState.mood_wife)}
            </Text>
            <Text style={styles.sessionStateText}>
              Affection: {item.emotionalState.affection_wife}/10
            </Text>
            <Text style={styles.sessionStateText}>
              Trust: {item.emotionalState.trust_wife}/10
            </Text>
          </View>
        </View>
        <View style={styles.sessionActions}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => handleContinueSession(item)}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteSession(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Choose a story to begin your interactive romance experience
      </Text>
      
      {savedSessions.length > 0 && (
        <View style={styles.savedSessionsContainer}>
          <Text style={styles.sectionTitle}>Continue a Saved Conversation</Text>
          <FlatList
            data={savedSessions}
            renderItem={renderSessionItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sessionsListContainer}
          />
        </View>
      )}
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
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
  savedSessionsContainer: {
    marginBottom: 20,
  },
  sessionsListContainer: {
    paddingBottom: 10,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sessionInfo: {
    marginBottom: 15,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  sessionState: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sessionStateText: {
    fontSize: 12,
    color: '#777',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  continueButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 14,
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
    height: 200,
    width: '100%',
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
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StorySelectionScreen;
