import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import StorySelectionScreen from '../screens/StorySelectionScreen';
import StorySceneScreen from '../screens/StorySceneScreen';
import ChatScreen from '../screens/ChatScreen';
import { commonStyles, colors } from '../styles'; // Import commonStyles and colors

// Define the navigation parameters
export type RootStackParamList = {
  StorySelection: undefined;
  StoryScene: { storyId: string; sceneId?: string; isPrologue?: boolean };
  Chat: { storyId: string; sceneId: string; startNewSession?: boolean };
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
  <NavigationContainer> {/* Removed onStateChange prop */}
      <Stack.Navigator
        initialRouteName="StorySelection"
        screenOptions={{
          headerStyle: commonStyles.navigationHeader,
          headerTintColor: colors.textLight, // Using colors.textLight directly
          headerTitleStyle: commonStyles.navigationHeaderTitle,
        }}
      >
        <Stack.Screen 
          name="StorySelection" 
          component={StorySelectionScreen} 
          options={{ title: 'Romance Chat Stories' }}
        />
        <Stack.Screen 
          name="StoryScene" 
          component={StorySceneScreen} 
          options={({ route }) => ({ 
            title: route.params.isPrologue ? 'Story Prologue' : 'Story Scene',
            headerBackTitle: 'Back'
            // Screen-specific header styles like headerBackTitle are kept here
            // If StoryScene needed a different header background, it would be specified here
          })}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: 'Chat',
            headerBackTitle: 'Exit',
            headerBackVisible: false, // Changed from headerLeft: () => null
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;