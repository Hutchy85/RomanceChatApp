import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation'; // Ensure path is correct

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
