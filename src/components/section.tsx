"use client"

import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef } from "react"

interface SectionProps {
    id: string
    title: string
    subtitle?: string
    children?: React.ReactNode
    className?: string
    dark?: boolean
}

export function Section({
    id,
    title,
    subtitle,
    children,
    className = "",
    dark = false,
}: SectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            id={id}
            ref={ref}
            className={`min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-white text-black ${className}`}
        >
            <motion.div
                className="max-w-6xl mx-auto w-full text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.span
                    className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-blue-900 bg-blue-100/50 border border-blue-200 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {subtitle || "Seção"}
                </motion.span>

                <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <span className="text-black">
                        {title}
                    </span>
                </motion.h2>

                <motion.div
                    className="w-24 h-1 mx-auto mb-12 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-full"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                />

                {/* Placeholder Content */}
                {children || (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-black">
                                    Conteúdo em breve
                                </h3>
                                <p className="text-black/60 text-sm leading-relaxed">
                                    Esta seção está sendo desenvolvida. Em breve teremos conteúdo
                                    incrível para você!
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </section>
    )
}
