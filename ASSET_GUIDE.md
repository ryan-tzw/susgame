# 📍 Asset Placement Guide

## Your Player Sprite Files

You mentioned you have:

-   ✅ Player spritesheet (PNG)
-   ✅ TexturePacker JSON atlas

## Where to Place Them

```
susgame/
└── public/
    └── assets/
        └── sprites/
            ├── player.png   ← Your spritesheet goes here
            └── player.json  ← Your atlas JSON goes here
```

**Important:** The files MUST be named exactly `player.png` and `player.json`

## How the Loading Works

In `GameScene.ts`, the preload method loads your atlas:

```typescript
this.load.atlas(
    'player', // Key to reference in game
    'assets/sprites/player.png', // Path to spritesheet
    'assets/sprites/player.json' // Path to atlas data
)
```

## Animation Frame Structure

Your TexturePacker export should have at least 3 frames accessible as:

-   **Frame 0**: Standing pose (neutral)
-   **Frame 1**: Left leg extended
-   **Frame 2**: Right leg extended

The animation cycles through: **0 → 1 → 0 → 2** (repeating)

This creates a smooth walking effect:

1. Standing
2. Left leg out
3. Standing
4. Right leg out
5. (repeat)

## Testing Your Sprites

After placing the files:

1. The browser should automatically reload
2. You should see your character in the center of the screen
3. Use arrow keys to move and see the walking animation

If you see a blank screen or placeholder, check the browser console for loading errors.

---

## Future Asset Locations

When you add more sprites later:

```
public/assets/sprites/
├── player.png
├── player.json
├── bins.png              ← Bin sprites (3 colors)
├── bins.json
├── trash.png             ← Trash item sprites
├── trash.json
├── dropoff-boxes.png     ← Dropoff point sprites
└── dropoff-boxes.json
```

Keep everything organized in `public/assets/sprites/` for easy management!
