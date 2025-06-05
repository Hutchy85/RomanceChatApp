import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, // Added for loading states
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories as importedStories } from '../../data/stories/index'; // Renamed to avoid conflict
import { Story } from '../../types/index';
import { clearSession, clearLastOpenedSession, hasSavedSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../styles';

type StorySelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StorySelection'>;
};

// Extend Story type to include session status
type StoryWithSessionStatus = Story & { hasSession: boolean };

const StorySelectionScreen: React.FC<StorySelectionScreenProps> = ({ navigation }) => {
  const [stories, setStories] = useState<StoryWithSessionStatus[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isProcessingStoryAction, setIsProcessingStoryAction] = useState<string | null>(null); // Store storyId being processed

  const loadStorySessionStates = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const storiesWithStates = await Promise.all(
        importedStories.map(async (story) => {
          const sessionExists = await hasSavedSession(story.id);
          return { ...story, hasSession: sessionExists };
        })
      );
      setStories(storiesWithStates);
    } catch (error) {
      console.error("Error loading story session states:", error);
      Alert.alert("Error", "Could not load story information. Please try again later.");
      // Set stories without session status or empty if preferred
      setStories(importedStories.map(story => ({ ...story, hasSession: false })));
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStorySessionStates();
    });
    return unsubscribe;
  }, [navigation, loadStorySessionStates]);

  const handleStartStory = async (storyId: string) => {
    setIsProcessingStoryAction(storyId);
    try {
      await clearSession(storyId);
      await clearLastOpenedSession();
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('StoryScene', { storyId, isPrologue: true });
    } catch (error) {
      console.error('Error starting new story:', error);
      Alert.alert('Error', 'Could not start the story. Please try again.');
    } finally {
      setIsProcessingStoryAction(null);
      // Refresh session states after action
      loadStorySessionStates();
    }
  };

  const handleContinueStoryById = async (storyId: string) => {
    setIsProcessingStoryAction(storyId);
    try {
      // We already know the session exists if this button is available and pressed
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('Chat', { storyId, sceneId: 'chat', startNewSession: false });
    } catch (error) {
      console.error('Error continuing story:', error);
      Alert.alert('Error', 'Could not continue the story. Please try again.');
    } finally {
      setIsProcessingStoryAction(null);
    }
  };

  const handleViewDashboard = () => {
    navigation.navigate('StoryDashboard');
  };

 const renderStoryItem = ({ item }: { item: StoryWithSessionStatus }) => {
  const imageSource = imageMap[item.image as keyof typeof imageMap] || require('../../images/defaultImage.png');
  const isCurrentStoryProcessing = isProcessingStoryAction === item.id;

  return (
    <View style={commonStyles.storyCard}>
      <Image
        source={imageSource}
        style={commonStyles.storyImage}
        resizeMode="cover"
        // Optional: Add ActivityIndicator for image loading if needed
        // onLoanStart, onLoadEnd
      />
      <View style={commonStyles.storyDetails}>
        <Text style={commonStyles.storyTitle}>{item.title}</Text>
        <Text style={commonStyles.storyDescription}>{item.description}</Text>
        <View style={commonStyles.storyMeta}>
          <Text style={commonStyles.storyMetaText}>Duration: {item.duration}</Text>
          <Text style={commonStyles.storyMetaText}>Theme: {item.theme}</Text>
        </View>

        {item.hasSession && (
          <TouchableOpacity
            style={[
              commonStyles.buttonSuccess, // Primary action if session exists
              isCurrentStoryProcessing && commonStyles.buttonDisabled,
              // Add a margin-bottom here to create the gap
              // We'll define 'buttonGap' in commonStyles
              { marginBottom: 12 }
            ]}
            onPress={() => handleContinueStoryById(item.id)}
            disabled={isCurrentStoryProcessing}
          >
            {isCurrentStoryProcessing ? (
              <ActivityIndicator color={commonStyles.buttonText?.color || "#fff"} />
            ) : (
              <Text style={commonStyles.buttonText}>Continue Story</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          // Style differently if it's "Restart" vs "Start" e.g. commonStyles.buttonOutline
          style={[
            item.hasSession ? commonStyles.buttonSecondary : commonStyles.buttonPrimary,
            isCurrentStoryProcessing && commonStyles.buttonDisabled
          ]}
          onPress={() => handleStartStory(item.id)}
          disabled={isCurrentStoryProcessing}
        >
          {isCurrentStoryProcessing && !item.hasSession ? ( // Show loader only if this is the action being processed
            <ActivityIndicator color={commonStyles.buttonText?.color || "#fff"} />
          ) : (
            <Text style={commonStyles.buttonText}>
              {item.hasSession ? 'Restart Story' : 'Start Story'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

if (isLoadingSessions && !stories.length) { // Show full screen loader only on initial load
  return (
    <SafeAreaView style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={commonStyles.sectionTitle?.color || "#000"} />
      <Text style={{ marginTop: 10 }}>Loading stories...</Text>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: commonStyles.container?.backgroundColor || '#fff' }}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.subtitle}>
          Choose a story to begin your interactive romance experience
        </Text>

        <TouchableOpacity
          style={[commonStyles.buttonSecondary, { marginBottom: 16 }]} // Assuming buttonSecondary is defined
          onPress={handleViewDashboard}
        >
          <Text style={commonStyles.buttonText}>View Your Progress</Text>
        </TouchableOpacity>

        <Text style={commonStyles.sectionTitle}>Available Stories</Text>
        {isLoadingSessions && stories.length > 0 && ( // Inline loader when refreshing
            <ActivityIndicator size="small" color={commonStyles.sectionTitle?.color || "#000"} style={{marginVertical: 10}}/>
        )}
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={stories.length === 0 ? commonStyles.listContainer : { paddingBottom: 20 }}
          ListEmptyComponent={
            !isLoadingSessions ? ( // Only show empty component if not loading
              <View style={commonStyles.emptyListContainer}> {/* Define in commonStyles */}
                <Text style={commonStyles.emptyListText}>No stories available at the moment.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default StorySelectionScreen;