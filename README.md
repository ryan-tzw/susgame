# Sustainability Game - Setup Instructions

## Project Structure

```
susgame/
├── public/
│   └── assets/
│       └── sprites/          # Place your sprite assets here
│           ├── player.png    # Your player spritesheet
│           └── player.json   # TexturePacker atlas JSON
├── src/
│   ├── game/
│   │   ├── config/
│   │   │   └── GameConfig.ts      # Phaser game configuration
│   │   ├── entities/
│   │   │   └── Player.ts          # Player class with movement & animations
│   │   ├── scenes/
│   │   │   └── GameScene.ts       # Main game scene
│   │   └── PhaserGame.tsx         # React wrapper for Phaser
│   ├── App.tsx
│   └── main.tsx
```

## Asset Setup

### Player Sprite

1. Place your `player.png` spritesheet in `public/assets/sprites/`
2. Place your `player.json` (TexturePacker atlas) in `public/assets/sprites/`

The game expects your player sprite atlas to have at least 3 frames:

-   Frame 0: Standing pose
-   Frame 1: Left leg out
-   Frame 2: Right leg out

The walking animation follows the pattern: 0 → 1 → 0 → 2

## Running the Game

```bash
npm install
npm run dev
```

## Controls

-   **Arrow Keys**: Move the player
-   **SPACE**: Interact (pick up bins, trash, deposit at dropoff points)

## Game Features (To Be Implemented)

### Current Status: ✅ Player Movement

-   [x] Player sprite loading
-   [x] Player movement (arrow keys)
-   [x] Walking animation
-   [x] HP system (5 HP)

### Next Steps:

-   [ ] Add 3 bins (green, blue, yellow)
-   [ ] Add 3 dropoff boxes (waste-to-energy, recycling, donation)
-   [ ] Add trash items
-   [ ] Implement bin pickup/dropoff mechanics
-   [ ] Implement trash collection system
-   [ ] Add HP loss for wrong trash
-   [ ] Create game over screen
-   [ ] Add main menu

## Game Mechanics

### Bins & Dropoff Points:

-   **Green Bin** → Waste-to-Energy Plant
-   **Blue Bin** → Recycling Plant
-   **Yellow Bin** → Donation Center

### Gameplay:

1. Walk to a bin and press SPACE to pick it up
2. Walk around and collect matching trash
3. Wrong trash = -1 HP
4. Deposit full bin at correct dropoff point
5. Game Over at 0 HP

## Technologies

-   **Phaser 3.90.0** - Game engine
-   **React 18** - UI framework
-   **TypeScript** - Type safety
-   **Vite** - Build tool
