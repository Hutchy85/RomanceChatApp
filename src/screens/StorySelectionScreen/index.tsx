import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories } from '../../data/stories/index';
import { Story } from '../../types/index';
import { clearSession, clearLastOpenedSession } from '../../data/sessionstorage';
import { hasSavedSession } from '../../data/sessionstorage';
import imageMap from '../../data/imageMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../styles';

type StorySelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'StorySelection'>;
};

const StorySelectionScreen: React.FC<StorySelectionScreenProps> = ({ navigation }) => {

  const handleStartStory = async (storyId: string) => {
    try {
      await clearSession(storyId);
      await clearLastOpenedSession();
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      
      // Navigate to StoryScene with isPrologue flag instead of dedicated Prologue screen
      navigation.navigate('StoryScene', { storyId, isPrologue: true });
    } catch (error) {
      console.error('Error starting new story:', error);
      navigation.navigate('StoryScene', { storyId, isPrologue: true });
    }
  };

  const handleContinueStoryById = async (storyId: string) => {
    const exists = await hasSavedSession(storyId);
    if (exists) {
      await AsyncStorage.setItem('lastOpenedSession', storyId);
      navigation.navigate('Chat', { storyId, sceneId: 'chat', startNewSession: false });
    } else {
      Alert.alert('No saved session', 'There is no saved session for this story.');
    }
  };

  const renderStoryItem = ({ item }: { item: Story }) => {
    // Use the image key from the story to fetch the image from the storyImages map
    const imageSource = imageMap[item.image as keyof typeof imageMap] || require('../../images/defaultImage.png');
  
    return (
      <View style={commonStyles.storyCard}>
        <Image 
          source={imageSource}
          style={commonStyles.storyImage}
          resizeMode="cover"
        />
        <View style={commonStyles.storyDetails}>
          <Text style={commonStyles.storyTitle}>{item.title}</Text>
          <Text style={commonStyles.storyDescription}>{item.description}</Text>
          <View style={commonStyles.storyMeta}>
            <Text style={commonStyles.storyMetaText}>Duration: {item.duration}</Text>
            <Text style={commonStyles.storyMetaText}>Theme: {item.theme}</Text>
          </View>
  
          {/* Start New Story Button */}
          <TouchableOpacity 
            style={commonStyles.buttonPrimary}
            onPress={() => handleStartStory(item.id)}
          >
            <Text style={commonStyles.buttonText}>Start Story</Text>
          </TouchableOpacity>
  
          {/* Continue Story Button */}
          <TouchableOpacity 
            style={commonStyles.buttonSuccess}
            onPress={() => handleContinueStoryById(item.id)}
          >
            <Text style={commonStyles.buttonText}>Continue Story</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };  

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.subtitle}>
        Choose a story to begin your interactive romance experience
      </Text>

      <Text style={commonStyles.sectionTitle}>Available Stories</Text>
      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={commonStyles.listContainer}
      />
    </View>
  );
};

export default StorySelectionScreen;