# Heart Sprite Guide

## Required Files

Place these two heart sprite images in the sprites folder:

```
public/assets/sprites/heart_filled.png
public/assets/sprites/heart_empty.png
```

## Recommended Sprite Specifications

-   **Size**: 32x32 pixels or 64x64 pixels (the code will scale them to 50% by default)
-   **Format**: PNG with transparency
-   **Style**: Simple, clear heart shape
-   **Colors**:
    -   Filled heart: Red/pink (#FF0000 or similar)
    -   Empty heart: Gray outline (#666666 or similar)

## How It Works

-   Hearts appear above the player and follow them around
-   5 hearts total (matching max HP)
-   Filled hearts show current HP
-   Empty hearts show lost HP
-   Hearts are spaced 40 pixels apart horizontally

## Adjustments

If your heart sprites are a different size, you can adjust in `GameScene.ts`:

-   **Scale**: Change `.setScale(0.5)` (line ~48)
-   **Spacing**: Change `heartSpacing = 40` (line ~53)
-   **Vertical offset**: Change `yOffset = -80` (line ~55)
