"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
}
export interface GalleryCategory {
  id: string;
  label: string;
  desc: string;
  images: GalleryImage[];
}

export const DEFAULT_CATEGORIES: GalleryCategory[] = [
  {
    id: "haz",
    label: "Ház & Exterior",
    desc: "A vendégház kívülről",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/53432e3f48ec9f9dfeb62c66.jpg",
        alt: "Milán Kuckó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/bd45fd03d7b6bea8e3d62b38.jpg",
        alt: "Milán Kuckó kívülről",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/665c23c9011f9664d8da2570.jpg",
        alt: "Vendégház a kert lenti részéből",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/f7162ab6b345969811462d93.jpg",
        alt: "Vendégház a kert lenti részéből",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/61667f380f53c85de241e61c.jpg",
        alt: "Vendégház a kert lenti részéből",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/e1745d90f67f49c535b4a3a2.jpg",
        alt: "Vendégház a kert lenti részéből",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/84109780a14e15320d471707.jpg",
        alt: "Vendégház a kert lenti részéből",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/e0ef9347f32210e27c022204.jpg",
        alt: "Bejárat",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/ccd13d367fd0daef9ea05df5.jpg",
        alt: "Milán kuckó a kaputól",
      },
    ],
  },
  {
    id: "kert",
    label: "Kert & Terasz",
    desc: "Hatalmas privát kert grillel és bográccsal",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/6461d103f066a7d7453a8f00.jpg",
        alt: "Privát kert",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/1b82cc388a1d4262ab9a94da.jpg",
        alt: "Kerti asztal",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/62d1fff46796e9edf7e68283.jpg",
        alt: "Grill",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/c0781d2df6a7b501580894b7.jpg",
        alt: "Grill nyitva",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/63cd5081441deebed67bd1ae.jpg",
        alt: "Bogrács",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/10524e84c76494bdf3123ba5.jpg",
        alt: "Bogrács balról",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/bd256a697d7f27cbdf0735fc.jpg",
        alt: "Bogrács fentről",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/0caa1a5ac37f2f72915c166f.jpg",
        alt: "Bogrács naplementében",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/2ba411fedb70ae3e22f2605a.jpg",
        alt: "Erkély",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/d55821ac4a346f25285c8412.jpg",
        alt: "Almafa",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/b7b1409ea407bc7dfb751b37.jpg",
        alt: "Kert lenti része",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/a11dc97e12184755ec305c63.jpg",
        alt: "Sziklakert",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/0254cbb6923d435ee0d7c385.jpg",
        alt: "",
      },
    ],
  },
  {
    id: "jacuzzi",
    label: "Jacuzzi",
    desc: "Privát jacuzzi korlátlan használattal",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/1d8393e59f7cf1e1360a0b52.jpg",
        alt: "Jacuzzi este",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/d5f339906da127355e376693.jpg",
        alt: "Jacuzzi",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/3d02987efa420e11ea230944.jpg",
        alt: "Jacuzzi kivilágítva",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/4797996c2641262dbc66630e.jpg",
        alt: "Jacuzzi télen",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/d92054cef83e6c63abe7d6b4.jpg",
        alt: "Jacuzzi télen kivilágítva",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/87aca0989ee41397c1eed4d0.jpg",
        alt: "Jacuzzi télen kívülről",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/0d92bd08be49303fe6c234c4.jpg",
        alt: "Jacuzzi télen kivilágítva kívülről",
      },
    ],
  },
  {
    id: "belso",
    label: "Belső terek",
    desc: "Hangulatos, gondosan berendezett szobák",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/fbc5be93c7acfd4a253099bd.jpg",
        alt: "Hálószoba",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/176cae3533d7d2162cc7d32e.jpg",
        alt: "Hálószoba ágy",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/b34a71d4f4629640ac9f3f64.jpg",
        alt: "Nappali kandalló",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/396b5f78cffb11612963a3a3.jpg",
        alt: "Konyha",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/6af320e1373873e865bc6a13.jpg",
        alt: "Fürdőszoba",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/a83ba5b6f76ae466c60cdd93.jpg",
        alt: "Étkezős nappali",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/c554bf2edf560de27226671d.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/d15531f907f61475a8f45b65.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/6cb013a996018290e6fc5661.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/b52a2181271824c8cb056fc5.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/09cacc85cdb5bc707982ba4d.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/0e042148baee76e01a98caaf.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/496e8b84128331d160118ef1.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/e125fa8bc78260bcb8240243.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/61dae60674f5766d79907e92.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/14ff08a6830c7e8d648c8ba6.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/1355e7ecd62ffafbdd7405d0.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/33c3c15ebdb041ad673ebdf8.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/458198761db821e642dea0f1.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/5493646175d61e87c6bfdfaf.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/c34068d531e740ea925acb74.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/baac9878629cf30abeb0fd41.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/c86c415c47bf8f9c3809cf53.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/3b4d4e1ec165cd2d06a3ca34.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/79e318ccc8707201d3388444.jpg",
        alt: "",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/3d1b147440e6b96816b6d27f.jpg",
        alt: "",
      },
    ],
  },
  {
    id: "kilatas",
    label: "Kilátás",
    desc: "Kilátás a kuckóból",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/bb07cb46c1e471b6446a003c.jpg",
        alt: "Kilátás a Bükkre",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/47b557e403f208ddab2bee8c.jpg",
        alt: "Erkélyről kilátás",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/4592993368b9cc79fdce0e51.jpg",
        alt: "Kilátás az ablakból",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/5e0157fe37dc4f3e1f92e89e.jpg",
        alt: "Reggeli kávé az erkélyen",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/2b0a20f903fee449b15fe1cc.jpg",
        alt: "Kilátás a Bükkre",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/51ada4826607de919942c6d3.jpg",
        alt: "Kilátás a Bükkre",
      },
    ],
  },
  {
    id: "kornyek",
    label: "Környék",
    desc: "Miskolctapolca és a Bükk gyönyörű tájai",
    images: [
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/0f059a5ef11f5d73a35a0222.jpg",
        alt: "Csónakázó tó fentről",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/aa3778b213041648bf8fedf0.jpg",
        alt: "Csónakázó tó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/2e63b9f4c950ae1b38965c84.jpg",
        alt: "Csónakázó tó a barlangfürdővel",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/81c9849b7d00f99d4832b5d2.jpg",
        alt: "Bobpálya",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/22a5abe1f0025e44c1da3539.jpg",
        alt: "Csónakázó tó adventi világítással",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/9623b477d3147b2c465ac8fb.jpg",
        alt: "Csónakázó tó adventi világítással",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/9dca217f397ba77dfdd909be.jpg",
        alt: "Csónakázó tó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/229690962e243e4cea0887a1.jpg",
        alt: "Csónakázó tó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/12509360f94fdb2f6f49aec6.jpg",
        alt: "Csónakázó tó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/9a2667e5a7c299ea40693f98.jpg",
        alt: "Miskolctapolcai sétány",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/f971755ebc446601100320a9.jpg",
        alt: "Hámori tó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/abba4ffd6b5b55b75df3a33c.jpg",
        alt: "Zsófia kilátó",
      },
      {
        src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/45f364e35e71f1199cccc27b.jpg",
        alt: "Lillafüredi Palotaszálló",
      },
    ],
  },
];

export default function GaleriaPage({
  categories = DEFAULT_CATEGORIES,
}: {
  categories?: GalleryCategory[];
}) {
  const ALL_IMAGES = categories.flatMap((cat) =>
    cat.images.map((img) => ({ ...img, category: cat.label })),
  );

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [navFixed, setNavFixed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNavFixed(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const prev = () =>
    setLightbox((i) =>
      i !== null ? (i - 1 + ALL_IMAGES.length) % ALL_IMAGES.length : null,
    );
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % ALL_IMAGES.length : null));

  // Lightbox megnyitása – globális index alapján
  const openLightbox = (catId: string, imgIndex: number) => {
    const catStartIndex = categories
      .slice(
        0,
        categories.findIndex((c) => c.id === catId),
      )
      .reduce((acc, cat) => acc + cat.images.length, 0);
    setLightbox(catStartIndex + imgIndex);
  };

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="container-custom">
        {/* Fejléc */}
        <div className="text-center mb-12">
          <div className="section-badge">Galéria</div>
          <h1 className="font-serif text-display-lg font-light text-forest-900">
            Tekintsen be a kuckóba
          </h1>
          <p className="text-stone-500 mt-3">
            {ALL_IMAGES.length} kép a szállásról és környékéről
          </p>
        </div>

        {/* Sentinel – megfigyeljük mikor tűnik el a nézőmezőből */}
        <div ref={sentinelRef} className="h-0" />

        {/* Fixed nav – csak amikor a sentinel eltűnt (iOS sticky fix) */}
        {navFixed && (
          <div className="fixed top-20 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex overflow-x-auto scrollbar-none items-center gap-2 bg-cream/95 backdrop-blur-md py-3 px-4 rounded-2xl shadow-card border border-stone-100">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={
                    "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 " +
                    (activeCategory === null
                      ? "bg-forest-900 text-cream shadow-luxury"
                      : "bg-white text-stone-600 hover:bg-forest-50 shadow-card")
                  }
                >
                  Összes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setTimeout(() => {
                        document.getElementById(cat.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 50);
                    }}
                    className={
                      "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 " +
                      (activeCategory === cat.id
                        ? "bg-forest-900 text-cream shadow-luxury"
                        : "bg-white text-stone-600 hover:bg-forest-50 shadow-card")
                    }
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kategória navigáció (inline) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16 py-4 rounded-2xl">
          <button
            onClick={() => setActiveCategory(null)}
            className={
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 " +
              (activeCategory === null
                ? "bg-forest-900 text-cream shadow-luxury"
                : "bg-white text-stone-600 hover:bg-forest-50 shadow-card")
            }
          >
            Összes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                document
                  .getElementById(cat.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 " +
                (activeCategory === cat.id
                  ? "bg-forest-900 text-cream shadow-luxury"
                  : "bg-white text-stone-600 hover:bg-forest-50 shadow-card")
              }
            >
              {cat.label}
              <span className="ml-1.5 text-xs opacity-60">
                {cat.images.length}
              </span>
            </button>
          ))}
        </div>

        {/* Kategóriák szekciónként */}
        <div className="space-y-20">
          {categories.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              style={{ scrollMarginTop: "140px" }}
            >
              {/* Szekció fejléc */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-serif text-display-md font-light text-forest-900">
                    {cat.label}
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">{cat.desc}</p>
                </div>
                <span className="text-stone-300 font-serif text-4xl font-light">
                  {cat.images.length}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-forest-900/20 via-terra-400/20 to-transparent mb-8" />

              {/* Képrács – egyforma rács */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.images.map((img, i) => (
                  <motion.div
                    key={img.src}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-[4/3]"
                    onClick={() => openLightbox(cat.id, i)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/40 transition-all duration-300 flex items-end p-4">
                      <span className="text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        {img.alt}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
              }
              touchStartX.current = null;
            }}
          >
            {/* Kategória label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
              {ALL_IMAGES[lightbox].category}
            </div>

            {/* Bezárás */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>

            {/* Előző */}
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Következő */}
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Kép */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full mx-12 sm:mx-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={ALL_IMAGES[lightbox].src}
                alt={ALL_IMAGES[lightbox].alt}
                width={1400}
                height={900}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/60">
                <p className="text-white/70 text-sm">
                  {ALL_IMAGES[lightbox].alt}
                </p>
                <p className="text-white/40 text-xs">
                  {lightbox + 1} / {ALL_IMAGES.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
