import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PrologueScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Prologue'>;
  route: RouteProp<RootStackParamList, 'Prologue'>;
};

// Interface for story prologue data
interface PrologueData {
  title: string;
  content: string;
  characterName: string;
}

// Interface for emotional state
interface EmotionalState {
  affection_wife: number;
  trust_wife: number;
  mood_wife: string;
  memories_wife: Record<string, boolean>;
  character_name: string;
}

// Mock data for prologues
const prologues: Record<string, PrologueData> = {
  'rekindled-flame': {
    title: 'Rekindled Flame',
    content: `The soft glow of the evening lamp casts long shadows across your living room. Five years of marriage to Emily, and lately, things have felt... different. The passionate conversations have given way to mundane exchanges about grocery lists and utility bills.

You remember how it used to be—the way her eyes would light up when you walked into the room, the spontaneous weekend trips, the long talks that stretched into the early hours of the morning. Somewhere along the way, those moments became rare, replaced by comfortable silence and separate routines.

Tonight, Emily is working late again. The third time this week. You've ordered her favorite takeout as a surprise, hoping to create a moment of connection when she returns. As you set the table, you notice the framed photo from your honeymoon—both of you laughing, carefree, deeply in love.

Your phone buzzes with a text from Emily:

"On my way home. Need to talk."

Something in the brevity of her message makes your heart sink. You've both been avoiding the conversation about what's happening between you. Perhaps tonight, you'll finally address the growing distance.

The sound of keys in the door pulls you from your thoughts. Emily steps in, looking tired but beautiful as always. Her expression softens slightly when she sees the takeout containers.

"Hi," she says, setting down her bag. "We need to talk..."`,
    characterName: 'Emily'
  },
  'new-beginnings': {
    title: 'New Beginnings',
    content: `The last box is finally unpacked. After three exhausting days of moving, you and Sarah have officially settled into your new apartment in a city where neither of you know anyone. Your promotion came with a significant raise, but also required this cross-country relocation.

Sarah supported your decision, even though it meant leaving her job and friends behind. "We'll make new memories," she had said with that optimistic smile that first drew you to her three years ago. But now, as you watch her arrange family photos on the unfamiliar shelves, you notice the slight tension in her shoulders.

This move is a fresh start for both of you—a chance to build the life you've talked about since getting married last year. Yet, the uncertainty of this new chapter hangs in the air between you.

Sarah turns to you, brushing a strand of hair from her face. "So, this is home now," she says, her voice carrying both excitement and apprehension. "What should we do first as official residents of Westlake?"

You know your answer matters. This is the beginning of your new life together, and how you navigate these first few weeks will set the tone for your relationship in this unfamiliar place.`,
    characterName: 'Sarah'
  },
  'anniversary-surprise': {
    title: 'Anniversary Surprise',
    content: `One year of marriage to Olivia has flown by in a whirlwind of laughter, growth, and the occasional disagreement about whose turn it is to do the dishes. Your first wedding anniversary is tomorrow, and you've been planning the perfect surprise for weeks.

Reservations at the exclusive restaurant where you had your first date? Check. The vintage bracelet she's been eyeing for months? Hidden in your sock drawer. A heartfelt letter expressing everything she means to you? Written and rewritten a dozen times.

As you finalize the details, your phone rings. It's your boss, and the conversation that follows throws your carefully crafted plans into disarray. An emergency client meeting has been scheduled for tomorrow evening—the exact time of your anniversary dinner. Your presence is "non-negotiable."

You hang up, mind racing. Olivia has mentioned several times how important this first anniversary is to her. Her parents divorced before their first anniversary, and she's always said making it to one year together, truly happy, means everything to her.

When Olivia comes home from her yoga class, cheeks flushed and smiling, you're still trying to figure out how to salvage your anniversary plans. She kisses you hello and says she has a small surprise for you for tomorrow.

The guilt intensifies. How are you going to tell her about the meeting?`,
    characterName: 'Olivia'
  }
};

// Initial emotional states for different stories
const initialStates: Record<string, EmotionalState> = {
  'rekindled-flame': {
    affection_wife: 5,
    trust_wife: 4,
    mood_wife: 'concerned',
    memories_wife: {
      recent_distance: true,
      takeout_surprise: true
    },
    character_name: 'Emily'
  },
  'new-beginnings': {
    affection_wife: 7,
    trust_wife: 8,
    mood_wife: 'hopeful',
    memories_wife: {
      supported_move: true,
      left_job_for_you: true
    },
    character_name: 'Sarah'
  },
  'anniversary-surprise': {
    affection_wife: 8,
    trust_wife: 9,
    mood_wife: 'excited',
    memories_wife: {
      first_anniversary_importance: true,
      parents_divorced_early: true
    },
    character_name: 'Olivia'
  }
};

const PrologueScreen: React.FC<PrologueScreenProps> = ({ navigation, route }) => {
  const { storyId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Get prologue data based on story ID
  const prologue = prologues[storyId] || {
    title: 'Unknown Story',
    content: 'Story details could not be loaded. Please return to the main page and try again.',
    characterName: 'Character'
  };

  // Fetch initial state from API or use local fallback
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        // In a real implementation, this would call the API
        // For now, we'll use the mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching prologue data:', error);
        setIsLoading(false);
        Alert.alert(
          'Error',
          'Failed to load story data. Please try again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }
    };

    fetchInitialState();
  }, [storyId, navigation]);

  // Function to handle continuing to chat
  const handleContinue = async () => {
    setIsInitializing(true);
    
    try {
      // Get initial emotional state for the story
      const emotionalState = initialStates[storyId] || {
        affection_wife: 5,
        trust_wife: 5,
        mood_wife: 'neutral',
        memories_wife: {},
        character_name: prologue.characterName
      };
      
      // In a real implementation, this would call the API
      // For now, we'll use the mock data
      
      // Save emotional state to AsyncStorage
      await AsyncStorage.setItem('emotionalState', JSON.stringify(emotionalState));
      
      // Navigate to chat screen
      navigation.navigate('Chat', { storyId });
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert(
        'Error',
        'Failed to initialize chat. Please try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{prologue.title}</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.prologueCard}>
          {prologue.content.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={styles.prologueText}>
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue to Chat</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isInitializing}
        >
          <Text style={styles.backButtonText}>Back to Stories</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
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
  buttonContainer: {
    marginTop: 20,
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

export default PrologueScreen;
