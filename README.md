# SUS-GAME 🗑️♻️

A top-down recycling and waste management game built with Phaser 3 and React.

## 🎮 Game Overview

Collect trash with the correct bins, deposit them at the appropriate facilities, and earn points! But be careful - picking up the wrong trash will damage you. Reach 500 points to win!

## 📁 Project Structure

```
susgame/
├── public/
│   └── assets/
│       ├── sprites/
│       │   ├── player.png & player.json      # Player spritesheet & atlas
│       │   ├── green_bin.png                 # Compostable waste bin
│       │   ├── blue_bin.png                  # Recyclable waste bin
│       │   ├── yellow_bin.png                # Donation items bin
│       │   ├── heart_filled.png & heart_empty.png
│       │   ├── arrow.png                     # Direction indicator
│       │   ├── waste_to_energy.png           # Dropoff decoration
│       │   ├── recycling_plant.png           # Dropoff decoration
│       │   ├── donation_center.png           # Dropoff decoration
│       │   └── trash/                        # Organized by bin type
│       │       ├── green/                    # Apple, etc.
│       │       ├── blue/                     # Bottles, cans, boxes
│       │       └── yellow/                   # Clothes, shoes
│       ├── background/
│       │   ├── spritesheet.png               # Tiled tilemap texture
│       │   └── map.tmj                       # Tiled map JSON
│       └── audio/
│           ├── music/
│           │   └── game_music.wav            # Background music
│           └── sfx/
│               ├── trash_pickup.mp3
│               ├── correct_deposit.mp3
│               ├── player_damage.mp3
│               ├── button_hover.mp3
│               ├── button_click.mp3
│               ├── victory.mp3
│               └── game_over.mp3
├── src/
│   └── game/
│       ├── config/
│       │   ├── GameConfig.ts                 # Phaser configuration
│       │   └── GameConstants.ts              # Game balance values
│       ├── entities/
│       │   ├── Player.ts                     # Player movement & HP
│       │   ├── Bin.ts                        # Bin carry/drain mechanics
│       │   ├── Trash.ts                      # Trash spawning & animations
│       │   └── DropoffBox.ts                 # Deposit locations
│       ├── managers/
│       │   ├── TilemapManager.ts             # Tiled map & collision
│       │   ├── SpawnManager.ts               # Entity spawning
│       │   ├── UIManager.ts                  # Score, HP, overlays
│       │   ├── InputManager.ts               # Input handling
│       │   ├── GameStateManager.ts           # Game state machine
│       │   ├── CollisionManager.ts           # Collision detection
│       │   └── AudioManager.ts               # Music & sound effects
│       ├── scenes/
│       │   ├── BootScene.ts                  # Initial asset loading
│       │   ├── MainMenuScene.ts              # Title screen
│       │   ├── PreloadScene.ts               # Game asset loading
│       │   └── GameScene.ts                  # Main gameplay
│       ├── utils/
│       │   ├── TrashLoader.ts                # Dynamic trash loading
│       │   └── SceneTransitions.ts           # Circle wipe transitions
│       └── PhaserGame.tsx                    # React integration
```

## 🎯 Controls

-   **Arrow Keys** / **WASD**: Move player
-   **SPACE**: Interact (pick up bins, collect trash)
-   **V**: Debug - Instant win (set score to 500)

## 🎨 Game Features

### ✅ Implemented

-   [x] **Player Movement** - Physics-based with collision detection
-   [x] **HP System** - 5 hearts, lose HP from wrong trash
-   [x] **3 Bin Types** - Green (compost), Blue (recycle), Yellow (donate)
-   [x] **3 Dropoff Points** - Waste-to-Energy, Recycling Plant, Donation Center
-   [x] **Trash Collection** - Multiple trash types per category
-   [x] **Bin Mechanics** - Pick up, carry, fill, drain at correct locations
-   [x] **Score System** - Points for correct pickups and deposits
-   [x] **Win Condition** - Reach 500 points
-   [x] **Game Over** - Lose all HP
-   [x] **Main Menu** - Gradient background with animated title
-   [x] **Scene Transitions** - Smooth circle wipe animations
-   [x] **Tiled Map Integration** - Large explorable world with water collision
-   [x] **UI System** - Score display, HP hearts, notifications, popups
-   [x] **Audio System** - Background music and sound effects
-   [x] **Visual Polish** - Rounded pixels, anti-aliasing, proper camera follow

### 🎮 Game Mechanics

#### Bin System

-   **Green Bin** → Compostable waste (food)
-   **Blue Bin** → Recyclable waste (plastic, metal, paper)
-   **Yellow Bin** → Donation items (clothes, shoes)

#### Gameplay Loop

1. **Pick up a bin** - Walk to a bin and press SPACE
2. **Collect matching trash** - Only pick up trash that matches your bin
3. **Avoid wrong trash** - Picking up mismatched trash deals 1 damage
4. **Deposit at correct facility** - Bin drains slowly when placed at correct dropoff
5. **Score points** - +10 for correct pickup, +5 per item drained
6. **Win or lose** - Reach 500 points to win, or lose all 5 HP for game over

#### Scoring

-   **Correct Trash Pickup**: +10 points
-   **Bin Drain (per item)**: +5 points
-   **Win Threshold**: 500 points

## 🔧 Technologies

-   **Phaser 3.90.0** - Game engine with Arcade physics
-   **React 18** - UI framework
-   **TypeScript** - Type safety
-   **Vite** - Fast build tool
-   **Tiled Map Editor** - Level design

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

## 🎵 Audio

-   **Background Music**: Loops continuously across all scenes
-   **Sound Effects**: Pickup, deposit, damage, victory, game over, UI sounds
-   **Volume Controls**: Separate music (50%) and SFX (70%) volumes
-   **Mute Support**: Toggle all audio on/off

## 🐛 Debug Features

-   **V Key**: Instantly set score to 500 (win condition)
-   **Physics Debug**: Set `debug: true` in GameConfig.ts to visualize collision boxes

## 🎨 Visual Features

-   **Smooth circle wipe transitions** between scenes
-   **Diagonal gradient background** on main menu
-   **Animated score popups** at pickup locations
-   **Damage indicators** above player
-   **Arrow indicator** shows nearby interactable objects
-   **Bin fill indicators** show capacity
-   **Transparent overlays** for win/game over screens

## 📝 Notes

-   **Tilemap collision**: Uses Tiled collision objects, not tile properties
-   **Texture filtering**: Tilemap uses NEAREST mode to prevent bleeding
-   **Pixel rounding**: Enabled globally for crisp pixel art
-   **Scene persistence**: Audio persists across scene changes

## 🔮 Future Enhancements

-   [ ] Pause menu
-   [ ] High score tracking with localStorage
-   [ ] Timer/countdown mode
-   [ ] Power-ups and special items
-   [ ] Difficulty progression
-   [ ] Multiple levels/maps
-   [ ] Particle effects
-   [ ] Mobile touch controls
-   [ ] More trash variety
-   [ ] Sound/music volume sliders in settings
