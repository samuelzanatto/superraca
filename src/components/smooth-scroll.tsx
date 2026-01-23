"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        // Initialize Lenis with ultra-smooth settings
        const lenis = new Lenis({
            duration: 1.8, // Longer duration = smoother feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for premium feel
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8, // Slower wheel = more control
            touchMultiplier: 1.5,
        })

        lenisRef.current = lenis

        // Animation frame loop
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // Cleanup on unmount
        return () => {
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
