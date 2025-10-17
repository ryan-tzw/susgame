import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Bin } from '../entities/Bin'
import { Trash } from '../entities/Trash'
import { TrashLoader, TrashAsset } from '../utils/TrashLoader'
import { DropoffBox } from '../entities/DropoffBox'

export class GameScene extends Phaser.Scene {
    private player!: Player
    private hearts: Phaser.GameObjects.Image[] = []
    private bins: Bin[] = []
    private carriedBin: Bin | null = null
    private spaceKey!: Phaser.Input.Keyboard.Key
    private eKey!: Phaser.Input.Keyboard.Key
    private trashItems: Trash[] = []
    private trashAssets: TrashAsset[] = []
    private nearbyTrash: Trash | null = null
    private dropoffBoxes: DropoffBox[] = []
    private drainTimer = 0
    private drainInterval = 60 // Frames between draining items (60 = 1 second at 60fps)

    constructor() {
        super({ key: 'GameScene' })
    }

    preload(): void {
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
        // Place these PNGs in public/assets/sprites/
        this.load.image(
            'waste_to_energy',
            'assets/sprites/waste_to_energy.png'
        )
        this.load.image('recycling_plant', 'assets/sprites/recycling_plant.png')
        this.load.image('donation_center', 'assets/sprites/donation_center.png')
    }

    private loadTrashSprites(): void {
        // TEMPORARY: Manually list your trash files here
        // Replace these arrays with your actual PNG filenames (without path)
        const greenTrashFiles: string[] = [
            // Example: 'banana.png', 'apple_core.png', 'food_waste.png'
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

    create(): void {
        // Create player at center of screen
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        )

        // Set up space key for interactions
        if (this.input.keyboard) {
            this.spaceKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )
            this.eKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            )
        }

        // Create bins at specific positions (left side of screen)
        const binStartX = 200
        const binStartY = this.cameras.main.centerY - 200
        const binSpacing = 150

        const greenBin = new Bin(this, binStartX, binStartY, 'green')
        const blueBin = new Bin(this, binStartX, binStartY + binSpacing, 'blue')
        const yellowBin = new Bin(
            this,
            binStartX,
            binStartY + binSpacing * 2,
            'yellow'
        )

        this.bins.push(greenBin, blueBin, yellowBin)

        // Create dropoff boxes (right side of screen)
        const dropoffStartX = this.cameras.main.width - 300
        const dropoffStartY = this.cameras.main.centerY - 250
        const dropoffSpacing = 250

        const greenDropoff = new DropoffBox(
            this,
            dropoffStartX,
            dropoffStartY,
            'green',
            'waste_to_energy'
        )
        const blueDropoff = new DropoffBox(
            this,
            dropoffStartX,
            dropoffStartY + dropoffSpacing,
            'blue',
            'recycling_plant'
        )
        const yellowDropoff = new DropoffBox(
            this,
            dropoffStartX,
            dropoffStartY + dropoffSpacing * 2,
            'yellow',
            'donation_center'
        )

        this.dropoffBoxes.push(greenDropoff, blueDropoff, yellowDropoff)

        // Set up collision detection between player and bins
        this.bins.forEach((bin) => {
            this.physics.add.overlap(this.player, bin, () => {
                // Interaction handled in update loop
            })
        })

        // Add instructional text
        this.add
            .text(
                16,
                16,
                'Arrow Keys/WASD: Move\nSPACE: Pick up/drop bin\nE: Collect trash',
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 10 },
                }
            )
            .setScrollFactor(0)
            .setDepth(100)

        // Create heart display (will be positioned below player in update)
        this.createHearts()

        // Spawn trash items
        this.spawnTrash()
    }

    private spawnTrash(): void {
        // Only spawn trash if we have loaded assets
        if (this.trashAssets.length === 0) {
            console.log(
                'No trash assets loaded. Add PNG files to trash folders.'
            )
            return
        }

        // Spawn random trash items across the map
        const numTrashItems = 15 // Total number of trash items to spawn
        const mapWidth = this.cameras.main.width
        const mapHeight = this.cameras.main.height

        for (let i = 0; i < numTrashItems; i++) {
            // Pick a random trash asset
            const randomAsset =
                this.trashAssets[
                    Phaser.Math.Between(0, this.trashAssets.length - 1)
                ]

            // Random position (avoiding edges and bin area)
            const x = Phaser.Math.Between(300, mapWidth - 100)
            const y = Phaser.Math.Between(100, mapHeight - 100)

            // Create trash item
            const trash = new Trash(
                this,
                x,
                y,
                randomAsset.binType,
                randomAsset.key
            )

            this.trashItems.push(trash)
        }
    }

    private createHearts(): void {
        // Create 5 hearts
        for (let i = 0; i < 5; i++) {
            const heart = this.add
                .image(0, 0, 'heart_filled')
                .setDepth(1000)
                .setScale(0.75) // Scale down if needed, adjust based on your heart sprite size
            this.hearts.push(heart)
        }
    }

    private updateHearts(): void {
        // Position hearts below the player
        const heartSpacing = 30 // Adjust based on your heart sprite size
        const totalWidth = (this.hearts.length - 1) * heartSpacing
        const startX = this.player.x - totalWidth / 2
        const yOffset = 80 // Position below player

        // Update each heart
        for (let i = 0; i < this.hearts.length; i++) {
            const heart = this.hearts[i]
            heart.setPosition(
                startX + i * heartSpacing,
                this.player.y + yOffset
            )

            // Show filled or empty heart based on current HP
            const textureKey =
                i < this.player.hp ? 'heart_filled' : 'heart_empty'

            // Only set texture if it exists and is different
            if (
                this.textures.exists(textureKey) &&
                heart.texture.key !== textureKey
            ) {
                heart.setTexture(textureKey)
            }
        }
    }

    update(): void {
        // Update player
        this.player.update()

        // Update bins
        this.bins.forEach((bin) => bin.update())

        // Update trash indicators
        this.trashItems.forEach((trash) => trash.updateIndicator())

        // Update heart display to follow player
        this.updateHearts()

        // Check for nearby trash (to show indicator)
        if (this.carriedBin) {
            this.checkNearbyTrash()
        }

        // Check for bin draining at dropoff boxes
        this.checkBinDraining()

        // Handle bin pickup/drop with SPACE key
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.handleBinInteraction()
        }

        // Handle trash collection with E key
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            this.handleTrashCollection()
        }
    }

    private checkBinDraining(): void {
        // Check each bin to see if it's on a dropoff box
        for (const bin of this.bins) {
            if (bin.isPickedUp || bin.isEmpty()) {
                bin.isDraining = false
                continue
            }

            // Check if bin is on the correct dropoff box
            let isOnCorrectDropoff = false
            for (const dropoff of this.dropoffBoxes) {
                if (
                    dropoff.boxType === bin.binType &&
                    dropoff.checkBinOverlap(bin.x, bin.y)
                ) {
                    isOnCorrectDropoff = true
                    break
                }
            }

            if (isOnCorrectDropoff) {
                bin.isDraining = true

                // Drain items over time
                this.drainTimer++
                if (this.drainTimer >= this.drainInterval) {
                    bin.drainItem()
                    this.drainTimer = 0
                    // TODO: Add score/points when draining
                }
            } else {
                bin.isDraining = false
            }
        }
    }

    private checkNearbyTrash(): void {
        if (!this.carriedBin) return

        let closestTrash: Trash | null = null
        let closestDistance = Infinity

        // Find the closest trash within range
        for (const trash of this.trashItems) {
            if (trash.isCollected) continue

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                trash.x,
                trash.y
            )

            // Within pickup range (80 pixels)
            if (distance < 80 && distance < closestDistance) {
                closestTrash = trash
                closestDistance = distance
            }
        }

        // Update indicators
        this.trashItems.forEach((trash) => {
            trash.showIndicator(trash === closestTrash)
        })

        this.nearbyTrash = closestTrash
    }

    private handleTrashCollection(): void {
        if (!this.carriedBin || !this.nearbyTrash) return

        const trash = this.nearbyTrash

        // Check if bin is full
        if (this.carriedBin.isFull()) {
            console.log('Bin is full! Go deposit it at the dropoff box.')
            return
        }

        // Check if trash matches the carried bin
        if (trash.binType === this.carriedBin.binType) {
            // Correct trash! Add to bin
            const added = this.carriedBin.addItem()
            if (added) {
                trash.collect()
                const index = this.trashItems.indexOf(trash)
                if (index > -1) {
                    this.trashItems.splice(index, 1)
                }
                this.nearbyTrash = null
                // TODO: Add visual/audio feedback
            }
        } else {
            // Wrong trash! Lose HP
            trash.collect()
            const index = this.trashItems.indexOf(trash)
            if (index > -1) {
                this.trashItems.splice(index, 1)
            }
            this.nearbyTrash = null
            this.player.takeDamage(1)

            // TODO: Add damage visual/audio feedback
            console.log(`Wrong trash! Lost 1 HP. Current HP: ${this.player.hp}`)

            // Check for game over
            if (this.player.hp <= 0) {
                this.handleGameOver()
            }
        }
    }

    private handleGameOver(): void {
        // TODO: Show game over screen
        console.log('GAME OVER!')
        // For now, just restart the scene
        this.scene.restart()
    }

    private handleBinInteraction(): void {
        if (this.carriedBin) {
            // Drop the bin at player's current position
            this.carriedBin.drop(this.player.x, this.player.y)
            this.player.dropBin()
            this.carriedBin = null
        } else {
            // Try to pick up a nearby bin
            for (const bin of this.bins) {
                if (bin.isPickedUp) continue

                // Check if player is close enough to the bin
                const distance = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    bin.x,
                    bin.y
                )

                if (distance < 80) {
                    // Pick up the bin
                    bin.pickUp(this.player)
                    this.player.pickUpBin(bin.binType)
                    this.carriedBin = bin
                    break
                }
            }
        }
    }
}
