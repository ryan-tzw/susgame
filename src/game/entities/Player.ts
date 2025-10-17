import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
    private wasdKeys: {
        W: Phaser.Input.Keyboard.Key
        A: Phaser.Input.Keyboard.Key
        S: Phaser.Input.Keyboard.Key
        D: Phaser.Input.Keyboard.Key
    } | null = null
    private speed = 300
    public hp = 5
    public maxHp = 5
    public isCarryingBin = false
    public currentBinType: string | null = null

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player', 'player_0.png')

        // Add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // Set up physics
        this.setCollideWorldBounds(true)

        // Set player depth
        this.setDepth(10)

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

    update(): void {
        if (!this.cursors) return

        // Reset velocity
        this.setVelocity(0, 0)

        let isMoving = false

        // Horizontal movement (Arrow keys + WASD)
        if (this.cursors.left?.isDown || this.wasdKeys?.A.isDown) {
            this.setVelocityX(-this.speed)
            isMoving = true
            this.setFlipX(false) // Sprite is facing left by default, so no flip
        } else if (this.cursors.right?.isDown || this.wasdKeys?.D.isDown) {
            this.setVelocityX(this.speed)
            isMoving = true
            this.setFlipX(true) // Flip to face right
        }

        // Vertical movement (Arrow keys + WASD)
        if (this.cursors.up?.isDown || this.wasdKeys?.W.isDown) {
            this.setVelocityY(-this.speed)
            isMoving = true
        } else if (this.cursors.down?.isDown || this.wasdKeys?.S.isDown) {
            this.setVelocityY(this.speed)
            isMoving = true
        }

        // Normalize diagonal movement
        if (
            this.body &&
            this.body.velocity.x !== 0 &&
            this.body.velocity.y !== 0
        ) {
            this.setVelocity(
                this.body.velocity.x * Math.sqrt(0.5),
                this.body.velocity.y * Math.sqrt(0.5)
            )
        }

        // Play appropriate animation
        if (isMoving) {
            // Only start animation if not already playing
            if (this.anims.currentAnim?.key !== 'player-walk-down') {
                this.play('player-walk-down')
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
}
