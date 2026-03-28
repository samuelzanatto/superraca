export interface Product {
    id: string
    title: string
    slug: string
    price: number
    category: string
    image: string
    description?: string
    isNew?: boolean
}

export const PRODUCTS: Product[] = [
    // -- Acessórios --
    { 
        id: "a1", title: "Boné Faith", slug: "bone-faith", price: 89.90, category: "Acessórios", image: "/store/acessorios/bonefaith.jpg", isNew: true,
        description: "Boné premium confeccionado em tecido resistente. Modelo clássico, aba curva com design abaulado que se adapta perfeitamente. 'Faith' bordado em alto relevo, declarando sua fé com estilo." 
    },
    { 
        id: "a2", title: "Boné Isaías", slug: "bone-isaias", price: 89.90, category: "Acessórios", image: "/store/acessorios/boneisaias.jpg",
        description: "O boné Isaías é um clássico atemporal para o uso diário. Com inspiração nas escrituras, apresenta uma costura reforçada e ajuste confortável. Estilo minimalista marcante."
    },
    { 
        id: "a3", title: "Broche Águia", slug: "broche-aguia-1", price: 29.90, category: "Acessórios", image: "/store/acessorios/brocheaguia.jpg",
        description: "Broche metálico em formato de águia. Perfeito para customizar jaquetas, mochilas e bonés, elevando os detalhes da sua vestimenta."
    },
    { 
        id: "a4", title: "Broche Pássaro", slug: "broche-passaro", price: 29.90, category: "Acessórios", image: "/store/acessorios/brochepassaro.jpg",
        description: "Broche com acabamento prateado. O detalhe sutil ideal para transmitir personalidade de força e determinação. Fixação segura."
    },
    { 
        id: "a5", title: "Broche Trigo", slug: "broche-trigo", price: 29.90, category: "Acessórios", image: "/store/acessorios/brochetrigo.jpg",
        description: "Emblema clássico do joio e do trigo. Material de altíssima qualidade contra oxidação para uso a longo prazo."
    },
    { 
        id: "a6", title: "Chaveiros Signature", slug: "chaveiro-signature", price: 19.90, category: "Acessórios", image: "/store/acessorios/chaveiros.jpg", isNew: true,
        description: "Acessório indispensável em couro sintético e metal, modelo resistente para o uso diário nas chaves de casa ou carro."
    },
    { 
        id: "a7", title: "Cordão Crachá Mídia", slug: "cordao-cracha-midia", price: 39.90, category: "Acessórios", image: "/store/acessorios/crachamidia.jpg",
        description: "Cordão de autenticação com impressão digital de alta resolução. Macio, lavável e não descasca. Equipado com presilha jacaré."
    },

    // -- Camisetas --
    { 
        id: "c1", title: "T-Shirt Child of God", slug: "tshirt-child-of-god", price: 119.90, category: "Camisetas", image: "/store/camisetas/childofgod.jpg", isNew: true,
        description: "Camiseta super premium oversized estampada 'Child of God'. Modelagem Streetwear desenhada para máximo conforto e durabilidade."
    },
    { 
        id: "c2", title: "T-Shirt Cristo Vive Em Mim", slug: "tshirt-cristo-vive-em-mim", price: 119.90, category: "Camisetas", image: "/store/camisetas/cristoviveemmim.jpg",
        description: "A frase forte no peito que dita o ritmo da vida. Algodão sustentável fio 30.1 penteado."
    },
    { 
        id: "c3", title: "T-Shirt Faith is Believe", slug: "tshirt-faith-is-believe", price: 119.90, category: "Camisetas", image: "/store/camisetas/faithisbelieve.jpg",
        description: "Arte texturizada minimalista. Gola ribana reforçada e tecido pré-encolhido que não amassa com facilidade."
    },
    { 
        id: "c4", title: "T-Shirt Jesus Christ", slug: "tshirt-jesus-christ", price: 129.90, category: "Camisetas", image: "/store/camisetas/jesuschrist.jpg",
        description: "Estampa moderna nas costas. Caimento exclusivo de alto padrão, garantindo que você carregue O Nome por onde for."
    },
    { 
        id: "c5", title: "T-Shirt Jesus is King", slug: "tshirt-jesus-is-king", price: 129.90, category: "Camisetas", image: "/store/camisetas/jesusiskinh.jpg", isNew: true,
        description: "Peça hype 'Jesus is King' estilo streetwear gringo. Costura ombro-a-ombro para durabilidade máxima e lavagem estonada."
    },
    { 
        id: "c6", title: "T-Shirt Trust Over Fear", slug: "tshirt-trust-over-fear", price: 119.90, category: "Camisetas", image: "/store/camisetas/trustoverfear.jpg",
        description: "'Confiança acima do medo'. Minimalista na frente, mensagem poderosa nas costas. Essencial no seu guarda-roupa."
    },
    { 
        id: "c7", title: "T-Shirt Viver é Cristo", slug: "tshirt-viver-e-cristo", price: 119.90, category: "Camisetas", image: "/store/camisetas/viverecristo.jpg",
        description: "Algodão premium brasileiro de textura extra-macia. Essa camiseta entrega estilo e identidade visual forte."
    },
    { 
        id: "c8", title: "T-Shirt Wings Like Eagles", slug: "tshirt-wings-like-eagles", price: 129.90, category: "Camisetas", image: "/store/camisetas/wingslikeeagles.jpg",
        description: "Com estampagem impecável em alta relevância, ilustrando a renovação das forças como as águias."
    },

    // -- Moletons --
    { 
        id: "m1", title: "Moletom Faith Over Fear", slug: "moletom-faith-over-fear", price: 249.90, category: "Moletons", image: "/store/moletons/faithoverfear.jpg", isNew: true,
        description: "Moletom 3 cabos de altíssima gramatura. Peluciado internamente, garantindo proteção contra o frio mais intenso. Costura robusta e capuz estruturado."
    },
    { 
        id: "m2", title: "Moletom Jesus King", slug: "moletom-jesus-king", price: 259.90, category: "Moletons", image: "/store/moletons/jesusking.jpg", isNew: true,
        description: "Edição Premium Especial. Moletom canguru com estampa industrial de longa durabilidade. Conforto inestimável e pegada urban pesada."
    },
    { 
        id: "m3", title: "Moletom Jesus Loves You", slug: "moletom-jesus-loves-you", price: 239.90, category: "Moletons", image: "/store/moletons/jesuslovesyou.jpg",
        description: "Acolhedor em todos os sentidos. Tecido flanelado interno e modelagem comfort que veste sem apertar."
    },
    { 
        id: "m4", title: "Moletom Jesus Saves", slug: "moletom-jesus-saves", price: 249.90, category: "Moletons", image: "/store/moletons/jesussave.jpg",
        description: "Capuz forrado em meia-malha de algodão premium, passante personalizado. Seu companheiro ideal para os dias mais gelados."
    },
    { 
        id: "m5", title: "Moletom Jesus The Truth", slug: "moletom-jesus-the-truth", price: 249.90, category: "Moletons", image: "/store/moletons/jesusthetruth.jpg",
        description: "Peça essencial no guarda-roupa de inverno. Alta tecnologia na tecelagem para não criar bolinhas e manter a aparência de novo por anos."
    },
    { 
        id: "m6", title: "Moletom Trust in The Lord", slug: "moletom-trust-in-the-lord", price: 239.90, category: "Moletons", image: "/store/moletons/trustinthelord.jpg",
        description: "Mensagem central no peito em um moletom espesso 100% algodão por fora e fleece macio por dentro."
    },
]

export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug)
}

export function getRelatedProducts(category: string, excludeId: string): Product[] {
    return PRODUCTS.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4)
}
