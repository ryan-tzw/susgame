# SUS-GAME 🗑️♻️

A top-down recycling and waste management game built with Phaser 3 and TypeScript.

## 🎮 About

Collect trash with the correct bins, deposit them at the appropriate facilities, and earn points! Be careful - picking up the wrong trash will damage you. Reach 500 points to win!

## 🎯 How to Play

**Controls:**

-   **Arrow Keys** / **WASD**: Move
-   **Shift**: Sprint
-   **Space**: Pick up bins
-   **E**: Pick up trash (while holding a bin)

**Bin Types:**

-   🟢 **Green** → Compostable (food)
-   🔵 **Blue** → Recyclable (plastic, metal, paper)
-   🟡 **Yellow** → Donations (clothes, shoes)

**Gameplay:**

1. Pick up a bin and collect matching trash (+10 points each)
2. Avoid mismatched trash (-1 HP)
3. Deposit at the correct facility (+5 per item drained)
4. Reach 500 points to win or lose all 5 HP for game over

## 🔧 Built With

**Game Engine:**

-   Phaser 3.90.0 (Arcade Physics)
-   TypeScript
-   Vite

**Tools:**

-   CLIP STUDIO PAINT - Art/sprites
-   Tiled Map Editor - Level design

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Requirements:** Node.js v18+
