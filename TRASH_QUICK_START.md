# Quick Setup: Adding Trash Sprites

## Your Trash Folder Structure is Ready! ✅

```
public/assets/sprites/trash/
├── green/     ← Put green bin trash PNGs here
├── blue/      ← Put blue bin trash PNGs here
└── yellow/    ← Put yellow bin trash PNGs here
```

## Step-by-Step Setup

### 1. Add Your PNG Files

Drop your trash sprite PNGs into the appropriate folders:

-   **Green** = Waste-to-energy (food, organic waste)
-   **Blue** = Recycling (plastic, paper, cans)
-   **Yellow** = Donation (clothes, toys, books)

### 2. Update the Code

Open: `src/game/scenes/GameScene.ts`

Find the `loadTrashSprites()` method (around line 40)

Replace the empty arrays with your filenames:

```typescript
const greenTrashFiles: string[] = ['your_file_1.png', 'your_file_2.png']

const blueTrashFiles: string[] = ['your_file_1.png', 'your_file_2.png']

const yellowTrashFiles: string[] = ['your_file_1.png', 'your_file_2.png']
```

### 3. Done!

Save and refresh. Your trash will appear scattered on the ground!

---

## Example

If you have these files:

```
trash/green/banana.png
trash/green/apple.png
trash/blue/bottle.png
trash/yellow/shirt.png
```

Update like this:

```typescript
const greenTrashFiles: string[] = ['banana.png', 'apple.png']
const blueTrashFiles: string[] = ['bottle.png']
const yellowTrashFiles: string[] = ['shirt.png']
```

That's it! 🎮
