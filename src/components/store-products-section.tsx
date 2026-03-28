"use client"

import { useState } from "react"
import { StoreProductCard } from "./store-product-card"
import { cn } from "@/lib/utils"

import { PRODUCTS } from "@/data/products"

// Lista exclusiva de categorias baseada nos produtos
const CATEGORIES = ["Todos", "Camisetas", "Moletons", "Acessórios"]

export function StoreProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredProducts =
    selectedCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory)

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20">

      {/* Cabeçalho da Seção e Selector de Categoria */}
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end mb-12">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Nossa Coleção
          </h2>
          <p className="text-gray-500 font-medium">As últimas novidades pra galera que rala.</p>
        </div>

        {/* Badges de Navegação Horizontal */}
        <div className="flex gap-2 p-1 overflow-x-auto bg-gray-100/50 backdrop-blur-sm rounded-full w-full justify-start md:w-auto md:justify-center no-scrollbar overscroll-x-contain">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
                selectedCategory === category
                  ? "bg-black text-white shadow-md scale-100"
                  : "text-gray-600 hover:text-black hover:bg-white scale-95"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-14">
        {filteredProducts.map((product) => (
          <StoreProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Caso nenum produto seja encontrado */}
      {filteredProducts.length === 0 && (
        <div className="flex w-full items-center justify-center p-12 text-gray-400">
          <p>Nenhum produto encontrado nesta categoria...</p>
        </div>
      )}
    </section>
  )
}
