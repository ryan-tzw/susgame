import Phaser from 'phaser'

/**
 * Manages tilemap loading, setup, and queries.
 * Handles wangset property extraction and collision configuration.
 */
export class TilemapManager {
    private scene: Phaser.Scene
    private map: Phaser.Tilemaps.Tilemap
    private mapKey: string
    private tileset: Phaser.Tilemaps.Tileset | null = null
    private terrainLayer: Phaser.Tilemaps.TilemapLayer | null = null
    private grassTileIndices: number[] = []

    constructor(
        scene: Phaser.Scene,
        mapKey: string,
        tilesetName: string,
        imageKey: string
    ) {
        this.scene = scene
        this.mapKey = mapKey

        // Create tilemap from Tiled JSON
        this.map = scene.make.tilemap({ key: mapKey })
        this.tileset = this.map.addTilesetImage(tilesetName, imageKey)

        if (!this.tileset) {
            console.error('Failed to load tileset')
            return
        }

        // Create the terrain layer (single layer contains all terrain types)
        this.terrainLayer = this.map.createLayer('terrain', this.tileset, 0, 0)

        // Set layer depth (below player)
        this.terrainLayer?.setDepth(1)

        // Set up collision for water tiles
        if (this.terrainLayer) {
            this.terrainLayer.setCollisionByProperty({ collides: true })
        }

        // Extract grass tiles from wangset and set spawn property
        this.grassTileIndices = this.extractGrassTilesFromWangset()
        console.log('Grass tile indices from wangset:', this.grassTileIndices)
        this.setSpawnPropertiesOnGrassTiles()
    }

    /**
     * Get the tilemap instance
     */
    getMap(): Phaser.Tilemaps.Tilemap {
        return this.map
    }

    /**
     * Get the terrain layer
     */
    getTerrainLayer(): Phaser.Tilemaps.TilemapLayer | null {
        return this.terrainLayer
    }

    /**
     * Get grass tile indices (tiles where trash can spawn)
     */
    getGrassTileIndices(): number[] {
        return this.grassTileIndices
    }

    /**
     * Get the map dimensions in pixels
     */
    getDimensions(): { width: number; height: number } {
        return {
            width: this.map.widthInPixels,
            height: this.map.heightInPixels,
        }
    }

    /**
     * Set up collision between a game object and the terrain layer
     */
    addCollision(gameObject: Phaser.GameObjects.GameObject): void {
        if (this.terrainLayer) {
            this.scene.physics.add.collider(gameObject, this.terrainLayer)
        }
    }

    /**
     * Extract grass tile indices from the tileset's wangsets.
     * Looks for wangset colors with spawn=true property and returns all tile IDs
     * that belong to that terrain type (pure tiles with all edges of that terrain).
     */
    private extractGrassTilesFromWangset(): number[] {
        const grassTiles: number[] = []

        // Look through the map's cache to get the raw tileset JSON
        const mapData = this.scene.cache.tilemap.get(this.mapKey)
        if (!mapData || !mapData.data || !mapData.data.tilesets) {
            console.warn('Cannot access map tileset data')
            return []
        }

        // Find our tileset in the map data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawTileset = mapData.data.tilesets.find(
            (ts: { name: string }) => ts.name === this.tileset?.name
        )

        if (!rawTileset || !rawTileset.wangsets) {
            console.warn('No wangsets found in tileset')
            return []
        }

        // Find the terrain color index that has spawn=true
        let spawnTerrainIndex = -1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const wangset of rawTileset.wangsets as any[]) {
            if (wangset.colors) {
                for (let i = 0; i < wangset.colors.length; i++) {
                    const color = wangset.colors[i]
                    if (
                        color.properties &&
                        color.properties.some(
                            (prop: { name: string; value: boolean }) =>
                                prop.name === 'spawn' && prop.value === true
                        )
                    ) {
                        spawnTerrainIndex = i + 1 // Wang colors are 1-indexed
                        break
                    }
                }
            }

            if (spawnTerrainIndex === -1) continue

            // Now find all tiles that are pure spawn terrain (all edges = spawnTerrainIndex)
            if (wangset.wangtiles) {
                for (const wangtile of wangset.wangtiles) {
                    const wangid = wangtile.wangid
                    // Check if all edges are the spawn terrain (pure tile)
                    if (
                        wangid.every(
                            (edge: number) => edge === spawnTerrainIndex
                        )
                    ) {
                        // Add 1 to convert from Tiled's 0-based to Phaser's firstgid offset
                        grassTiles.push(wangtile.tileid + 1)
                    }
                }
            }
        }

        return grassTiles
    }

    /**
     * Set spawn=true property on all grass tiles in the terrain layer.
     * This allows SpawnManager to check tile.properties.spawn.
     */
    private setSpawnPropertiesOnGrassTiles(): void {
        this.terrainLayer?.layer.data.forEach((row) => {
            row.forEach((tile) => {
                if (this.grassTileIndices.includes(tile.index)) {
                    tile.properties.spawn = true
                }
            })
        })
    }
}
