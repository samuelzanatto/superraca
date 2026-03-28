import Link from "next/link"
import Image from "next/image"
import { type Product } from "@/data/products"

interface StoreProductCardProps {
  product: Product
}

export function StoreProductCard({ product }: StoreProductCardProps) {
  // Formatar preço para Reais (BRL)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price)

  return (
    <Link href={`/loja/produto/${product.slug}`} className="group relative flex flex-col cursor-pointer">
      {/* Container da Imagem */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 transition-all">
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-black px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-white shadow-sm">
            Novo
          </div>
        )}
        
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Hover overlay indicando clique - opcional, mas elegante */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      {/* Informações do Produto */}
      <div className="mt-4 flex flex-col items-center text-center px-1">
        <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {product.category}
        </p>
        <p className="mt-2 text-base md:text-lg font-black text-black">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}
