"use client"

import { motion } from "motion/react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
    children: React.ReactNode
}

export function AdminPageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="flex-1"
        >
            {children}
        </motion.div>
    )
}

