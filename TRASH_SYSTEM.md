# 🗑️ Trash System Guide

## ✅ Setup Complete!

The trash system is now fully implemented with organized folders for each bin type.

## 📁 Folder Structure

```
public/assets/sprites/trash/
├── green/     ← Waste-to-Energy trash (food waste, organic materials)
├── blue/      ← Recycling trash (plastic, paper, cardboard)
└── yellow/    ← Donation trash (clothes, toys, books)
```

## 🎨 Adding Your Trash Sprites

### Step 1: Place PNG Files in Correct Folders

**Green Bin Trash** (Waste-to-Energy):

-   Food waste, organic materials, non-recyclables
-   Place PNGs in: `public/assets/sprites/trash/green/`
-   Examples: `banana.png`, `apple_core.png`, `pizza_box.png`

**Blue Bin Trash** (Recycling):

-   Recyclable materials
-   Place PNGs in: `public/assets/sprites/trash/blue/`
-   Examples: `plastic_bottle.png`, `paper.png`, `can.png`

**Yellow Bin Trash** (Donation):

-   Reusable items
-   Place PNGs in: `public/assets/sprites/trash/yellow/`
-   Examples: `shirt.png`, `toy.png`, `book.png`

### Step 2: Update GameScene.ts

Open `src/game/scenes/GameScene.ts` and find the `loadTrashSprites()` method (around line 40).

Update these arrays with your actual PNG filenames:

```typescript
const greenTrashFiles: string[] = [
    'banana.png',
    'apple_core.png',
    'pizza_box.png',
    // Add all your green folder PNGs here
]

const blueTrashFiles: string[] = [
    'plastic_bottle.png',
    'paper.png',
    'can.png',
    // Add all your blue folder PNGs here
]

const yellowTrashFiles: string[] = [
    'shirt.png',
    'toy.png',
    'book.png',
    // Add all your yellow folder PNGs here
]
```

### Step 3: Test!

Refresh the game and you should see:

-   15 random trash items scattered on the floor
-   Each trash item comes from one of your folders
-   Walk over trash while carrying the matching bin to collect it
-   Wrong trash = -1 HP!

## 🎮 How It Works

### Trash Collection Mechanics:

1. **Pick up a bin** with SPACE
2. **Walk over trash** (within 50 pixels)
3. **Correct trash** → Collected! (no HP loss)
4. **Wrong trash** → Collected but -1 HP
5. **0 HP** → Game Over (scene restarts)

### Current Settings:

-   **Number of trash items**: 15 (change in `spawnTrash()` method)
-   **Collection range**: 50 pixels (change in `checkTrashCollection()` method)
-   **Spawn area**: Avoids edges and bin area on left side

## 🔧 Adjustments

### Change number of trash spawns:

In `GameScene.ts`, line ~113:

```typescript
const numTrashItems = 15 // Change this number
```

### Change collection range:

In `GameScene.ts`, line ~227:

```typescript
if (distance < 50) {  // Change 50 to desired range
```

### Change spawn area:

In `GameScene.ts`, lines ~121-122:

```typescript
const x = Phaser.Math.Between(300, mapWidth - 100) // Adjust X range
const y = Phaser.Math.Between(100, mapHeight - 100) // Adjust Y range
```

## 📊 Trash Organization System

The system automatically:

-   ✅ Reads filenames from each folder
-   ✅ Generates unique keys for each trash sprite
-   ✅ Associates each trash with its bin type
-   ✅ Loads all sprites into Phaser
-   ✅ Spawns random trash across the map

**Key naming pattern:**

-   Green folder PNGs → `trash_green_filename`
-   Blue folder PNGs → `trash_blue_filename`
-   Yellow folder PNGs → `trash_yellow_filename`

## 🎯 Next Steps

Now that trash collection works, consider adding:

1. **Dropoff boxes** - Where to deposit collected trash
2. **Bin capacity** - Limit how much trash fits in each bin
3. **Score system** - Track correctly collected items
4. **Visual feedback** - Particles, sounds, animations
5. **Game over screen** - Proper UI instead of restart

---

**Quick Test**: Add at least one PNG to each trash folder and update the arrays in `loadTrashSprites()` to see trash appear!
