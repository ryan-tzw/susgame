import Phaser from 'phaser'
import { BootScene } from '../scenes/BootScene'
import { MainMenuScene } from '../scenes/MainMenuScene'
import { GameScene } from '../scenes/GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000', // Black background (tilemap will cover this)
    render: {
        antialias: true, // Keep smooth for hand-drawn sprites
        antialiasGL: true,
        roundPixels: true, // Round pixel positions to prevent sub-pixel gaps
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top-down game, no gravity
            debug: false, // Enable debug rendering to see collision boxes
        },
    },
    scene: [BootScene, MainMenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}
