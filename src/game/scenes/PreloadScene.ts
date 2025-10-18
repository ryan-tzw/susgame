import Phaser from 'phaser'
import { TrashLoader, TrashAsset } from '../utils/TrashLoader'

export class PreloadScene extends Phaser.Scene {
    private trashAssets: TrashAsset[] = []

    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload(): void {
        // Don't show loading bar to prevent flash when transitioning
        // this.createLoadingBar()

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

        // Load audio files
        this.loadAudio()
    }

    create(): void {
        // Disable anti-aliasing on the tilemap spritesheet to prevent tile bleeding
        const tilemapTexture = this.textures.get('spritesheet')
        if (tilemapTexture) {
            tilemapTexture.setFilter(Phaser.Textures.FilterMode.NEAREST)
        }

        // Store trash assets in registry so GameScene can access them
        this.registry.set('trashAssets', this.trashAssets)

        // Start the game scene
        this.scene.start('GameScene')
    }

    private loadTrashSprites(): void {
        // TEMPORARY: Manually list your trash files here
        // Replace these arrays with your actual PNG filenames (without path)
        const greenTrashFiles: string[] = [
            'apple.png',
            'tissue.png',
            'paper_plate.png',
            'disposable_chopsticks.png',
            'paper_cup.png',
        ]

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
            'teddy.png',
            'book.png',
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

    private loadAudio(): void {
        // Note: game_music is already loaded in BootScene and playing

        // Load sound effects
        this.load.audio('trash_pickup', 'assets/audio/sfx/trash_pickup.mp3')
        this.load.audio(
            'correct_deposit',
            'assets/audio/sfx/correct_deposit.mp3'
        )
        this.load.audio('wrong_deposit', 'assets/audio/sfx/wrong_deposit.mp3')
        this.load.audio('player_damage', 'assets/audio/sfx/player_damage.mp3')
        this.load.audio('button_hover', 'assets/audio/sfx/button_hover.mp3')
        this.load.audio('button_click', 'assets/audio/sfx/button_click.mp3')
        this.load.audio('victory', 'assets/audio/sfx/victory.mp3')
        this.load.audio('game_over', 'assets/audio/sfx/game_over.mp3')
    }
}
