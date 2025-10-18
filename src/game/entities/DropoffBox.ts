import Phaser from 'phaser'
import { BinType } from './Bin'

export class DropoffBox extends Phaser.GameObjects.Rectangle {
    public boxType: BinType
    public isActive = false

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        boxType: BinType,
        decorationImageKey: string
    ) {
        // Pastel colors for each box type
        const colorMap = {
            green: 0xb8f4b8, // Pastel green
            blue: 0xb8d4f4, // Pastel blue
            yellow: 0xfff4b8, // Pastel yellow
        }

        const boxSize = 120
        super(scene, x, y, boxSize, boxSize, colorMap[boxType])

        this.boxType = boxType

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
        const bounds = this.getBounds()
        return bounds.contains(binX, binY)
    }
}
