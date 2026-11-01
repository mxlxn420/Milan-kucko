"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import BookingWidget from "@/components/booking/BookingWidget";
import { ICON_MAP } from "@/lib/icons";

interface Highlight {
  icon:  string;
  label: string;
}

interface Slide {
  src: string;
  alt: string;
}

interface HeroData {
  subtitle:      string;
  titleBefore:   string;
  titleEmphasis: string;
  titleAfter:    string;
  description:   string;
  highlights:    Highlight[];
  slides:        Slide[];
}

interface Props {
  data: HeroData;
}

// .hero-in CSS-animáció paraméterei: eltolás (px), időtartam és késleltetés (s)
const heroIn = (y: number, duration: number, delay: number) =>
  ({ "--hero-y": `${y}px`, "--hero-dur": `${duration}s`, "--hero-delay": `${delay}s` }) as React.CSSProperties;

export default function HeroSection({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const slides = data.slides.filter((s) => s.src).length > 0
    ? data.slides.filter((s) => s.src)
    : [{ src: "", alt: "" }];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] flex flex-col overflow-hidden" style={{ touchAction: "pan-y" }}>

      {/* Slideshow */}
      <AnimatePresence initial={false}>
        <m.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {slides[current]?.src && (
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-hero-overlay" />
        </m.div>
      </AnimatePresence>

      {/* Tartalom – a szekció inkább megnő, mint hogy a navbar alá csússzon vagy levágódjon */}
      <m.div
        className="relative z-10 flex-1 flex flex-col justify-start lg:justify-center pt-[calc(var(--navbar-h)+1.5rem)] pb-28 short:pb-24"
        style={{ y: textY, opacity }}
      >
        <div className="container-custom w-full pb-4 lg:pb-8 short:pb-3">
          {/* text-shadow az egész szövegblokkra öröklődik */}
          <div className="max-w-4xl [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">

            {/* Belépő animációk CSS-sel (.hero-in), így a szöveg már a HTML-lel megjelenik, nem vár a JS-re */}
            <div
              className="hero-in flex items-center gap-2.5 mb-6 short:mb-3"
              style={heroIn(20, 0.7, 0.1)}
            >
              <span className="h-px w-8 bg-white/50" />
              <span className="text-white text-xs font-medium tracking-[0.25em] uppercase">
                {data.subtitle}
              </span>
            </div>

            <h1
              className="hero-in font-serif text-display-hero font-light text-white mb-6 short:mb-3"
              style={heroIn(40, 0.9, 0.2)}
            >
              {data.titleBefore}
              <em className="italic text-white">{data.titleEmphasis}</em>
              <br />{data.titleAfter}
            </h1>

            <p
              className="hero-in text-white/90 text-lg short:text-base font-light leading-relaxed mb-8 short:mb-4 max-w-xl"
              style={heroIn(30, 0.8, 0.35)}
            >
              {data.description}
            </p>

            {data.highlights.length > 0 && (
              <div
                className="hero-in flex flex-wrap gap-3 short:gap-2 mb-10 short:mb-2"
                style={heroIn(20, 0.7, 0.5)}
              >
                {data.highlights.map(({ icon, label }) => {
                  const Icon = ICON_MAP[icon];
                  return (
                    <div key={label} className="flex items-center gap-2 px-4 py-2 short:py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
                      {Icon && <Icon size={13} className="text-white" />}
                      {label}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Booking widget */}
        <div
          className="hero-in container-custom w-full"
          style={heroIn(50, 0.9, 0.6)}
        >
          <BookingWidget />
        </div>
      </m.div>

      {/* Slideshow pontok + Görgessen – EGYÜTT ALUL */}
      <div className="absolute bottom-6 short:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">

        {/* Pontok */}
        <div className="flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full ${i === current
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`${i + 1}. kép`}
            />
          ))}
        </div>

        {/* Görgessen */}
        <div className="flex flex-col items-center gap-1 text-white/70 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
          <span className="text-[10px] tracking-[0.25em] uppercase">Görgessen</span>
          <m.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={18} />
          </m.div>
        </div>

      </div>

    </section>
  );
}
