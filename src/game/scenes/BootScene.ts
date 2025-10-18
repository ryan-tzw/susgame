import Phaser from 'phaser'
import { AudioManager } from '../managers/AudioManager'
import { TrashLoader, TrashAsset } from '../utils/TrashLoader'

/**
 * Boot scene - loads ALL assets before showing main menu
 */
export class BootScene extends Phaser.Scene {
    private trashAssets: TrashAsset[] = []

    constructor() {
        super({ key: 'BootScene' })
    }

    preload(): void {
        const width = this.cameras.main.width
        const height = this.cameras.main.height

        // Show simple loading text
        const loadingText = this.add
            .text(width / 2, height / 2, 'Loading...', {
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        // === AUDIO ===
        // Load game music to start playing immediately
        this.load.audio('game_music', 'assets/audio/music/game_music.wav')

        // Load UI sound effects
        this.load.audio('button_hover', 'assets/audio/sfx/button_hover.mp3')
        this.load.audio('button_click', 'assets/audio/sfx/button_click.mp3')

        // Load game sound effects
        this.load.audio('trash_pickup', 'assets/audio/sfx/trash_pickup.mp3')
        this.load.audio(
            'correct_deposit',
            'assets/audio/sfx/correct_deposit.mp3'
        )
        this.load.audio('wrong_deposit', 'assets/audio/sfx/wrong_deposit.mp3')
        this.load.audio('player_damage', 'assets/audio/sfx/player_damage.mp3')
        this.load.audio('victory', 'assets/audio/sfx/victory.mp3')
        this.load.audio('game_over', 'assets/audio/sfx/game_over.mp3')

        // === PLAYER ===
        this.load.atlas(
            'player',
            'assets/sprites/player.png',
            'assets/sprites/player.json'
        )

        // === UI SPRITES ===
        this.load.image('heart_filled', 'assets/sprites/heart_filled.png')
        this.load.image('heart_empty', 'assets/sprites/heart_empty.png')
        this.load.image('arrow', 'assets/sprites/arrow.png')

        // === BIN SPRITES ===
        this.load.image('green_bin', 'assets/sprites/green_bin.png')
        this.load.image('blue_bin', 'assets/sprites/blue_bin.png')
        this.load.image('yellow_bin', 'assets/sprites/yellow_bin.png')

        // === TRASH SPRITES ===
        this.loadTrashSprites()

        // === DROPOFF DECORATIONS ===
        this.load.image('waste_to_energy', 'assets/sprites/waste_to_energy.png')
        this.load.image('recycling_plant', 'assets/sprites/recycling_plant.png')
        this.load.image('donation_center', 'assets/sprites/donation_center.png')

        // === TILEMAP ===
        this.load.image(
            'spritesheet',
            'assets/sprites/background/spritesheet.png'
        )
        this.load.tilemapTiledJSON('map', 'assets/sprites/background/map.tmj')

        // Update loading text
        this.load.on('progress', (value: number) => {
            loadingText.setText(`Loading... ${Math.floor(value * 100)}%`)
        })

        // Clean up when done
        this.load.on('complete', () => {
            loadingText.destroy()
        })
    }

    create(): void {
        // Disable anti-aliasing on the tilemap spritesheet to prevent tile bleeding
        const tilemapTexture = this.textures.get('spritesheet')
        if (tilemapTexture) {
            tilemapTexture.setFilter(Phaser.Textures.FilterMode.NEAREST)
        }

        // Store trash assets in registry so GameScene can access them
        this.registry.set('trashAssets', this.trashAssets)

        // Initialize global AudioManager and start background music
        const audioManager = AudioManager.getInstance(this)
        audioManager.playMusic('game_music')

        // Start the main menu
        this.scene.start('MainMenuScene')
    }

    private loadTrashSprites(): void {
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
}
