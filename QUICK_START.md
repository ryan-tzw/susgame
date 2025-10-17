# Quick Start: Adding Your Player Sprite

## Step 1: Add Your Sprite Files

Copy your exported TexturePacker files to the following location:

```
public/assets/sprites/player.png
public/assets/sprites/player.json
```

## Step 2: Verify Frame Names

Make sure your `player.json` file has frames named or indexed in a way that Phaser can access them.
The code expects to access frames by index (0, 1, 2).

If your JSON uses named frames like "player_0", "player_1", etc., you may need to adjust the animation code in `src/game/entities/Player.ts`.

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Test Movement

Use the arrow keys to move your player character around the screen!

---

## Current Features:

✅ Player appears on screen
✅ Arrow keys control movement
✅ Walking animation (0→1→0→2 cycle)
✅ Character flips when moving left
✅ HP display in top-left corner
✅ Smooth diagonal movement

## Troubleshooting:

### If the player doesn't appear:

1. Check browser console for errors
2. Verify sprite files are in `public/assets/sprites/`
3. Check that file names match exactly: `player.png` and `player.json`

### If animations don't work:

1. Open your `player.json` file
2. Check the frame naming convention
3. Adjust frame references in `Player.ts` if needed

### Example player.json structure:

```json
{
  "frames": {
    "0": { ... },
    "1": { ... },
    "2": { ... }
  }
}
```

Or with named frames:

```json
{
  "frames": [
    { "filename": "0", ... },
    { "filename": "1", ... },
    { "filename": "2", ... }
  ]
}
```
