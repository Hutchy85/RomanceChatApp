import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSessionNavigation } from '../contexts/SessionNavigationContext';


const RelationshipStatusBar = () => {
  const { currentSession } = useSessionNavigation();
  
  // Early return if no session or no character stats
  if (!currentSession?.characterStats) return null;

  const { affection, trust } = currentSession.characterStats;

  // Don't render if stats are undefined or null
  if (affection === undefined || trust === undefined) return null;

  return (
    <View style={styles.container}>
      <View style={styles.statBlock}>
        <Text style={styles.label}>❤️ Affection</Text>
        <Progress.Bar 
          progress={affection / 100} 
          width={120} 
          color="#ff6384"
          unfilledColor="#333"
          borderWidth={0}
          height={10}
        />
      </View>
      <View style={styles.statBlock}>
        <Text style={styles.label}>🤝 Trust</Text>
        <Progress.Bar 
          progress={trust / 100} 
          width={120} 
          color="#4bc0c0"
          unfilledColor="#333"
          borderWidth={0}
          height={10}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  statBlock: {
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RelationshipStatusBar;