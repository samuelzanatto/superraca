"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    ImageIcon,
    Video,
    BookOpen,
    Trophy,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings,
    Quote,
    Camera
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Landing CMS",
        href: "/admin/landing-cms",
        icon: ImageIcon,
    },
    {
        label: "Fotos Galeria",
        href: "/admin/photos",
        icon: Camera,
    },
    {
        label: "Kids Videos",
        href: "/admin/kids",
        icon: Video,
    },
    {
        label: "Frases Hero",
        href: "/admin/quotes",
        icon: Quote,
    },
    {
        label: "Mensagens",
        href: "/admin/messages",
        icon: BookOpen,
    },
    {
        label: "Ranking",
        href: "/admin/ranking",
        icon: Trophy,
    },
    {
        label: "Usuários",
        href: "/admin/users",
        icon: Users,
        adminOnly: true,
    },
]

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { canManageUsers, logout } = useAuthStore()

    const filteredNavItems = navItems.filter(
        (item) => !item.adminOnly || canManageUsers()
    )

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }


    return (
        <motion.aside
            className={cn(
                "h-full flex flex-col overflow-hidden shrink-0",
                isCollapsed ? "w-20" : "w-56"
            )}
            animate={{ width: isCollapsed ? 80 : 224 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Logo */}
            <div className="flex items-center justify-center px-4 py-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.img
                        src="/logo.png"
                        alt="Super Raça"
                        className="h-14 w-auto object-contain invert transition-transform group-hover:scale-105"
                    />
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="font-bold text-[#0a1628] text-sm leading-tight tracking-wide">
                                SUPER RAÇA
                            </span>
                            <span className="text-[10px] font-bold text-[#0a1628]/50 tracking-[0.2em] leading-tight">
                                ADMINISTRATIVO
                            </span>
                        </motion.div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 flex flex-col gap-2 overflow-y-auto">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href))

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className={cn(
                                    "flex items-center rounded-xl transition-all relative",
                                    isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                                    isActive
                                        ? "bg-[#0a1628] text-white shadow-md shadow-[#0a1628]/20"
                                        : "text-black/50 hover:text-black hover:bg-black/5"
                                )}
                                whileHover={{ x: isActive ? 0 : 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-medium text-sm whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 py-3 space-y-1">
                <Link href="/admin/settings">
                    <motion.div
                        className={cn(
                            "flex items-center rounded-xl transition-colors",
                            isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                            pathname === "/admin/settings"
                                ? "bg-[#0a1628] text-white shadow-md shadow-[#0a1628]/20"
                                : "text-black/50 hover:text-black hover:bg-black/5"
                        )}
                        whileHover={{ x: pathname === "/admin/settings" ? 0 : 4 }}
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Configurações</span>}
                    </motion.div>
                </Link>

                <motion.button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-50 transition-colors",
                        isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                    )}
                    whileHover={{ x: 4 }}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">Sair</span>}
                </motion.button>

                {/* Collapse Toggle */}
                <motion.button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black/5 text-black/40 hover:text-black/60 hover:bg-black/10 transition-colors mt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-medium">Recolher</span>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.aside>
    )
}
