"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User as UserIcon } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import { useCartStore } from "@/stores/cart-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function StoreHeader() {
    const { user, isAuthenticated, isLoading } = useAuthStore()
    const { items, removeItem, updateItemQuantity, getTotalPrice, getTotalItems } = useCartStore()
    const { scrollY } = useScroll()
    
    const totalItems = getTotalItems()
    const totalPrice = getTotalPrice()
    const [isSticky, setIsSticky] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsSticky(latest >= 650)
    })

    return (
        <>
            {/* Ocupa o espaço real na página, nunca se altera */}
            <div className="h-20 w-full" />
            
            {/* Wrapper que viaja e atraca perfeitamente sem alterar a altura do layout (h-0) */}
            <div className="sticky top-0 z-[110] w-full h-0">
                <motion.header
                    className={cn(
                        "absolute left-0 right-0 h-20 w-full transition-colors duration-300",
                        // Estado sticky sem sombra/borda pedido! E estado puro com bg-white
                        isSticky ? "bg-white/95 backdrop-blur-md" : "bg-white"
                    )}
                    initial={false}
                    // -80px deixa a placa "pendurada" invisível acoplada até chegar a exata borda, parecendo uma header fixa na página!
                    animate={{ y: isSticky ? 0 : -80 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 mx-auto flex items-center justify-between h-20">
                {/* 1. Logo (Esquerda) */}
                <Link href="/" className="flex items-center group shrink-0">
                    <img
                        src="/logo.png"
                        alt="Super Raça"
                        className="h-12 w-auto invert transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* 2. Searchbar (Centro) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-black" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-full pl-12 pr-6 py-3 text-sm outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 3. Carrinho e Avatar (Direita) */}
                <div className="flex items-center gap-4 shrink-0">
                    <button className="md:hidden relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 hover:text-black hover:bg-transparent transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 hover:text-black hover:bg-transparent transition-colors cursor-pointer">
                                <ShoppingCart className="w-5 h-5" />
                                {/* Indicador de items no carrinho */}
                                {totalItems > 0 && (
                                    <span className="absolute top-1 right-1 h-4 w-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md border-l border-gray-100 bg-white">
                            <SheetHeader className="text-left border-b border-gray-100 pb-4">
                                <SheetTitle className="text-xl font-bold font-poppins text-black flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Seu Carrinho
                                </SheetTitle>
                                <SheetDescription className="text-sm text-gray-500">
                                    Seus produtos selecionados aparecerão aqui.
                                </SheetDescription>
                            </SheetHeader>
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full pb-20 opacity-50 space-y-4">
                                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                                    <p className="text-gray-500 font-medium">O carrinho está vazio</p>
                                </div>
                            ) : (
                                <div className="flex flex-col h-[calc(100vh-8rem)]">
                                    <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                                        {items.map((item) => (
                                            <div key={`${item.product.id}-${item.size}`} className="flex gap-4 border-b border-gray-100 pb-4">
                                                <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between py-1">
                                                    <div>
                                                        <h4 className="font-bold text-sm line-clamp-2 text-gray-900 leading-tight mb-1">{item.product.title}</h4>
                                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{item.size ? `Tamanho: ${item.size}` : item.product.category}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
                                                            <button onClick={() => updateItemQuantity(item.product.id, item.size, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 text-xs font-bold hover:text-black">-</button>
                                                            <span className="text-xs font-bold w-4 text-center bg-transparent">{item.quantity}</span>
                                                            <button onClick={() => updateItemQuantity(item.product.id, item.size, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white shadow-sm text-xs font-bold hover:scale-105 transition-transform">+</button>
                                                        </div>
                                                        <button onClick={() => removeItem(item.product.id, item.size)} className="text-[11px] text-gray-400 font-bold hover:text-red-500 transition-colors uppercase tracking-wider">
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 mt-auto bg-white">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-bold text-gray-500 uppercase text-sm tracking-wider">Total</span>
                                            <span className="text-2xl font-black text-black">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                                            </span>
                                        </div>
                                        <Button className="w-full h-14 rounded-full font-bold text-base bg-black hover:bg-black/90 hover:scale-[1.02] shadow-xl shadow-black/10 transition-all">
                                            Finalizar Compra
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>

                    {/* Divisor */}
                    <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                    {/* Avatar do Usuário */}
                    {!isLoading && isAuthenticated && user ? (
                        <Link href="/admin">
                            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-gray-200 shadow-sm cursor-pointer transition-all">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="bg-black text-white text-sm font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 hover:text-black hover:bg-transparent transition-colors">
                                <UserIcon className="w-5 h-5" />
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
        </div>
        </>
    )
}
