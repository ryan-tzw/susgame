import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Bin } from '../entities/Bin'
import { Trash } from '../entities/Trash'
import { DropoffBox } from '../entities/DropoffBox'
import { SpawnManager } from '../managers/SpawnManager'
import { TilemapManager } from '../managers/TilemapManager'
import { InputManager, GameAction } from '../managers/InputManager'
import { UIManager } from '../managers/UIManager'
import { GameStateManager } from '../managers/GameStateManager'
import { GameConstants } from '../config/GameConstants'
import { SceneTransitions } from '../utils/SceneTransitions'
import { AudioManager } from '../managers/AudioManager'

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
    private stateManager!: GameStateManager
    private audioManager!: AudioManager

    constructor() {
        super({ key: 'GameScene' })
    }

    create(): void {
        // Initialize game state manager
        this.stateManager = new GameStateManager()

        // Initialize audio manager (music already playing from BootScene)
        this.audioManager = new AudioManager(this)

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

        // Add physics body to container and set up collision with terrain
        this.physics.add.existing(this.playerContainer)
        const containerBody = this.playerContainer
            .body as Phaser.Physics.Arcade.Body
        if (containerBody) {
            // Collision box configuration
            // setSize(width, height) - Size of the collision box
            // setOffset(x, y) - Position relative to container center
            //   Negative Y moves box down (toward feet)
            //   Example: setOffset(0, 16) moves box 16px down from center
            containerBody.setSize(50, 16) // Width x Height of collision box
            containerBody.setOffset(-25, 40) // X and Y offset from container center
            containerBody.setCollideWorldBounds(true) // Keep player in world
        }

        // Give player reference to its container so it can move it (after physics is added)
        this.player.setContainer(this.playerContainer)

        this.tilemapManager.addCollision(this.playerContainer)

        // Set up camera to follow the container instead
        this.cameras.main.startFollow(this.playerContainer)
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
        this.cameras.main.setZoom(1)
        this.cameras.main.setRoundPixels(true) // Round pixel positions to prevent sub-pixel gaps

        // Play circle wipe in transition when entering the game
        SceneTransitions.circleWipeIn(this)

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
        this.bins = this.spawnManager.spawnBins(this.playerContainer)

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

        // DEBUG: Add key to instantly win (press V key for "Victory")
        const debugWinKey = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.V
        )
        if (debugWinKey) {
            debugWinKey.on('down', () => {
                console.log('DEBUG: Setting score to win threshold')
                this.uiManager.setScore(GameConstants.SCORE.WIN_THRESHOLD)
            })
        }
    }

    update(): void {
        // Update player (handles input and moves container)
        this.player.update()

        // Update UI (hearts, score, etc.)
        this.uiManager.update()

        // Check for win condition
        if (
            this.stateManager.isPlaying() &&
            this.uiManager.getScore() >= GameConstants.SCORE.WIN_THRESHOLD
        ) {
            this.handleWin()
            return // Stop updating after win
        }

        // Don't update game logic if game has ended
        if (!this.stateManager.isPlaying()) {
            return
        }

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

                    // Play deposit sound
                    this.audioManager.playCorrectDeposit()

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
                // Play pickup sound
                this.audioManager.playTrashPickup()

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

            // Play damage sound
            this.audioManager.playPlayerDamage()

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
            if (this.stateManager.isPlaying() && this.player.hp <= 0) {
                this.handleGameOver()
            }
        }
    }

    private handleGameOver(): void {
        // Only show game over if we successfully transition to that state
        if (this.stateManager.setGameOver()) {
            // Play game over sound
            this.audioManager.playGameOver()

            // Disable player controls
            this.player.setControlsEnabled(false)

            // Drop any carried bin
            if (this.carriedBin) {
                this.carriedBin.drop(
                    this.playerContainer,
                    this.playerContainer.x,
                    this.playerContainer.y
                )
                this.player.dropBin()
                this.carriedBin = null
            }

            this.uiManager.showGameOver(() => {
                this.scene.restart()
            })
        }
    }

    private handleWin(): void {
        // Only show win if we successfully transition to that state
        if (this.stateManager.setWin()) {
            // Play victory sound
            this.audioManager.playVictory()

            // Disable player controls
            this.player.setControlsEnabled(false)

            // Drop any carried bin
            if (this.carriedBin) {
                this.carriedBin.drop(
                    this.playerContainer,
                    this.playerContainer.x,
                    this.playerContainer.y
                )
                this.player.dropBin()
                this.carriedBin = null
            }

            this.uiManager.showWin(() => {
                this.scene.restart()
            })
        }
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
                    bin.pickUp(this.playerContainer)
                    this.player.pickUpBin(bin.binType)
                    this.carriedBin = bin
                    break
                }
            }
        }
    }
}
