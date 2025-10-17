import Phaser from 'phaser'
import { Player } from '../entities/Player'

export class GameScene extends Phaser.Scene {
    private player!: Player

    constructor() {
        super({ key: 'GameScene' })
    }

    preload(): void {
        // Load player atlas
        // Make sure to place your player spritesheet and JSON file in public/assets/sprites/
        // Example filenames: player.png and player.json
        this.load.atlas(
            'player',
            'assets/sprites/player.png',
            'assets/sprites/player.json'
        )

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

        // Add HP display
        this.add
            .text(16, 100, '', {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 },
            })
            .setScrollFactor(0)
            .setDepth(100)
            .setName('hpText')
    }

    update(): void {
        // Update player
        this.player.update()

        // Update HP display
        const hpText = this.children.getByName(
            'hpText'
        ) as Phaser.GameObjects.Text
        if (hpText) {
            hpText.setText(`HP: ${this.player.hp}/${this.player.maxHp}`)
        }
    }
}
