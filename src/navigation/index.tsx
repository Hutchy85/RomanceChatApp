import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
// Import screens
import StorySelectionScreen from '../screens/StorySelectionScreen';
import StorySceneScreen from '../screens/StorySceneScreen';
import ChatScreen from '../screens/ChatScreen';
import StoryDashboardScreen from '../screens/StoryDashboardScreen';
import SessionSelectionScreen from '../screens/SessionSelectionScreen';
import SaveManagerScreen from '../screens/SaveManagerScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HeaderMenu from '../components/HeadderMenu'; // Import the header menu component
import ProfileGate from '../screens/ProfileGateScreen'; // Import the profile gate screen
import EditProfileScreen from '../screens/EditProfileScreen'; // Import the edit profile screen

// Define the navigation parameters
export type RootStackParamList = {

  ProfileGate: undefined; // Initial gate to check user profile

  StorySelection: undefined;
  StoryDashboard: undefined;
  UserProfile: undefined; // User profile setup screen
  EditProfile: undefined; // Screen to edit user profile
  
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
        initialRouteName="ProfileGate"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff6b6b',
            elevation: 0, // Android
            shadowOpacity: 0, // iOS
            borderBottomWidth: 0, // fallback
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
        name="ProfileGate"
        component={ProfileGate}
        options={{ headerShown: false }} 
/>

        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
          title: 'Your Profile',
          headerBackTitle: 'Back',
  }}
/>

        <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
        title: 'Edit Profile',
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
    headerBackground: () => (
      <LinearGradient
        colors={['#ff6b6b', 'rgba(255, 107, 107, 0.6)', 'transparent']}
        style={{ flex: 1 }}
      />
    ),
  })}
/>

        {/* Chat screen with session management */}
        <Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={({ route }) => ({
    title: 'Chat',
    headerBackTitle: 'Stories',
    headerLeft: () => null,
    headerBackground: () => (
      <LinearGradient
        colors={['#ff6b6b', 'rgba(255, 107, 107, 0.6)', 'transparent']}
        style={{ flex: 1 }}
      />
    ),
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