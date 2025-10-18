import Phaser from 'phaser'

/**
 * Manages all audio for the game including music and sound effects
 */
export class AudioManager {
    private scene: Phaser.Scene
    private music: Phaser.Sound.BaseSound | null = null
    private sfxVolume = 0.7
    private musicVolume = 0.5
    private isMuted = false

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    /**
     * Play background music with optional looping
     */
    playMusic(key: string, loop = true): void {
        // Stop current music if playing
        this.stopMusic()

        // Play new music
        this.music = this.scene.sound.add(key, {
            loop,
            volume: this.isMuted ? 0 : this.musicVolume,
        })
        this.music.play()
    }

    /**
     * Stop currently playing music
     */
    stopMusic(): void {
        if (this.music) {
            this.music.stop()
            this.music.destroy()
            this.music = null
        }
    }

    /**
     * Play a sound effect
     */
    playSfx(key: string, volume?: number): void {
        if (this.isMuted) return

        // TODO: Temporarily disabled - audio files not added yet
        console.log(
            `[SFX] Would play: ${key} at volume ${volume ?? this.sfxVolume}`
        )

        // const sfx = this.scene.sound.add(key, {
        //     volume: volume ?? this.sfxVolume,
        // })
        // sfx.play()

        // // Auto-destroy after playing to prevent memory leaks
        // sfx.once('complete', () => {
        //     sfx.destroy()
        // })
    }

    /**
     * Play trash pickup sound
     */
    playTrashPickup(): void {
        console.log('[SFX] Trash pickup sound')
        // this.playSfx('trash_pickup')
    }

    /**
     * Play correct bin deposit sound
     */
    playCorrectDeposit(): void {
        console.log('[SFX] Correct deposit sound')
        // this.playSfx('correct_deposit')
    }

    /**
     * Play wrong bin deposit sound
     */
    playWrongDeposit(): void {
        console.log('[SFX] Wrong deposit sound')
        // this.playSfx('wrong_deposit')
    }

    /**
     * Play player damage sound
     */
    playPlayerDamage(): void {
        console.log('[SFX] Player damage sound')
        // this.playSfx('player_damage')
    }

    /**
     * Play button hover sound
     */
    playButtonHover(): void {
        console.log('[SFX] Button hover sound')
        // this.playSfx('button_hover', 0.3)
    }

    /**
     * Play button click sound
     */
    playButtonClick(): void {
        console.log('[SFX] Button click sound')
        // this.playSfx('button_click', 0.5)
    }

    /**
     * Play victory sound
     */
    playVictory(): void {
        console.log('[SFX] Victory sound')
        // this.playSfx('victory', 0.8)
    }

    /**
     * Play game over sound
     */
    playGameOver(): void {
        console.log('[SFX] Game over sound')
        // this.playSfx('game_over', 0.8)
    }

    /**
     * Set music volume (0 to 1)
     */
    setMusicVolume(volume: number): void {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1)
        if (this.music && !this.isMuted) {
            const sound = this.music as
                | Phaser.Sound.WebAudioSound
                | Phaser.Sound.HTML5AudioSound
            sound.setVolume(this.musicVolume)
        }
    }

    /**
     * Set sound effects volume (0 to 1)
     */
    setSfxVolume(volume: number): void {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1)
    }

    /**
     * Toggle mute for all audio
     */
    toggleMute(): void {
        this.isMuted = !this.isMuted
        if (this.music) {
            const sound = this.music as
                | Phaser.Sound.WebAudioSound
                | Phaser.Sound.HTML5AudioSound
            sound.setVolume(this.isMuted ? 0 : this.musicVolume)
        }
    }

    /**
     * Set mute state
     */
    setMute(muted: boolean): void {
        this.isMuted = muted
        if (this.music) {
            const sound = this.music as
                | Phaser.Sound.WebAudioSound
                | Phaser.Sound.HTML5AudioSound
            sound.setVolume(this.isMuted ? 0 : this.musicVolume)
        }
    }

    /**
     * Get current mute state
     */
    isMutedState(): boolean {
        return this.isMuted
    }

    /**
     * Clean up audio resources
     */
    destroy(): void {
        this.stopMusic()
    }
}
