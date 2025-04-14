import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Button, TextInput, Card, Text, useTheme, DefaultTheme, DarkTheme } from 'react-native-paper';
import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const theme = useTheme();

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {messages.map((msg, index) => (
            <Card key={index} style={styles.messageCard}>
              <Card.Content>
                <Text>{msg}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            style={styles.textInput}
          />
          <Button mode="contained" onPress={handleSend} style={styles.sendButton}>
            Send
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 16,
  },
  messageCard: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 4,
  },
});