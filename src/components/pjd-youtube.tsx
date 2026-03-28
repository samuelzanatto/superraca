"use client"

import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useRef } from "react"

const videos = [
    { id: "l8qfMX4ZnT8", title: "PRINCÍPIOS - Ir. Jonatas Yogiro | 12º PJD #9" },
    { id: "CuM-LS8878Q", title: "NÃO SE CONFORME COM ESTE MUNDO - Ir. Jonatas Yogiro | 12º PJD #7" },
    { id: "qBy6qVDV6aM", title: "A JORNADA DA MENTE DE DEUS AO CORPO GLORIFICADO | 12º PJD #6" },
    { id: "kN8ZKHxxrZ4", title: "AS 7 ETAPAS DO JUÍZO DIVINO: O JULGAMENTO DE DEUS JÁ COMEÇOU | 12º PJD #5" },
    { id: "KyRy7lEWX5g", title: "O PORTAL PARA O MUNDO INVERTIDO, UM UNIVERSO PARALELO E O CONTROLE MENTAL | 12º PJD #4" },
    { id: "vkm9jueX7JA", title: "CIENTISTAS DO DIABO vs WILLIAM BRANHAM - Ir. Jonatas Yogiro | 12º PJD #1" },
]

const extendedVideos = [...videos, ...videos];

export function PjdYoutube() {
    const containerRef = useRef<HTMLElement>(null)

    // Acompanha o progresso do scroll apenas enquanto a seção PJD está visível na tela
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Transformações Y (verticais) para cada coluna usando transformações diretas (mais leve para o navegador do que o colSpring)
    const col1Y = useTransform(scrollYProgress, [0, 1], [50, -150])
    const col2Y = useTransform(scrollYProgress, [0, 1], [-50, 50])
    const col3Y = useTransform(scrollYProgress, [0, 1], [100, -200])

    return (
        <section ref={containerRef} id="pjd" className="relative w-full overflow-hidden bg-white min-h-[600px] md:min-h-[800px] lg:min-h-[900px] flex items-center py-20 md:py-0 mt-32 md:mt-48 mb-32 md:mb-48">

            {/* 
                Lado Direito: Imagem do Grid (Background Atmosférico) 
                Ele fica absolute na direita ocupando 65% do espaço.
            */}
            <div className="absolute top-0 right-0 bottom-0 w-full md:w-[70%] lg:w-[65%] z-0 h-full flex items-center justify-center opacity-30 md:opacity-100 overflow-hidden pointer-events-none md:pointer-events-auto">

                {/* Gradiente Fade: Mescla a coluna esquerda (branca) suavemente com o lado direito */}
                <div className="absolute inset-0 z-30 bg-gradient-to-r from-white via-white/80 to-transparent w-[60%] lg:w-[50%] left-0 pointer-events-none hidden md:block" />

                {/* Fades de Topo e Base para suavizar as pontas se sobrarem */}
                <div className="absolute inset-x-0 top-0 h-32 z-30 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-32 z-30 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                {/* Grid Diagonal (Container Inclinado) */}
                <motion.div
                    className="flex gap-4 md:gap-6 lg:gap-8 w-[150%] md:w-[120%] h-[150%] items-center justify-center origin-center translate-x-[10%] md:translate-x-[5%]"
                    initial={{ rotate: -12, scale: 1.05 }}
                    animate={{ rotate: -12, scale: 1.05 }}
                >
                    {/* Coluna 1 da Grade */}
                    <motion.div 
                        className="flex flex-col gap-4 md:gap-6 lg:gap-8 pt-32 will-change-transform"
                        style={{ y: col1Y }}
                    >
                        {extendedVideos.slice(0, 4).map((video: any, idx: number) => (
                            <VideoCard key={`col1-${idx}`} video={video} />
                        ))}
                    </motion.div>

                    {/* Coluna 2 (Deslocada verticalmente acima e movendo em direção oposta) */}
                    <motion.div 
                        className="flex flex-col gap-4 md:gap-6 lg:gap-8 -mt-32 will-change-transform"
                        style={{ y: col2Y }}
                    >
                        {extendedVideos.slice(4, 8).map((video: any, idx: number) => (
                            <VideoCard key={`col2-${idx}`} video={video} />
                        ))}
                    </motion.div>

                    {/* Coluna 3 */}
                    <motion.div 
                        className="flex flex-col gap-4 md:gap-6 lg:gap-8 pt-48 hidden sm:flex will-change-transform"
                        style={{ y: col3Y }}
                    >
                        {extendedVideos.slice(8, 12).map((video: any, idx: number) => (
                            <VideoCard key={`col3-${idx}`} video={video} />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Lado Esquerdo: Conteúdo em Primeiro Plano */}
            <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 flex items-center h-full pointer-events-none">
                <div className="w-full md:w-[60%] lg:w-[50%] flex flex-col gap-6 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h4 className="inline-block text-[#000000] font-bold tracking-[0.2em] uppercase text-sm mb-4 bg-gray-50/80 backdrop-blur-md px-4 py-1 rounded-full border border-gray-200">
                            12ª Temporada
                        </h4>

                        <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter leading-[0.9] mb-8">
                            Programa<br />
                            Jovens<br />
                            Destemidos
                        </h2>

                        <a
                            href="https://www.youtube.com/playlist?list=PLMlSzikdFlKbgKmBK96CvJu94FCwQAHKk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-fit items-center justify-center gap-3 bg-white text-black px-6 py-3.5 rounded-full font-bold text-base hover:bg-gray-50 hover:scale-[1.03] transition-all shadow-md hover:shadow-lg border border-gray-200 group"
                        >
                            {/* YouTube Logo SVG */}
                            <svg className="w-6 h-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2005/svg">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            Assistir no YouTube
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// Subcomponente encapsulado para as cartas de vídeo (sem interação e otimizado)
function VideoCard({ video }: { video: any }) {
    return (
        <div className="relative block w-[280px] md:w-[320px] lg:w-[380px] aspect-video rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl z-20 border-[4px] border-white/50 will-change-transform">
            <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
            />
            {/* Overlay Escuro Constante para Ler Título (gradiente leve para economizar GPU) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Título do Vídeo - Fixo */}
            <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-snug drop-shadow-md">
                    {video.title}
                </h3>
            </div>
        </div>
    )
}
