import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './config/GameConfig'

export function PhaserGame() {
    const gameRef = useRef<Phaser.Game | null>(null)

    useEffect(() => {
        if (gameRef.current) return

        // Initialize Phaser game
        gameRef.current = new Phaser.Game(gameConfig)

        // Cleanup on unmount
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true)
                gameRef.current = null
            }
        }
    }, [])

    return (
        <div
            id="game-container"
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
            }}
        />
    )
}
