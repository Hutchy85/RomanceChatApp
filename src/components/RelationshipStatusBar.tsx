import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSessionNavigation } from '../contexts/SessionNavigationContext';


const RelationshipStatusBar = () => {
  const { currentSession } = useSessionNavigation();

  if (!currentSession?.characterStats) return null;

  const statsToDisplay = [
    { key: 'affection', label: '❤️ Affection', color: '#ff6384' },
    { key: 'trust', label: '🤝 Trust', color: '#4bc0c0' },
    { key: 'respect', label: '🫡 Respect', color: '#facc15' },
    { key: 'friendship', label: '👥 Friendship', color: '#c084fc' },
  ];

  return (
    <View style={styles.container}>
      {statsToDisplay.map(({ key, label, color }) => {
        const value = currentSession.characterStats[key];
        if (value === undefined) return null;
        return (
          <View key={key} style={styles.statBlock}>
  <Text style={styles.label}>{label}</Text>
  <Progress.Bar
    progress={Number(value) / 100}
    width={120}
    color={color}
    unfilledColor="#333"
    borderWidth={0}
    height={10}
  />
  <Text style={styles.value}>{value}</Text>
</View>
        );
      })}
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