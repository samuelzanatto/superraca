import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import { Session, User as SupabaseUser } from "@supabase/supabase-js"

export type UserRole = "admin" | "editor" | "user"

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatarUrl?: string
}

interface AuthState {
    user: User | null
    session: Session | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    initialize: () => Promise<void>
    logout: () => Promise<void>
    setUser: (user: User | null) => void // Helper for manual updates if needed

    // Computed selectors
    isAdmin: () => boolean
    isEditor: () => boolean
    canManageUsers: () => boolean
    canEditContent: () => boolean
}

// Helper to map Supabase user to our User type
const mapSupabaseUser = (sbUser: SupabaseUser | null): User | null => {
    if (!sbUser) return null
    // You might want to fetch role from metadata or a separate table
    // For now, defaulting to 'admin' for known email or specific metadata
    const role = (sbUser.user_metadata?.role as UserRole) || "admin"

    return {
        id: sbUser.id,
        name: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "User",
        email: sbUser.email || "",
        role: role,
        avatarUrl: sbUser.user_metadata?.avatar_url,
    }
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true, // Start true, set false after initialize

    initialize: async () => {
        set({ isLoading: true })
        try {
            // Check active session
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                set({
                    session,
                    user: mapSupabaseUser(session.user),
                    isAuthenticated: true,
                    isLoading: false
                })
            } else {
                set({ user: null, session: null, isAuthenticated: false, isLoading: false })
            }

            // Listen for changes
            supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    set({
                        session,
                        user: mapSupabaseUser(session.user),
                        isAuthenticated: true,
                        isLoading: false
                    })
                } else {
                    set({ user: null, session: null, isAuthenticated: false, isLoading: false })
                }
            })

        } catch (error) {
            console.error("Auth initialization failed:", error)
            set({ isLoading: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })
        await supabase.auth.signOut()
        set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false
        })
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    // Computed
    isAdmin: () => get().user?.role === "admin",
    isEditor: () => get().user?.role === "editor" || get().user?.role === "admin",
    canManageUsers: () => get().user?.role === "admin",
    canEditContent: () => get().user?.role === "admin" || get().user?.role === "editor",
}))
