import Phaser from 'phaser'
import { Player } from '../entities/Player'

export class GameScene extends Phaser.Scene {
    private player!: Player
    private hearts: Phaser.GameObjects.Image[] = []

    constructor() {
        super({ key: 'GameScene' })
    }

    preload(): void {
        // Load player atlas
        this.load.atlas(
            'player',
            'assets/sprites/player.png',
            'assets/sprites/player.json'
        )

        // Load heart sprites
        // Place heart_filled.png and heart_empty.png in public/assets/sprites/
        this.load.image('heart_filled', 'assets/sprites/heart_filled.png')
        this.load.image('heart_empty', 'assets/sprites/heart_empty.png')

        // TODO: Load other assets (bins, trash, dropoff boxes, etc.)
    }

    create(): void {
        // Create player at center of screen
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        )

        // Add instructional text
        this.add
            .text(16, 16, 'Use arrow keys to move\nPress SPACE to interact', {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 },
            })
            .setScrollFactor(0)
            .setDepth(100)

        // Create heart display (will be positioned above player in update)
        this.createHearts()
    }

    private createHearts(): void {
        // Create 5 hearts
        for (let i = 0; i < 5; i++) {
            const heart = this.add
                .image(0, 0, 'heart_filled')
                .setDepth(1000)
                .setScale(0.75) // Scale down if needed, adjust based on your heart sprite size
            this.hearts.push(heart)
        }
    }

    private updateHearts(): void {
        // Position hearts above the player
        const heartSpacing = 30 // Adjust based on your heart sprite size
        const totalWidth = (this.hearts.length - 1) * heartSpacing
        const startX = this.player.x - totalWidth / 2
        const yOffset = -80 // Position above player

        // Update each heart
        for (let i = 0; i < this.hearts.length; i++) {
            const heart = this.hearts[i]
            heart.setPosition(
                startX + i * heartSpacing,
                this.player.y + yOffset
            )

            // Show filled or empty heart based on current HP
            if (i < this.player.hp) {
                heart.setTexture('heart_filled')
            } else {
                heart.setTexture('heart_empty')
            }
        }
    }

    update(): void {
        // Update player
        this.player.update()

        // Update heart display to follow player
        this.updateHearts()
    }
}
