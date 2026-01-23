"use client"

import { motion } from "motion/react"

/**
 * Immersive Gradient Blobs Component
 * 
 * These gradient blobs are rendered at the page level with `position: fixed`
 * so they stay visible across all sections as the user scrolls.
 * 
 * Technique:
 * - `fixed` positioning keeps them pinned to viewport corners
 * - `pointer-events-none` ensures they don't block interactions
 * - Low opacity (0.25) for subtle, ambient effect
 * - Large blur for soft, immersive appearance
 * - Gentle animation for "alive" feel without being distracting
 */
export function GradientBlobs() {
    return (
        <>
            {/* Top-Left Gradient Blob */}
            <motion.div
                className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-900 rounded-full blur-[150px] pointer-events-none z-[1]"
                style={{ transform: "translate(-30%, -30%)" }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.25,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 2, delay: 3, ease: "easeOut" }
                }}
            />

            {/* Bottom-Right Gradient Blob */}
            <motion.div
                className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-900 rounded-full blur-[180px] pointer-events-none z-[1]"
                style={{ transform: "translate(30%, 30%)" }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.25,
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    scale: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 },
                    opacity: { duration: 2, delay: 3.5, ease: "easeOut" }
                }}
            />
        </>
    )
}
