"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/stores/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

const navItems = [
    { label: "Início", href: "#home" },
    { label: "Galeria", href: "#galeria" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Equipe", href: "#equipe" },
]

export function Header() {
    const { scrollY } = useScroll()
    const [hasScrolled, setHasScrolled] = useState(false)

    const pathname = usePathname()



    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 50)
        })
        return () => unsubscribe()
    }, [scrollY])

    const isHome = pathname === "/"

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-[110]"
            style={{
                backgroundColor: hasScrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
                backdropFilter: hasScrolled ? "blur(12px)" : "none",
                borderBottom: hasScrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
                paddingTop: hasScrolled ? "0.5rem" : "1rem",
                paddingBottom: hasScrolled ? "0.5rem" : "1rem",
                transition: "background-color 0.3s, backdrop-filter 0.3s, border-bottom 0.3s, padding 0.3s",
                display: isHome ? "block" : "none",
            }}
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <nav className="relative max-w-[80%] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo.png"
                        alt="Super Raça"
                        className="h-16 w-auto invert"
                    />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
                    <NavItems />
                </div>

                <div>
                    <AuthenticationButton />
                </div>
            </nav>
        </motion.header>
    )
}

function NavItems() {
    const [activeSection, setActiveSection] = useState("home") // Start with home active

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => item.href.substring(1))
            const scrollPosition = window.scrollY + 100 // Offset

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    let { offsetTop, offsetHeight } = element

                    // If element is a small anchor, use parent section dimensions
                    if (offsetHeight < 50 && element.parentElement) {
                        offsetTop = element.parentElement.offsetTop
                        offsetHeight = element.parentElement.offsetHeight
                    }

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        return
                    }
                }
            }
            // If at top, set to home
            if (window.scrollY < 50) setActiveSection("home")
        }

        // Call once on mount to set initial state
        handleScroll()

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${isActive ? "text-black" : "text-black/60 hover:text-black"
                            }`}
                    >
                        {item.label}
                        {/* Hover Active State */}
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 ease-out ${isActive ? "w-3/4" : "w-0 group-hover:w-1/2"}`} />
                    </Link>
                )
            })}
        </>
    )
}

function AuthenticationButton() {
    const { user, isAuthenticated, isLoading } = useAuthStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true)
    }, [])

    if (!mounted || isLoading) return null

    if (isAuthenticated && user) {
        return (
            <Link href="/admin">
                <motion.div
                    className="flex items-center bg-black rounded-full cursor-pointer overflow-hidden p-0"
                    initial="initial"
                    whileHover="hover"

                >
                    <motion.div
                        variants={{
                            initial: { width: 0, opacity: 0 },
                            hover: { width: "auto", opacity: 1 }
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden whitespace-nowrap"
                    >
                        <span className="text-sm font-medium text-white pl-4 pr-1 whitespace-nowrap inline-block">
                            Dashboard
                        </span>
                    </motion.div>

                    <div className="relative z-10 m-0">
                        <Avatar className="h-9 w-9 border-none">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="bg-white/20 text-white text-xs font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </motion.div>
            </Link>
        )
    }

    return (
        <Link href="/login">
            <Button
                variant="default"
                className="bg-black hover:bg-black/90 text-white font-bold px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
                Entrar
            </Button>
        </Link>
    )
}

