/**
 * Manages the overall game state and prevents conflicting states.
 * Ensures only one end-game screen (win/game over) can be active at a time.
 */
export enum GameState {
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
    WIN = 'WIN',
}

export class GameStateManager {
    private currentState: GameState = GameState.PLAYING

    /**
     * Get the current game state
     */
    getState(): GameState {
        return this.currentState
    }

    /**
     * Check if the game is in a specific state
     */
    isState(state: GameState): boolean {
        return this.currentState === state
    }

    /**
     * Check if the game is currently playing (not ended or paused)
     */
    isPlaying(): boolean {
        return this.currentState === GameState.PLAYING
    }

    /**
     * Check if the game has ended (win or game over)
     */
    hasEnded(): boolean {
        return (
            this.currentState === GameState.GAME_OVER ||
            this.currentState === GameState.WIN
        )
    }

    /**
     * Set the game state to playing
     */
    setPlaying(): void {
        this.currentState = GameState.PLAYING
    }

    /**
     * Set the game state to paused
     */
    setPaused(): void {
        if (this.currentState === GameState.PLAYING) {
            this.currentState = GameState.PAUSED
        }
    }

    /**
     * Set the game state to game over
     * Only works if not already ended
     */
    setGameOver(): boolean {
        if (!this.hasEnded()) {
            this.currentState = GameState.GAME_OVER
            return true
        }
        return false
    }

    /**
     * Set the game state to win
     * Only works if not already ended
     */
    setWin(): boolean {
        if (!this.hasEnded()) {
            this.currentState = GameState.WIN
            return true
        }
        return false
    }

    /**
     * Reset the game state to playing
     */
    reset(): void {
        this.currentState = GameState.PLAYING
    }
}
