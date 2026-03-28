import { getProductBySlug } from "@/data/products"
import { notFound } from "next/navigation"
import { ProductDetailsClient } from "@/components/product-details-client"
import { StoreHeader } from "@/components/store-header"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = getProductBySlug(slug)

    if (!product) {
        return notFound()
    }

    return (
        <main className="relative min-h-screen bg-white cursor-none">
            <StoreHeader />
            <ProductDetailsClient product={product} />
        </main>
    )
}
