import Phaser from 'phaser'
import { BinType } from './Bin'
import { GameConstants } from '../config/GameConstants'

export class Trash extends Phaser.Physics.Arcade.Sprite {
    public binType: BinType // Which bin this trash belongs to
    public isCollected = false
    public trashKey: string // Unique key for this trash sprite
    private indicator: Phaser.GameObjects.Image | null = null
    public isNearPlayer = false
    private hoverOffset = 0 // For animation
    private canBePickedUp = true // Can this trash be picked up yet?

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
        this.setScale(GameConstants.TRASH.SCALE)

        // Set depth so trash appears below the player
        this.setDepth(GameConstants.TRASH.DEPTH)

        // Create indicator arrow (hidden by default)
        this.indicator = scene.add
            .image(0, 0, 'arrow')
            .setOrigin(0.5)
            .setScale(GameConstants.TRASH.INDICATOR.SCALE)
            .setVisible(false)
            .setDepth(1002)
    }

    public showIndicator(show: boolean): void {
        // Only show indicator if trash can be picked up
        this.isNearPlayer = show && this.canBePickedUp
        if (this.indicator) {
            this.indicator.setVisible(this.isNearPlayer)
        }
    }

    public setPickupEnabled(enabled: boolean): void {
        this.canBePickedUp = enabled
        // Hide indicator if disabling pickup
        if (!enabled && this.indicator) {
            this.indicator.setVisible(false)
            this.isNearPlayer = false
        }
    }

    public canPickup(): boolean {
        return this.canBePickedUp && !this.isCollected
    }

    public updateIndicator(): void {
        if (this.indicator && this.isNearPlayer) {
            // Update hover animation using sin wave
            this.hoverOffset += GameConstants.TRASH.HOVER.SPEED
            const hoverAmount =
                Math.sin(this.hoverOffset) * GameConstants.TRASH.HOVER.AMPLITUDE

            // Position arrow above trash with hover animation
            this.indicator.setPosition(
                this.x,
                this.y + GameConstants.TRASH.INDICATOR.OFFSET_Y + hoverAmount
            )
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
