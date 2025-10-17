import Phaser from 'phaser'
import { GameConstants } from '../config/GameConstants'

export type BinType = 'green' | 'blue' | 'yellow'

export class Bin extends Phaser.Physics.Arcade.Sprite {
    public binType: BinType
    public isPickedUp = false
    private player: Phaser.Physics.Arcade.Sprite | null = null
    private playerContainer: Phaser.GameObjects.Container | null = null
    public itemCount = 0
    public maxCapacity = GameConstants.BIN.MAX_CAPACITY
    public isDraining = false
    private capacityMeter: Phaser.GameObjects.Container | null = null
    private meterBackground: Phaser.GameObjects.Rectangle | null = null
    private meterFill: Phaser.GameObjects.Rectangle | null = null

    constructor(scene: Phaser.Scene, x: number, y: number, binType: BinType) {
        // Map bin type to sprite key
        const spriteKey = `${binType}_bin`
        super(scene, x, y, spriteKey)

        this.binType = binType

        // Add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // Set up physics - bins are static objects
        this.setImmovable(true)

        // Set depth so bin appears correctly
        this.setDepth(10)

        // Create capacity meter
        this.createCapacityMeter(scene)
    }

    private createCapacityMeter(scene: Phaser.Scene): void {
        const meterWidth = GameConstants.BIN.METER.WIDTH
        const meterHeight = GameConstants.BIN.METER.HEIGHT

        // Background (gray)
        this.meterBackground = scene.add
            .rectangle(0, 0, meterWidth, meterHeight, 0x555555)
            .setOrigin(0, 0.5)

        // Fill (color based on bin type)
        const fillColors = {
            green: GameConstants.BIN.COLORS.GREEN,
            blue: GameConstants.BIN.COLORS.BLUE,
            yellow: GameConstants.BIN.COLORS.YELLOW,
        }

        this.meterFill = scene.add
            .rectangle(0, 0, 0, meterHeight, fillColors[this.binType])
            .setOrigin(0, 0.5)

        // Container to hold both
        this.capacityMeter = scene.add.container(0, 0, [
            this.meterBackground,
            this.meterFill,
        ])
        this.capacityMeter.setDepth(1003)
        this.capacityMeter.setVisible(false)
    }

    private updateCapacityMeter(): void {
        if (!this.capacityMeter || !this.meterFill || !this.meterBackground)
            return

        // Position above bin
        const yOffset = GameConstants.BIN.METER.OFFSET_Y
        this.capacityMeter.setPosition(
            this.x - this.meterBackground.width / 2,
            this.y + yOffset
        )

        // Update fill width based on item count
        const fillPercentage = this.itemCount / this.maxCapacity
        this.meterFill.width = this.meterBackground.width * fillPercentage

        // Show meter only when bin has items
        this.capacityMeter.setVisible(this.itemCount > 0)
    }

    public pickUp(
        player: Phaser.Physics.Arcade.Sprite,
        container: Phaser.GameObjects.Container
    ): void {
        this.isPickedUp = true
        this.player = player

        // Disable physics when picked up
        if (this.body) {
            this.body.enable = false
        }

        // Remove from scene and add to container at relative position
        const yOffset = -70 // Position above player (player is at 0,0 in container)
        this.setPosition(0, yOffset)
        container.add(this)

        // Add capacity meter to container as well
        if (this.capacityMeter) {
            container.add(this.capacityMeter)
        }

        // Increase depth to appear above player (within container)
        this.setDepth(1)
    }

    public drop(
        container: Phaser.GameObjects.Container,
        worldX: number,
        worldY: number
    ): void {
        this.isPickedUp = false
        // Don't set player to null - we need it for depth sorting!

        // Remove from container and add back to scene
        container.remove(this)
        this.scene.add.existing(this)

        // Remove capacity meter from container and add back to scene
        if (this.capacityMeter) {
            container.remove(this.capacityMeter)
        }

        // Re-enable physics
        if (this.body) {
            this.body.enable = true
        }

        // Set position where dropped (in world coordinates)
        this.setPosition(worldX, worldY)

        // Reset depth (will be updated by depth sorting logic)
        this.setDepth(10)
    }

    update(): void {
        // Position is now handled by container when picked up, no need to update
        // Just handle depth sorting when not picked up
        if (!this.isPickedUp && this.playerContainer) {
            // Update depth based on player container position for depth illusion
            // If player is below the bin, bin should be behind (lower depth)
            // If player is above the bin, bin should be in front (higher depth)
            if (this.playerContainer.y > this.y) {
                // Player is below bin, so bin should be painted first (lower depth)
                this.setDepth(5)
            } else {
                // Player is above bin, so bin should be painted last (higher depth)
                this.setDepth(15)
            }
        }

        // Update capacity meter position
        this.updateCapacityMeter()
    }

    public setPlayer(
        player: Phaser.Physics.Arcade.Sprite,
        container: Phaser.GameObjects.Container
    ): void {
        this.player = player
        this.playerContainer = container
    }

    public addItem(): boolean {
        if (this.itemCount >= this.maxCapacity) {
            return false // Bin is full
        }
        this.itemCount++
        return true
    }

    public drainItem(): boolean {
        if (this.itemCount <= 0) {
            return false // Bin is empty
        }
        this.itemCount--
        return true
    }

    public isEmpty(): boolean {
        return this.itemCount === 0
    }

    public isFull(): boolean {
        return this.itemCount >= this.maxCapacity
    }

    public getBinTypeFullName(): string {
        switch (this.binType) {
            case 'green':
                return 'Waste-to-Energy'
            case 'blue':
                return 'Recycling'
            case 'yellow':
                return 'Donation'
        }
    }
}
