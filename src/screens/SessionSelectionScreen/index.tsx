// SessionSelectionScreen.tsx - New screen for managing sessions
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useSessionAwareNavigation } from '../../contexts/SessionNavigationContext';
import { StorySession } from '../../types';

type SessionSelectionScreenRouteProp = RouteProp<RootStackParamList, 'SessionSelection'>;
type SessionSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SessionSelection'>;

interface Props {
  route: SessionSelectionScreenRouteProp;
  navigation: SessionSelectionScreenNavigationProp;
}

const SessionSelectionScreen: React.FC<Props> = ({ route }) => {
  const { storyId, storyTitle } = route.params;
  const { getSessionsForStory, startNewSession, resumeSession, deleteSession, canResumeSession, getSessionProgress } = useSessionAwareNavigation();
  
  const [sessions, setSessions] = useState<StorySession[]>([]);

  useEffect(() => {
    // Load sessions for this story
    const storySessions = getSessionsForStory(storyId);
    setSessions(storySessions);
  }, [storyId]);

  const handleStartNewSession = async () => {
    try {
      await startNewSession(storyId);
    } catch (error) {
      Alert.alert('Error', 'Failed to start new session');
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    try {
      await resumeSession(sessionId);
    } catch (error) {
      Alert.alert('Error', 'Failed to resume session');
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(sessionId);
              setSessions(sessions.filter(s => s.id !== sessionId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity 
        onPress={handleStartNewSession}
        style={{ 
          backgroundColor: '#ff6b6b', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 16 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          Start New Session
        </Text>
      </TouchableOpacity>

      {sessions.length > 0 && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Your Sessions
          </Text>
          
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ 
                backgroundColor: 'white', 
                padding: 16, 
                marginBottom: 8, 
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: item.isCompleted ? '#4CAF50' : '#ff6b6b'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {item.customVariables?.characterName || 'Unnamed Character'}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 14 }}>
                      Progress: {getSessionProgress(item)}%
                    </Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>
                      Last played: {formatDate(item.lastPlayedAt)}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>
                      Play time: {formatPlayTime(item.totalPlayTime)}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => handleResumeSession(item.id)}
                      style={{ 
                        backgroundColor: canResumeSession(item) ? '#4CAF50' : '#2196F3',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 4,
                        marginRight: 8
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {canResumeSession(item) ? 'Resume' : 'Start'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleDeleteSession(item.id)}
                      style={{ 
                        backgroundColor: '#f44336',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      )}
      
      {sessions.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No sessions found for this story.{'\n'}Start a new session to begin!
          </Text>
        </View>
      )}
    </View>
  );
};

export default SessionSelectionScreen;