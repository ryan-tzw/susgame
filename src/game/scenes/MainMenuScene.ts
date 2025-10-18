import Phaser from 'phaser'
import { SceneTransitions } from '../utils/SceneTransitions'
import { AudioManager } from '../managers/AudioManager'

/**
 * Main menu scene with title and play button
 */
export class MainMenuScene extends Phaser.Scene {
    private audioManager!: AudioManager

    constructor() {
        super({ key: 'MainMenuScene' })
    }

    create(): void {
        // Initialize audio manager (music already playing from BootScene)
        this.audioManager = new AudioManager(this)
        const centerX = this.cameras.main.width / 2
        const centerY = this.cameras.main.height / 2
        const width = this.cameras.main.width
        const height = this.cameras.main.height

        // Create diagonal gradient background (top-left to bottom-right)
        const gradient = this.add.graphics()

        const topLeftColor = 0x96dd99
        const bottomRightColor = 0xd7f5d3

        // Draw gradient using diagonal strips
        const steps = 200
        const maxDistance = Math.sqrt(width * width + height * height)

        // Draw diagonal strips
        for (let i = 0; i < steps; i++) {
            const ratio = i / steps

            // Interpolate between colors
            const r = Math.floor(
                ((topLeftColor >> 16) & 0xff) * (1 - ratio) +
                    ((bottomRightColor >> 16) & 0xff) * ratio
            )
            const g = Math.floor(
                ((topLeftColor >> 8) & 0xff) * (1 - ratio) +
                    ((bottomRightColor >> 8) & 0xff) * ratio
            )
            const b = Math.floor(
                (topLeftColor & 0xff) * (1 - ratio) +
                    (bottomRightColor & 0xff) * ratio
            )
            const color = (r << 16) | (g << 8) | b

            gradient.fillStyle(color, 1)

            // Draw a diagonal strip
            const distance = (maxDistance / steps) * i
            const nextDistance = (maxDistance / steps) * (i + 1)

            // Create a polygon that represents this diagonal strip
            gradient.beginPath()
            gradient.moveTo(0, distance)
            gradient.lineTo(distance, 0)
            gradient.lineTo(nextDistance, 0)
            gradient.lineTo(0, nextDistance)
            if (distance > 0) {
                gradient.lineTo(0, distance)
            }
            gradient.closePath()
            gradient.fillPath()

            // Fill the other corner
            if (nextDistance < maxDistance) {
                gradient.beginPath()
                gradient.moveTo(width, height - distance)
                gradient.lineTo(width - distance, height)
                gradient.lineTo(width - nextDistance, height)
                gradient.lineTo(width, height - nextDistance)
                gradient.closePath()
                gradient.fillPath()
            }
        }
        gradient.setDepth(-1) // Behind everything

        // Title text
        const title = this.add
            .text(centerX, centerY - 100, 'SUS-GAME', {
                fontSize: '96px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6,
            })
            .setOrigin(0.5)

        // Subtitle or tagline (optional)
        this.add
            .text(centerX, centerY, 'Recycle the trash, save the day!', {
                fontSize: '24px',
                stroke: '#000000',
                strokeThickness: 1,
                color: '#000',
            })
            .setOrigin(0.5)

        // Play button background (pill shape)
        const buttonWidth = 200
        const buttonHeight = 80
        const buttonRadius = buttonHeight / 2 // Full rounding for pill shape

        const playButtonBg = this.add.graphics()
        playButtonBg.fillStyle(0x27ae60, 1)
        playButtonBg.fillRoundedRect(
            -buttonWidth / 2,
            -buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            buttonRadius
        )
        playButtonBg.setPosition(centerX, centerY + 100)

        // Play button text
        const playButtonText = this.add
            .text(centerX, centerY + 100, 'PLAY', {
                fontSize: '48px',
                color: '#2ecc71',
            })
            .setOrigin(0.5)

        // Create interactive zone for the button
        const playButton = this.add
            .zone(centerX, centerY + 100, buttonWidth, buttonHeight)
            .setInteractive({ useHandCursor: true })

        // Play button hover effect
        playButton.on('pointerover', () => {
            this.audioManager.playButtonHover()
            playButtonBg.clear()
            playButtonBg.fillStyle(0x2ecc71, 1)
            playButtonBg.fillRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                buttonRadius
            )
            playButtonText.setStyle({ color: '#ffffff' })
            playButtonBg.setScale(1.05)
            playButtonText.setScale(1.05)
        })

        playButton.on('pointerout', () => {
            playButtonBg.clear()
            playButtonBg.fillStyle(0x27ae60, 1)
            playButtonBg.fillRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                buttonRadius
            )
            playButtonText.setStyle({ color: '#2ecc71' })
            playButtonBg.setScale(1)
            playButtonText.setScale(1)
        })

        // Play button click
        playButton.on('pointerdown', () => {
            this.audioManager.playButtonClick()
            playButtonBg.setScale(0.95)
            playButtonText.setScale(0.95)
        })

        playButton.on('pointerup', () => {
            playButtonBg.setScale(1.05)
            playButtonText.setScale(1.05)

            // Disable button to prevent multiple clicks
            playButton.removeInteractive()

            // Start circle shrink transition
            SceneTransitions.circleWipeOut(this, {
                onComplete: () => {
                    this.scene.start('PreloadScene')
                },
            })
        })

        // Also allow pressing SPACE or ENTER to start
        const spaceKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
        const enterKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        const startWithTransition = () => {
            // Disable keyboard to prevent multiple triggers
            spaceKey?.removeAllListeners()
            enterKey?.removeAllListeners()
            playButton.removeInteractive()

            SceneTransitions.circleWipeOut(this, {
                duration: 800,
                onComplete: () => {
                    this.scene.start('PreloadScene')
                },
            })
        }

        spaceKey?.on('down', startWithTransition)
        enterKey?.on('down', startWithTransition)

        // Add a subtle title animation
        this.tweens.add({
            targets: title,
            y: centerY - 110,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        })
    }
}
