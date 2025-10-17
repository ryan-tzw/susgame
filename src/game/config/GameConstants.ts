/**
 * Game Constants - Centralized configuration for all gameplay values
 * Modify these values to tune gameplay balance and behavior
 */

export const GameConstants = {
    /**
     * Player configuration
     */
    PLAYER: {
        /** Maximum health points */
        MAX_HP: 5,
        /** Starting health points */
        STARTING_HP: 5,
        /** Normal movement speed (pixels per second) */
        MOVE_SPEED: 300,
        /** Sprint movement speed (pixels per second) */
        SPRINT_SPEED: 600,
        /** Interaction range for picking up bins and trash (pixels) */
        PICKUP_RANGE: 80,
        /** Physics collision body size */
        COLLISION_SIZE: {
            WIDTH: 32,
            HEIGHT: 32,
            OFFSET_X: -16,
            OFFSET_Y: -16,
        },
    },

    /**
     * Bin configuration
     */
    BIN: {
        /** Maximum items a bin can hold */
        MAX_CAPACITY: 10,
        /** Frames between draining items (60 = 1 second at 60fps) */
        DRAIN_INTERVAL_FRAMES: 60,
        /** Points awarded per item drained (future feature) */
        POINTS_PER_DRAIN: 10,
        /** Capacity meter dimensions */
        METER: {
            WIDTH: 60,
            HEIGHT: 8,
            OFFSET_Y: -50, // Above bin
        },
        /** Spawn positions */
        SPAWN: {
            START_X: 300,
            SPACING_Y: 150,
        },
        /** Bin type colors for capacity meter */
        COLORS: {
            GREEN: 0x4ade80,
            BLUE: 0x60a5fa,
            YELLOW: 0xfbbf24,
        },
    },

    /**
     * Dropoff box configuration
     */
    DROPOFF: {
        /** Spawn positions */
        SPAWN: {
            START_X: 3440,
            SPACING_Y: 250,
        },
        /** Detection range for bin overlap */
        OVERLAP_RANGE: 100,
    },

    /**
     * Trash spawning configuration
     */
    SPAWN: {
        /** Initial trash items when game starts */
        INITIAL_COUNT: 15,
        /** Maximum trash items on map at once */
        MAX_ITEMS: 60,
        /** Minimum time between spawns in milliseconds (when trash is very low) */
        MIN_INTERVAL_MS: 2000,
        /** Maximum time between spawns in milliseconds (when trash is plentiful) */
        MAX_INTERVAL_MS: 10000,
        /** Spawn zone margins from world edges */
        MARGIN: {
            X: 400, // Don't spawn too close to bin/dropoff areas
            Y: 200,
        },
        /** Maximum attempts to find valid spawn position */
        MAX_SPAWN_ATTEMPTS: 20,
        /** Spawn animation duration (milliseconds) */
        SPAWN_ANIMATION_MS: 400,
        /** Delay before trash can be picked up after spawning (milliseconds) */
        PICKUP_DELAY_MS: 400,
    },

    /**
     * Trash entity configuration
     */
    TRASH: {
        /** Display scale for trash sprites */
        SCALE: 0.65,
        /** Display depth (rendering layer) */
        DEPTH: 2,
        /** Hover animation */
        HOVER: {
            SPEED: 0.05,
            AMPLITUDE: 5, // pixels up/down
        },
        /** Indicator arrow */
        INDICATOR: {
            OFFSET_Y: -40, // Above trash
            SCALE: 0.5,
        },
    },

    /**
     * UI configuration
     */
    UI: {
        /** Heart display (health) */
        HEARTS: {
            COUNT: 5,
            SPACING: 30,
            SCALE: 0.75,
            Y_OFFSET: 80, // Below player
            DEPTH: -1, // Behind player in container
        },
        /** Instruction text */
        INSTRUCTIONS: {
            X: 16,
            Y: 16,
            FONT_SIZE: '18px',
            COLOR: '#ffffff',
            BACKGROUND_COLOR: '#000000',
            PADDING: { x: 10, y: 10 },
            TEXT: 'Arrow Keys/WASD: Move\nSHIFT: Sprint\nSPACE: Pick up/drop bin\nE: Collect trash',
        },
        /** Loading bar (PreloadScene) */
        LOADING_BAR: {
            WIDTH: 400,
            HEIGHT: 50,
            Y_OFFSET: 30,
            COLOR: 0xffffff,
            BACKGROUND_COLOR: 0x222222,
        },
    },

    /**
     * World/Map configuration
     */
    WORLD: {
        /** Expected tile size (pixels) */
        TILE_SIZE: 64,
        /** Expected map size in tiles */
        MAP_SIZE: {
            WIDTH: 60,
            HEIGHT: 40,
        },
        /** Calculated dimensions (can be overridden by actual tilemap) */
        get DIMENSIONS() {
            return {
                WIDTH: this.MAP_SIZE.WIDTH * this.TILE_SIZE,
                HEIGHT: this.MAP_SIZE.HEIGHT * this.TILE_SIZE,
            }
        },
    },

    /**
     * Camera configuration
     */
    CAMERA: {
        /** Camera lerp/smoothing (0-1, lower = smoother but slower) */
        LERP: 0.1,
        /** Camera zoom level */
        ZOOM: 1,
        /** Round camera position to pixels (reduces sub-pixel rendering) */
        ROUND_PIXELS: false,
    },

    /**
     * Physics configuration
     */
    PHYSICS: {
        /** Global gravity (currently disabled for top-down view) */
        GRAVITY: 0,
    },

    /**
     * Scoring configuration (future feature)
     */
    SCORE: {
        /** Points for correct trash collection */
        CORRECT_TRASH: 10,
        /** Points for bin draining */
        BIN_DRAIN: 5,
        /** Penalty for wrong trash (currently loses HP instead) */
        WRONG_TRASH_PENALTY: -5,
    },

    /**
     * Difficulty configuration (future feature)
     */
    DIFFICULTY: {
        /** Trash spawn rate multiplier */
        SPAWN_RATE_MULTIPLIER: 1.0,
        /** Player damage multiplier */
        DAMAGE_MULTIPLIER: 1.0,
    },
} as const

/**
 * Type helper for constants (allows IDE autocomplete)
 */
export type GameConstantsType = typeof GameConstants
