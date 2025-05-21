import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { getChatbotReply } from '../../api/apiClient';
import { Message } from '../../types/index';
import { stories } from '../../data/stories/index';
import { Scene } from '../../types/index';
import { saveSession, loadSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { colors, commonStyles } from '../../styles'; // Import shared styles

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
      commonStyles.messageWrapper,
      item.type === 'user' ? commonStyles.userMessageWrapper : commonStyles.assistantMessageWrapper
    ]}>
      {item.type !== 'system' && (
        <Image source={item.avatar} style={commonStyles.avatar} />
      )}
      <View style={[
        commonStyles.messageContainer,
        item.type === 'user' ? commonStyles.userMessage :
        item.type === 'assistant' ? commonStyles.assistantMessage :
        commonStyles.systemMessage
      ]}>
        {item.type !== 'system' && (
          <Text style={commonStyles.senderName}>{item.name}</Text>
        )}
        {item.image ? (
          <Image
            source={item.image}
            style={commonStyles.chatImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={[
            commonStyles.messageText,
            item.type === 'system' && commonStyles.systemMessageText
          ]}>
            {item.text}
          </Text>
        )}
        {item.type !== 'system' && !item.image && (
          <Text style={commonStyles.timestampText}>{item.timestamp}</Text>
        )}
      </View>
    </View>
  );

  if (!selectedStory || !currentScene) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={commonStyles.errorText}>Story or scene not found.</Text>
        <TouchableOpacity 
          style={commonStyles.buttonPrimary}
          onPress={() => navigation.navigate('StorySelection')}
        >
          <Text style={commonStyles.buttonText}>Return to Stories</Text>
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
    <SafeAreaView style={commonStyles.safeAreaContainer}>
  
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={item => item.id}
      contentContainerStyle={commonStyles.messagesContent}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      keyboardShouldPersistTaps="handled"
    />

    <View style={commonStyles.footerContainer}>
    {isSending && (
        <View style={commonStyles.typingContainer}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={commonStyles.typingText}>Typing...</Text>
        </View>
      )}

      <View style={commonStyles.inputContainer}>
        <TextInput
          style={commonStyles.input}
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
            commonStyles.buttonPrimary,
            (!inputText.trim() || isSending) && commonStyles.buttonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSending}
        >
          <Text style={commonStyles.buttonText}>Send</Text>
        </TouchableOpacity>
      
      </View>
      <View style={commonStyles.buttonRow}>
        <TouchableOpacity
          style={commonStyles.buttonSecondary}
          onPress={() => saveSession(storyId, messages)}
        >
          <Text style={commonStyles.buttonText}>Save Progress</Text>
        </TouchableOpacity>

        {currentScene.sceneTriggers && currentScene.sceneTriggers.length > 0 && (
          <TouchableOpacity
            style={commonStyles.buttonTertiary}
            onPress={() => {
              const nextSceneId = currentScene.sceneTriggers?.[0]?.nextSceneIndex;
              if (nextSceneId) {
                navigation.navigate('StoryScene', { storyId, sceneId: nextSceneId });
              }
            }}
          >
            <Text style={commonStyles.buttonText}>Go to Next Scene</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </SafeAreaView>
  </KeyboardAvoidingView>

  );
};

export default ChatScreen;