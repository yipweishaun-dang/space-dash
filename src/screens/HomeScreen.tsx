import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onStart: () => void;
  highScore: number;
}

export function HomeScreen({ onStart, highScore }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SPACE DASH</Text>
      {highScore > 0 && (
        <Text style={styles.highScore}>Best: {highScore}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>TAP TO PLAY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 6,
  },
  highScore: {
    fontSize: 18,
    color: '#aaaacc',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
  },
});
