"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Check } from "lucide-react"
import { motion } from "motion/react"

import { type Product } from "@/data/products"
import { useCartStore } from "@/stores/cart-store"
import { Button } from "@/components/ui/button"

const SIZES = ["P", "M", "G", "GG"]

export function ProductDetailsClient({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState<string>("M")
    const [isAdded, setIsAdded] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const needsSize = product.category === "Camisetas" || product.category === "Moletons"

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price)

    const handleAddToCart = () => {
        addItem(product, needsSize ? selectedSize : undefined)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 py-12 md:py-16">

            {/* Back Navigation */}
            <Link
                href="/loja"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para a loja
            </Link>

            <div className="flex flex-col md:flex-row md:justify-center gap-10 lg:gap-16 xl:gap-72">

                {/* Left: Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] max-w-xl relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-sm"
                >
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </motion.div>

                {/* Right: Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full md:flex-1 flex flex-col justify-start max-w-3xl"
                >
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {product.category}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        {product.title}
                    </h1>

                    <p className="text-2xl md:text-3xl font-black text-black mb-6">
                        {formattedPrice}
                    </p>

                    <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                        {product.description || "O item perfeito para completar seu armário com extrema qualidade e conforto premium desenvolvido especialmente para uso diário."}
                    </p>

                    {/* Size Selector */}
                    {needsSize && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-sm">Escolha o Tamanho</span>
                                <button className="text-xs text-gray-400 underline hover:text-black">Guia de Medidas</button>
                            </div>
                            <div className="flex gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all ${selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 text-gray-600 hover:border-gray-400"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`w-full h-14 rounded-full text-lg font-bold text-white transition-all ${isAdded ? "bg-green-500 hover:bg-green-600" : "bg-black hover:scale-[1.02] hover:shadow-xl"
                            }`}
                    >
                        {isAdded ? (
                            <span className="flex items-center gap-2">
                                <Check className="w-5 h-5" /> Adicionado
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho
                            </span>
                        )}
                    </Button>

                    {/* Features */}
                    <div className="mt-12 pt-8 border-t flex flex-col gap-4 text-sm text-gray-500 font-medium">
                        <p>✓ Frete grátis para compras acima de R$299</p>
                        <p>✓ Qualidade premium 100% garantida</p>
                        <p>✓ Troca e devolução grátis em até 7 dias</p>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
