import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { GradientBlobs } from "@/components/gradient-blobs";
import { GallerySection } from "@/components/gallery-section";
import { WmbTimeline } from "@/components/wmb-timeline";

import { PjdYoutube } from "@/components/pjd-youtube";

export default function Home() {
  return (
    <main className="relative">
      {/* Immersive Gradient Blobs - Fixed position, bleeds across all sections */}
      <GradientBlobs />

      <Hero />

      {/* Gallery Section with Scroll Animation - Right after Hero */}
      <GallerySection />

      {/* W.M.B Timeline Section - Replaces static layout */}
      <WmbTimeline />

      {/* Programa Jovens Destemidos - YouTube Sections */}
      <PjdYoutube />

      <Footer />
    </main>
  );
}
