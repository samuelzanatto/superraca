"use client"

import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    if (typeof document === "undefined") return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden"
                    >
                        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-black">{title}</h2>
                                {description && <p className="text-sm text-black/50 mt-1">{description}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-black/40" />
                            </button>
                        </div>

                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
