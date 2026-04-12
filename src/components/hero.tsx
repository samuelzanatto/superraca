"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect, useRef } from "react"
import { AutoTextSize } from "auto-text-size"
import { CometCard } from "@/components/ui/comet-card"
import Image from "next/image"
import { Loader2 } from "lucide-react"

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

type CardMedia = {
    id: string
    type: "image" | "video"
    src: string
    title: string
    code: string
}

type CardSlideContentProps = {
    card: CardMedia
    index: number
    onVideoRef: (index: number, el: HTMLVideoElement | null) => void
    isActive: boolean
    offset: number
}

function CardSlideContent({ card, index, onVideoRef, isActive, offset }: CardSlideContentProps) {
    const youtubeId = card.type === 'video' ? getYoutubeId(card.src) : null;
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)")
        setIsMobile(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-[85vw] sm:w-[500px] lg:w-[600px] aspect-[3/2]"
            style={{
                transformStyle: "preserve-3d",
            }}
            initial={false}
            animate={{
                x: isMobile
                    ? `calc(${offset * 110}% - 50%)`
                    : `calc(${offset * 60}% - 50%)`,
                y: "-50%",
                z: isMobile ? 0 : (isActive ? 0 : -400),
                rotateY: isMobile ? 0 : offset * -35,
                scale: isMobile ? 0.92 : (isActive ? 1 : 0.80),
                opacity: isMobile ? (isActive ? 1 : 0) : (isActive ? 1 : 0.4),
                zIndex: isActive ? 30 : 10,
            }}
            transition={isMobile ? {
                type: "tween",
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1],
                opacity: { duration: 0.25 },
            } : {
                type: "spring",
                stiffness: 50,
                damping: 20,
                mass: 1.2,
                opacity: { duration: 0.2, delay: isActive ? 0 : 0.2 },
                zIndex: { delay: isActive ? 0 : 0.1 }
            }}
        >
            <div className={`w-full h-full transition-all duration-700 ${isActive ? "blur-0" : "blur-[2px] grayscale-[50%]"
                }`}>
                <CometCard className="w-full h-full shadow-none md:shadow-2xl">
                    <div className="relative w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 w-full h-full">
                            {card.type === "image" ? (
                                <Image
                                    src={card.src}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    width={1080}
                                    height={1920}
                                />
                            ) : youtubeId ? (
                                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isActive ? 1 : 0}&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                                        className="absolute top-1/2 left-1/2 w-[300%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover"
                                        title={card.title}
                                        style={{ pointerEvents: 'none' }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            ) : (
                                <video
                                    ref={(el) => { onVideoRef(index, el) }}
                                    src={card.src}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                />
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold tracking-wide text-lg text-left shadow-black drop-shadow-lg mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-white/60 text-xs font-medium text-left bg-white/10 backdrop-blur-md px-2 py-1 rounded-md inline-block">
                                        {card.code}
                                    </p>
                                </div>

                                <motion.div
                                    animate={{
                                        opacity: isActive ? 1 : 0,
                                        scale: isActive ? 1 : 0.5
                                    }}
                                    style={{
                                        pointerEvents: isActive ? "auto" : "none"
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        delay: isActive ? 0.1 : 0
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                                    onClick={() => {
                                        // Optional: Action when clicking the play button
                                        // For YouTube, maybe unmute or open full screen?
                                    }}
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </CometCard>
            </div>
        </motion.div>
    )
}

/**
 * QuoteAutoFit — Production-grade component
 * 
 * Mobile: Uses auto-text-size library (ResizeObserver + binary search) 
 * to dynamically fit quote text into a flex-1 container.
 * The parent hero uses h-dvh + flex-col so the quote area always
 * fills remaining space after the fixed-height carousel.
 * Result: zero layout shift, zero text clipping.
 *
 * Desktop: Original layout animation with popLayout preserved.
 */
function QuoteAutoFit({ quotes, currentQuoteIndex }: {
    quotes: { book: string, phrase: string, author: string }[]
    currentQuoteIndex: number
}) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)")
        setIsMobile(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    if (isMobile) {
        return (
            <div className="flex flex-col justify-center w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="w-full h-full flex flex-col justify-center"
                    >
                        <p className="text-sm font-semibold text-black/70 mb-2">
                            {quotes[currentQuoteIndex]?.book}
                        </p>
                        <div className="flex-1 min-h-0 flex items-center">
                            <AutoTextSize
                                mode="box"
                                minFontSizePx={16}
                                maxFontSizePx={32}
                                as="h1"
                                className="font-black text-black leading-[1.2] w-full"
                            >
                                &ldquo;{quotes[currentQuoteIndex]?.phrase}&rdquo;
                            </AutoTextSize>
                        </div>
                        <p className="text-sm font-medium text-black/60 mt-2">
                            — {quotes[currentQuoteIndex]?.author}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        )
    }

    // Desktop: original layout animation — untouched
    return (
        <motion.div layout className="relative flex flex-col justify-center">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentQuoteIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        delay: 0.6,
                        duration: 0.8
                    }}
                    layout
                >
                    <p className="text-xl font-semibold text-black/70 mb-4">
                        {quotes[currentQuoteIndex]?.book}
                    </p>
                    <h1
                        className="font-black text-black leading-tight mb-6 text-[2.75rem] lg:text-4xl"
                    >
                        &ldquo;{quotes[currentQuoteIndex]?.phrase}&rdquo;
                    </h1>
                    <p className="text-xl font-medium text-black/60">
                        — {quotes[currentQuoteIndex]?.author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}

export function Hero() {
    const [quotes, setQuotes] = useState<{ book: string, phrase: string, author: string }[]>([])
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [cards, setCards] = useState<CardMedia[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Cards from API route (cached)
                const cardsResponse = await fetch('/api/landing/cards')
                if (cardsResponse.ok) {
                    const cardsData = await cardsResponse.json()
                    setCards(cardsData || [])
                } else {
                    setCards([])
                }

                // Fetch Quotes from API route (cached)
                const quotesResponse = await fetch('/api/landing/quotes')
                if (quotesResponse.ok) {
                    const quotesData = await quotesResponse.json()
                    setQuotes(quotesData || [])
                } else {
                    setQuotes([])
                }
            } catch (err) {
                console.error("Failed to fetch data:", err)
                setCards([])
                setQuotes([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleVideoRef = (index: number, el: HTMLVideoElement | null) => {
        if (el) videoRefs.current[index] = el
    }

    useEffect(() => {
        if (isHovering || cards.length === 0) return;
        const interval = setInterval(() => {
            setCurrentCardIndex((prev) => (prev + 1) % cards.length)
        }, 15000)
        return () => clearInterval(interval)
    }, [isHovering, cards.length])

    useEffect(() => {
        if (quotes.length === 0) return
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
        }, 10000)
        return () => clearInterval(interval)
    }, [quotes.length])

    useEffect(() => {
        videoRefs.current.forEach(video => {
            if (video) video.pause()
        })
        if (cards.length > 0) {
            const activeCard = cards[currentCardIndex]
            if (activeCard && activeCard.type === 'video') {
                const videoEl = videoRefs.current[currentCardIndex]
                if (videoEl) {
                    videoEl.currentTime = 0
                    const playPromise = videoEl.play()
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Silent catch
                        })
                    }
                }
            }
        }
    }, [currentCardIndex, cards])

    const nextCard = () => {
        setCurrentCardIndex((prev) => (prev + 1) % cards.length)
    }

    const prevCard = () => {
        setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }

    return (
        <section
            id="home"
            className="relative z-20 h-dvh lg:min-h-screen flex items-center bg-white overflow-hidden py-0 lg:py-0"
        >
            {/* Gradientes agora estão em page.tsx */}

            <div className="relative z-10 w-full h-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16 px-6 lg:px-12 pt-20 pb-6 lg:pt-0 lg:pb-0">
                {/* --- LADO ESQUERDO: TEXTO --- */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center flex-1 lg:flex-none min-h-0">
                    <div className="w-full max-w-2xl h-full lg:h-auto flex flex-col">
                        {quotes.length > 0 && (
                            <div className="flex-1 min-h-0 lg:flex-none">
                                <QuoteAutoFit
                                    quotes={quotes}
                                    currentQuoteIndex={currentQuoteIndex}
                                />
                            </div>
                        )}

                        {/* Barrinhas de progresso */}
                        <div className="flex gap-2 mt-3 lg:mt-10 flex-shrink-0">
                            {quotes.map((_, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    className={`h-1 rounded-full transition-all duration-300 ${index === currentQuoteIndex
                                        ? "w-8 bg-black"
                                        : "w-2 bg-black/40"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- LADO DIREITO: CARROSSEL --- */}
                <div
                    className="flex w-full lg:w-1/2 flex-col items-center justify-center gap-2 lg:gap-8 flex-shrink-0"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <motion.div
                        className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center overflow-hidden md:overflow-visible"
                        style={{ perspective: "1000px" }}
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    >
                        {cards.map((card, index) => {
                            let offset = (index - currentCardIndex) % cards.length;
                            if (offset < 0) offset += cards.length;
                            if (offset > cards.length / 2) offset -= cards.length;

                            const isActive = offset === 0

                            return (
                                <CardSlideContent
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    onVideoRef={handleVideoRef}
                                    isActive={isActive}
                                    offset={offset}
                                />
                            )
                        })}
                        {/* Controles do Carrossel */}
                    </motion.div>

                    {/* Controles do Carrossel */}
                    <div className="w-full flex items-center justify-center gap-4">
                        <button
                            onClick={prevCard}
                            className="w-10 h-10 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="flex gap-2">
                            {cards.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentCardIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentCardIndex
                                        ? "w-6 bg-black"
                                        : "w-2 bg-black/30 hover:bg-black/50"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextCard}
                            className="w-10 h-10 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section >
    )
}