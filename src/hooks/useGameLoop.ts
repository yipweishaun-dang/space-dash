import { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
  GRAVITY,
  JUMP_VELOCITY,
  OBSTACLE_SPEED,
  OBSTACLE_GAP,
  OBSTACLE_WIDTH,
  OBSTACLE_INTERVAL,
  PLAYER_SIZE,
  PLAYER_X,
  FRAME_RATE,
} from '../constants/game';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Obstacle {
  id: number;
  x: number;
  gapTop: number; // y position where the gap starts
}

interface GameState {
  playerY: number;
  playerVelocity: number;
  obstacles: Obstacle[];
  score: number;
  isAlive: boolean;
}

const initialState = (): GameState => ({
  playerY: SCREEN_HEIGHT / 2,
  playerVelocity: 0,
  obstacles: [],
  score: 0,
  isAlive: true,
});

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(initialState());
  const [isRunning, setIsRunning] = useState(false);
  const frameRef = useRef(0);
  const obstacleCounter = useRef(0);
  const obstacleId = useRef(0);
  const stateRef = useRef<GameState>(initialState());

  const jump = useCallback(() => {
    if (!stateRef.current.isAlive) return;
    stateRef.current = {
      ...stateRef.current,
      playerVelocity: JUMP_VELOCITY,
    };
  }, []);

  const start = useCallback(() => {
    const fresh = initialState();
    stateRef.current = fresh;
    setGameState(fresh);
    obstacleCounter.current = 0;
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const s = stateRef.current;
      if (!s.isAlive) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      // Physics
      const newVelocity = s.playerVelocity + GRAVITY;
      const newY = s.playerY + newVelocity;

      // Spawn obstacles
      obstacleCounter.current += 1;
      let newObstacles = s.obstacles
        .map((o) => ({ ...o, x: o.x - OBSTACLE_SPEED }))
        .filter((o) => o.x + OBSTACLE_WIDTH > 0);

      if (obstacleCounter.current >= OBSTACLE_INTERVAL) {
        obstacleCounter.current = 0;
        const minGapTop = 80;
        const maxGapTop = SCREEN_HEIGHT - OBSTACLE_GAP - 80;
        const gapTop = Math.random() * (maxGapTop - minGapTop) + minGapTop;
        newObstacles = [
          ...newObstacles,
          { id: obstacleId.current++, x: SCREEN_WIDTH, gapTop },
        ];
      }

      // Collision detection
      const playerLeft = PLAYER_X;
      const playerRight = PLAYER_X + PLAYER_SIZE;
      const playerTop = newY;
      const playerBottom = newY + PLAYER_SIZE;

      const hitFloorOrCeiling = playerTop <= 0 || playerBottom >= SCREEN_HEIGHT;

      const hitObstacle = newObstacles.some((o) => {
        const obsLeft = o.x;
        const obsRight = o.x + OBSTACLE_WIDTH;
        if (playerRight < obsLeft || playerLeft > obsRight) return false;
        // Hit top pillar or bottom pillar
        return playerTop < o.gapTop || playerBottom > o.gapTop + OBSTACLE_GAP;
      });

      const isAlive = !hitFloorOrCeiling && !hitObstacle;

      // Score: count obstacles fully passed
      const newScore = newObstacles.filter(
        (o) => o.x + OBSTACLE_WIDTH < PLAYER_X
      ).length;

      const next: GameState = {
        playerY: newY,
        playerVelocity: newVelocity,
        obstacles: newObstacles,
        score: newScore,
        isAlive,
      };

      stateRef.current = next;
      setGameState({ ...next });
    }, 1000 / FRAME_RATE);

    return () => clearInterval(interval);
  }, [isRunning]);

  return { gameState, jump, start, stop, isRunning };
}
