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
import { Story } from '../../types/index';
import { useSessionAwareNavigation } from '../../contexts/SessionNavigationContext'; // Changed this import
import { StorySession } from '../../types';
import { imageMap } from '../../data/imageMap';
import { commonStyles, colors, fontSizes, spacing, borderRadius } from '../../styles';

type StoryDashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StoryDashboard'>;
};

// Enhanced story progress interface
interface StoryProgress {
  storyId: string;
  sessions: StorySession[];
  totalMessagesCount: number;
  lastPlayedDate?: string;
  completionPercentage: number;
  currentScene?: string;
  badges: Badge[];
  totalPlayTime: number;
  mostRecentSession?: StorySession;
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

// Enhanced badge definitions
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
    color: colors.success,
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
    description: 'Played for 2+ hours total',
    icon: '⭐',
    color: colors.primary,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Completed a story',
    icon: '🏆',
    color: colors.success,
  },
  {
    id: 'choice_master',
    name: 'Choice Master',
    description: 'Made 50+ choices',
    icon: '🎯',
    color: colors.primary,
  },
  {
    id: 'memory_keeper',
    name: 'Memory Keeper',
    description: 'Collected 10+ memories',
    icon: '🧠',
    color: colors.tertiary,
  },
];

const StoryDashboardScreen: React.FC<StoryDashboardScreenProps> = ({ navigation }) => {
  const [storyProgresses, setStoryProgresses] = useState<StoryProgress[]>([]);
  const [totalBadges, setTotalBadges] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use the session-aware navigation hook instead
  const sessionNavigation = useSessionAwareNavigation();

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const progresses: StoryProgress[] = [];
      
      for (const story of stories) {
        // Get all sessions for this story using the new system
        const sessions = sessionNavigation.getSessionsForStory(story.id);
        
        // Calculate aggregated stats from all sessions
        const totalMessagesCount = sessions.reduce((sum, session) => sum + session.messages.length, 0);
        const totalPlayTime = sessions.reduce((sum, session) => sum + session.totalPlayTime, 0);
        const totalChoices = sessions.reduce((sum, session) => sum + session.choiceCount, 0);
        const totalMemories = sessions.reduce((sum, session) => sum + session.memories.length, 0);
        
        // Find the most recent session
        const mostRecentSession = sessions.length > 0 
          ? sessions.reduce((latest, session) => 
              new Date(session.lastPlayedAt) > new Date(latest.lastPlayedAt) ? session : latest
            )
          : undefined;

        const lastPlayedDate = mostRecentSession?.lastPlayedAt;

        // Calculate completion percentage based on sessions
        let completionPercentage = 0;
        if (sessions.length > 0) {
          const completedSessions = sessions.filter(s => s.isCompleted).length;
          const maxProgress = Math.max(...sessions.map(s => sessionNavigation.getSessionProgress(s)));
          completionPercentage = completedSessions > 0 ? 100 : maxProgress;
        }

        // Calculate badges for this story
        const badges = calculateBadgesForStory(
          story.id, 
          totalMessagesCount, 
          sessions, 
          progresses,
          totalPlayTime,
          totalChoices,
          totalMemories
        );

        progresses.push({
          storyId: story.id,
          sessions,
          totalMessagesCount,
          lastPlayedDate,
          completionPercentage,
          currentScene: mostRecentSession?.currentSceneId,
          badges,
          totalPlayTime,
          mostRecentSession,
        });
      }

      setStoryProgresses(progresses);
      
      // Calculate overall badge statistics
      const allBadges = progresses.flatMap((p) => p.badges);
      const totalBadgeCount = BADGE_DEFINITIONS.length * stories.length;
      const earnedBadgeCount = allBadges.filter((b) => b.earned).length;
      
      setTotalBadges(totalBadgeCount);
      setEarnedBadges(earnedBadgeCount);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBadgesForStory = (
    storyId: string, 
    totalMessages: number, 
    sessions: StorySession[], 
    currentProgresses: StoryProgress[],
    totalPlayTime: number,
    totalChoices: number,
    totalMemories: number
  ): Badge[] => {
    return BADGE_DEFINITIONS.map((badgeDefinition) => {
      let earned = false;
      
      switch (badgeDefinition.id) {
        case 'first_message':
          earned = totalMessages > 0;
          break;
        case 'chatty':
          earned = totalMessages >= 50;
          break;
        case 'marathon':
          earned = totalMessages >= 100;
          break;
        case 'story_starter':
          earned = sessions.length > 0;
          break;
        case 'explorer':
          const storiesStarted = currentProgresses.filter(p => p.sessions.length > 0).length + (sessions.length > 0 ? 1 : 0);
          earned = storiesStarted >= 3;
          break;
        case 'dedicated':
          // 2+ hours in seconds
          earned = totalPlayTime >= 7200;
          break;
        case 'completionist':
          earned = sessions.some(s => s.isCompleted);
          break;
        case 'choice_master':
          earned = totalChoices >= 50;
          break;
        case 'memory_keeper':
          earned = totalMemories >= 10;
          break;
      }

      return {
        ...badgeDefinition,
        earned,
        earnedDate: earned ? new Date().toLocaleDateString() : undefined,
      };
    });
  };

  const getStoryById = (storyId: string): Story | undefined => {
    return stories.find((story) => story.id === storyId);
  };

  const handleContinueStory = async (progress: StoryProgress) => {
    if (!progress.mostRecentSession) {
      Alert.alert('No session found', 'Please start a new story session.');
      return;
    }

    try {
      // Use the session-aware navigation to resume
      await sessionNavigation.resumeSession(progress.mostRecentSession.id);
    } catch (error) {
      console.error('Failed to continue story:', error);
      Alert.alert('Error', 'Failed to continue story. Please try again.');
    }
  };

  const handleStartNewStory = async (storyId: string) => {
    try {
      // Use the session-aware navigation to start new session
      await sessionNavigation.startNewSession(storyId);
    } catch (error) {
      console.error('Failed to start new story:', error);
      Alert.alert('Error', 'Failed to start new story. Please try again.');
    }
  };

  const handleManageSessions = (progress: StoryProgress) => {
    if (progress.sessions.length === 0) {
      Alert.alert('No sessions', 'Start a story to manage sessions.');
      return;
    }

    // Navigate to session selection for this story
    const story = getStoryById(progress.storyId);
    sessionNavigation.navigateToStory(progress.storyId, story?.title);
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

  const formatPlayTime = (seconds: number): string => {
    if (seconds < 60) return '< 1 min';
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    
    return `${minutes}m`;
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
        { backgroundColor: badge.earned ? badge.color : colors.lightGray },
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

    const imageSource = imageMap[story.image as keyof typeof imageMap] || require('../../assets/images/defaultImage.png');
    const hasAnySessions = progress.sessions.length > 0;
    const canContinue = progress.mostRecentSession && sessionNavigation.canResumeSession(progress.mostRecentSession);

    return (
      <View key={progress.storyId} style={commonStyles.storyCard}>
        <View style={[commonStyles.flexRow, { marginBottom: spacing.lg, marginLeft: spacing.sm, marginTop: spacing.sm }]}>
          <Image 
            source={imageSource} 
            style={dashboardStyles.storyThumbnail} 
            resizeMode="cover" 
          />
          <View style={dashboardStyles.storyHeaderInfo}>
            <Text style={commonStyles.storyTitle}>{story.title}</Text>
            <Text style={dashboardStyles.storyMeta}>
              {progress.sessions.length} session{progress.sessions.length !== 1 ? 's' : ''} • {progress.totalMessagesCount} messages
            </Text>
            <Text style={dashboardStyles.storyMeta}>
              {formatPlayTime(progress.totalPlayTime)} played • {formatLastPlayed(progress.lastPlayedDate)}
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

        <View style={[commonStyles.flexRow, commonStyles.spaceBetween]}>
          {canContinue ? (
            <TouchableOpacity
              style={[commonStyles.buttonSuccess, dashboardStyles.actionButton]}
              onPress={() => handleContinueStory(progress)}
            >
              <Text style={commonStyles.buttonText}>Continue Story</Text>
            </TouchableOpacity>
          ) : hasAnySessions ? (
            <TouchableOpacity
              style={[commonStyles.buttonPrimary, dashboardStyles.actionButton]}
              onPress={() => handleManageSessions(progress)}
            >
              <Text style={commonStyles.buttonText}>Manage Sessions</Text>
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
            <Text style={commonStyles.buttonTextOutline}>New Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const overallProgress = storyProgresses.length > 0 
    ? storyProgresses.reduce((sum, p) => sum + p.completionPercentage, 0) / storyProgresses.length 
    : 0;

  const totalPlayTime = storyProgresses.reduce((sum, p) => sum + p.totalPlayTime, 0);
  const totalSessions = storyProgresses.reduce((sum, p) => sum + p.sessions.length, 0);

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
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.coloredTitle}>Your Story Journey</Text>
          <Text style={commonStyles.subtitle}>Track your progress and unlock achievements</Text>
        </View>

        {/* Overall Progress Section */}
        <View style={[commonStyles.card, commonStyles.centerContent]}>
          <Text style={commonStyles.sectionTitle}>Overall Progress</Text>
          {renderProgressBar(overallProgress)}
          
          <View style={dashboardStyles.statsRow}>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{storyProgresses.filter(p => p.sessions.length > 0).length}</Text>
              <Text style={dashboardStyles.statLabel}>Stories Started</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{totalSessions}</Text>
              <Text style={dashboardStyles.statLabel}>Total Sessions</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{earnedBadges}</Text>
              <Text style={dashboardStyles.statLabel}>Badges Earned</Text>
            </View>
          </View>
          
          <View style={dashboardStyles.statsRow}>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>
                {storyProgresses.reduce((sum, p) => sum + p.totalMessagesCount, 0)}
              </Text>
              <Text style={dashboardStyles.statLabel}>Total Messages</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>{formatPlayTime(totalPlayTime)}</Text>
              <Text style={dashboardStyles.statLabel}>Time Played</Text>
            </View>
            <View style={dashboardStyles.statItem}>
              <Text style={dashboardStyles.statNumber}>
                {storyProgresses.reduce((sum, p) => sum + p.sessions.reduce((s, session) => s + session.choiceCount, 0), 0)}
              </Text>
              <Text style={dashboardStyles.statLabel}>Choices Made</Text>
            </View>
          </View>
        </View>

        {/* Achievement Showcase */}
        <View style={[commonStyles.card, dashboardStyles.achievementCard]}>
          <Text style={commonStyles.sectionTitle}>Latest Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {storyProgresses
              .flatMap(p => p.badges)
              .filter(b => b.earned)
              .slice(0, 6)
              .map((badge, index) => (
                <View key={`${badge.id}-${index}`} style={dashboardStyles.achievementItem}>
                  {renderBadge(badge, 'medium')}
                </View>
              ))}
          </ScrollView>
        </View>

        {/* Stories Section */}
        <Text style={commonStyles.sectionTitle}>Your Stories</Text>
        {storyProgresses.map(renderStoryCard)}

        {/* Navigation Actions */}
        <View style={dashboardStyles.navigationActions}>
          <TouchableOpacity
            style={[commonStyles.buttonPrimary, { marginBottom: spacing.md }]}
            onPress={() => sessionNavigation.navigateToStorySelection()}
          >
            <Text style={commonStyles.buttonText}>Browse All Stories</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={commonStyles.buttonOutline}
            onPress={() => sessionNavigation.navigateToSaveManager()}
          >
            <Text style={commonStyles.buttonTextOutline}>Manage Save Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Dashboard-specific styles (same as before, but with some additions)
const dashboardStyles = {
  progressBarContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'stretch' as 'stretch',
    marginVertical: spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: fontSizes.small,
    color: colors.darkGray,
    fontWeight: 'bold' as const,
    minWidth: 35,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignSelf: 'stretch' as const,
    marginTop: spacing.lg,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statNumber: {
    fontSize: fontSizes.heading,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSizes.small,
    color: colors.darkGray,
    textAlign: 'center' as const,
  },
  achievementCard: {
    paddingHorizontal: 0,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  achievementItem: {
    marginRight: spacing.md,
    marginLeft: spacing.md,
  },
  storyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.lg,
  },
  storyHeaderInfo: {
    flex: 1,
  },
  storyMeta: {
    fontSize: fontSizes.small,
    color: colors.darkGray,
    marginBottom: spacing.sm,
  },
  badgeSection: {
    marginBottom: spacing.lg,
  },
  badgeSectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold' as const,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  badgesList: {
    flexDirection: 'row' as const,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    alignItems: 'center' as const,
    minWidth: 40,
  },
  badgeMedium: {
    flexDirection: 'row' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
    marginRight: spacing.sm,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: fontSizes.small,
    fontWeight: 'bold' as const,
    color: colors.textLight,
  },
  badgeNameUnearnned: {
    color: colors.darkGray,
  },
  badgeDescription: {
    fontSize: fontSizes.small,
    color: colors.textLight,
    opacity: 0.8,
  },
  badgeDescriptionUnearnned: {
    color: colors.darkGray,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  navigationActions: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
};

export default StoryDashboardScreen;