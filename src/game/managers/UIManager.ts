import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { GameConstants } from '../config/GameConstants'

/**
 * Manages all UI elements including hearts, score, instructions, and overlays.
 * Centralizes UI creation, updates, and state management.
 */
export class UIManager {
    private scene: Phaser.Scene
    private player: Player
    private hearts: Phaser.GameObjects.Image[] = []
    private instructionText: Phaser.GameObjects.Text | null = null
    private scoreText: Phaser.GameObjects.Text | null = null
    private score = 0
    private playerContainer: Phaser.GameObjects.Container

    constructor(
        scene: Phaser.Scene,
        player: Player,
        playerContainer: Phaser.GameObjects.Container
    ) {
        this.scene = scene
        this.player = player
        this.playerContainer = playerContainer

        this.createHearts()
        this.createInstructions()
        this.createScoreDisplay()
    }

    /**
     * Create heart display for player HP
     */
    private createHearts(): void {
        const heartSpacing = GameConstants.UI.HEARTS.SPACING
        const heartCount = GameConstants.UI.HEARTS.COUNT
        const totalWidth = (heartCount - 1) * heartSpacing
        const startX = -totalWidth / 2
        const yOffset = GameConstants.UI.HEARTS.Y_OFFSET

        for (let i = 0; i < heartCount; i++) {
            const heart = this.scene.add
                .image(startX + i * heartSpacing, yOffset, 'heart_filled')
                .setDepth(GameConstants.UI.HEARTS.DEPTH)
                .setScale(GameConstants.UI.HEARTS.SCALE)
            this.hearts.push(heart)
            this.playerContainer.add(heart)
        }
    }

    /**
     * Create instruction text overlay
     */
    private createInstructions(): void {
        this.instructionText = this.scene.add
            .text(
                GameConstants.UI.INSTRUCTIONS.X,
                GameConstants.UI.INSTRUCTIONS.Y,
                GameConstants.UI.INSTRUCTIONS.TEXT,
                {
                    fontSize: GameConstants.UI.INSTRUCTIONS.FONT_SIZE,
                    color: GameConstants.UI.INSTRUCTIONS.COLOR,
                    padding: GameConstants.UI.INSTRUCTIONS.PADDING,
                    stroke: '#000000',
                    strokeThickness: 3,
                }
            )
            .setScrollFactor(0)
            .setDepth(100)
    }

    /**
     * Create score display
     */
    private createScoreDisplay(): void {
        this.scoreText = this.scene.add
            .text(
                this.scene.cameras.main.width - 16,
                16,
                `Score: ${this.score}`,
                {
                    fontSize: '24px',
                    color: '#ffffff',
                    padding: { x: 10, y: 10 },
                    stroke: '#000000',
                    strokeThickness: 3,
                }
            )
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100)
    }

    /**
     * Update UI elements - call this every frame
     */
    update(): void {
        this.updateHearts()
    }

    /**
     * Update heart textures based on current player HP
     */
    private updateHearts(): void {
        for (let i = 0; i < this.hearts.length; i++) {
            const heart = this.hearts[i]

            // Show filled or empty heart based on current HP
            const textureKey =
                i < this.player.hp ? 'heart_filled' : 'heart_empty'

            // Only set texture if it exists and is different
            if (
                this.scene.textures.exists(textureKey) &&
                heart.texture.key !== textureKey
            ) {
                heart.setTexture(textureKey)
            }
        }
    }

    /**
     * Add points to the score
     */
    addScore(points: number): void {
        this.score += points
        this.updateScoreDisplay()
    }

    /**
     * Get current score
     */
    getScore(): number {
        return this.score
    }

    /**
     * Reset score to zero
     */
    resetScore(): void {
        this.score = 0
        this.updateScoreDisplay()
    }

    /**
     * Set score to a specific value (for debugging)
     */
    setScore(value: number): void {
        this.score = value
        this.updateScoreDisplay()
    }

    /**
     * Update score text display
     */
    private updateScoreDisplay(): void {
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.score}`)
        }
    }

    /**
     * Show or hide instruction text
     */
    setInstructionsVisible(visible: boolean): void {
        if (this.instructionText) {
            this.instructionText.setVisible(visible)
        }
    }

    /**
     * Show game over overlay
     */
    showGameOver(callback: () => void): void {
        const centerX = this.scene.cameras.main.width / 2
        const centerY = this.scene.cameras.main.height / 2

        // Dark overlay
        const overlay = this.scene.add
            .rectangle(
                0,
                0,
                this.scene.cameras.main.width,
                this.scene.cameras.main.height,
                0x000000,
                0.7
            )
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000)

        // Game Over text
        const gameOverText = this.scene.add
            .text(centerX, centerY - 50, 'GAME OVER', {
                fontSize: '64px',
                color: '#ff0000',
                fontStyle: 'bold',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Final score
        const finalScoreText = this.scene.add
            .text(centerX, centerY + 20, `Final Score: ${this.score}`, {
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Restart instruction
        const restartText = this.scene.add
            .text(centerX, centerY + 80, 'Press SPACE to Restart', {
                fontSize: '24px',
                color: '#888888',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Flashing restart text
        this.scene.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
        })

        // Listen for restart key
        const spaceKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
        if (spaceKey) {
            spaceKey.once('down', () => {
                // Clean up
                overlay.destroy()
                gameOverText.destroy()
                finalScoreText.destroy()
                restartText.destroy()
                callback()
            })
        }
    }

    /**
     * Show win overlay
     */
    showWin(callback: () => void): void {
        const centerX = this.scene.cameras.main.width / 2
        const centerY = this.scene.cameras.main.height / 2

        // Dark overlay (semi-transparent black)
        const overlay = this.scene.add
            .rectangle(
                0,
                0,
                this.scene.cameras.main.width,
                this.scene.cameras.main.height,
                0x000000
            )
            .setAlpha(0.7) // 70% transparent
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1000)

        // Win text
        const winText = this.scene.add
            .text(centerX, centerY - 50, 'YOU WIN!', {
                fontSize: '64px',
                color: '#00ff00',
                fontStyle: 'bold',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Final score
        const finalScoreText = this.scene.add
            .text(centerX, centerY + 20, `Final Score: ${this.score}`, {
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Continue instruction
        const continueText = this.scene.add
            .text(centerX, centerY + 80, 'Press SPACE to Continue', {
                fontSize: '24px',
                color: '#888888',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001)

        // Flashing continue text
        this.scene.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
        })

        // Listen for continue key
        const spaceKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
        if (spaceKey) {
            spaceKey.once('down', () => {
                // Clean up
                overlay.destroy()
                winText.destroy()
                finalScoreText.destroy()
                continueText.destroy()
                callback()
            })
        }
    }

    /**
     * Show temporary notification message
     */
    showNotification(
        message: string,
        duration = 2000,
        color = '#ffffff'
    ): void {
        const centerX = this.scene.cameras.main.width / 2
        const y = this.scene.cameras.main.height - 100

        const notification = this.scene.add
            .text(centerX, y, message, {
                fontSize: '32px',
                color: color,
                padding: { x: 20, y: 10 },
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(999)
            .setAlpha(0)

        // Fade in
        this.scene.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 200,
            onComplete: () => {
                // Wait, then fade out
                this.scene.time.delayedCall(duration, () => {
                    this.scene.tweens.add({
                        targets: notification,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            notification.destroy()
                        },
                    })
                })
            },
        })
    }

    /**
     * Show animated score popup at a specific world position
     * @param x World X position
     * @param y World Y position
     * @param points Score to display (e.g., 5, 10)
     * @param color Text color
     */
    showScorePopup(
        x: number,
        y: number,
        points: number,
        color = '#ffff00'
    ): void {
        // Random angle offset (-15 to 15 degrees)
        const randomAngle = Phaser.Math.Between(-15, 15)

        // Random rotation (-10 to 10 degrees)
        const randomRotation = Phaser.Math.FloatBetween(-0.17, 0.17) // radians

        // Calculate direction based on angle
        const angleRad = Phaser.Math.DegToRad(90 + randomAngle) // 90 = straight up
        const distance = 80 // Total distance to travel
        const endX = x + Math.cos(angleRad) * distance
        const endY = y + Math.sin(angleRad) * distance

        const scoreText = this.scene.add
            .text(x, y, `+${points}`, {
                fontSize: '32px',
                color: color,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1001)
            .setScale(0)
            .setRotation(0)

        // Transition IN: Scale up + move up with deceleration + rotate
        this.scene.tweens.add({
            targets: scoreText,
            scale: 1.2, // Slightly oversized
            x: endX,
            y: endY - distance * 0.3, // Move 30% of the way during transition in
            rotation: randomRotation,
            duration: 400,
            ease: 'Cubic.easeOut', // Fast start, slow end
            onComplete: () => {
                // Brief pause at full size, then transition OUT
                this.scene.time.delayedCall(300, () => {
                    // Transition OUT: Continue moving + scale down
                    this.scene.tweens.add({
                        targets: scoreText,
                        scale: 0,
                        x: endX,
                        y: endY, // Continue to final position
                        rotation: randomRotation * 1.5, // Rotate a bit more
                        duration: 400,
                        ease: 'Cubic.easeIn', // Slow start, fast end
                        onComplete: () => {
                            scoreText.destroy()
                        },
                    })
                })
            },
        })
    }

    /**
     * Show animated damage popup at a specific world position
     * @param x World X position
     * @param y World Y position
     * @param damage Damage amount to display (e.g., 1, 2)
     */
    showDamagePopup(x: number, y: number, damage: number): void {
        // Random angle offset (-15 to 15 degrees)
        const randomAngle = Phaser.Math.Between(-15, 15)

        // Random rotation (-10 to 10 degrees)
        const randomRotation = Phaser.Math.FloatBetween(-0.17, 0.17) // radians

        // Calculate direction based on angle
        const angleRad = Phaser.Math.DegToRad(90 + randomAngle) // 90 = straight up
        const distance = 80 // Total distance to travel
        const endX = x + Math.cos(angleRad) * distance
        const endY = y + Math.sin(angleRad) * distance

        const damageText = this.scene.add
            .text(x, y, `-${damage}`, {
                fontSize: '48px', // Bigger for impact!
                color: '#ff0000', // Red
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6, // Thicker stroke for visibility
            })
            .setOrigin(0.5)
            .setDepth(1001)
            .setScale(0)
            .setRotation(0)

        // Transition IN: Scale up + move up with deceleration + rotate
        this.scene.tweens.add({
            targets: damageText,
            scale: 1.5, // Extra large for damage emphasis!
            x: endX,
            y: endY - distance * 0.3, // Move 30% of the way during transition in
            rotation: randomRotation,
            duration: 400,
            ease: 'Cubic.easeOut', // Fast start, slow end
            onComplete: () => {
                // Brief pause at full size, then transition OUT
                this.scene.time.delayedCall(300, () => {
                    // Transition OUT: Continue moving + scale down
                    this.scene.tweens.add({
                        targets: damageText,
                        scale: 0,
                        x: endX,
                        y: endY, // Continue to final position
                        rotation: randomRotation * 1.5, // Rotate a bit more
                        duration: 400,
                        ease: 'Cubic.easeIn', // Slow start, fast end
                        onComplete: () => {
                            damageText.destroy()
                        },
                    })
                })
            },
        })
    }

    /**
     * Clean up UI elements
     */
    destroy(): void {
        this.hearts.forEach((heart) => heart.destroy())
        this.hearts = []

        if (this.instructionText) {
            this.instructionText.destroy()
            this.instructionText = null
        }

        if (this.scoreText) {
            this.scoreText.destroy()
            this.scoreText = null
        }
    }
}
