import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Bin } from '../entities/Bin'
import { Trash } from '../entities/Trash'
import { DropoffBox } from '../entities/DropoffBox'
import { SpawnManager } from '../managers/SpawnManager'
import { TilemapManager } from '../managers/TilemapManager'
import { InputManager, GameAction } from '../managers/InputManager'
import { UIManager } from '../managers/UIManager'
import { GameConstants } from '../config/GameConstants'

export class GameScene extends Phaser.Scene {
    private player!: Player
    private playerContainer!: Phaser.GameObjects.Container
    private bins: Bin[] = []
    private carriedBin: Bin | null = null
    private nearbyTrash: Trash | null = null
    private dropoffBoxes: DropoffBox[] = []
    private drainTimer = 0
    private drainInterval = GameConstants.BIN.DRAIN_INTERVAL_FRAMES
    private spawnManager!: SpawnManager
    private tilemapManager!: TilemapManager
    private inputManager!: InputManager
    private uiManager!: UIManager

    constructor() {
        super({ key: 'GameScene' })
    }

    create(): void {
        // Get trash assets from registry (loaded in PreloadScene)
        const trashAssets = this.registry.get('trashAssets') || []

        // Set up tilemap (handles terrain, collision, spawn zones)
        this.tilemapManager = new TilemapManager(
            this,
            'map',
            'tileset',
            'spritesheet'
        )

        // Get world dimensions from tilemap
        const { width: worldWidth, height: worldHeight } =
            this.tilemapManager.getDimensions()
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight)

        // Create player at center of world
        this.player = new Player(this, 0, 0) // Position at 0,0 relative to container

        // Create player container and add player to it
        this.playerContainer = this.add.container(
            worldWidth / 2,
            worldHeight / 2
        )
        this.playerContainer.setDepth(10) // Player layer depth
        this.playerContainer.add(this.player)

        // Give player reference to its container so it can move it
        this.player.setContainer(this.playerContainer)

        // Add physics body to container and set up collision with terrain
        this.physics.add.existing(this.playerContainer)
        const containerBody = this.playerContainer
            .body as Phaser.Physics.Arcade.Body
        if (containerBody) {
            containerBody.setSize(32, 32) // Adjust collision box size
            containerBody.setOffset(-16, -16) // Center it
        }
        this.tilemapManager.addCollision(this.playerContainer)

        // Set up camera to follow the container instead
        this.cameras.main.startFollow(this.playerContainer)
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
        this.cameras.main.setZoom(1)
        this.cameras.main.setRoundPixels(false)

        // Set up input manager and subscribe to actions
        this.inputManager = new InputManager(this)
        this.inputManager.on(
            GameAction.INTERACT,
            this.handleBinInteraction,
            this
        )
        this.inputManager.on(
            GameAction.COLLECT,
            this.handleTrashCollection,
            this
        )

        // Initialize spawn manager with terrain layer for spawn validation
        this.spawnManager = new SpawnManager(
            this,
            trashAssets,
            worldWidth,
            worldHeight,
            this.tilemapManager.getTerrainLayer()
        )

        // Spawn bins using spawn manager
        this.bins = this.spawnManager.spawnBins(
            this.player,
            this.playerContainer
        )

        // Spawn dropoff boxes using spawn manager
        this.dropoffBoxes = this.spawnManager.spawnDropoffBoxes()

        // Set up collision detection between player and bins
        this.bins.forEach((bin) => {
            this.physics.add.overlap(this.player, bin, () => {
                // Interaction handled in update loop
            })
        })

        // Initialize UI manager (handles hearts, score, instructions, overlays)
        this.uiManager = new UIManager(this, this.player, this.playerContainer)

        // Spawn initial trash items (start with less, more will spawn over time)
        this.spawnManager.spawnInitialTrash(GameConstants.SPAWN.INITIAL_COUNT)
    }

    update(): void {
        // Update player (handles input and moves container)
        this.player.update()

        // Update UI (hearts, score, etc.)
        this.uiManager.update()

        // Update bins
        this.bins.forEach((bin) => bin.update())

        // Update spawn manager (handles continuous spawning)
        this.spawnManager.update(this.time.now)

        // Update trash indicators
        this.spawnManager
            .getTrashItems()
            .forEach((trash) => trash.updateIndicator())

        // Check for nearby trash (to show indicator)
        if (this.carriedBin) {
            this.checkNearbyTrash()
        }

        // Check for bin draining at dropoff boxes
        this.checkBinDraining()

        // Update input manager (checks keys and emits events)
        this.inputManager.update()
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

                    // Add score for draining
                    this.uiManager.addScore(GameConstants.SCORE.BIN_DRAIN)

                    // Show animated score popup above the bin
                    this.uiManager.showScorePopup(
                        bin.x,
                        bin.y - 60, // Above the bin
                        GameConstants.SCORE.BIN_DRAIN,
                        '#ffff00' // Yellow for draining
                    )
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

        // Find the closest trash within range (use container position)
        for (const trash of this.spawnManager.getTrashItems()) {
            if (!trash.canPickup()) continue

            const distance = Phaser.Math.Distance.Between(
                this.playerContainer.x,
                this.playerContainer.y,
                trash.x,
                trash.y
            )

            // Within pickup range
            if (
                distance < GameConstants.PLAYER.PICKUP_RANGE &&
                distance < closestDistance
            ) {
                closestTrash = trash
                closestDistance = distance
            }
        }

        // Update indicators
        this.spawnManager.getTrashItems().forEach((trash) => {
            trash.showIndicator(trash === closestTrash)
        })

        this.nearbyTrash = closestTrash
    }

    private handleTrashCollection(): void {
        if (!this.carriedBin || !this.nearbyTrash) return

        const trash = this.nearbyTrash

        // Check if trash can be picked up (animation complete)
        if (!trash.canPickup()) {
            return
        }

        // Check if bin is full
        if (this.carriedBin.isFull()) {
            this.uiManager.showNotification('Bin is full!', 2000, '#ff9900')
            return
        }

        // Check if trash matches the carried bin
        if (trash.binType === this.carriedBin.binType) {
            // Correct trash! Add to bin
            const added = this.carriedBin.addItem()
            if (added) {
                // Store trash position before destroying
                const trashX = trash.x
                const trashY = trash.y

                trash.collect()
                this.spawnManager.removeTrash(trash)
                this.nearbyTrash = null

                // Add score for correct collection
                this.uiManager.addScore(GameConstants.SCORE.CORRECT_TRASH)

                // Show animated score popup at trash location
                this.uiManager.showScorePopup(
                    trashX,
                    trashY,
                    GameConstants.SCORE.CORRECT_TRASH,
                    '#00ff00'
                )
            }
        } else {
            // Wrong trash! Lose HP
            trash.collect()
            this.spawnManager.removeTrash(trash)
            this.nearbyTrash = null
            this.player.takeDamage(1)

            // Show damage popup above player
            this.uiManager.showDamagePopup(
                this.playerContainer.x,
                this.playerContainer.y - 40, // Above player
                1
            )

            // Also show notification
            this.uiManager.showNotification('Wrong bin! -1 HP', 2000, '#ff0000')

            // Check for game over
            if (this.player.hp <= 0) {
                this.handleGameOver()
            }
        }
    }

    private handleGameOver(): void {
        // Show game over overlay with restart option
        this.uiManager.showGameOver(() => {
            this.scene.restart()
        })
    }

    private handleBinInteraction(): void {
        if (this.carriedBin) {
            // Drop the bin at player's current position (use container position as world position)
            this.carriedBin.drop(
                this.playerContainer,
                this.playerContainer.x,
                this.playerContainer.y
            )
            this.player.dropBin()
            this.carriedBin = null
        } else {
            // Try to pick up a nearby bin
            for (const bin of this.bins) {
                if (bin.isPickedUp) continue

                // Check if player is close enough to the bin
                const distance = Phaser.Math.Distance.Between(
                    this.playerContainer.x,
                    this.playerContainer.y,
                    bin.x,
                    bin.y
                )

                if (distance < GameConstants.PLAYER.PICKUP_RANGE) {
                    // Pick up the bin
                    bin.pickUp(this.player, this.playerContainer)
                    this.player.pickUpBin(bin.binType)
                    this.carriedBin = bin
                    break
                }
            }
        }
    }
}
