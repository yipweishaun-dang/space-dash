import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useGameLoop } from '../hooks/useGameLoop';
import { PLAYER_X, PLAYER_SIZE, OBSTACLE_WIDTH, OBSTACLE_GAP } from '../constants/game';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onGameOver: (score: number) => void;
}

export function GameScreen({ onGameOver }: Props) {
  const { gameState, jump, start } = useGameLoop();
  const [started, setStarted] = useState(false);

  const handleTap = useCallback(() => {
    if (!started) {
      setStarted(true);
      start();
    } else if (!gameState.isAlive) {
      onGameOver(gameState.score);
    } else {
      jump();
    }
  }, [started, gameState.isAlive, gameState.score, jump, start, onGameOver]);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Background stars (static decoration) */}
        <View style={styles.stars} />

        {/* Obstacles */}
        {gameState.obstacles.map((obs) => (
          <React.Fragment key={obs.id}>
            {/* Top pillar */}
            <View
              style={[
                styles.obstacle,
                { left: obs.x, top: 0, height: obs.gapTop, width: OBSTACLE_WIDTH },
              ]}
            />
            {/* Bottom pillar */}
            <View
              style={[
                styles.obstacle,
                {
                  left: obs.x,
                  top: obs.gapTop + OBSTACLE_GAP,
                  height: SCREEN_HEIGHT - obs.gapTop - OBSTACLE_GAP,
                  width: OBSTACLE_WIDTH,
                },
              ]}
            />
          </React.Fragment>
        ))}

        {/* Player */}
        <View
          style={[
            styles.player,
            { top: gameState.playerY, left: PLAYER_X },
          ]}
        />

        {/* Score */}
        <Text style={styles.score}>{gameState.score}</Text>

        {/* Overlays */}
        {!started && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>TAP TO START</Text>
          </View>
        )}
        {started && !gameState.isAlive && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>GAME OVER</Text>
            <Text style={styles.overlayScore}>Score: {gameState.score}</Text>
            <Text style={styles.overlayText}>Tap to continue</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    overflow: 'hidden',
  },
  stars: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a1a',
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: '#818cf8',
    borderRadius: 8,
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: '#312e81',
    borderRadius: 4,
  },
  score: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    left: SCREEN_WIDTH / 2 - 20,
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 12,
  },
  overlayTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#ffffff',
  },
  overlayScore: {
    fontSize: 22,
    color: '#c7d2fe',
  },
  overlayText: {
    fontSize: 18,
    color: '#a5b4fc',
    marginTop: 8,
  },
});