import Phaser from 'phaser'
import { BinType } from './Bin'

export class Trash extends Phaser.Physics.Arcade.Sprite {
    public binType: BinType // Which bin this trash belongs to
    public isCollected = false
    public trashKey: string // Unique key for this trash sprite
    private indicator: Phaser.GameObjects.Image | null = null
    public isNearPlayer = false
    private hoverOffset = 0 // For animation

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        binType: BinType,
        trashKey: string
    ) {
        super(scene, x, y, trashKey)

        this.binType = binType
        this.trashKey = trashKey

        // Add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // Set up physics - trash is static
        this.setImmovable(true)

        // Scale down
        this.setScale(0.65)

        // Set depth so trash appears below the player
        this.setDepth(2)

        // Create indicator arrow (hidden by default)
        this.indicator = scene.add
            .image(0, 0, 'arrow')
            .setOrigin(0.5)
            .setScale(1) // Adjust scale as needed for your arrow size
            .setVisible(false)
            .setDepth(1002)
    }

    public showIndicator(show: boolean): void {
        this.isNearPlayer = show
        if (this.indicator) {
            this.indicator.setVisible(show)
        }
    }

    public updateIndicator(): void {
        if (this.indicator && this.isNearPlayer) {
            // Update hover animation using sin wave
            this.hoverOffset += 0.1 // Speed of animation
            const hoverAmount = Math.sin(this.hoverOffset) * 5 // 5 pixels up/down

            // Position arrow above trash with hover animation
            this.indicator.setPosition(this.x, this.y - 50 + hoverAmount)
        }
    }

    public collect(): void {
        this.isCollected = true
        if (this.indicator) {
            this.indicator.destroy()
        }
        this.destroy()
    }

    public getTrashTypeDescription(): string {
        // This can be expanded later for specific trash names
        return `${this.binType} bin trash`
    }
}
