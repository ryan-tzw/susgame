import Phaser from 'phaser'
import { BinType } from '../entities/Bin'

export interface TrashAsset {
    key: string
    path: string
    binType: BinType
}

/**
 * Loads all trash sprites from the organized folder structure:
 * - trash/green/*.png → green bin trash
 * - trash/blue/*.png → blue bin trash
 * - trash/yellow/*.png → yellow bin trash
 */
export class TrashLoader {
    /**
     * Get all trash assets that should be loaded
     * Note: In a real scenario, you'd dynamically read the folder.
     * For now, this needs to be manually updated when adding new trash images.
     */
    static getTrashAssets(): TrashAsset[] {
        // TODO: Add your actual trash PNG filenames here
        // Example format:
        const assets: TrashAsset[] = [
            // Green bin trash (waste-to-energy)
            // { key: 'trash_green_banana', path: 'assets/sprites/trash/green/banana.png', binType: 'green' },
            // { key: 'trash_green_apple', path: 'assets/sprites/trash/green/apple.png', binType: 'green' },
            // Blue bin trash (recycling)
            // { key: 'trash_blue_bottle', path: 'assets/sprites/trash/blue/bottle.png', binType: 'blue' },
            // { key: 'trash_blue_paper', path: 'assets/sprites/trash/blue/paper.png', binType: 'blue' },
            // Yellow bin trash (donation)
            // { key: 'trash_yellow_shirt', path: 'assets/sprites/trash/yellow/shirt.png', binType: 'yellow' },
            // { key: 'trash_yellow_toy', path: 'assets/sprites/trash/yellow/toy.png', binType: 'yellow' },
        ]

        return assets
    }

    /**
     * Automatically generates trash asset list from folder contents
     * Call this after you add PNG files to the trash folders
     */
    static generateFromFiles(
        greenFiles: string[],
        blueFiles: string[],
        yellowFiles: string[]
    ): TrashAsset[] {
        const assets: TrashAsset[] = []

        // Process green bin trash
        greenFiles.forEach((filename) => {
            const name = filename.replace('.png', '')
            assets.push({
                key: `trash_green_${name}`,
                path: `assets/sprites/trash/green/${filename}`,
                binType: 'green',
            })
        })

        // Process blue bin trash
        blueFiles.forEach((filename) => {
            const name = filename.replace('.png', '')
            assets.push({
                key: `trash_blue_${name}`,
                path: `assets/sprites/trash/blue/${filename}`,
                binType: 'blue',
            })
        })

        // Process yellow bin trash
        yellowFiles.forEach((filename) => {
            const name = filename.replace('.png', '')
            assets.push({
                key: `trash_yellow_${name}`,
                path: `assets/sprites/trash/yellow/${filename}`,
                binType: 'yellow',
            })
        })

        return assets
    }

    /**
     * Load all trash sprites into a Phaser scene
     */
    static loadTrashSprites(scene: Phaser.Scene, assets: TrashAsset[]): void {
        assets.forEach((asset) => {
            scene.load.image(asset.key, asset.path)
        })
    }
}
