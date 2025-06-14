import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionNavigationProvider } from './src/contexts/SessionNavigationContext';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SessionNavigationProvider>
          <Navigation />
        </SessionNavigationProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;