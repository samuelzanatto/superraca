"use client"

import { motion, useMotionValue, useSpring } from "motion/react"
import { useEffect, useState } from "react"

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smoother spring for main cursor (higher stiffness = faster response)
    const cursorX = useSpring(mouseX, { stiffness: 600, damping: 40, mass: 0.3 })
    const cursorY = useSpring(mouseY, { stiffness: 600, damping: 40, mass: 0.3 })

    // Even smoother for circle on hover
    const circleX = useSpring(mouseX, { stiffness: 150, damping: 25, mass: 0.8 })
    const circleY = useSpring(mouseY, { stiffness: 150, damping: 25, mass: 0.8 })

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            // Show cursor only when user moves mouse
            if (!isVisible) setIsVisible(true)
        }

        const handleLeave = () => setIsVisible(false)
        const handleEnter = () => setIsVisible(true)
        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        // Detect hoverable elements
        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true)
            }
        }

        const handleHoverEnd = () => setIsHovering(false)

        window.addEventListener("mousemove", handleMove)
        window.addEventListener("mouseleave", handleLeave)
        window.addEventListener("mouseenter", handleEnter)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("mouseover", handleHoverStart)
        document.addEventListener("mouseout", handleHoverEnd)

        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("mouseleave", handleLeave)
            window.removeEventListener("mouseenter", handleEnter)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("mouseover", handleHoverStart)
            document.removeEventListener("mouseout", handleHoverEnd)
        }
    }, [mouseX, mouseY, isVisible])

    // Don't render on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null
    }

    // SVG Cursor Component - Filled version (smaller size: 18)
    const FilledCursor = () => (
        <svg width="18" height="18" viewBox="0 0 53 53" fill="none" className="drop-shadow-sm">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.329611 6.76686C-1.17769 2.74744 2.74746 -1.17768 6.76686 0.32961L49.6183 16.3989C54.3838 18.186 53.7438 25.1201 48.7318 26.0046L29.4136 29.4136L26.0046 48.7318C25.1201 53.7438 18.186 54.3838 16.3989 49.6183L0.329611 6.76686Z"
                fill="#0F0F0F"
            />
        </svg>
    )

    return (
        <>
            {/* Main cursor - Filled SVG (hidden on hover) */}
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isVisible && !isHovering ? 1 : 0,
                    scale: !isVisible ? 0 : (isClicking ? 0.85 : 1),
                }}
                transition={{ duration: 0.15 }}
            >
                <FilledCursor />
            </motion.div>

            {/* Circle - Only visible on hover */}
            <motion.div
                className="fixed pointer-events-none z-[9997]"
                style={{
                    x: circleX,
                    y: circleY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0.5,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <div
                    className="w-12 h-12 rounded-full border-2 border-black/50 bg-transparent"
                    style={{ marginLeft: 9, marginTop: 9 }}
                />
            </motion.div>
        </>
    )
}
