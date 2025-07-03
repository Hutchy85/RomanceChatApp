import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { Message, Scene, StorySession } from '../../types/index';
import { stories } from '../../data/stories/index';
import { storySessionManager } from '../../data/sessionstorage';
import { useSessionNavigation } from '../../contexts/SessionNavigationContext';
import { imageMap } from '../../data/imageMap';
import { colors, commonStyles } from '../../styles';
import { useUserProfile } from '../../contexts/UserProfileContext';

type MessageHubScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MessageHub'>;
  route: RouteProp<RootStackParamList, 'MessageHub'>;
};

// Interface for conversation data
interface Conversation {
  sceneId: string;
  sceneName: string;
  characterName: string;
  characterAvatar: number;
  lastMessage: Message | null;
  messageCount: number;
  unreadCount: number;
  lastActivity: string;
  hasUnread: boolean;
}

const MessageHubScreen: React.FC<MessageHubScreenProps> = ({ navigation, route }) => {
  const { storyId, sessionId } = route.params;
  const { profile } = useUserProfile();
  const { currentSession, updateCurrentSession } = useSessionNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<StorySession | null>(null);

  const selectedStory = stories.find(story => story.id === storyId);

  useEffect(() => {
    loadConversations();
  }, [storyId, sessionId, currentSession]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);

      if (!selectedStory) {
        throw new Error('Story not found');
      }

      // Load session data
      let sessionData = storySessionManager.getSession(sessionId);
      if (!sessionData) {
        throw new Error('Session not found');
      }

      // Check for chat scenes that need an initial message
      const initialMessagesToAdd: Message[] = [];
      const sessionMessages = sessionData.messages || [];

      selectedStory.scenes.forEach(scene => {
        // Check if the scene is a chat scene and has an initialMessage property
        if (scene.type === 'chat' && 'initialMessage' in scene && scene.initialMessage) {
          const hasMessagesForScene = sessionMessages.some(msg => msg.sceneId === scene.id);
          if (!hasMessagesForScene) {
            const initialMessage: Message = {
              id: `initial-${scene.id}-${Date.now()}`,
              text: scene.initialMessage,
              sender: 'assistant',
              timestamp: new Date().toISOString(),
              name: scene.characterName,
              avatar: imageMap.assistantAvatar,
              sceneId: scene.id,
              isRead: false,
            };
            initialMessagesToAdd.push(initialMessage);
          }
        }
      });

      if (initialMessagesToAdd.length > 0) {
        const updatedMessages = [...sessionMessages, ...initialMessagesToAdd];
        await updateCurrentSession({ messages: updatedMessages });
        return; // Re-run will be triggered by useEffect
      }

      setSession(sessionData);

      // Group messages by scene to create conversations
      const conversationMap = new Map<string, Conversation>();
      const readMessages = sessionData.readMessages || [];

      // Get all messages and group them by scene
      const allMessages = sessionData.messages || [];
      
      // Group messages by scene
      const messagesByScene = new Map<string, Message[]>();
      
      allMessages.forEach(msg => {
        const sceneId = msg.sceneId || 'unknown';
        if (!messagesByScene.has(sceneId)) {
          messagesByScene.set(sceneId, []);
        }
        messagesByScene.get(sceneId)!.push(msg);
      });

      // Create conversations from grouped messages
      messagesByScene.forEach((messages, sceneId) => {
        const scene = selectedStory.scenes.find(s => s.id === sceneId);
        if (scene) {
          // Filter out system messages and user messages for unread count
          const assistantMessages = messages.filter(msg => msg.sender === 'assistant');
          const unreadMessages = assistantMessages.filter(msg => !readMessages.includes(msg.id));
          
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

          conversationMap.set(sceneId, {
            sceneId,
            sceneName: scene.id,
            characterName: scene.characterName || 'Character',
            characterAvatar: imageMap.assistantAvatar,
            lastMessage,
            messageCount: messages.length,
            unreadCount: unreadMessages.length,
            hasUnread: unreadMessages.length > 0,
            lastActivity: lastMessage?.timestamp || 'No messages',
          });
        }
      });

      // Convert map to array and sort by unread first, then by last activity
      const conversationList = Array.from(conversationMap.values()).sort((a, b) => {
        // First sort by unread status
        if (a.hasUnread && !b.hasUnread) return -1;
        if (!a.hasUnread && b.hasUnread) return 1;
        
        // Then sort by last activity
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        
        return b.lastActivity.localeCompare(a.lastActivity);
      });

      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationPress = async (conversation: Conversation) => {
    // Mark messages as read when entering conversation
    if (conversation.hasUnread && session) {
      try {
        const allMessages = session.messages || [];
        const sceneMessages = allMessages.filter(msg => msg.sceneId === conversation.sceneId);
        const assistantMessages = sceneMessages.filter(msg => msg.sender === 'assistant');
        const currentReadMessages = session.readMessages || [];
        
        // Add unread message IDs to read list
        const newReadMessages = [...currentReadMessages];
        assistantMessages.forEach(msg => {
          if (!newReadMessages.includes(msg.id)) {
            newReadMessages.push(msg.id);
          }
        });

        await updateCurrentSession({
          readMessages: newReadMessages,
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }

    navigation.navigate('Chat', {
      storyId,
      sessionId,
      sceneId: conversation.sceneId,
    });
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const displayLastMessage = item.lastMessage?.text || 'No messages yet';
    const isUserMessage = item.lastMessage?.sender === 'user';
    
    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          item.hasUnread && styles.conversationItemUnread
        ]}
        onPress={() => handleConversationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={item.characterAvatar} style={styles.avatar} />
          {item.hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[
              styles.characterName,
              item.hasUnread && styles.characterNameUnread
            ]}>
              {item.characterName}
            </Text>
            <Text style={styles.sceneName}>({item.sceneName})</Text>
          </View>
          
          <Text style={[
            styles.lastMessage,
            item.hasUnread && styles.lastMessageUnread
          ]} numberOfLines={2}>
            {isUserMessage ? 'You: ' : ''}{displayLastMessage}
          </Text>
          
          <View style={styles.conversationFooter}>
            <Text style={styles.messageCount}>{item.messageCount} messages</Text>
            <Text style={styles.lastActivity}>{item.lastActivity}</Text>
          </View>
        </View>
        
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No conversations yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Start chatting in different scenes to see conversations here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[commonStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={commonStyles.messageText}>Loading conversations...</Text>
      </SafeAreaView>
    );
  }

  if (!selectedStory || !session) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={commonStyles.errorText}>Story or session not found.</Text>
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
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          {selectedStory.title} • {session.scenesVisited?.length || 0} scenes visited
        </Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.sceneId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = {
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textDark,
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationItemUnread: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  avatarContainer: {
    position: 'relative' as const,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute' as const,
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.textDark,
    marginRight: 8,
  },
  characterNameUnread: {
    color: colors.primary,
  },
  sceneName: {
    fontSize: 12,
    color: colors.textDark,
    fontStyle: 'italic' as const,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
    lineHeight: 20,
  },
  lastMessageUnread: {
    fontWeight: 'bold' as const,
  },
  conversationFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  messageCount: {
    fontSize: 12,
    color: colors.textDark,
  },
  lastActivity: {
    fontSize: 12,
    color: colors.textDark,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 20,
    color: colors.textDark,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center' as const,
    paddingHorizontal: 32,
  },
};

export default MessageHubScreen;