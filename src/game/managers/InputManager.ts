import Phaser from 'phaser'

/**
 * Action types that can be triggered by input
 */
export enum GameAction {
    INTERACT = 'interact', // Pick up/drop bin (SPACE)
    COLLECT = 'collect', // Collect trash (E)
}

/**
 * Manages input and emits events for game actions.
 * Centralizes all input handling and makes keybindings easy to change.
 */
export class InputManager {
    private scene: Phaser.Scene
    private keys: Map<GameAction, Phaser.Input.Keyboard.Key>
    private eventEmitter: Phaser.Events.EventEmitter

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.keys = new Map()
        this.eventEmitter = new Phaser.Events.EventEmitter()

        this.setupDefaultKeybindings()
    }

    /**
     * Set up default keyboard mappings
     */
    private setupDefaultKeybindings(): void {
        if (!this.scene.input.keyboard) return

        // Map actions to keys
        this.keys.set(
            GameAction.INTERACT,
            this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )
        )
        this.keys.set(
            GameAction.COLLECT,
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        )
    }

    /**
     * Subscribe to a game action
     * @param action The action to listen for
     * @param callback Function to call when action is triggered
     * @param context The context to bind the callback to (usually 'this')
     */
    on(action: GameAction, callback: () => void, context?: unknown): void {
        this.eventEmitter.on(action, callback, context)
    }

    /**
     * Unsubscribe from a game action
     */
    off(action: GameAction, callback: () => void, context?: unknown): void {
        this.eventEmitter.off(action, callback, context)
    }

    /**
     * Update method - checks for key presses and emits events
     * Should be called every frame from the scene's update()
     */
    update(): void {
        // Check each action's key and emit event if just pressed
        this.keys.forEach((key, action) => {
            if (Phaser.Input.Keyboard.JustDown(key)) {
                this.eventEmitter.emit(action)
            }
        })
    }

    /**
     * Rebind an action to a different key
     * @param action The action to rebind
     * @param keyCode The new key code to bind to
     */
    rebind(action: GameAction, keyCode: number): void {
        if (!this.scene.input.keyboard) return

        // Remove old key if it exists
        const oldKey = this.keys.get(action)
        if (oldKey) {
            this.scene.input.keyboard.removeKey(oldKey)
        }

        // Add new key
        const newKey = this.scene.input.keyboard.addKey(keyCode)
        this.keys.set(action, newKey)
    }

    /**
     * Get the current key bound to an action (for displaying controls)
     */
    getKeyForAction(action: GameAction): string {
        const key = this.keys.get(action)
        if (!key) return 'Not bound'

        // Get the key name from the key object
        return key.originalEvent?.key?.toUpperCase() || 'Unknown'
    }

    /**
     * Clean up when the manager is destroyed
     */
    destroy(): void {
        this.eventEmitter.removeAllListeners()
        this.keys.clear()
    }
}
