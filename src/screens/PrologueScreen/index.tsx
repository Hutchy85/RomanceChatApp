import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { stories } from '../../data/stories';

type PrologueScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Prologue'>;
  route: RouteProp<RootStackParamList, 'Prologue'>;
};

const PrologueScreen: React.FC<PrologueScreenProps> = ({ navigation, route }) => {
  const { storyId } = route.params;
  
  const story = stories.find((item) => item.id === storyId);

  const prologue = story
    ? {
        title: story.title,
        content: story.prologue,
      }
    : {
        title: 'Unknown Story',
        content: 'Story details could not be loaded. Please return to the main page and try again.',
      };

  // Function to handle continuing to chat
  const handleContinue = () => {
    navigation.navigate('Chat', { storyId, sceneId: 'chat', startNewSession: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{prologue.title}</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.prologueCard}>
          {prologue.content.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={styles.prologueText}>
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue to Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Stories</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  prologueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  prologueText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  continueButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  backButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PrologueScreen;