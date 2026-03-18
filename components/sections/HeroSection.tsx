"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Waves, Home } from "lucide-react";
import BookingWidget from "@/components/booking/BookingWidget";

const SLIDES = [
  { src: "/images/hero.jpg",     alt: "Milán Kuckó – vendégház kívülről" },
  { src: "/images/jacuzzi.jpg",  alt: "Privát jacuzzi"                   },
  { src: "/images/kert.jpg",     alt: "Hatalmas privát kert"             },
];

const BADGES = [
  { icon: Star,  label: "10/10 – Tökéletes értékelés" },
  { icon: Waves, label: "Privát jacuzzi"               },
  { icon: Home,  label: "Csak ti vagytok"              },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" ref={ref} className="relative h-screen min-h-[640px] overflow-hidden">

      {/* Slideshow */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={SLIDES[current].src}
            alt={SLIDES[current].alt}
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Tartalom */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-center"
        style={{ y: textY, opacity }}
      >
        <div className="container-custom pt-20 pb-8">
          <div className="max-w-3xl">

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-6"
            >
              <span className="h-px w-8 bg-terra-300/70" />
              <span className="text-terra-200 text-xs font-medium tracking-[0.25em] uppercase">
                Bencések útja 117/A, Miskolctapolca
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif text-display-2xl font-light text-cream mb-6"
            >
              A tökéletes{" "}
              <em className="italic text-terra-200">kikapcsolódás</em>
              <br />csak rád vár.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-cream/75 text-lg font-light leading-relaxed mb-8 max-w-xl"
            >
              Romantikus vendégház hatalmas kerttel és privát jacuzzival,
              Miskolctapolca csendes zsákutcájában. Csak ti vagytok az egész „birtokon."
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cream/90 text-xs font-medium">
                  <Icon size={13} className="text-terra-200" />
                  {label}
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* Booking widget */}
        <motion.div
          className="container-custom"
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <BookingWidget />
        </motion.div>
      </motion.div>

      {/* Slideshow pontok + Görgessen – EGYÜTT ALUL */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">

        {/* Pontok */}
        <div className="flex items-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-cream"
                  : "w-2 h-2 bg-cream/40 hover:bg-cream/70"
              }`}
              aria-label={`${i + 1}. kép`}
            />
          ))}
        </div>

        {/* Görgessen */}
        <div className="flex flex-col items-center gap-1 text-cream/50">
          <span className="text-[10px] tracking-[0.25em] uppercase">Görgessen</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

      </div>

    </section>
  );
}