import Phaser from 'phaser'

export type BinType = 'green' | 'blue' | 'yellow'

export class Bin extends Phaser.Physics.Arcade.Sprite {
    public binType: BinType
    public isPickedUp = false
    private player: Phaser.Physics.Arcade.Sprite | null = null

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
        this.player = null

        // Re-enable physics
        if (this.body) {
            this.body.enable = true
        }

        // Set position where dropped
        this.setPosition(x, y)

        // Reset depth
        this.setDepth(10)
    }

    update(): void {
        // If picked up, follow player and position on their head
        if (this.isPickedUp && this.player) {
            const yOffset = -70 // Position above player's head (adjust as needed)
            this.setPosition(this.player.x, this.player.y + yOffset)
        }
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
