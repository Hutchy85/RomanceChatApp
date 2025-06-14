import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Import screens
import StorySelectionScreen from '../screens/StorySelectionScreen';
import StorySceneScreen from '../screens/StorySceneScreen';
import ChatScreen from '../screens/ChatScreen';
import StoryDashboardScreen from '../screens/StoryDashboardScreen';
import SessionSelectionScreen from '../screens/SessionSelectionScreen';
import SaveManagerScreen from '../screens/SaveManagerScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HeaderMenu from '../components/HeadderMenu'; // Import the header menu component

// Import session types
import { StorySession } from '../data/sessionstorage';

// Define the navigation parameters
export type RootStackParamList = {
  StorySelection: undefined;
  StoryDashboard: undefined;
  UserProfile: undefined; // User profile setup screen

  
  // Session management screens
  SessionSelection: { 
    storyId: string; 
    storyTitle?: string;
  };
  
  // Story screens with session context
  StoryScene: { 
    storyId: string; 
    sessionId: string;
    sceneId?: string; 
    isPrologue?: boolean;
  };
  Chat: { 
    storyId: string; 
    sessionId: string;
    sceneId: string; 
    resumeFromCheckpoint?: boolean;
  };
  
  // Session management screens
  SessionDetails: {
    sessionId: string;
    storyId: string;
  };
  SaveManager: undefined; // For managing saves, exports, imports
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer
      onStateChange={(state) => {
        console.log('Current navigation state:', state);
        // You could add session tracking here if needed
      }}
    >
      <Stack.Navigator
        initialRouteName="StorySelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff6b6b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Add consistent session-aware styling
          headerBackTitleStyle: {
            fontSize: 16,
          },
          gestureEnabled: true,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 500 } },
      close: { animation: 'timing', config: { duration: 500 } },
    },
        }}
      >
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
          title: 'Your Profile',
          headerBackTitle: 'Back',
  }}
/>

        {/* Main story selection */}
        <Stack.Screen 
          name="StorySelection" 
          component={StorySelectionScreen} 
          options={{ 
            title: 'Romance Chat Stories',
            headerRight: () => <HeaderMenu />

          }}
        />
        
        {/* Story progress dashboard */}
        <Stack.Screen
          name="StoryDashboard"
          component={StoryDashboardScreen}
          options={{
            title: 'Your Progress',
            headerBackTitle: 'Stories',
          }}
        />

        {/* Session selection - choose existing session or create new */}
        <Stack.Screen
          name="SessionSelection"
          component={SessionSelectionScreen}
          options={({ route }) => ({
            title: route.params.storyTitle || 'Select Session',
            headerBackTitle: 'Stories',
          })}
        />

        {/* Story scene with session context */}
        <Stack.Screen 
          name="StoryScene" 
          component={StorySceneScreen} 
          options={({ route }) => ({ 
            title: route.params.isPrologue ? 'Story Prologue' : 'Story Scene',
            headerBackTitle: 'Sessions',
            // Pass session context to the screen
          })}
        />

        {/* Chat screen with session management */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            title: 'Chat',
            headerBackTitle: 'Story',
            headerLeft: () => null, // Prevent accidental navigation away
            // You might want to add a save/pause button in headerRight
          })}
        />

        {/* Save management utilities */}
        <Stack.Screen
          name="SaveManager"
          component={SaveManagerScreen}
          options={{
            title: 'Manage Saves',
            headerBackTitle: 'Dashboard',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;