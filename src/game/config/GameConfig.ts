import Phaser from 'phaser'
import { GameScene } from '../scenes/GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#d7f5d3', // Light green background
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top-down game, no gravity
            debug: false,
        },
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}
