// Re-export the browser client for backward compatibility
// All client-side code should use this export
import { createClient } from './supabase/client'

// Create a singleton instance for client components
// This ensures consistent session state across the app
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
    if (!supabaseInstance) {
        supabaseInstance = createClient()
    }
    return supabaseInstance
})()

// Also export createClient for cases where a fresh instance is needed
export { createClient }
