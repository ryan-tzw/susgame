import Phaser from 'phaser'
import { GameConstants } from '../config/GameConstants'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
    private wasdKeys: {
        W: Phaser.Input.Keyboard.Key
        A: Phaser.Input.Keyboard.Key
        S: Phaser.Input.Keyboard.Key
        D: Phaser.Input.Keyboard.Key
    } | null = null
    private shiftKey: Phaser.Input.Keyboard.Key | null = null
    private speed = GameConstants.PLAYER.MOVE_SPEED
    private sprintSpeed = GameConstants.PLAYER.SPRINT_SPEED
    public hp: number = GameConstants.PLAYER.STARTING_HP
    public maxHp: number = GameConstants.PLAYER.MAX_HP
    public isCarryingBin = false
    public currentBinType: string | null = null
    private container: Phaser.GameObjects.Container | null = null
    private controlsEnabled = true // Flag to enable/disable player controls

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player', 'player_0.png')

        // Add to scene
        scene.add.existing(this)
        // Note: We don't add physics anymore since the player is just a sprite in a container

        // Set player depth (within container, 0 is base)
        this.setDepth(0)

        // Set up input
        this.cursors = scene.input.keyboard?.createCursorKeys() || null

        // Set up WASD keys
        if (scene.input.keyboard) {
            this.wasdKeys = {
                W: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.W
                ),
                A: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.A
                ),
                S: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.S
                ),
                D: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.D
                ),
            }
            this.shiftKey = scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SHIFT
            )
        }

        // Create animations
        this.createAnimations()
    }

    private createAnimations(): void {
        const scene = this.scene

        // Walking animation (frame 0 > 1 > 0 > 2)
        if (!scene.anims.exists('player-walk-down')) {
            scene.anims.create({
                key: 'player-walk-down',
                frames: [
                    { key: 'player', frame: 'player_0.png' },
                    { key: 'player', frame: 'player_1.png' },
                    { key: 'player', frame: 'player_0.png' },
                    { key: 'player', frame: 'player_2.png' },
                ],
                frameRate: 6,
                repeat: -1,
            })
        }

        // Idle animation
        if (!scene.anims.exists('player-idle')) {
            scene.anims.create({
                key: 'player-idle',
                frames: [{ key: 'player', frame: 'player_0.png' }],
                frameRate: 1,
            })
        }
    }

    public setContainer(container: Phaser.GameObjects.Container): void {
        this.container = container
    }

    /**
     * Enable or disable player controls
     */
    public setControlsEnabled(enabled: boolean): void {
        this.controlsEnabled = enabled
        
        // Stop movement when controls are disabled
        if (!enabled && this.container?.body) {
            const containerBody = this.container.body as Phaser.Physics.Arcade.Body
            containerBody.setVelocity(0, 0)
            // Show idle animation
            if (this.anims.currentAnim?.key !== 'player-idle') {
                this.play('player-idle')
            }
        }
    }

    update(): void {
        if (!this.cursors || !this.container) return

        // Don't process input if controls are disabled
        if (!this.controlsEnabled) {
            return
        }

        // Check if sprinting
        const isSprinting = this.shiftKey?.isDown || false
        const currentSpeed = isSprinting ? this.sprintSpeed : this.speed

        // Calculate movement delta
        let velocityX = 0
        let velocityY = 0
        let isMoving = false

        // Horizontal movement (Arrow keys + WASD)
        if (this.cursors.left?.isDown || this.wasdKeys?.A.isDown) {
            velocityX = -currentSpeed
            isMoving = true
            this.setFlipX(false) // Sprite is facing left by default, so no flip
        } else if (this.cursors.right?.isDown || this.wasdKeys?.D.isDown) {
            velocityX = currentSpeed
            isMoving = true
            this.setFlipX(true) // Flip to face right
        }

        // Vertical movement (Arrow keys + WASD)
        if (this.cursors.up?.isDown || this.wasdKeys?.W.isDown) {
            velocityY = -currentSpeed
            isMoving = true
        } else if (this.cursors.down?.isDown || this.wasdKeys?.S.isDown) {
            velocityY = currentSpeed
            isMoving = true
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= Math.sqrt(0.5)
            velocityY *= Math.sqrt(0.5)
        }

        // Apply velocity to the container's physics body
        const containerBody = this.container.body as Phaser.Physics.Arcade.Body
        if (containerBody) {
            containerBody.setVelocity(velocityX, velocityY)
        }

        // Play appropriate animation
        if (isMoving) {
            // Adjust animation speed based on sprinting
            const animSpeed = isSprinting ? 10 : 6

            // Only start animation if not already playing
            if (this.anims.currentAnim?.key !== 'player-walk-down') {
                this.play('player-walk-down')
            }

            // Update animation speed
            if (this.anims.currentAnim) {
                this.anims.currentAnim.frameRate = animSpeed
            }
        } else {
            // Stop animation and show idle frame
            if (this.anims.currentAnim?.key !== 'player-idle') {
                this.play('player-idle')
            }
        }
    }

    public takeDamage(amount: number): void {
        this.hp = Math.max(0, this.hp - amount)
        // TODO: Add visual feedback for damage
    }

    public pickUpBin(binType: string): void {
        this.isCarryingBin = true
        this.currentBinType = binType
        // TODO: Add visual indicator for carrying bin
    }

    public dropBin(): void {
        this.isCarryingBin = false
        this.currentBinType = null
        // TODO: Remove visual indicator
    }

    /**
     * Reset player state (called when game restarts)
     */
    public reset(): void {
        this.isCarryingBin = false
        this.currentBinType = null
        this.hp = this.maxHp
        this.controlsEnabled = true
    }
}
