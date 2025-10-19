import Phaser from 'phaser'

/**
 * Manages all audio for the game including music and sound effects
 */
export class AudioManager {
    private static instance: AudioManager | null = null
    private static readonly VOLUME_STORAGE_KEY = 'susgame_music_volume'
    private scene: Phaser.Scene
    private music: Phaser.Sound.BaseSound | null = null

    // SFX settings
    private sfxVolume = 0.3

    // Music volume settings - two-tier system
    private baseMusicVolume = 0.15 // Internal base level (prevents ear-blasting)
    private userMusicVolume = 0.5 // User-adjustable 0-1 (0% to 100%)
    private maxMusicMultiplier = 2.0 // Multiplier for 100% (0.15 * 2 = 0.3)

    private isMuted = false

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        // Load saved volume from localStorage
        this.loadVolumeFromStorage()
    }

    /**
     * Load saved volume from localStorage
     */
    private loadVolumeFromStorage(): void {
        try {
            const savedVolume = localStorage.getItem(
                AudioManager.VOLUME_STORAGE_KEY
            )
            if (savedVolume !== null) {
                const volume = parseFloat(savedVolume)
                if (!isNaN(volume) && volume >= 0 && volume <= 1) {
                    this.userMusicVolume = volume
                }
            }
        } catch (error) {
            // localStorage might be disabled or unavailable
            console.warn('Failed to load volume from localStorage:', error)
        }
    }

    /**
     * Save volume to localStorage
     */
    private saveVolumeToStorage(): void {
        try {
            localStorage.setItem(
                AudioManager.VOLUME_STORAGE_KEY,
                this.userMusicVolume.toString()
            )
        } catch (error) {
            // localStorage might be disabled or unavailable
            console.warn('Failed to save volume to localStorage:', error)
        }
    }

    /**
     * Get or create global AudioManager instance
     */
    static getInstance(scene: Phaser.Scene): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager(scene)
        } else {
            // Update scene reference if needed
            AudioManager.instance.scene = scene
        }
        return AudioManager.instance
    }

    /**
     * Calculate actual music volume from base and user settings
     */
    private getActualMusicVolume(): number {
        // User volume acts as a multiplier on the base volume
        // 0% (0.0) = 0, 50% (0.5) = base volume, 100% (1.0) = base * maxMultiplier
        return (
            this.baseMusicVolume *
            this.userMusicVolume *
            this.maxMusicMultiplier
        )
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
            volume: this.isMuted ? 0 : this.getActualMusicVolume(),
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

        const sfx = this.scene.sound.add(key, {
            volume: volume ?? this.sfxVolume,
        })
        sfx.play()

        // Auto-destroy after playing to prevent memory leaks
        sfx.once('complete', () => {
            sfx.destroy()
        })
    }

    /**
     * Play trash pickup sound with random pitch variation
     */
    playTrashPickup(): void {
        if (this.isMuted) return

        const sfx = this.scene.sound.add('trash_pickup', {
            volume: this.sfxVolume,
        })

        // Random pitch variation: -200 to +200 cents (2 semitones up/down)
        // detune is in cents: 100 cents = 1 semitone
        const randomDetune = Phaser.Math.Between(-200, 200)

        // Cast to access detune property
        const sound = sfx as
            | Phaser.Sound.WebAudioSound
            | Phaser.Sound.HTML5AudioSound
        if ('setDetune' in sound) {
            sound.setDetune(randomDetune)
        }

        sfx.play()

        // Auto-destroy after playing
        sfx.once('complete', () => {
            sfx.destroy()
        })
    }

    /**
     * Play player damage sound
     */
    playPlayerDamage(): void {
        this.playSfx('player_damage')
    }

    /**
     * Play button hover sound
     */
    playButtonHover(): void {
        this.playSfx('button_hover', 0.3)
    }

    /**
     * Play button click sound
     */
    playButtonClick(): void {
        this.playSfx('button_click', 0.5)
    }

    /**
     * Play victory sound
     */
    playVictory(): void {
        this.playSfx('victory', 0.8)
    }

    /**
     * Play game over sound
     */
    playGameOver(): void {
        this.playSfx('game_over', 0.8)
    }

    /**
     * Set user music volume (0 to 1, where 0.5 = base volume)
     * 0.0 (0%) = silent
     * 0.5 (50%) = base volume (default)
     * 1.0 (100%) = base volume * maxMultiplier
     */
    setUserMusicVolume(volume: number): void {
        this.userMusicVolume = Phaser.Math.Clamp(volume, 0, 1)
        this.updateMusicVolume()
        this.saveVolumeToStorage() // Persist to localStorage
    }

    /**
     * Get current user music volume (0 to 1)
     */
    getUserMusicVolume(): number {
        return this.userMusicVolume
    }

    /**
     * Set base music volume (internal level, not exposed to user)
     */
    setBaseMusicVolume(volume: number): void {
        this.baseMusicVolume = Phaser.Math.Clamp(volume, 0, 1)
        this.updateMusicVolume()
    }

    /**
     * Update the actual playing music volume
     */
    private updateMusicVolume(): void {
        if (this.music && !this.isMuted) {
            const sound = this.music as
                | Phaser.Sound.WebAudioSound
                | Phaser.Sound.HTML5AudioSound
            sound.setVolume(this.getActualMusicVolume())
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
            sound.setVolume(this.isMuted ? 0 : this.getActualMusicVolume())
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
            sound.setVolume(this.isMuted ? 0 : this.getActualMusicVolume())
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
