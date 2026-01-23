"use client"

import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useRef, useEffect, useState } from "react"

type PhotoData = {
    id: string
    src: string
    alt: string
    objectPosition?: string
}

// Parse position string "x y" to CSS object-position
const getObjectPositionCSS = (pos: string) => {
    const [x, y] = (pos || '50 50').split(' ').map(Number)
    const xVal = isNaN(x) ? 50 : x
    const yVal = isNaN(y) ? 50 : y
    return `${xVal}% ${yVal}%`
}

// Generate placeholder if no photos exist
const generatePlaceholders = (count: number): PhotoData[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `placeholder-${i}`,
        src: '',
        alt: `Foto ${i}`
    }))
}

// Shuffle array (Fisher-Yates) - simple implementation
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray
}

// Card component - Larger size w-96 h-60
const PhotoCard = ({ image, index }: { image: PhotoData, index: number }) => (
    <motion.div
        key={`${image.id}-${index}`} // Unique key for repeated items
        className="w-96 h-60 rounded-3xl overflow-hidden bg-gray-200 shrink-0"
        initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: index * 0.015, duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
    >
        {image.src ? (
            <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: getObjectPositionCSS(image.objectPosition || 'center') }}
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {image.alt}
            </div>
        )}
    </motion.div>
)

export function GallerySection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [distributedPhotos, setDistributedPhotos] = useState<PhotoData[][]>([[], [], [], []])
    const [isLoaded, setIsLoaded] = useState(false)

    // Fetch and distribute photos
    useEffect(() => {
        const fetchAndDistribute = async () => {
            try {
                const response = await fetch('/api/landing/photos')
                if (!response.ok) throw new Error('Failed to fetch')

                let photos: PhotoData[] = await response.json()

                // If no photos, use placeholders
                if (!photos || photos.length === 0) {
                    photos = generatePlaceholders(10)
                }

                // Algorithm:
                // 1. Shuffle original photos to randomize order
                // 2. We need to fill 4 rows with 10 items each = 40 items total
                // 3. Repeat the shuffled photos until we have enough to fill the grid

                const shuffled = shuffleArray(photos)
                const totalSlots = 40 // 4 rows * 10 columns
                const filledGrid: PhotoData[] = []

                // Fill the grid by repeating the shuffled list
                while (filledGrid.length < totalSlots) {
                    filledGrid.push(...shuffled)
                }

                // Trim to exact size
                const finalGrid = filledGrid.slice(0, totalSlots)

                // Distribute into 4 rows
                const rows: PhotoData[][] = [[], [], [], []]
                finalGrid.forEach((photo, index) => {
                    const rowIndex = Math.floor(index / 10) // 0-9 = row 0, 10-19 = row 1, etc.
                    if (rowIndex < 4) {
                        rows[rowIndex].push(photo)
                    }
                })

                setDistributedPhotos(rows)
            } catch (error) {
                console.error('Error fetching gallery photos:', error)
                // Fallback
                const fallback = generatePlaceholders(40)
                setDistributedPhotos([
                    fallback.slice(0, 10),
                    fallback.slice(10, 20),
                    fallback.slice(20, 30),
                    fallback.slice(30, 40)
                ])
            } finally {
                setIsLoaded(true)
            }
        }

        fetchAndDistribute()
    }, [])

    const row1Photos = distributedPhotos[0]
    const row2Photos = distributedPhotos[1]
    const row3Photos = distributedPhotos[2]
    const row4Photos = distributedPhotos[3]

    // Track scroll progress within this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Grid fades in gradually as user scrolls - 25% of scroll for visible transition
    const gridOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])
    const gridScale = useTransform(scrollYProgress, [0, 0.25], [0.7, 1])

    // Blur effect synced with opacity/scale transition
    const gridBlur = useTransform(
        scrollYProgress,
        [0, 0.25],
        ["blur(20px)", "blur(0px)"]
    )

    // Continuous scroll with spring physics for smooth movement
    const springConfig = { stiffness: 100, damping: 30, mass: 1 }
    const row1TranslateXRaw = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"])
    const row2TranslateXRaw = useTransform(scrollYProgress, [0, 1], ["-5%", "12%"])
    const row3TranslateXRaw = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"])
    const row4TranslateXRaw = useTransform(scrollYProgress, [0, 1], ["-3%", "10%"])

    // Apply spring to smooth out the movement
    const row1TranslateX = useSpring(row1TranslateXRaw, springConfig)
    const row2TranslateX = useSpring(row2TranslateXRaw, springConfig)
    const row3TranslateX = useSpring(row3TranslateXRaw, springConfig)
    const row4TranslateX = useSpring(row4TranslateXRaw, springConfig)

    return (
        <section
            ref={containerRef}
            className="relative min-h-[300vh] bg-white z-10 -mt-32"
        >
            {/* Scroll Anchor - Positioned to land where grid is fully visible */}
            <div id="galeria" className="absolute top-[50vh] w-full h-1 pointer-events-none" />

            {/* Sticky container for the grid - overflow visible for immersive effect */}
            <div className="sticky top-0 h-screen overflow-visible flex items-center justify-center">

                {/* Photo Grid - Tilted, Infinite Loop Appearance, 4 Rows */}
                <motion.div
                    className="flex flex-col gap-6 items-center justify-center"
                    style={{
                        opacity: gridOpacity,
                        scale: gridScale,
                        filter: gridBlur,
                        rotate: -5,
                    }}
                >
                    {/* Row 1 - Scrolls Left (duplicated for loop effect) */}
                    <motion.div
                        className="flex gap-6"
                        style={{ x: row1TranslateX }}
                    >
                        {[...row1Photos, ...row1Photos].map((image, index) => (
                            <PhotoCard key={`r1-${index}`} image={image} index={index % row1Photos.length} />
                        ))}
                    </motion.div>

                    {/* Row 2 - Scrolls Right (duplicated for loop effect) */}
                    <motion.div
                        className="flex gap-6"
                        style={{ x: row2TranslateX }}
                    >
                        {[...row2Photos, ...row2Photos].map((image, index) => (
                            <PhotoCard key={`r2-${index}`} image={image} index={index % row2Photos.length} />
                        ))}
                    </motion.div>

                    {/* Row 3 - Scrolls Left (duplicated for loop effect) */}
                    <motion.div
                        className="flex gap-6"
                        style={{ x: row3TranslateX }}
                    >
                        {[...row3Photos, ...row3Photos].map((image, index) => (
                            <PhotoCard key={`r3-${index}`} image={image} index={index % row3Photos.length} />
                        ))}
                    </motion.div>

                    {/* Row 4 - Scrolls Right (duplicated for loop effect) */}
                    <motion.div
                        className="flex gap-6"
                        style={{ x: row4TranslateX }}
                    >
                        {[...row4Photos, ...row4Photos].map((image, index) => (
                            <PhotoCard key={`r4-${index}`} image={image} index={index % row4Photos.length} />
                        ))}
                    </motion.div>
                </motion.div>


            </div>
        </section>
    )
}
