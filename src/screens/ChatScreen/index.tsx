import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
// import { getChatbotReply } from '../../api/apiClient'; // Replaced by useChatApi
import { Message } from '../../types/index';
import { stories } from '../../data/stories/index';
import { Scene } from '../../types/index';
import imageMap from '../../data/imageMap'; 
import { colors, commonStyles } from '../../styles'; 
import { useChatMessages } from './hooks/useChatMessages';
import { useChatSession } from './hooks/useChatSession';
import { useChatApi } from './hooks/useChatApi';

type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { storyId, sceneId, startNewSession } = route.params;
  
  const [inputText, setInputText] = useState('');
  // const [isSending, setIsSending] = useState(false); // Moved to useChatApi
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const selectedStory = stories.find(story => story.id === storyId);

  const { messages, addMessage, addImageMessage, setMessages: setHookMessages } = useChatMessages(flatListRef);
  const { chatHistory, loadSession, saveSession, initializeChatHistory, updateChatHistory } = useChatSession(storyId, setHookMessages);
  const { isSending, fetchBotReply } = useChatApi();


  // Find the current scene and set up system prompt on mount
  useEffect(() => {
    if (!selectedStory) return;
    
    const scene = selectedStory.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    setCurrentScene(scene);
    const systemPrompt = scene.systemPrompt || 'You are a helpful assistant.';
    
    if (!startNewSession) {
      loadSession(systemPrompt);
    } else {
      initializeChatHistory(systemPrompt);
      setHookMessages([]); 
    }
  }, [storyId, sceneId, startNewSession, selectedStory, loadSession, initializeChatHistory, setHookMessages]);


  const checkTriggers = useCallback((aiReply: string) => {
    if (!currentScene) return;
    
    const imageTriggers = currentScene.imageTriggers || [];
    imageTriggers.forEach(trigger => {
      if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
        trigger.images.forEach(imageKey => addImageMessage(String(imageMap[imageKey] || imageKey), 'ai', currentScene));
      }
    });
    
    const sceneTriggers = currentScene.sceneTriggers || [];
    sceneTriggers.forEach(trigger => {
      if (aiReply.toLowerCase().includes(trigger.keyword.toLowerCase())) {
        navigation.navigate('StoryScene', { storyId, sceneId: trigger.nextSceneIndex });
      }
    });
  }, [currentScene, storyId, navigation, addImageMessage]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending || !currentScene) return;

    const userMessageText = inputText.trim(); // Renamed from userMessage to userMessageText for clarity
    const userMessageObject = addMessage(userMessageText, 'user', currentScene);
    updateChatHistory(userMessageObject); 
    
    setInputText('');
    // setIsSending(true); // Handled by useChatApi

    try {
      const aiReplyText = await fetchBotReply(chatHistory.current);
      
      // Note: addMessage returns the message object, which is useful for updateChatHistory
      const aiMessageObject = addMessage(aiReplyText, 'ai', currentScene);
      updateChatHistory(aiMessageObject); 
      
      checkTriggers(aiReplyText);
      
      // It's important that 'messages' here reflects the state *after* both user and AI messages are added.
      // addMessage updates the 'messages' state in useChatMessages hook.
      // By the time saveSession is called, 'messages' should be up-to-date.
      saveSession(messages); 
      
    } catch (error) {
      // Error is already logged by useChatApi
      // Add error message to UI.
      const errMessageObject = addMessage('Sorry, something went wrong. Please try again.', 'ai', currentScene);
      // Optionally, add this system-like error to chat history for context, though it's an AI placeholder
      updateChatHistory(errMessageObject);
    } 
    // finally { setIsSending(false); } // Handled by useChatApi
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      commonStyles.messageWrapper,
      item.sender === 'user' ? commonStyles.userMessageWrapper : commonStyles.assistantMessageWrapper
    ]}>
      {/* Assuming system messages won't have avatar/name and are not typical here */}
      <Image source={item.avatar} style={commonStyles.avatar} />
      <View style={[
        commonStyles.messageContainer,
        item.sender === 'user' ? commonStyles.userMessage : commonStyles.assistantMessage
        // System messages styling would need a condition if they are rendered through this
      ]}>
        <Text style={commonStyles.senderName}>{item.name}</Text>
        {item.imageUrl ? ( // Changed from item.image to item.imageUrl
          <Image
            source={{uri: item.imageUrl}} // Assuming imageUrl is a URI
            style={commonStyles.chatImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={commonStyles.messageText}>
            {item.text}
          </Text>
        )}
        {/* Timestamp display based on ISO string, can be formatted if needed */}
        {!item.imageUrl && (
            <Text style={commonStyles.timestampText}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
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
    style={commonStyles.keyboardAvoidingView} // Use commonStyles
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
  >
    <SafeAreaView style={commonStyles.safeAreaContainer}>
  
    <FlatList
      ref={flatListRef}
      data={messages} // From useChatMessages
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
          onPress={() => saveSession(messages)} // messages from useChatMessages
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