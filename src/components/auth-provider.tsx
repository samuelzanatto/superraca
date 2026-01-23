"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore(state => state.initialize)

    useEffect(() => {
        // Initialize auth state from cookies-based session
        // The middleware ensures the session is always fresh
        initialize()
    }, [initialize])

    return <>{children}</>
}
