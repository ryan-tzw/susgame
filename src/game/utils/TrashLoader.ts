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
     * Generates trash asset list from filenames
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
