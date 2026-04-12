export type ProductBadge = "novo" | "em_breve" | "esgotado"

export interface Product {
    id: string
    title: string
    slug: string
    price: number
    category: string
    image: string
    description?: string
    badge?: ProductBadge
}

export const PRODUCTS: Product[] = [
    // -- Camisetas --
    {
        id: "c1", title: "Camiseta Oversized Super Raça", slug: "tshirt-super-raca", price: 49.90, category: "Camisetas", image: "/store/camisetas/v1.png", badge: "em_breve",
        description: "Camiseta exclusiva em algodão premium com estampa de alta definição. Modelagem oversized streetwear para máximo conforto e estilo."
    },

    // -- Moletons --
    {
        id: "m1", title: "Moletom Faith Over Fear", slug: "moletom-faith-over-fear", price: 249.90, category: "Moletons", image: "/store/moletons/faithoverfear.jpg", badge: "novo",
        description: "Moletom 3 cabos de altíssima gramatura. Peluciado internamente, garantindo proteção contra o frio mais intenso. Costura robusta e capuz estruturado."
    },
    {
        id: "m2", title: "Moletom Jesus King", slug: "moletom-jesus-king", price: 259.90, category: "Moletons", image: "/store/moletons/jesusking.jpg", badge: "novo",
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

    // -- Acessórios --
    {
        id: "a1", title: "Boné Faith", slug: "bone-faith", price: 89.90, category: "Acessórios", image: "/store/acessorios/bonefaith.jpg", badge: "novo",
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
        id: "a6", title: "Chaveiros Signature", slug: "chaveiro-signature", price: 19.90, category: "Acessórios", image: "/store/acessorios/chaveiros.jpg", badge: "novo",
        description: "Acessório indispensável em couro sintético e metal, modelo resistente para o uso diário nas chaves de casa ou carro."
    },
    {
        id: "a7", title: "Cordão Crachá Mídia", slug: "cordao-cracha-midia", price: 39.90, category: "Acessórios", image: "/store/acessorios/crachamidia.jpg",
        description: "Cordão de autenticação com impressão digital de alta resolução. Macio, lavável e não descasca. Equipado com presilha jacaré."
    },
]

export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug)
}

export function getRelatedProducts(category: string, excludeId: string): Product[] {
    return PRODUCTS.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4)
}
