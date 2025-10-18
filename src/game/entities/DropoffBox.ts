import Phaser from 'phaser'
import { BinType } from './Bin'

export class DropoffBox extends Phaser.GameObjects.Container {
    public boxType: BinType
    public isActive = false
    private boxSize: number
    private boxGraphics: Phaser.GameObjects.Graphics

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        boxType: BinType,
        decorationImageKey: string
    ) {
        super(scene, x, y)

        this.boxType = boxType
        this.boxSize = 120

        // Pastel colors for each box type
        const colorMap = {
            green: 0xb8f4b8, // Pastel green
            blue: 0xb8d4f4, // Pastel blue
            yellow: 0xfff4b8, // Pastel yellow
        }

        // Create rounded rectangle using Graphics
        this.boxGraphics = scene.add.graphics()
        this.boxGraphics.fillStyle(colorMap[boxType], 1)
        this.boxGraphics.fillRoundedRect(
            -this.boxSize / 2,
            -this.boxSize / 2,
            this.boxSize,
            this.boxSize,
            20 // Corner radius
        )

        // Add graphics to container
        this.add(this.boxGraphics)

        // Add to scene
        scene.add.existing(this)

        // Set depth below player
        this.setDepth(1)

        // Add decoration image next to the box
        const decorationOffset = 250
        scene.add
            .image(x + decorationOffset, y, decorationImageKey)
            .setDepth(5)
            .setScale(1) // Adjust as needed
    }

    public checkBinOverlap(binX: number, binY: number): boolean {
        // Check if bin position is within dropoff box bounds
        const halfSize = this.boxSize / 2
        const isWithinX = binX >= this.x - halfSize && binX <= this.x + halfSize
        const isWithinY = binY >= this.y - halfSize && binY <= this.y + halfSize
        return isWithinX && isWithinY
    }
}
