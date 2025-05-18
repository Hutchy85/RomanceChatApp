import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Button, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { getChatbotReply } from '../../api/apiClient';
import { Message } from '../../types/index';
import { stories } from '../../data/stories';
import { saveSession } from '../../data/sessionstorage';
import { loadSession } from '../../data/sessionstorage';
import { ImageTrigger } from '../../data/stories';
import imageMap from '../../data/imageMap';

type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {

  const { storyId, sceneId} = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);

  const selectedStory = stories.find(story => story.id === storyId);

  useEffect(() => {
    const scene = selectedStory?.scenes.find(s => s.id === sceneId);
    const systemPrompt = scene?.systemPrompt || 'You are a helpful assistant.';
    chatHistory.current = [
      { role: 'system', content: systemPrompt },
    ];
  
    const loadExistingSession = async () => {
      try {
        const savedMessages = await loadSession(storyId);
        if (savedMessages) {
          setMessages(savedMessages);
  
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
  
          console.log('Loaded existing session:', savedMessages);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };
  
    if (!route.params.startNewSession) {
      loadExistingSession();
    }

  }, [storyId]);    

  if (!selectedStory) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ margin: 20, fontSize: 18 }}>Story not found.</Text>
      </SafeAreaView>
    );
  }

  const addMessage = (text: string, type: Message['type']) => {
    const currentSceneIndex = selectedStory.scenes.findIndex(scene => scene.id === sceneId);
    const currentScene = selectedStory.scenes[currentSceneIndex];
  
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: type === 'user' ? 'You' : currentScene.characterName,
      avatar: type === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
  
    setMessages(prev => [...prev, newMessage]);
  
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };  
  
  const addImageMessage = (imageUrl: number, type: Message['type']) => {
    const currentSceneIndex = selectedStory.scenes.findIndex(scene => scene.id === sceneId);
    const currentScene = selectedStory.scenes[currentSceneIndex];
  
    const newMessage: Message = {
      id: Date.now().toString(),
      image: imageUrl,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: type === 'user' ? 'You' : currentScene.characterName,
      avatar: type === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
  
    setMessages(prev => [...prev, newMessage]);
  
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };  

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, 'user');
    chatHistory.current.push({ role: 'user', content: userMessage });
    setInputText('');
    setIsSending(true);

    try {
      const aiReply = await getChatbotReply(chatHistory.current);
      chatHistory.current.push({ role: 'assistant', content: aiReply });
      addMessage(aiReply, 'assistant');
    
      // Image triggers from current scene
      const currentSceneIndex = selectedStory.scenes.findIndex(scene => scene.id === sceneId);
      const triggers = selectedStory.scenes[currentSceneIndex].imageTriggers || [];
      const sceneTriggers = selectedStory.scenes[currentSceneIndex].sceneTriggers || [];
      triggers.forEach(trigger => {
        if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
          trigger.images.forEach(image => addImageMessage(Number(image), 'assistant'));
        }
      });
      sceneTriggers.forEach(trigger => {
        if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
          navigation.navigate('StoryScene', { storyId, sceneId: 'partyArival' });
        }
      });

    } catch (error) {
      console.error(error);
      addMessage('Sorry, something went wrong.', 'system');
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
        />
  
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveSession(storyId, messages)}
          >
            <Text style={styles.saveButtonText}>Save Progress</Text>
          </TouchableOpacity>
  
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
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isSending}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={{
    backgroundColor: '#ffa502',
    padding: 12,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  }}
  onPress={() => navigation.navigate('StoryScene', { storyId, sceneId: 'partyArival' })}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Skip to Party (Test)</Text>
</TouchableOpacity>

          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );  
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', marginBottom: 10 },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#ff6b6b', borderBottomRightRadius: 0 },
  assistantMessage: { alignSelf: 'flex-start', backgroundColor: '#4ecdc4', borderBottomLeftRadius: 0 },
  systemMessage: { alignSelf: 'center', backgroundColor: '#f0f0f0', maxWidth: '90%' },
  messageText: { fontSize: 16, color: '#fff' },
  systemMessageText: { color: '#777', fontStyle: 'italic' },
  timestampText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', alignSelf: 'flex-end', marginTop: 5 },
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

  typingText: { marginLeft: 5, color: '#777' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eaeaea' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { backgroundColor: '#ff6b6b', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  messagesContent: { padding: 15, paddingBottom: 10 },
  saveButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
});

export default ChatScreen;
