import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSessionNavigation } from '../contexts/SessionNavigationContext';

const statsToDisplay = [
  { key: 'affection' as const, label: '❤️ Affection', color: '#ff6384' },
  { key: 'trust' as const, label: '🤝 Trust', color: '#4bc0c0' },
  { key: 'respect' as const, label: '🫡 Respect', color: '#facc15' },
  { key: 'friendship' as const, label: '👥 Friendship', color: '#c084fc' },
];

const RelationshipStatusBar = () => {
  const { currentSession } = useSessionNavigation();

  if (!currentSession?.characterStats) return null;

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
              width={140}
              color={color}
              unfilledColor="#333"
              borderWidth={0}
              height={10}
              style={styles.progressBar}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 6,
  },
  statBlock: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  label: {
    color: '#eee',
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    marginVertical: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default RelationshipStatusBar;
