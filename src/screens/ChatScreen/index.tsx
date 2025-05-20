import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { getChatbotReply } from '../../api/apiClient';
import { Message } from '../../types/index';
import { stories } from '../../data/stories/index';
import { Scene, ImageTrigger, SceneTrigger } from '../../types/index';
import { saveSession, loadSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';

type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { storyId, sceneId, startNewSession } = route.params;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);
  
  const selectedStory = stories.find(story => story.id === storyId);

  // Find the current scene and set up system prompt on mount
  useEffect(() => {
    if (!selectedStory) return;
    
    const scene = selectedStory.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    setCurrentScene(scene);
    const systemPrompt = scene.systemPrompt || 'You are a helpful assistant.';
    chatHistory.current = [{ role: 'system', content: systemPrompt }];
    
    // Load existing session if needed
    if (!startNewSession) {
      loadExistingSession(systemPrompt);
    }
  }, [storyId, sceneId, startNewSession]);

  const loadExistingSession = async (systemPrompt: string) => {
    try {
      const savedMessages = await loadSession(storyId);
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
        
        // Rebuild chat history from saved messages
        const rebuiltHistory = savedMessages
          .filter(msg => msg.type !== 'system')
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text || '',
          }));
          
        chatHistory.current = [
          { role: 'system', content: systemPrompt },
          ...rebuiltHistory,
        ];
        
        console.log('Loaded existing session with', savedMessages.length, 'messages');
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  // Memoized message creation function to prevent recreating on each render
  const createMessage = useCallback((text: string, type: Message['type'], imageUrl?: number): Message => {
    return {
      id: Date.now().toString(),
      text: imageUrl ? undefined : text,
      image: imageUrl,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: type === 'user' ? 'You' : currentScene?.characterName,
      avatar: type === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
  }, [currentScene]);

  const addMessage = useCallback((text: string, type: Message['type']) => {
    const newMessage = createMessage(text, type);
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    scrollToEnd();
  }, [createMessage]);

  const addImageMessage = useCallback((imageUrl: number, type: Message['type']) => {
    const newMessage = createMessage('', type, imageUrl);
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    scrollToEnd();
  }, [createMessage]);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const checkTriggers = useCallback((aiReply: string) => {
    if (!currentScene) return;
    
    // Check for image triggers
    const imageTriggers = currentScene.imageTriggers || [];
    imageTriggers.forEach(trigger => {
      if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
        trigger.images.forEach(image => addImageMessage(Number(image), 'assistant'));
      }
    });
    
    // Check for scene triggers
    const sceneTriggers = currentScene.sceneTriggers || [];
    sceneTriggers.forEach(trigger => {
      if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
        navigation.navigate('StoryScene', { storyId, sceneId: trigger.nextSceneIndex });
      }
    });
  }, [currentScene, storyId, navigation, addImageMessage]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, 'user');
    chatHistory.current.push({ role: 'user', content: userMessage });
    setInputText('');
    setIsSending(true);

    try {
      const aiReply = await getChatbotReply(chatHistory.current);
      chatHistory.current.push({ role: 'assistant', content: aiReply });
      addMessage(aiReply, 'assistant');
      
      // Check for triggers in the AI's reply
      checkTriggers(aiReply);
      
      // Auto-save after each message exchange
      const updatedMessages = [...messages, 
        createMessage(userMessage, 'user'),
        createMessage(aiReply, 'assistant')
      ];
      await saveSession(storyId, updatedMessages);
      
    } catch (error) {
      console.error('Error getting chatbot reply:', error);
      addMessage('Sorry, something went wrong. Please try again.', 'system');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper,
      item.type === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper
    ]}>
      {item.type !== 'system' && (
        <Image source={item.avatar} style={styles.avatar} />
      )}
      <View style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage :
        item.type === 'assistant' ? styles.assistantMessage :
        styles.systemMessage
      ]}>
        {item.type !== 'system' && (
          <Text style={styles.senderName}>{item.name}</Text>
        )}
        {item.image ? (
          <Image
            source={item.image}
            style={styles.chatImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={[
            styles.messageText,
            item.type === 'system' && styles.systemMessageText
          ]}>
            {item.text}
          </Text>
        )}
        {item.type !== 'system' && !item.image && (
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        )}
      </View>
    </View>
  );

  if (!selectedStory || !currentScene) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Story or scene not found.</Text>
        <TouchableOpacity 
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('StorySelection')}
        >
          <Text style={styles.buttonText}>Return to Stories</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
  >
    <SafeAreaView style={styles.container}>
  
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.messagesContent}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      keyboardShouldPersistTaps="handled"
    />

    <View style={styles.footerContainer}>
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
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveSession(storyId, messages)}
        >
          <Text style={styles.saveButtonText}>Save Progress</Text>
        </TouchableOpacity>

        {currentScene.sceneTriggers && currentScene.sceneTriggers.length > 0 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              const nextSceneId = currentScene.sceneTriggers?.[0]?.nextSceneIndex;
              if (nextSceneId) {
                navigation.navigate('StoryScene', { storyId, sceneId: nextSceneId });
              }
            }}
          >
            <Text style={styles.nextButtonText}>Go to Next Scene</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </SafeAreaView>
  </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9',
    paddingBottom: 30, 
  },

  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    textAlign: 'center',
    margin: 20,
  },
  buttonPrimary: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderBottomRightRadius: 0 
  },
  assistantMessage: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#4ecdc4', 
    borderBottomLeftRadius: 0 
  },
  systemMessage: { 
    alignSelf: 'center', 
    backgroundColor: '#f0f0f0', 
    maxWidth: '90%' 
  },
  messageText: { 
    fontSize: 16, 
    color: '#fff' 
  },
  systemMessageText: { 
    color: '#777', 
    fontStyle: 'italic' 
  },
  timestampText: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.7)', 
    alignSelf: 'flex-end', 
    marginTop: 5 
  },
  chatImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
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
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userMessageWrapper: {
    flexDirection: 'row-reverse',
  },
  assistantMessageWrapper: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  senderName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  typingText: { 
    marginLeft: 5, 
    color: '#777' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#eaeaea' 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    maxHeight: 100 
  },
  sendButton: { 
    backgroundColor: '#ff6b6b', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    marginLeft: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendButtonDisabled: { 
    backgroundColor: '#ccc' 
  },
  sendButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  messagesContent: { 
    padding: 15, 
    paddingBottom: 10 
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#ffa502',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
  borderTopWidth: 1,
  borderTopColor: '#eaeaea',
  backgroundColor: '#fff',
  padding: 10,
  flexShrink: 0,
},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default ChatScreen;