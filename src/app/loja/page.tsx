import { StoreHeader } from "@/components/store-header";
import { StoreHeroCarousel } from "@/components/store-hero-carousel";
import { StoreProductsSection } from "@/components/store-products-section";
export default function Loja() {
    return (
        <main className="relative min-h-screen cursor-none bg-white">
            <StoreHeader />
            <StoreHeroCarousel />
            <StoreProductsSection />
        </main>
    );
}