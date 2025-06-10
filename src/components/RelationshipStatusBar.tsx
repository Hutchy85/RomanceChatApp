import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SessionNavigationContext } from '../contexts/SessionNavigationContext';

const RelationshipStatusBar = () => {
  const { sessionState } = useContext(SessionNavigationContext);
  const { characterStats } = sessionState;

  if (!characterStats) return null;

  const { affection, trust } = characterStats;

  return (
    <View style={styles.container}>
      <View style={styles.statBlock}>
        <Text style={styles.label}>❤️ Affection</Text>
        <Text style={styles.value}>{affection}</Text>
      </View>
      <View style={styles.statBlock}>
        <Text style={styles.label}>🤝 Trust</Text>
        <Text style={styles.value}>{trust}</Text>
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
