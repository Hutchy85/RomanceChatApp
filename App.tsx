import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionNavigationProvider } from './src/contexts/SessionNavigationContext';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <SessionNavigationProvider>
        <Navigation />
      </SessionNavigationProvider>
    </SafeAreaProvider>
  );
};

export default App;