import Phaser from 'phaser'

export type BinType = 'green' | 'blue' | 'yellow'

export class Bin extends Phaser.Physics.Arcade.Sprite {
    public binType: BinType
    public isPickedUp = false
    private player: Phaser.Physics.Arcade.Sprite | null = null
    public itemCount = 0
    public maxCapacity = 10
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
        const meterWidth = 60
        const meterHeight = 8

        // Background (gray)
        this.meterBackground = scene.add
            .rectangle(0, 0, meterWidth, meterHeight, 0x555555)
            .setOrigin(0, 0.5)

        // Fill (color based on bin type)
        const fillColors = {
            green: 0x4ade80,
            blue: 0x60a5fa,
            yellow: 0xfbbf24,
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
        const yOffset = -50
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

    public pickUp(player: Phaser.Physics.Arcade.Sprite): void {
        this.isPickedUp = true
        this.player = player

        // Disable physics when picked up
        if (this.body) {
            this.body.enable = false
        }

        // Increase depth to appear above player
        this.setDepth(1001)
    }

    public drop(x: number, y: number): void {
        this.isPickedUp = false
        // Don't set player to null - we need it for depth sorting!

        // Re-enable physics
        if (this.body) {
            this.body.enable = true
        }

        // Set position where dropped
        this.setPosition(x, y)

        // Reset depth (will be updated by depth sorting logic)
        this.setDepth(10)
    }

    update(): void {
        // If picked up, follow player and position on their head
        if (this.isPickedUp && this.player) {
            const yOffset = -70 // Position above player's head (adjust as needed)
            this.setPosition(this.player.x, this.player.y + yOffset)
        } else if (this.player) {
            // Update depth based on player position for depth illusion
            // If player is below the bin (player.y > bin.y), bin should be behind (lower depth)
            // If player is above the bin (player.y < bin.y), bin should be in front (higher depth)
            if (this.player.y > this.y) {
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

    public setPlayer(player: Phaser.Physics.Arcade.Sprite): void {
        this.player = player
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
