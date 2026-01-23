"use client"

import { QueryProvider } from "@/lib/query-provider"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminPageTransition } from "@/components/admin/page-transition"
import { useAuthStore } from "@/stores/auth-store"
import { useEffect, useState, useLayoutEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, user } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isChecking, setIsChecking] = useState(true)

    // Check authentication on mount and state change
    useEffect(() => {
        // Small delay to allow Zustand to hydrate from localStorage
        const timer = setTimeout(() => {
            setIsChecking(false)
            if (!useAuthStore.getState().isAuthenticated) {
                router.push("/login")
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [router, isAuthenticated]) // Added isAuthenticated dependency

    // Lock body scroll when in admin layout to prevent background scrolling
    // Use useLayoutEffect for synchronous update before paint
    useLayoutEffect(() => {
        // Only lock if we're in admin route
        if (pathname?.startsWith('/admin')) {
            document.body.style.overflow = "hidden"
        }

        return () => {
            // Always reset on cleanup
            document.body.style.overflow = ""
        }
    }, [pathname])

    // Show loading while checking auth
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a1628]" />
            </div>
        )
    }

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a1628]" />
            </div>
        )
    }

    return (
        <QueryProvider>
            {/* Container Pai: h-screen, max-h-screen, fundo cinza, padding uniforme, sem scroll (controlado no body) */}
            <div className="h-screen w-full bg-slate-100 p-12 flex gap-6 overflow-hidden">
                {/* Sidebar: h-full, rounded, overflow interno */}
                <AdminSidebar />

                {/* Conteúdo Principal: flex-1, h-full, rounded, overflow interno */}
                <div className="flex-1 h-full bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden flex flex-col">
                    <AdminHeader />
                    <main className="flex-1 p-6 overflow-y-auto">
                        <AdminPageTransition>
                            {children}
                        </AdminPageTransition>
                    </main>
                </div>
            </div>
        </QueryProvider>
    )
}
