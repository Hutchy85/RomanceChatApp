import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

// Message types
type MessageType = 'system' | 'user' | 'wife';

interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: string;
}

// Emotional state interface
interface EmotionalState {
  affection_wife: number;
  trust_wife: number;
  mood_wife: string;
  memories_wife: Record<string, boolean>;
  character_name: string;
}

// API response interface
interface ApiResponse {
  reply: string;
  updated_state: EmotionalState;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { storyId, restore } = route.params;
  
  // State for emotional state
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  
  // State for messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Input state
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Ref for FlatList to auto-scroll to bottom
  const flatListRef = useRef<FlatList>(null);
  
  // Load emotional state and messages on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load emotional state from AsyncStorage
        const emotionalStateJson = await AsyncStorage.getItem('emotionalState');
        
        if (emotionalStateJson) {
          const loadedState = JSON.parse(emotionalStateJson);
          setEmotionalState(loadedState);
          
          // Add initial system message
          const initialMessage: Message = {
            id: Date.now().toString(),
            text: `You are now chatting with ${loadedState.character_name}. Type a message to begin your conversation.`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages([initialMessage]);
        } else {
          // If no emotional state is found, navigate back to story selection
          Alert.alert(
            'Error',
            'Failed to load conversation data. Please try again.',
            [
              { 
                text: 'OK', 
                onPress: () => navigation.navigate('StorySelection') 
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert(
          'Error',
          'Failed to load conversation data. Please try again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('StorySelection') 
            }
          ]
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [navigation, storyId, restore]);
  
  // Function to add a new message
  const addMessage = (text: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Scroll to bottom after adding message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !emotionalState) return;
    
    // Add user message
    addMessage(inputText, 'user');
    
    // Clear input
    const sentMessage = inputText;
    setInputText('');
    
    // Show sending state
    setIsSending(true);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response
      const response = await generateResponse(sentMessage, emotionalState);
      
      // Add wife's response
      addMessage(response.reply, 'wife');
      
      // Update emotional state
      setEmotionalState(response.updated_state);
      
      // Save updated emotional state to AsyncStorage
      await AsyncStorage.setItem('emotionalState', JSON.stringify(response.updated_state));
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, there was an error processing your message. Please try again.', 'system');
    } finally {
      setIsSending(false);
    }
  };
  
  // Function to generate a response (simulating API call)
  const generateResponse = async (userMessage: string, currentState: EmotionalState): Promise<ApiResponse> => {
    // In a real implementation, this would call the backend API
    // For now, we'll use mock responses based on the emotional state
    
    const lowerMessage = userMessage.toLowerCase();
    let reply = '';
    let updatedState = { ...currentState };
    
    // Check for greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      if (currentState.mood_wife === 'happy' || currentState.mood_wife === 'excited' || currentState.mood_wife === 'hopeful') {
        reply = `Hi there! It's good to see you. How has your day been so far?`;
      } else if (currentState.mood_wife === 'sad') {
        reply = `Hey... I've been better, honestly. But I'm glad you're here.`;
      } else if (currentState.mood_wife === 'angry') {
        reply = `Hi. I'm still a bit upset about earlier, but I'm trying to move past it.`;
      } else if (currentState.mood_wife === 'concerned') {
        reply = `Hi... I've been thinking about us a lot today. Can we talk?`;
      } else {
        reply = `Hey there. How are you doing?`;
      }
    }
    // Check for apology
    else if (lowerMessage.includes('sorry') || lowerMessage.includes('apologize')) {
      if (currentState.trust_wife < 5) {
        reply = `I appreciate you saying that. It's going to take some time, but it's a start.`;
        updatedState.trust_wife = Math.min(10, currentState.trust_wife + 1);
        updatedState.mood_wife = 'hopeful';
      } else {
        reply = `Thank you for apologizing. That means a lot to me. I know we can work through this together.`;
        updatedState.affection_wife = Math.min(10, currentState.affection_wife + 1);
        updatedState.mood_wife = 'happy';
      }
    }
    // Check for love expression
    else if (lowerMessage.includes('love you') || lowerMessage.includes('love u')) {
      if (currentState.affection_wife > 7) {
        reply = `I love you too, so much. You make me so happy.`;
        updatedState.affection_wife = Math.min(10, currentState.affection_wife + 1);
        updatedState.mood_wife = 'happy';
      } else if (currentState.affection_wife > 4) {
        reply = `I love you too. We've been through a lot, but my feelings haven't changed.`;
      } else {
        reply = `I... I know. I love you too, but we need to work on some things, don't we?`;
      }
    }
    // Check for question about feelings
    else if (lowerMessage.includes('feel') || lowerMessage.includes('how are you')) {
      if (currentState.mood_wife === 'happy') {
        reply = `I'm feeling really good today! Just being with you makes everything better.`;
      } else if (currentState.mood_wife === 'sad') {
        reply = `Honestly? I'm a bit down. I've been thinking about everything that's happened, and it's been hard.`;
      } else if (currentState.mood_wife === 'angry') {
        reply = `I'm still processing things. I need a little space, but I'm trying not to let it affect us too much.`;
      } else if (currentState.mood_wife === 'concerned') {
        reply = `I'm worried about us. I feel like we've been drifting apart lately. Have you noticed that too?`;
      } else if (currentState.mood_wife === 'hopeful') {
        reply = `I'm actually feeling hopeful. I think we're moving in the right direction, don't you?`;
      } else if (currentState.mood_wife === 'excited') {
        reply = `I'm excited! I've been looking forward to spending time with you all day.`;
      } else {
        reply = `I'm okay. Nothing special, just taking things one day at a time.`;
      }
    }
    // Default response based on mood
    else {
      if (currentState.mood_wife === 'happy') {
        reply = `That's interesting! You know, I was just thinking about the weekend. Maybe we could do something special together?`;
      } else if (currentState.mood_wife === 'sad') {
        reply = `I hear you. Sorry if I seem a bit distant. I've just had a lot on my mind lately.`;
      } else if (currentState.mood_wife === 'angry') {
        reply = `I understand what you're saying. I'm trying to be more open-minded, even though I'm still working through some feelings.`;
      } else if (currentState.mood_wife === 'concerned') {
        reply = `I see. You know, I've been wondering if we're still on the same page about our future. What do you think?`;
      } else if (currentState.mood_wife === 'hopeful') {
        reply = `That makes sense. I've been feeling more positive about things lately. I think we're making progress, don't you?`;
      } else if (currentState.mood_wife === 'excited') {
        reply = `Yes! And you know what? I was thinking we could try that new restaurant downtown this weekend. What do you think?`;
      } else {
        reply = `I understand. Let's keep talking about this. Communication is important, right?`;
      }
    }
    
    return {
      reply,
      updated_state: updatedState
    };
  };
  
  // Function to save conversation
  const handleSaveConversation = async () => {
    if (!emotionalState) return;
    
    try {
      // Create saved session object
      const savedSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        storyId,
        characterName: emotionalState.character_name,
        emotionalState: {
          affection_wife: emotionalState.affection_wife,
          trust_wife: emotionalState.trust_wife,
          mood_wife: emotionalState.mood_wife
        },
        messages: messages
      };
      
      // Get existing saved sessions
      const savedSessionsJson = await AsyncStorage.getItem('savedSessions');
      let savedSessions = savedSessionsJson ? JSON.parse(savedSessionsJson) : [];
      
      // Add new session
      savedSessions.push(savedSession);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('savedSessions', JSON.stringify(savedSessions));
      
      // Show confirmation
      addMessage('Conversation saved successfully.', 'system');
    } catch (error) {
      console.error('Error saving conversation:', error);
      addMessage('Failed to save conversation. Please try again.', 'system');
    }
  };
  
  // Function to handle exiting the story
  const handleExitStory = () => {
    Alert.alert(
      'Exit Story',
      'Are you sure you want to exit this story? Unsaved progress will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => navigation.navigate('StorySelection')
        }
      ]
    );
  };
  
  // Function to render a message item
  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessage : 
      item.type === 'wife' ? styles.wifeMessage : 
      styles.systemMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.type === 'system' && styles.systemMessageText
      ]}>
        {item.text}
      </Text>
      {item.type !== 'system' && (
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      )}
    </View>
  );
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  if (isLoading || !emotionalState) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.storyInfo}>
          <Text style={styles.characterName}>{emotionalState.character_name}</Text>
        </View>
        <View style={styles.emotionalState}>
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>Mood:</Text>
            <Text style={[
              styles.stateValue,
              styles[`mood${capitalizeFirstLetter(emotionalState.mood_wife)}` as keyof typeof styles] || styles.moodNeutral
            ]}>
              {capitalizeFirstLetter(emotionalState.mood_wife)}
            </Text>
          </View>
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>Affection:</Text>
            <Text style={styles.stateValue}>{emotionalState.affection_wife}/10</Text>
          </View>
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>Trust:</Text>
            <Text style={styles.stateValue}>{emotionalState.trust_wife}/10</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        {isSending && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#4ecdc4" />
            <Text style={styles.typingText}>Typing...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isSending}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleSaveConversation}
            disabled={isSending}
          >
            <Text style={styles.controlButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleExitStory}
            disabled={isSending}
          >
            <Text style={styles.controlButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  storyInfo: {
    marginBottom: 10,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emotionalState: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#777',
  },
  stateValue: {
    fontSize: 14,
    backgroundColor: '#eaeaea',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    color: '#333',
  },
  moodHappy: {
    backgroundColor: '#6bcd69',
    color: '#fff',
  },
  moodSad: {
    backgroundColor: '#74b9ff',
    color: '#fff',
  },
  moodAngry: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
  },
  moodConcerned: {
    backgroundColor: '#ffd166',
    color: '#333',
  },
  moodHopeful: {
    backgroundColor: '#4ecdc4',
    color: '#fff',
  },
  moodExcited: {
    backgroundColor: '#ff9a8b',
    color: '#fff',
  },
  moodNeutral: {
    backgroundColor: '#a0a0a0',
    color: '#fff',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff6b6b',
    borderBottomRightRadius: 0,
  },
  wifeMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#4ecdc4',
    borderBottomLeftRadius: 0,
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    maxWidth: '90%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  systemMessageText: {
    color: '#777',
    fontStyle: 'italic',
  },
  timestampText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginLeft: 15,
    marginBottom: 10,
  },
  typingText: {
    marginLeft: 5,
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  controlButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 5,
  },
  controlButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
