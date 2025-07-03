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
  lastActivity: string;
}

const MessageHubScreen: React.FC<MessageHubScreenProps> = ({ navigation, route }) => {
  const { storyId, sessionId } = route.params;
  const { profile } = useUserProfile();
  const { currentSession } = useSessionNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<StorySession | null>(null);

  const selectedStory = stories.find(story => story.id === storyId);

  useEffect(() => {
    loadConversations();
  }, [storyId, sessionId]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);

      if (!selectedStory) {
        throw new Error('Story not found');
      }

      // Load session data
      const sessionData = storySessionManager.getSession(sessionId);
      if (!sessionData) {
        throw new Error('Session not found');
      }

      setSession(sessionData);

      // Group messages by scene to create conversations
      const conversationMap = new Map<string, Conversation>();

      // Get all scenes that have been visited
      const visitedScenes = sessionData.scenesVisited || [];
      
      visitedScenes.forEach(sceneId => {
        const scene = selectedStory.scenes.find(s => s.id === sceneId);
        if (scene) {
          // Find messages for this scene
          const sceneMessages = sessionData.messages?.filter(msg => {
            // You might need to adjust this logic based on how you track which messages belong to which scene
            // For now, we'll use a simple approach
            return true; // Include all messages for now
          }) || [];

          // Get the last message for this scene
          const lastMessage = sceneMessages.length > 0 ? sceneMessages[sceneMessages.length - 1] : null;

          conversationMap.set(sceneId, {
            sceneId,
            sceneName: (scene.id),
            characterName: scene.characterName || 'Character',
            characterAvatar: imageMap.assistantAvatar, // You might want to make this scene-specific
            lastMessage,
            messageCount: sceneMessages.length,
            lastActivity: lastMessage?.timestamp || 'No messages',
          });
        }
      });

      // Convert map to array and sort by last activity
      const conversationList = Array.from(conversationMap.values()).sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        
        // Sort by timestamp (you might need to adjust this based on your timestamp format)
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

  const handleConversationPress = (conversation: Conversation) => {
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
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
        activeOpacity={0.7}
      >
        <Image source={item.characterAvatar} style={styles.avatar} />
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.characterName}>{item.characterName}</Text>
            <Text style={styles.sceneName}>({item.sceneName})</Text>
          </View>
          
          <Text style={styles.lastMessage} numberOfLines={2}>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
