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
import { ShoppingCart } from "lucide-react"

// Configurações de alinhamento do texto
const ALIGN_CONFIG = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
}

// Exemplo de banners para a loja
const banners = [
  {
    id: 1,
    title: "Nova Coleção Exclusiva",
    subtitle: <>Vista a garra.<br />Garanta já a sua.</>, 
    bgColor: "bg-zinc-900",
    image: "/store/banners/v1.png",
    // Agora você pode ter uma configuração para celular (base) e outra para computador (md)
    bgPosition: { base: "right center", md: "right 50%" }, // Posicionando a imagem na direita no mobile para não chocar com o texto
    bgSize: { base: "cover", md: "115%" }, // "cover" no mobile evita que sobre espaço vazio aparecendo o fundo preto
    contentAlign: "left" as keyof typeof ALIGN_CONFIG, // "left", "center", ou "right"
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
        <CarouselContent className={banners.length === 1 ? "justify-center" : ""}>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className={banners.length === 1 ? "basis-[96%] md:basis-[90%] lg:basis-[85%]" : "basis-[92%] md:basis-[85%] lg:basis-[80%]"}>
              <div
                className={`relative w-full h-[300px] md:h-[400px] lg:h-[700px] ${banner.bgColor} overflow-hidden rounded-3xl flex items-center justify-center shadow-lg`}
              >
                {/* Imagem de Fundo (Responsiva) */}
                <div
                  className="absolute inset-0 bg-no-repeat bg-[position:var(--bg-pos-base)] md:bg-[position:var(--bg-pos-md)] bg-[size:var(--bg-size-base)] md:bg-[size:var(--bg-size-md)]"
                  style={{
                    backgroundImage: `url(${banner.image})`,
                    "--bg-pos-base": banner.bgPosition?.base || "center",
                    "--bg-pos-md": banner.bgPosition?.md || "center",
                    "--bg-size-base": banner.bgSize?.base || "cover",
                    "--bg-size-md": banner.bgSize?.md || "cover",
                  } as React.CSSProperties}
                />

                {/* Overlay suave para garantir legibilidade sem pesar */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Conteúdo Textual */}
                <div className={`relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col gap-4 ${ALIGN_CONFIG[banner.contentAlign] || ALIGN_CONFIG.left}`}>
                  <span className="text-white/80 font-semibold tracking-wider text-xs md:text-sm uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    Destaque
                  </span>
                  <h2 className="text-white font-black text-3xl md:text-5xl lg:text-6xl tracking-tight max-w-2xl leading-none">
                    {banner.title}
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl max-w-lg font-medium">
                    {banner.subtitle}
                  </p>

                  <button className="mt-4 bg-white text-black w-12 h-12 md:w-auto md:h-auto md:px-8 md:py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center gap-2">
                    <ShoppingCart className="w-6 h-6 md:hidden" />
                    <span className="hidden md:block">Comprar Agora</span>
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
