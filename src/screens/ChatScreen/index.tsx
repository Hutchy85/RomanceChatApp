import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { getChatbotReply } from '../../api/apiClient';
import { Message, Scene, UserProfile } from '../../types/index';
import { stories } from '../../data/stories/index';
import { storySessionManager } from '../../data/sessionstorage';
import { useSessionNavigation } from '../../contexts/SessionNavigationContext';
import { imageMap } from '../../data/imageMap';
import { colors, commonStyles } from '../../styles';
import RelationshipStatusBar from '../../components/RelationshipStatusBar';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { playBackgroundMusic, stopBackgroundMusic, playSoundEffect } from '../../utils/AudioManager';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { storyId, sessionId, sceneId } = route.params;
  const { profile, isProfileLoaded } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const headerHeight = useHeaderHeight();  
  const flatListRef = useRef<FlatList>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);
  const playStartTime = useRef<number>(Date.now());
  const insets = useSafeAreaInsets();
  const selectedStory = stories.find(story => story.id === storyId);
  const { currentSession, updateCurrentSession } = useSessionNavigation();

  // Initialize chat session
  useEffect(() => {
    initializeChatSession();
    stopBackgroundMusic();
  }, [storyId, sessionId, sceneId]);


  // Track play time when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      updatePlayTime();
    };
  }, []);

  const initializeChatSession = async () => {
    try {
      setIsLoading(true);

      if (!selectedStory) {
        throw new Error('Story not found');
      }

      // Find the current scene
      const scene = selectedStory.scenes.find(s => s.id === sceneId);
      if (!scene) {
        throw new Error('Scene not found');
      }

      setCurrentScene(scene);

      // Load session data
      const session = storySessionManager.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Set up system prompt
      const systemPrompt = scene.systemPrompt || 'You are a helpful assistant.';
      chatHistory.current = [{ role: 'system', content: systemPrompt }];

      // Load existing messages if any
      if (session.messages && session.messages.length > 0) {
        // Ensure messages have all required fields for Message type
        const transformedMessages = session.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          image: msg.image,
          sender: msg.type ?? 'assistant', // fallback if missing
          timestamp: msg.timestamp ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: msg.name,
          avatar: msg.avatar,
        }));
        setMessages(transformedMessages);
        
        // Rebuild chat history from saved messages
        const rebuiltHistory = transformedMessages
          .filter(msg => msg.sender !== 'system')
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || '',
          }));
          
        chatHistory.current = [
          { role: 'system', content: systemPrompt },
          ...rebuiltHistory,
        ];
      }

      // Update session with current scene if different
      if (session.currentSceneId !== sceneId) {
        await updateCurrentSession({
          currentSceneId: sceneId,
          scenesVisited: [...new Set([...session.scenesVisited, sceneId])],
        });
      }

    } catch (error) {
      console.error('Error initializing chat session:', error);
      Alert.alert(
        'Error', 
        'Failed to load chat session. Please try again.',
        [
          { text: 'Go Back', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: () => initializeChatSession() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayTime = async () => {
    try {
      const sessionEndTime = Date.now();
      const sessionDuration = Math.floor((sessionEndTime - playStartTime.current) / 1000);
      
      if (currentSession && sessionDuration > 0) {
        await updateCurrentSession({
          totalPlayTime: currentSession.totalPlayTime + sessionDuration,
        });
      }
    } catch (error) {
      console.error('Error updating play time:', error);
    }
  };

  const saveSessionData = async (updatedMessages: Message[]) => {
    try {
      if (!currentSession) return;

      await updateCurrentSession({
        messages: updatedMessages.map(msg => ({
          ...msg,
          sender: msg.name ?? '',
          content: msg.text ?? '',
        })),
        lastPlayedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving session:', error);
      // Don't show error to user for auto-saves, but log it
    }
  };

  // Memoized message creation function
  const createMessage = useCallback((text: string, type: Message['sender'], imageUrl?: number): Message => {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: imageUrl ? undefined : text,
      image: imageUrl,
      sender: type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: type === 'user' ? 'You' : currentScene?.characterName,
      avatar: type === 'user' ? imageMap.userAvatar : imageMap.assistantAvatar,
    };
  }, [currentScene]);

  const addMessage = useCallback((text: string, type: Message['sender']) => {
    const newMessage = createMessage(text, type);
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      // Auto-save after adding message
      saveSessionData(updatedMessages);
      return updatedMessages;
    });
    
    scrollToEnd();
  }, [createMessage]);

  const addImageMessage = useCallback((imageUrl: number, type: Message['sender']) => {
    const newMessage = createMessage('', type, imageUrl);
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      // Auto-save after adding message
      saveSessionData(updatedMessages);
      return updatedMessages;
    });
    
    scrollToEnd();
  }, [createMessage]);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const checkTriggers = useCallback(async (aiReply: string) => {
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
    for (const trigger of sceneTriggers) {
      if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
        // Record memory of scene transition
        try {
          await storySessionManager.recordMemory(sessionId, {
            id: `scene_transition_${Date.now()}`,
            type: 'event',
            title: `Scene Transition`,
            description: `Triggered by keyword: ${trigger.keyword}`,
            sceneId: currentScene.id,
            tags: ['scene_transition', trigger.keyword],
          });

          // Navigate to next scene
          navigation.navigate('StoryScene', { 
            storyId, 
            sessionId,
            sceneId: trigger.nextSceneIndex 
          });
        } catch (error) {
          console.error('Error recording scene transition:', error);
          // Still navigate even if memory recording fails
          navigation.navigate('StoryScene', { 
            storyId, 
            sessionId,
            sceneId: trigger.nextSceneIndex 
          });
        }
        break; // Only trigger first matching scene transition
      }
    }
  }, [currentScene, storyId, sessionId, navigation, addImageMessage]);

  const handleSendMessage = async () => {
  if (!inputText.trim() || isSending || !currentSession) return;

  await playSoundEffect(require('../../assets/audio/message_send.mp3'));

  const userMessage = inputText.trim();
  addMessage(userMessage, 'user');
  chatHistory.current.push({ role: 'user', content: userMessage });
  setInputText('');
  setIsSending(true);

  try {
    // Record choice at this message
    await storySessionManager.recordChoice(sessionId, {
      id: `choice_${Date.now()}`,
      sceneId: currentScene?.id || sceneId,
      choiceIndex: currentSession.choiceCount,
      choiceText: userMessage,
    });

    const aiReply = await getChatbotReply(chatHistory.current);
    chatHistory.current.push({ role: 'assistant', content: aiReply });
    addMessage(aiReply, 'assistant');

    await playSoundEffect(require('../../assets/audio/message_receive.mp3'));

    // Check for triggers in AI's reply
    await checkTriggers(aiReply);

    // Update session stats (increment choice count)
    await updateCurrentSession({
      choiceCount: currentSession.choiceCount + 1,
    });

    // 🔥 Autosave progress here
    await updatePlayTime();
    await saveSessionData(messages);

  } catch (error) {
    console.error('Error handling message send:', error);
    addMessage('Sorry, something went wrong. Please try again.', 'system');
  } finally {
    setIsSending(false);
  }
};

  const renderMessageItem = ({ item }: { item: Message }) => {
  const displayName = item.sender === 'user'
    ? profile?.playerName || 'You'
    : item.name;

  return (
    <View style={[
      commonStyles.messageWrapper,
      item.sender === 'user' ? commonStyles.userMessageWrapper : commonStyles.assistantMessageWrapper
    ]}>
      {item.sender !== 'system' && (
        <Image source={item.avatar} style={commonStyles.avatar} />
      )}
      <View style={[
        commonStyles.messageContainer,
        item.sender === 'user' ? commonStyles.userMessage :
        item.sender === 'assistant' ? commonStyles.assistantMessage :
        commonStyles.systemMessage
      ]}>
        {item.sender !== 'system' && (
          <Text style={commonStyles.senderName}>{displayName}</Text>
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
            item.sender === 'system' && commonStyles.systemMessageText
          ]}>
            {item.text}
          </Text>
        )}
        {item.sender !== 'system' && !item.image && (
          <Text style={commonStyles.timestampText}>{item.timestamp}</Text>
        )}
      </View>
    </View>
  );
};


  if (isLoading) {
    return (
      <SafeAreaView style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={commonStyles.messageText}>Loading chat session...</Text>
      </SafeAreaView>
    );
  }

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
  <>
    <RelationshipStatusBar />
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={commonStyles.messagesContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        keyboardShouldPersistTaps="always"
      />

      <View style={[commonStyles.footerContainer, { paddingBottom: insets.bottom }]}>
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
            editable={!isSending}
          />
          <TouchableOpacity
            style={[
              commonStyles.sendButton,
              (!inputText.trim() || isSending) && commonStyles.buttonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isSending}
          >
            <Text style={commonStyles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </>
);
};

export default ChatScreen;