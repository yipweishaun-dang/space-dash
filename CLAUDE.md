# CLAUDE.md — space-dash

## Project Overview
- **Project:** Space Dash — arcade mobile game (Flappy Bird-style)
- **Stack:** Expo SDK 55 + React Native + TypeScript
- **Platform:** iOS & Android (via Expo Go for dev)

## Project Structure
```
space-dash/
├── App.tsx                   # Root: screen router (home ↔ game)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx    # Title screen with high score
│   │   └── GameScreen.tsx    # Main gameplay view
│   ├── hooks/
│   │   └── useGameLoop.ts    # setInterval game loop, physics, collision
│   └── constants/
│       └── game.ts           # Tunable physics constants (gravity, speed, gap)
└── assets/                   # Sprites and sounds (to be added)
```

## Game Architecture
- **Game loop:** `setInterval` at 60fps inside `useGameLoop.ts`
- **Physics:** simple Euler integration (velocity += gravity each frame)
- **Collision:** AABB (axis-aligned bounding box) against obstacle pillars
- **State:** plain React state via `useState` + a `useRef` mirror for the loop

## Commands
| Command | Description |
|---------|-------------|
| `npx expo start` | Start dev server, scan QR with Expo Go |
| `npx expo start --ios` | Open in iOS simulator |
| `npx expo start --android` | Open in Android emulator |

## Key Tuning
All physics values live in `src/constants/game.ts`. Adjust `GRAVITY`, `JUMP_VELOCITY`, `OBSTACLE_SPEED`, and `OBSTACLE_GAP` to tune difficulty without touching game logic.
