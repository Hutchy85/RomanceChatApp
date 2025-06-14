import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { SessionNavigationProvider } from './src/contexts/SessionNavigationContext';
import { UserProfileProvider } from './src/contexts/UserProfileContext';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <UserProfileProvider>         
          <SessionNavigationProvider>
            <Navigation />
          </SessionNavigationProvider>
        </UserProfileProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
