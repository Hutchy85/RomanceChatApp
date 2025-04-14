import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import StorySelectionScreen from '../screens/StorySelectionScreen';
import PrologueScreen from '../screens/PrologueScreen';
import ChatScreen from '../screens/ChatScreen';

// Define the navigation parameters
export type RootStackParamList = {
  StorySelection: undefined;
  Prologue: { storyId: string };
  Chat: { storyId: string; restore?: boolean };
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
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
          options={({ route }) => ({ 
            title: 'Story Prologue',
            headerBackTitle: 'Back'
          })}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={({ route }) => ({ 
            title: 'Chat',
            headerBackTitle: 'Exit',
            headerLeft: () => null, // Remove back button for chat screen
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
