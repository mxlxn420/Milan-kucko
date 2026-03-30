"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

const IMAGES = [
  { src: "/images/haz/IMG_8537 kicsi.jpg", alt: "Kuckó külső", span: "col-span-2 row-span-2" },
  { src: "/images/jacuzzi/jacuzzi.jpg", alt: "Jacuzzi", span: "" },
  { src: "/images/belso/nappali.jpg", alt: "Nappali", span: "" },
  { src: "/images/belso/haloszoba.jpg", alt: "Hálószoba", span: "" },
  { src: "/images/belso/konyha.jpg", alt: "Konyha", span: "" },
  { src: "/images/belso/fürdő.jpg", alt: "Fürdő", span: "" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % IMAGES.length : null));

  return (
    <section id="galeria" className="section-py bg-cream">
      <div className="container-custom">

        <AnimatedSection className="text-center mb-14">
          <div className="section-badge">Galéria</div>
          <h2 className="font-serif text-display-lg font-light text-forest-900">
            Tekintsen be a kuckóba
          </h2>
        </AnimatedSection>

        {/* Masonry rács */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {IMAGES.map(({ src, alt, span }, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${span}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onClick={() => setLightbox(i)}
            >
              <Image src={src} alt={alt} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest uppercase">
                  Megnézem
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/galeria" className="btn-secondary">
            Összes kép megtekintése →
          </Link>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={40} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight size={40} />
          </button>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={IMAGES[lightbox].src} alt={IMAGES[lightbox].alt} fill className="object-contain" />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightbox + 1} / {IMAGES.length}
          </p>
        </motion.div>
      )}
    </section>
  );
}