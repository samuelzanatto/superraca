"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

const navItems = [
    { label: "Início", href: "#home" },
    { label: "Galeria", href: "#galeria" },
    { label: "W.M.B", href: "#wmb" },
    { label: "PJD", href: "#pjd" },
    { label: "Loja", href: "/loja" },
]

export function Header() {
    const { scrollY } = useScroll()
    const [hasScrolled, setHasScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 50)
        })
        return () => unsubscribe()
    }, [scrollY])

    const isHome = pathname === "/"

    return (
        <>
        <motion.header
            className={`fixed top-0 left-0 right-0 z-[110] ${hasScrolled ? "py-1.5 md:py-2" : "py-2 md:py-4"}`}
            style={{
                backgroundColor: hasScrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
                backdropFilter: hasScrolled ? "blur(12px)" : "none",
                borderBottom: hasScrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
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
            <nav className="relative w-full px-4 sm:px-12 md:px-16 lg:px-24 xl:px-32 mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo.png"
                        alt="Super Raça"
                        className="h-10 md:h-16 w-auto invert"
                    />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
                    <NavItems onSelect={() => {}} />
                </div>

                <div className="hidden md:flex items-center gap-4 z-50">
                    <LiveStatusButton />
                    <AuthenticationButton />
                </div>

                <div className="flex md:hidden items-center z-50">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="p-2 text-black hover:bg-black/5 rounded-full transition-colors"
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>
        </motion.header>

        {/* Menu Mobile — fora do header para backdrop-filter funcionar */}
        {isHome && (
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed left-0 right-0 z-[109] bg-white/60 backdrop-blur-2xl border-b border-black/5 overflow-hidden shadow-lg"
                        style={{
                            top: hasScrolled ? "calc(0.35rem * 2 + 2.5rem)" : "calc(0.5rem * 2 + 2.5rem)",
                            transition: "top 0.3s",
                        }}
                    >
                        <div className="flex flex-col items-center py-4 px-4 gap-3">
                            <NavItems onSelect={() => setIsMobileMenuOpen(false)} isMobile />
                            <div className="w-full h-px bg-black/10 my-1" />
                            <div className="flex flex-col items-center gap-3 w-full">
                                <LiveStatusButton />
                                <div className="w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <AuthenticationButton />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        )}
        </>
    )
}

function NavItems({ onSelect, isMobile }: { onSelect: () => void, isMobile?: boolean }) {
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
                        onClick={onSelect}
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${isActive ? "text-black" : "text-black/60 hover:text-black"
                            } ${isMobile ? "text-base font-bold w-full text-center py-2.5" : ""}`}
                    >
                        {item.label}
                        {/* Hover Active State */}
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 ease-out ${isActive ? "w-3/4" : "w-0 group-hover:w-1/2"} ${isMobile ? "hidden" : ""}`} />
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
                className="bg-black hover:bg-black/90 text-white font-bold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            >
                Acesse
            </Button>
        </Link>
    )
}

function LiveStatusButton() {
    const [liveData, setLiveData] = useState<{ isLive: boolean, url: string } | null>(null)

    useEffect(() => {
        const checkLiveStatus = async () => {
            try {
                const res = await fetch('/api/youtube-live')
                if (res.ok) {
                    const data = await res.json()
                    setLiveData(data)
                }
            } catch (err) {
                console.error("Erro ao checar status da live:", err)
            }
        }
        
        checkLiveStatus()
        
        // Verifica novamente a cada 5 minutos
        const interval = setInterval(checkLiveStatus, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (!liveData?.isLive) return null

    return (
        <a href={liveData.url} target="_blank" rel="noopener noreferrer">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm shadow-md transition-all cursor-pointer"
            >
                <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </div>
                AO VIVO
            </motion.div>
        </a>
    )
}

