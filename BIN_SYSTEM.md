# Bin System Documentation

## ✅ Implemented Features

### Bins Created

Three bins are now available in the game:

-   **Green Bin** → Waste-to-Energy Plant
-   **Blue Bin** → Recycling Plant
-   **Yellow Bin** → Donation Center

### Bin Locations

All three bins are positioned on the left side of the screen, vertically spaced.

### Controls

-   **SPACE** near a bin → Pick up the bin
-   **SPACE** while carrying a bin → Drop the bin at current location

### Visual Behavior

-   When picked up, the bin appears on top of the player's head
-   Bin follows the player as they move
-   Hearts now appear **below** the player (to avoid overlapping with carried bin)

## Adjusting Bin Position

If you need to adjust where the bin sits on the player's head, edit this value in `src/game/entities/Bin.ts`:

```typescript
const yOffset = -60 // Line 60 - Change this number
```

-   **More negative** = Higher above the player
-   **Less negative** = Lower/closer to the player
-   **Positive** = Below the player

## Current Interaction Range

The player can pick up a bin when within **80 pixels** of it.

To adjust this, edit in `src/game/scenes/GameScene.ts`:

```typescript
if (distance < 80) {  // Line ~149 - Change 80 to desired distance
```

## File Structure

```
src/game/entities/
├── Player.ts    - Player movement, animation, state
└── Bin.ts       - Bin entity, pickup/drop logic

src/game/scenes/
└── GameScene.ts - Scene management, bin creation, interactions
```

## Next Steps

Now that bins work, we can add:

1. **Trash items** scattered on the ground
2. **Dropoff boxes** (waste-to-energy, recycling, donation)
3. **Trash collection** mechanics (pick up matching trash)
4. **HP loss** for wrong trash type
5. **Deposit system** at dropoff points
