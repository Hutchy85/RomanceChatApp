import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories/index';
import { Story, Message } from '../../types/index';
import { loadSession, hasSavedSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { commonStyles, colors, fontSizes, spacing, borderRadius } from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StoryDashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StoryDashboard'>;
};

// Story progress and badge types
interface StoryProgress {
  storyId: string;
  messagesCount: number;
  lastPlayedDate?: string;
  completionPercentage: number;
  currentScene?: string;
  badges: Badge[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  color: string;
}

// Badge definitions
const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedDate'>[] = [
  {
    id: 'first_message',
    name: 'First Words',
    description: 'Sent your first message',
    icon: '💬',
    color: colors.secondary,
  },
  {
    id: 'chatty',
    name: 'Chatty',
    description: 'Sent 50+ messages',
    icon: '🗣️',
    color: colors.tertiary,
  },
  {
    id: 'marathon',
    name: 'Marathon Chatter',
    description: 'Sent 100+ messages',
    icon: '🏃‍♀️',
    color: colors.primary,
  },
  {
    id: 'story_starter',
    name: 'Story Starter',
    description: 'Started your first story',
    icon: '📖',
    color: colors.success || colors.primary,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Started 3+ different stories',
    icon: '🗺️',
    color: colors.tertiary,
  },
  {
    id: 'dedicated',
    name: 'Dedicated Reader',
    description: 'Played for 7+ days',
    icon: '⭐',
    color: colors.primary,
  },
];

const StoryDashboardScreen: React.FC<StoryDashboardScreenProps> = ({ navigation }) => {
  const [storyProgresses, setStoryProgresses] = useState<StoryProgress[]>([]);
  const [totalBadges, setTotalBadges] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const progresses: StoryProgress[] = [];
      
      for (const story of stories) {
        const hasSession = await hasSavedSession(story.id);
        let messagesCount = 0;
        let lastPlayedDate: string | undefined;
        let currentScene: string | undefined;

        if (hasSession) {
          const savedMessages = await loadSession(story.id);
          if (savedMessages) {
            messagesCount = savedMessages.length;
            const lastMessage = savedMessages[savedMessages.length - 1];
            lastPlayedDate = lastMessage?.timestamp;
          }

          // Try to get last played date from AsyncStorage as well
          try {
            const lastOpened = await AsyncStorage.getItem(`lastPlayed_${story.id}`);
            if (lastOpened) {
              lastPlayedDate = lastOpened;
            }
          } catch (error) {
            console.log('No last played date found for', story.id);
          }
        }

        // Calculate completion percentage (simplified - based on message count)
        const completionPercentage = Math.min((messagesCount / 20) * 100, 100);

        // Calculate badges for this story
        const badges = calculateBadgesForStory(story.id, messagesCount, hasSession, progresses);

        progresses.push({
          storyId: story.id,
          messagesCount,
          lastPlayedDate,
          completionPercentage,
          currentScene,
          badges,
        });
      }

      setStoryProgresses(progresses);
      
      // Calculate overall badge statistics
      const allBadges = progresses.flatMap((p) => p.badges);
      const totalBadgeCount = calculateTotalPossibleBadges();
      const earnedBadgeCount = allBadges.filter((b) => b.earned).length;
      
      setTotalBadges(totalBadgeCount);
      setEarnedBadges(earnedBadgeCount);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBadgesForStory = (storyId: string, messagesCount: number, hasSession: boolean, currentProgresses: StoryProgress[]): Badge[] => {
    return BADGE_DEFINITIONS.map((badgeDefinition) => {
      let earned = false;
      
      switch (badgeDefinition.id) {
        case 'first_message':
          earned = messagesCount > 0;
          break;
        case 'chatty':
          earned = messagesCount >= 50;
          break;
        case 'marathon':
          earned = messagesCount >= 100;
          break;
        case 'story_starter':
          earned = hasSession;
          break;
        case 'explorer':
          // Check current progresses plus this story
          const storiesStarted = currentProgresses.filter(p => p.messagesCount > 0).length + (messagesCount > 0 ? 1 : 0);
          earned = storiesStarted >= 3;
          break;
        case 'dedicated':
          // This would need day tracking - simplified for now
          earned = messagesCount >= 30;
          break;
      }

      return {
        ...badgeDefinition,
        earned,
        earnedDate: earned ? new Date().toLocaleDateString() : undefined,
      };
    });
  };

  const calculateTotalPossibleBadges = (): number => {
    return BADGE_DEFINITIONS.length * stories.length;
  };

  const getStoryById = (storyId: string): Story | undefined => {
    return stories.find((story) => story.id === storyId);
  };

  const handleContinueStory = async (storyId: string) => {
    const hasSession = await hasSavedSession(storyId);
    if (hasSession) {
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('Chat', { storyId, sceneId: 'chat', startNewSession: false });
    } else {
      Alert.alert('No saved session', 'Start a new story from the story selection screen.');
    }
  };

  const handleStartNewStory = (storyId: string) => {
    navigation.navigate('StoryScene', { storyId, isPrologue: true });
  };

  const formatLastPlayed = (dateString?: string): string => {
    if (!dateString) return 'Never played';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const renderProgressBar = (percentage: number) => (
    <View style={dashboardStyles.progressBarContainer}>
      <View style={dashboardStyles.progressBarBackground}>
        <View 
          style={[
            dashboardStyles.progressBarFill, 
            { width: `${percentage}%` }
          ]} 
        />
      </View>
      <Text style={dashboardStyles.progressText}>{Math.round(percentage)}%</Text>
    </View>
  );

  const renderBadge = (badge: Badge, size: 'small' | 'medium' = 'small') => (
    <View
      key={badge.id}
      style={[
        dashboardStyles.badge,
        size === 'medium' && dashboardStyles.badgeMedium,
        { backgroundColor: badge.earned ? badge.color : colors.lightGray || '#E0E0E0' },
        !badge.earned && dashboardStyles.badgeUnearnned,
      ]}
    >
      <Text style={[dashboardStyles.badgeIcon, size === 'medium' && dashboardStyles.badgeIconMedium]}>
        {badge.icon}
      </Text>
      {size === 'medium' && (
        <View style={dashboardStyles.badgeInfo}>
          <Text style={[dashboardStyles.badgeName, !badge.earned && dashboardStyles.badgeNameUnearnned]}>
            {badge.name}
          </Text>
          <Text style={[dashboardStyles.badgeDescription, !badge.earned && dashboardStyles.badgeDescriptionUnearnned]}>
            {badge.description}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStoryCard = (progress: StoryProgress) => {
    const story = getStoryById(progress.storyId);
    if (!story) return null;

    const imageSource = imageMap[story.image as keyof typeof imageMap] || require('../../images/defaultImage.png');

    return (
      <View key={progress.storyId} style={dashboardStyles.storyCard}>
        <View style={dashboardStyles.storyHeader}>
          <Image source={imageSource} style={dashboardStyles.storyThumbnail} resizeMode="cover" />
          <View style={dashboardStyles.storyHeaderInfo}>
            <Text style={dashboardStyles.storyTitle}>{story.title}</Text>
            <Text style={dashboardStyles.storyMeta}>
              {progress.messagesCount} messages • {formatLastPlayed(progress.lastPlayedDate)}
            </Text>
            {renderProgressBar(progress.completionPercentage)}
          </View>
        </View>

        <View style={dashboardStyles.badgeSection}>
          <Text style={dashboardStyles.badgeSectionTitle}>Story Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dashboardStyles.badgesList}>
            {progress.badges.map((badge) => renderBadge(badge))}
          </ScrollView>
        </View>

        <View style={dashboardStyles.storyActions}>
          {progress.messagesCount > 0 ? (
            <TouchableOpacity
              style={[commonStyles.buttonSuccess || commonStyles.buttonPrimary, dashboardStyles.actionButton]}
              onPress={() => handleContinueStory(progress.storyId)}
            >
              <Text style={commonStyles.buttonText}>Continue Story</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[commonStyles.buttonPrimary, dashboardStyles.actionButton]}
              onPress={() => handleStartNewStory(progress.storyId)}
            >
              <Text style={commonStyles.buttonText}>Start Story</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[commonStyles.buttonOutline, dashboardStyles.actionButton]}
            onPress={() => handleStartNewStory(progress.storyId)}
          >
            <Text style={commonStyles.buttonTextOutline}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const overallProgress = storyProgresses.length > 0 
    ? storyProgresses.reduce((sum, p) => sum + p.completionPercentage, 0) / storyProgresses.length 
    : 0;

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeAreaContainer}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.paragraph}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={dashboardStyles.header}>
          <Text style={commonStyles.coloredTitle}>Your Story Journey</Text>
          <Text style={commonStyles.subtitle}>Track your progress and unlock achievements</Text>
        </View>

        {/* Overall Progress Section */}
        <View style={[commonStyles.card, dashboardStyles.overallProgressCard]}>
          <Text style={dashboardStyles.sectionTitle}>Overall Progress</Text>
          {renderProgressBar(overallProgress)}
          
          <View style={dashboardStyles.statsRow}>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{storyProgresses.filter(p => p.messagesCount > 0).length}</Text>
              <Text style={dashboardStyles.statLabel}>Stories Started</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{earnedBadges}</Text>
              <Text style={dashboardStyles.statLabel}>Badges Earned</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>
                {storyProgresses.reduce((sum, p) => sum + p.messagesCount, 0)}
              </Text>
              <Text style={dashboardStyles.statLabel}>Total Messages</Text>
            </View>
          </View>
        </View>

        {/* Achievement Showcase */}
        <View style={[commonStyles.card, dashboardStyles.achievementCard]}>
          <Text style={dashboardStyles.sectionTitle}>Latest Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {storyProgresses
              .flatMap(p => p.badges)
              .filter(b => b.earned)
              .slice(0, 5)
              .map((badge, index) => (
                <View key={`${badge.id}-${index}`} style={dashboardStyles.achievementItem}>
                  {renderBadge(badge, 'medium')}
                </View>
              ))}
          </ScrollView>
        </View>

        {/* Stories Section */}
        <Text style={dashboardStyles.sectionTitle}>Your Stories</Text>
        {storyProgresses.map(renderStoryCard)}

        {/* Navigation Actions */}
        <View style={dashboardStyles.navigationActions}>
          <TouchableOpacity
            style={commonStyles.buttonPrimary}
            onPress={() => navigation.navigate('StorySelection')}
          >
            <Text style={commonStyles.buttonText}>Browse All Stories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Dashboard-specific styles
const dashboardStyles = {
  header: {
    alignItems: 'center' as const,
    marginBottom: spacing.xxl || 32,
  },
  overallProgressCard: {
    alignItems: 'center' as const,
  },
  sectionTitle: {
    fontSize: fontSizes.large || 18,
    fontWeight: 'bold' as const,
    color: colors.textDark || '#333',
    marginBottom: spacing.lg || 16,
    textAlign: 'center' as const,
  },
  progressBarContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as 'stretch',
    marginVertical: spacing.md || 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray || '#E0E0E0',
    borderRadius: 4,
    marginRight: spacing.md || 12,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: fontSizes.small || 12,
    color: colors.darkGray || '#666',
    fontWeight: 'bold' as const,
    minWidth: 35,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignSelf: 'stretch' as const,
    marginTop: spacing.lg || 16,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statNumber: {
    fontSize: fontSizes.heading || 24,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSizes.small || 12,
    color: colors.darkGray || '#666',
    textAlign: 'center' as const,
  },
  achievementCard: {
    paddingHorizontal: 0,
  },
  achievementItem: {
    marginRight: spacing.md || 12,
  },
  storyCard: {
    overflow: 'hidden' as 'hidden',
    ...commonStyles.card,
  },
  storyHeader: {
    flexDirection: 'row' as const,
    marginBottom: spacing.lg || 16,
  },
  storyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md || 8,
    marginRight: spacing.lg || 16,
  },
  storyHeaderInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: fontSizes.large || 18,
    fontWeight: 'bold' as const,
    color: colors.textDark || '#333',
    marginBottom: spacing.xs || 4,
  },
  storyMeta: {
    fontSize: fontSizes.small || 12,
    color: colors.darkGray || '#666',
    marginBottom: spacing.md || 12,
  },
  badgeSection: {
    marginBottom: spacing.lg || 16,
  },
  badgeSectionTitle: {
    fontSize: fontSizes.medium || 14,
    fontWeight: 'bold' as const,
    color: colors.textDark || '#333',
    marginBottom: spacing.sm || 8,
  },
  badgesList: {
    flexDirection: 'row' as const,
  },
  badge: {
    paddingHorizontal: spacing.md || 12,
    paddingVertical: spacing.sm || 8,
    borderRadius: borderRadius.round || 20,
    marginRight: spacing.sm || 8,
    alignItems: 'center' as const,
    minWidth: 40,
  },
  badgeMedium: {
    flexDirection: 'row' as const,
    paddingHorizontal: spacing.lg || 16,
    paddingVertical: spacing.md || 12,
    minWidth: 120,
  },
  badgeUnearnned: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeIconMedium: {
    fontSize: 20,
    marginRight: spacing.sm || 8,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: fontSizes.small || 12,
    fontWeight: 'bold' as const,
    color: colors.textLight || colors.white || '#FFFFFF',
  },
  badgeNameUnearnned: {
    color: colors.darkGray || '#666',
  },
  badgeDescription: {
    fontSize: fontSizes.small || 12,
    color: colors.textLight || colors.white || '#FFFFFF',
    opacity: 0.8,
  },
  badgeDescriptionUnearnned: {
    color: colors.darkGray || '#666',
  },
  storyActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs || 4,
  },
  navigationActions: {
    marginTop: spacing.xl || 24,
    marginBottom: spacing.xxl || 32,
  },
};

export default StoryDashboardScreen;