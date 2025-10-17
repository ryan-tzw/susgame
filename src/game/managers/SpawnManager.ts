import Phaser from 'phaser'
import { Bin, BinType } from '../entities/Bin'
import { Trash } from '../entities/Trash'
import { DropoffBox } from '../entities/DropoffBox'
import { TrashAsset } from '../utils/TrashLoader'
import { Player } from '../entities/Player'

export class SpawnManager {
    private scene: Phaser.Scene
    private trashAssets: TrashAsset[]
    private trashItems: Trash[] = []
    private worldWidth: number
    private worldHeight: number

    // Continuous spawning config
    private maxTrashItems = 60 // Maximum trash items on map
    private minSpawnInterval = 2000 // Minimum time between spawns (ms) - when trash is very low
    private maxSpawnInterval = 10000 // Maximum time between spawns (ms) - when trash is plentiful
    private nextSpawnTime = 0
    private isSpawningEnabled = true

    constructor(
        scene: Phaser.Scene,
        trashAssets: TrashAsset[],
        worldWidth: number,
        worldHeight: number
    ) {
        this.scene = scene
        this.trashAssets = trashAssets
        this.worldWidth = worldWidth
        this.worldHeight = worldHeight

        // Schedule first spawn
        this.scheduleNextSpawn()
    }

    /**
     * Spawn initial trash items when game starts
     */
    public spawnInitialTrash(count: number): void {
        if (this.trashAssets.length === 0) {
            console.log(
                'No trash assets loaded. Add PNG files to trash folders.'
            )
            return
        }

        for (let i = 0; i < count; i++) {
            this.spawnSingleTrash(false) // No animation for initial spawn
        }

        console.log(`Spawned ${count} initial trash items`)
    }

    /**
     * Spawn a single trash item at a random location
     */
    private spawnSingleTrash(animate = true): Trash | null {
        if (this.trashAssets.length === 0) return null

        // Pick a random trash asset
        const randomAsset =
            this.trashAssets[
                Phaser.Math.Between(0, this.trashAssets.length - 1)
            ]

        // Random position across world (with padding from edges)
        const x = Phaser.Math.Between(400, this.worldWidth - 400)
        const y = Phaser.Math.Between(200, this.worldHeight - 200)

        // Create trash item
        const trash = new Trash(
            this.scene,
            x,
            y,
            randomAsset.binType,
            randomAsset.key
        )

        if (animate) {
            // Start with scale 0 and disabled
            trash.setScale(0)
            trash.setPickupEnabled(false)

            // Animate scale up with bounce effect
            this.scene.tweens.add({
                targets: trash,
                scale: 0.65, // Target scale (normal size)
                duration: 400,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // Enable pickup after animation completes
                    trash.setPickupEnabled(true)
                },
            })
        }

        this.trashItems.push(trash)
        return trash
    }

    /**
     * Update spawn manager - call this in scene's update loop
     */
    public update(time: number): void {
        if (!this.isSpawningEnabled) return

        // Check if it's time to spawn new trash
        if (time >= this.nextSpawnTime && this.canSpawnMore()) {
            this.spawnSingleTrash(true) // Animate spawns during gameplay
            this.scheduleNextSpawn()
        }
    }

    /**
     * Schedule the next trash spawn at a random interval
     * Interval scales based on current trash count - fewer trash = faster spawns
     */
    private scheduleNextSpawn(): void {
        const activeCount = this.getActiveTrashCount()
        const trashPercentage = activeCount / this.maxTrashItems

        // Calculate dynamic interval based on trash density
        // Scale between minSpawnInterval (when empty) and maxSpawnInterval (when full)
        // Uses quadratic easing for more responsive scaling at low trash counts

        // Inverse percentage - higher value when trash is low
        const inversePercentage = 1 - trashPercentage

        // Apply easing curve (quadratic) to make it spawn faster when low
        const easedValue = inversePercentage * inversePercentage

        // Calculate interval range based on eased value
        const intervalRange = this.maxSpawnInterval - this.minSpawnInterval
        const minInterval = this.minSpawnInterval
        const maxInterval = minInterval + intervalRange * (1 - easedValue)

        const interval = Phaser.Math.Between(
            Math.floor(minInterval),
            Math.floor(maxInterval)
        )

        this.nextSpawnTime = this.scene.time.now + interval

        // Optional: Log for debugging
        // console.log(`Next spawn in ${(interval/1000).toFixed(1)}s (${activeCount}/${this.maxTrashItems} trash, ${(trashPercentage*100).toFixed(0)}%)`)
    }

    /**
     * Check if we can spawn more trash (haven't hit the limit)
     */
    private canSpawnMore(): boolean {
        // Count active (not collected) trash items
        const activeTrashCount = this.trashItems.filter(
            (t) => !t.isCollected
        ).length
        return activeTrashCount < this.maxTrashItems
    }

    /**
     * Create bins at specific positions
     */
    public spawnBins(
        player: Player,
        playerContainer: Phaser.GameObjects.Container
    ): Bin[] {
        const bins: Bin[] = []
        const binStartX = 300
        const binStartY = this.worldHeight / 2 - 200
        const binSpacing = 150

        const binTypes: BinType[] = ['green', 'blue', 'yellow']
        binTypes.forEach((type, index) => {
            const bin = new Bin(
                this.scene,
                binStartX,
                binStartY + binSpacing * index,
                type
            )
            bin.setPlayer(player, playerContainer)
            bins.push(bin)
        })

        return bins
    }

    /**
     * Create dropoff boxes at specific positions
     */
    public spawnDropoffBoxes(): DropoffBox[] {
        const dropoffBoxes: DropoffBox[] = []
        const dropoffStartX = this.worldWidth - 400
        const dropoffStartY = this.worldHeight / 2 - 250
        const dropoffSpacing = 250

        const dropoffConfigs: Array<{
            type: BinType
            decoration: string
        }> = [
            { type: 'green', decoration: 'waste_to_energy' },
            { type: 'blue', decoration: 'recycling_plant' },
            { type: 'yellow', decoration: 'donation_center' },
        ]

        dropoffConfigs.forEach((config, index) => {
            const dropoff = new DropoffBox(
                this.scene,
                dropoffStartX,
                dropoffStartY + dropoffSpacing * index,
                config.type,
                config.decoration
            )
            dropoffBoxes.push(dropoff)
        })

        return dropoffBoxes
    }

    /**
     * Remove a trash item from tracking (when collected)
     */
    public removeTrash(trash: Trash): void {
        const index = this.trashItems.indexOf(trash)
        if (index > -1) {
            this.trashItems.splice(index, 1)
        }
    }

    /**
     * Get all active trash items
     */
    public getTrashItems(): Trash[] {
        return this.trashItems
    }

    /**
     * Enable or disable continuous spawning
     */
    public setSpawningEnabled(enabled: boolean): void {
        this.isSpawningEnabled = enabled
        if (enabled) {
            this.scheduleNextSpawn()
        }
    }

    /**
     * Set the maximum number of trash items allowed on the map
     */
    public setMaxTrashItems(max: number): void {
        this.maxTrashItems = max
    }

    /**
     * Set spawn interval range (in milliseconds)
     */
    public setSpawnInterval(min: number, max: number): void {
        this.minSpawnInterval = min
        this.maxSpawnInterval = max
    }

    /**
     * Get count of active trash items
     */
    public getActiveTrashCount(): number {
        return this.trashItems.filter((t) => !t.isCollected).length
    }
}
