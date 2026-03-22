import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';

type Screen = 'home' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [highScore, setHighScore] = useState(0);

  const handleStart = () => setScreen('game');

  const handleGameOver = (score: number) => {
    if (score > highScore) setHighScore(score);
    setScreen('home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'home' ? (
        <HomeScreen onStart={handleStart} highScore={highScore} />
      ) : (
        <GameScreen onGameOver={handleGameOver} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
});
