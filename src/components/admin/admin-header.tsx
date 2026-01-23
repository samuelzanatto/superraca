"use client"

import { motion } from "motion/react"
import { usePathname } from "next/navigation"
import { Bell, Search, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"

// Breadcrumb mapping
const pathLabels: Record<string, string> = {
    admin: "Dashboard",
    "landing-cms": "Landing CMS",
    kids: "Kids Videos",
    messages: "Mensagens",
    ranking: "Ranking",
    users: "Usuários",
    settings: "Configurações",
    quotes: "Frases",
}

export function AdminHeader() {
    const pathname = usePathname()
    const { user } = useAuthStore()

    // Generate breadcrumbs from pathname
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = segments.map((segment, index) => ({
        label: pathLabels[segment] || segment,
        href: "/" + segments.slice(0, index + 1).join("/"),
        isLast: index === segments.length - 1,
    }))

    return (
        <header className="h-14 bg-white border-b border-black/5 flex items-center justify-between px-6 shrink-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <motion.div
                        key={crumb.href}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {index > 0 && <ChevronRight className="w-4 h-4 text-black/30" />}
                        <span
                            className={
                                crumb.isLast
                                    ? "font-semibold text-black"
                                    : "text-black/50 hover:text-black transition-colors"
                            }
                        >
                            {crumb.label}
                        </span>
                    </motion.div>
                ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {/* User Avatar */}
                <motion.div
                    className="flex items-center gap-3 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="w-9 h-9 rounded-full bg-[#0a1628] flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-black">{user?.name || "Admin"}</p>
                        <p className="text-xs text-black/50 capitalize">{user?.role || "admin"}</p>
                    </div>
                </motion.div>
            </div>
        </header>
    )
}
