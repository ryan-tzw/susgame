import Phaser from 'phaser'
import { TrashLoader, TrashAsset } from '../utils/TrashLoader'

export class PreloadScene extends Phaser.Scene {
    private trashAssets: TrashAsset[] = []

    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload(): void {
        // Create loading bar
        this.createLoadingBar()

        // Load player atlas
        this.load.atlas(
            'player',
            'assets/sprites/player.png',
            'assets/sprites/player.json'
        )

        // Load heart sprites
        this.load.image('heart_filled', 'assets/sprites/heart_filled.png')
        this.load.image('heart_empty', 'assets/sprites/heart_empty.png')

        // Load arrow indicator
        this.load.image('arrow', 'assets/sprites/arrow.png')

        // Load bin sprites
        this.load.image('green_bin', 'assets/sprites/green_bin.png')
        this.load.image('blue_bin', 'assets/sprites/blue_bin.png')
        this.load.image('yellow_bin', 'assets/sprites/yellow_bin.png')

        // Load trash sprites from organized folders
        this.loadTrashSprites()

        // Load dropoff decoration images
        this.load.image('waste_to_energy', 'assets/sprites/waste_to_energy.png')
        this.load.image('recycling_plant', 'assets/sprites/recycling_plant.png')
        this.load.image('donation_center', 'assets/sprites/donation_center.png')

        // Load Tiled map and tileset
        this.load.image(
            'spritesheet',
            'assets/sprites/background/spritesheet.png'
        )
        this.load.tilemapTiledJSON('map', 'assets/sprites/background/map.tmj')
    }

    create(): void {
        // Store trash assets in registry so GameScene can access them
        this.registry.set('trashAssets', this.trashAssets)

        // Start the game scene
        this.scene.start('GameScene')
    }

    private createLoadingBar(): void {
        const width = this.cameras.main.width
        const height = this.cameras.main.height

        // Background
        const background = this.add.rectangle(
            width / 2,
            height / 2,
            400,
            50,
            0x222222
        )

        // Loading bar
        const loadingBar = this.add.rectangle(
            width / 2 - 200 + 10,
            height / 2,
            0,
            30,
            0x4ade80
        )
        loadingBar.setOrigin(0, 0.5)

        // Loading text
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 50,
            'Loading...',
            {
                fontSize: '24px',
                color: '#ffffff',
            }
        )
        loadingText.setOrigin(0.5)

        // Percentage text
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            color: '#ffffff',
        })
        percentText.setOrigin(0.5)

        // Update loading bar as assets load
        this.load.on('progress', (value: number) => {
            loadingBar.width = 380 * value
            percentText.setText(`${Math.floor(value * 100)}%`)
        })

        // Clean up when loading is complete
        this.load.on('complete', () => {
            loadingBar.destroy()
            background.destroy()
            loadingText.destroy()
            percentText.destroy()
        })
    }

    private loadTrashSprites(): void {
        // TEMPORARY: Manually list your trash files here
        // Replace these arrays with your actual PNG filenames (without path)
        const greenTrashFiles: string[] = ['apple.png']

        const blueTrashFiles: string[] = [
            'cardboard_box.png',
            'coke_can.png',
            'plastic_bottle.png',
            'milk_carton.png',
            'takeaway_box.png',
            'plastic_bag.png',
        ]

        const yellowTrashFiles: string[] = [
            'shirt.png',
            'pants.png',
            'shoe.png',
        ]

        // Generate asset list from filenames
        this.trashAssets = TrashLoader.generateFromFiles(
            greenTrashFiles,
            blueTrashFiles,
            yellowTrashFiles
        )

        // Load all trash sprites
        TrashLoader.loadTrashSprites(this, this.trashAssets)
    }
}
