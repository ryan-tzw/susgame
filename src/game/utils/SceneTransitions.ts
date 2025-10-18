import Phaser from 'phaser'

export class SceneTransitions {
    static DURATION_DEFAULT = 1000

    /**
     * Circle wipe out - shrinks view to a point (transitioning away from scene)
     * @param scene The scene to transition from
     * @param options Configuration options
     */
    static circleWipeOut(
        scene: Phaser.Scene,
        options: {
            x?: number
            y?: number
            duration?: number
            onComplete?: () => void
        } = {}
    ): void {
        const { duration = this.DURATION_DEFAULT, onComplete } = options
        const cam = scene.cameras.main
        const w = cam.width
        const h = cam.height
        const cx = options.x ?? w / 2
        const cy = options.y ?? h / 2
        const rMax = Math.hypot(w, h) // Cover whole screen

        // Create a black overlay that will be revealed as the circle shrinks
        const overlay = scene.add.rectangle(0, 0, w, h, 0x000000)
        overlay.setOrigin(0, 0)
        overlay.setDepth(9999)
        overlay.setScrollFactor(0)

        // Create graphics for the mask (this will show the overlay everywhere EXCEPT inside the circle)
        const graphics = scene.add.graphics().setScrollFactor(0)
        graphics.fillStyle(0xffffff, 0)
        graphics.fillCircle(cx, cy, rMax)

        // Apply inverted mask to the overlay (show overlay everywhere except where circle is)
        const mask = graphics.createGeometryMask()
        mask.setInvertAlpha(true)
        overlay.setMask(mask)

        // Tween the circle radius down to 0
        scene.tweens.add({
            targets: { r: rMax },
            r: 0,
            duration,
            ease: 'Cubic.easeInOut',
            onUpdate: (_tween, target) => {
                graphics.clear()
                graphics.fillStyle(0xffffff, 0)
                graphics.fillCircle(cx, cy, target.r)
            },
            onComplete: () => {
                // Don't clean up yet - keep the black screen visible
                // The cleanup will happen when the scene stops

                if (onComplete) {
                    onComplete()
                }
            },
        })
    }

    /**
     * Circle wipe in - expands view from a point (transitioning into scene)
     * @param scene The scene to transition to
     * @param options Configuration options
     */
    static circleWipeIn(
        scene: Phaser.Scene,
        options: {
            x?: number
            y?: number
            duration?: number
        } = {}
    ): void {
        const { duration = this.DURATION_DEFAULT } = options
        const cam = scene.cameras.main
        const w = cam.width
        const h = cam.height
        const cx = options.x ?? w / 2
        const cy = options.y ?? h / 2
        const rMax = Math.hypot(w, h)

        // Set camera background to black
        cam.setBackgroundColor('#000000')

        // Create graphics for the mask starting with radius 0
        const graphics = scene.add.graphics().setScrollFactor(0)
        graphics.fillStyle(0xffffff, 1)
        graphics.fillCircle(cx, cy, 0)

        // Create mask and apply to camera
        const mask = graphics.createGeometryMask()
        cam.setMask(mask)

        // Tween the circle radius up to full size
        scene.tweens.add({
            targets: { r: 0 },
            r: rMax,
            duration,
            ease: 'Cubic.easeInOut',
            onUpdate: (_tween, target) => {
                graphics.clear()
                graphics.fillStyle(0xffffff, 1)
                graphics.fillCircle(cx, cy, target.r)
            },
            onComplete: () => {
                // Remove mask and destroy graphics
                cam.clearMask(true)
            },
        })
    }
}
