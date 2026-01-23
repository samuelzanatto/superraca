import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Footer } from "@/components/footer";
import { GradientBlobs } from "@/components/gradient-blobs";
import { GallerySection } from "@/components/gallery-section";

export default function Home() {
  return (
    <main className="relative">
      {/* Immersive Gradient Blobs - Fixed position, bleeds across all sections */}
      <GradientBlobs />

      <Hero />

      {/* Gallery Section with Scroll Animation - Right after Hero */}
      <GallerySection />

      <Section
        id="sobre"
        title="Sobre Nós"
        subtitle="Conheça Nossa História"
      />

      <Section
        id="servicos"
        title="Nossos Serviços"
        subtitle="O Que Oferecemos"
        dark
      />

      <Section
        id="depoimentos"
        title="Depoimentos"
        subtitle="O Que Dizem Sobre Nós"
        dark
      />

      <Section
        id="equipe"
        title="Nossa Equipe"
        subtitle="Profissionais Dedicados"
      />

      <Footer />
    </main>
  );
}
