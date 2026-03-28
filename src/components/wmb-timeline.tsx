"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { Pinyon_Script } from "next/font/google"

const pinyonScript = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
})

const timelineEvents = [
    {
        year: "1909",
        title: "O Chamado na Infância",
        description: "Nascido em uma humilde cabana no Kentucky, o início de sua vida foi marcado pela aparição de uma impressionante Luz Sobrenatural e por uma voz distintiva em sua infância, separando-o desde cedo para um propósito maior.",
        image: "/images/cabana.jpg",
        aspect: "4/3",           // landscape
        objectPosition: "center",
    },
    {
        year: "1937",
        title: "Juventude e Luto",
        description: "Em meio à Grande Enchente do Rio Ohio, enfrentou a fase mais tenebrosa de sua jornada com a perda trágica de sua amada esposa Hope e de sua pequena filha. Um evento dilacerante que forjou sua fé na fornalha da provação.",
        image: "/images/hope.jpg",
        aspect: "4/3",
        objectPosition: "center top",
    },
    {
        year: "1946",
        title: "A Visitação do Anjo",
        description: "Enquanto orava em uma caverna isolada, recebeu a majestosa visitação divina de um Anjo do Senhor, que o comissionou diretamente para um intenso ministério de cura, acendendo um avivamento intercontinental.",
        image: "/images/caverna.jpg",
        aspect: "4/3",
        objectPosition: "center",
    },
    {
        year: "Os Puxões",
        title: "Os Três Puxões do Ministério",
        description: "Seu ministério evoluiu espiritualmente em três estágios ou maravilhosos 'puxões'. Do dom inato de cura pelas mãos, passando pelo profundo discernimento e leitura dos corações, chegando, por fim, à manifestação criativa da Palavra Falada.",
        image: "/images/william.jpg",
        aspect: "4/3",
        objectPosition: "center top",
    },
    {
        year: "1963",
        title: "A Abertura dos Selos",
        description: "Após um arrebatamento espiritual marcante com uma constelação gloriosa nas montanhas do Arizona, dedicou seus últimos anos à pregação profunda da Revelação dos Sete Selos, desvendando mistérios ocultos que pavimentaram seus ensinamentos até sua partida em 1965.",
        image: "/images/nuvem.png",
        aspect: "3/4",           // portrait
        objectPosition: "center",
    }
]

export function WmbTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [pathData, setPathData] = useState("")
    const [dotThresholds, setDotThresholds] = useState<number[]>([])

    // Mapeamos a progressão do viewport unicamente sob o container dos eventos (do primeiro ao último eixo)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    })

    // Cortina mágica que revela o SVG matematicamente sincronizado com scroll
    const clipPath = useTransform(scrollYProgress, (v) => `inset(0% 0% ${100 - v * 100}% 0%)`)

    useEffect(() => {
        // Gerador de curva matemática de alta precisão
        const updatePath = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const dotElements = Array.from(containerRef.current.querySelectorAll('.timeline-dot'));

            if (dotElements.length === 0) return;

            // Captura exata e absoluta do hardware DOM
            const points = dotElements.map(dot => {
                const rect = dot.getBoundingClientRect();
                return {
                    x: rect.left - containerRect.left + (rect.width / 2),
                    y: rect.top - containerRect.top + (rect.height / 2)
                };
            });

            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];

                // Interpolação de Bezier puramente vertical (que gera as ondas entre desvios de eixos em pixels físicos nativos da tela)
                const cp1x = prev.x;
                const cp1y = prev.y + (curr.y - prev.y) * 0.5;
                const cp2x = curr.x;
                const cp2y = curr.y - (curr.y - prev.y) * 0.5;

                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
            }

            // Extensão fluida contínua da linha para baixo, garantindo que o fecho da timeline role até o fim
            const lastDot = points[points.length - 1];
            d += ` L ${lastDot.x} ${containerRect.height}`;

            setPathData(d);

            // Calcula a posição Y real de cada dot como fração da altura do container
            const containerHeight = containerRect.height;
            const thresholds = points.map(p => p.y / containerHeight);
            setDotThresholds(thresholds);
        };

        const timeout = setTimeout(updatePath, 50);

        // Mantém as cordenadas sempre ativas perfeitamente perante resizes no celular/desktop e imagens puxadas
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updatePath);
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, [])

    return (
        <section id="wmb" ref={sectionRef} className="relative py-24 bg-white overflow-hidden font-sans">
            <div className="max-w-[90rem] mx-auto px-6 relative z-10 block">

                {/* O container mestre absoluto que guia todos os tracking de scroll */}
                <div ref={containerRef} className="relative flex flex-col w-full pb-40 md:pb-64">

                    {/* Background SVG Canvas Perfeito */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {pathData && (
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="#f3f4f6"
                                    strokeWidth="2"
                                />
                                <motion.svg
                                    className="absolute inset-0 w-full h-full"
                                    style={{ clipPath }}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke="black"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </motion.svg>
                            </svg>
                        )}
                    </div>

                    {/* Fila dos Eventos renderizados por cima da linha */}
                    {timelineEvents.map((event, index) => (
                        <TimelineEvent
                            key={index}
                            event={event}
                            index={index}
                            total={timelineEvents.length}
                            isLast={index === timelineEvents.length - 1}
                            scrollYProgress={scrollYProgress}
                            dotThreshold={dotThresholds[index] ?? 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TimelineEvent({ event, index, total, isLast, scrollYProgress, dotThreshold }: { event: any, index: number, total: number, isLast: boolean, scrollYProgress: any, dotThreshold: number }) {
    const isEven = index % 2 === 0

    // Configura fisicamente as variações gerando as curvas senoidais belíssimas em C1 via Flexbox Real
    const horizontalOffsets = [
        "translate-x-0",
        "translate-x-3 md:translate-x-6",
        "-translate-x-2 md:-translate-x-5",
        "translate-x-4 md:translate-x-8",
        "-translate-x-1 md:-translate-x-3"
    ]
    const dotOffset = horizontalOffsets[index % horizontalOffsets.length]

    // Sincroniza a animação do dot com a posição REAL da linha
    const dotOpacity = useTransform(scrollYProgress, [Math.max(0, dotThreshold - 0.02), dotThreshold], [0, 1])
    const dotScale = useTransform(scrollYProgress, [Math.max(0, dotThreshold - 0.02), dotThreshold], [0, 1])

    const textContent = (
        <motion.div
            className={`${pinyonScript.className} py-4 md:py-8`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            viewport={{ margin: "0px 0px -60% 0px" }}
        >
            <span className="inline-block px-4 py-1 mb-4 text-xl tracking-widest text-gray-500 rounded-full border border-gray-200">
                {event.year}
            </span>
            <h3 className="text-4xl md:text-5xl mb-4 text-gray-900 leading-tight">{event.title}</h3>
            <p className="text-gray-700 leading-relaxed text-2xl md:text-3xl">
                {event.description}
            </p>
        </motion.div>
    );

    const imageContent = event.image ? (
        <motion.div
            className="w-full rounded-2xl overflow-hidden"
            style={{ aspectRatio: event.aspect || '4/3' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "0px 0px -60% 0px" }}
        >
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100 grayscale hover:grayscale-0"
                style={{ objectPosition: event.objectPosition || 'center' }}
            />
        </motion.div>
    ) : null;

    return (
        <div className={`relative flex flex-row items-stretch w-full group ${!isLast ? 'pb-24 md:pb-40' : 'pb-0'}`}>

            {/* Eixo Rastreável — centralizado verticalmente */}
            <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-12 md:w-24 z-10 flex flex-col items-center justify-center`}>
                <motion.div
                    className={`timeline-dot w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] border-white bg-black z-30 shadow-md ${dotOffset}`}
                    style={{ opacity: dotOpacity, scale: dotScale }}
                />
            </div>

            {/* Conteiner Flex Inteligente */}
            <div className={`w-full ml-16 md:ml-0 flex flex-col md:flex-row relative z-20 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>

                {/* Lado Texto */}
                <div className={`w-full md:w-[42.5%] flex flex-col justify-center ${isEven ? 'md:pr-20 lg:pr-24' : 'md:pl-20 lg:pl-24'}`}>
                    {textContent}
                </div>

                {/* Espaço Divisor do Centro */}
                <div className="hidden md:block md:w-[15%] shrink-0"></div>

                {/* Lado Imagem */}
                <div className={`w-full md:w-[42.5%] flex flex-col justify-center mt-2 md:mt-0 ${isEven ? 'md:pl-20 lg:pl-24' : 'md:pr-20 lg:pr-24'}`}>
                    {imageContent}
                </div>
            </div>
        </div>
    )
}
