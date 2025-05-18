import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import StorySelectionScreen from '../screens/StorySelectionScreen';
import PrologueScreen from '../screens/PrologueScreen';
import ChatScreen from '../screens/ChatScreen';
import StorySceneScreen from '../screens/StorySceneScreen';

// Define the navigation parameters
export type RootStackParamList = {
  StorySelection: undefined;
  Prologue: { storyId: string };
  StoryScene: { storyId: string; sceneId: string };
  Chat: { storyId: string; sceneId: string; startNewSession?: boolean };
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
  <NavigationContainer
    onStateChange={(state) => {
      console.log('Current state:', state);
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
        }}
      >
        <Stack.Screen 
          name="StorySelection" 
          component={StorySelectionScreen} 
          options={{ title: 'Romance Chat Stories' }}
        />
        <Stack.Screen 
          name="Prologue" 
          component={PrologueScreen} 
          options= {{ 
            title: 'Story Prologue',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen
          name="StoryScene"
          component={StorySceneScreen}
          options={{
            title: 'Story Scene',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={{
    title: 'Chat',
    headerBackTitle: 'Exit',
    headerLeft: () => null,
  }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
