"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

// Exemplo de banners para a loja
const banners = [
  {
    id: 1,
    title: "Nova Coleção Exclusiva",
    subtitle: "Vista a garra. Garanta já a sua.",
    bgColor: "bg-zinc-900",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200",
  },
  {
    id: 2,
    title: "Frete Grátis Sul & Sudeste",
    subtitle: "Em compras acima de R$ 299.",
    bgColor: "bg-black",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200",
  },
  {
    id: 3,
    title: "Acessórios Super Raça",
    subtitle: "O detalhe que faltava no seu dia.",
    bgColor: "bg-zinc-800",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200",
  }
]

export function StoreHeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="w-full relative bg-white py-6 overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full mx-auto"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="basis-[92%] md:basis-[85%] lg:basis-[80%]">
              <div
                className={`relative w-full h-[300px] md:h-[400px] lg:h-[700px] ${banner.bgColor} overflow-hidden rounded-3xl flex items-center justify-center shadow-lg`}
              >
                {/* Imagem de Fundo com Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                  style={{ backgroundImage: `url(${banner.image})` }}
                />

                {/* Gradiente para garantir legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Conteúdo Textual */}
                <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col items-start gap-4">
                  <span className="text-white/80 font-semibold tracking-wider text-xs md:text-sm uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    Destaque
                  </span>
                  <h2 className="text-white font-black text-3xl md:text-5xl lg:text-6xl tracking-tight max-w-2xl leading-none">
                    {banner.title}
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl max-w-lg font-medium">
                    {banner.subtitle}
                  </p>

                  <button className="mt-4 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg">
                    Comprar Agora
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas de Navegação Sobrepostas Harmoniosamente */}
        <CarouselPrevious className="hidden md:flex left-4 lg:left-8 !bg-white hover:!bg-gray-100 !text-black border-none shadow-md transition-colors" />
        <CarouselNext className="hidden md:flex right-4 lg:right-8 !bg-white hover:!bg-gray-100 !text-black border-none shadow-md transition-colors" />

        {/* Dots (Indicadores) */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
