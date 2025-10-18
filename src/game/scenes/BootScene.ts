import Phaser from 'phaser'
import { AudioManager } from '../managers/AudioManager'

/**
 * Boot scene - loads initial assets before showing main menu
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' })
    }

    preload(): void {
        const width = this.cameras.main.width
        const height = this.cameras.main.height

        // Show simple loading text
        const loadingText = this.add
            .text(width / 2, height / 2, 'Loading...', {
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        // Load game music to start playing immediately
        this.load.audio('game_music', 'assets/audio/music/game_music.wav')

        // Load UI sound effects
        this.load.audio('button_hover', 'assets/audio/sfx/button_hover.mp3')
        this.load.audio('button_click', 'assets/audio/sfx/button_click.mp3')

        // Update loading text
        this.load.on('progress', (value: number) => {
            loadingText.setText(`Loading... ${Math.floor(value * 100)}%`)
        })

        // Clean up when done
        this.load.on('complete', () => {
            loadingText.destroy()
        })
    }

    create(): void {
        // Initialize global AudioManager and start background music
        const audioManager = AudioManager.getInstance(this)
        audioManager.playMusic('game_music')

        // Start the main menu
        this.scene.start('MainMenuScene')
    }
}
