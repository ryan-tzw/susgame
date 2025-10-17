import Phaser from 'phaser'
import { PreloadScene } from '../scenes/PreloadScene'
import { GameScene } from '../scenes/GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000', // Black background (tilemap will cover this)
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top-down game, no gravity
            debug: false, // Enable debug rendering to see collision boxes
        },
    },
    scene: [PreloadScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}
