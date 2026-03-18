"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const FAQS = [
  { q: "Mikor van bejelentkezés és kijelentkezés?",          a: "Bejelentkezés: 14:00–20:00 között. Kijelentkezés: 10:00-ig. Eltérő időpont előzetesen egyeztethető." },
  { q: "Hány fő tud elszállásolni a kuckóban?",              a: "A Milán Kuckó alapvetően 2 fő részére ideális, de maximum 4 fő számára biztosítható elhelyezés (extra pótágyakkal). 3+ fő esetén extra felár kerül felszámolásra." },
  { q: "Szabad-e kisállatot hozni?",                         a: "Sajnos kisállatokat nem tudunk fogadni, hogy minden vendégünk számára allergiamentes és tiszta környezetet biztosíthassunk." },
  { q: "Hogyan működik a dézsafürdő és a szauna?",           a: "Érkezés előtt a dézsafürdőt a kívánt hőfokra (kb. 38-40°C) előkészítjük. A szauna fa tüzelésű, felfűtési ideje kb. 1 óra – az instrukciók a helyszínen megtalálhatók." },
  { q: "Van-e lehetőség korai érkezésre vagy késői távozásra?", a: "Előzetes egyeztetés alapján igen, amennyiben a nyaraló szabad. Kérjük, jelezze igényét foglaláskor a megjegyzés rovatban." },
  { q: "Hogyan lehet lemondani a foglalást?",                 a: "A foglalás lemondása az érkezés előtt 7 napig ingyenes. 7 napon belüli lemondás esetén az előleg nem visszatérítendő. Részletek az ÁSZF-ben." },
  { q: "Van-e a közelben étterem vagy bevásárlási lehetőség?",a: "Miskolctapolca és Miskolc belvárosa 5-10 percre található, ahol számos étterem és áruház elérhető. A kuckóban teljes felszereltségű konyha áll rendelkezésre." },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gyik" className="section-py bg-forest-50">
      <div className="container-custom max-w-3xl">

        <AnimatedSection className="text-center mb-14">
          <div className="section-badge">GYIK</div>
          <h2 className="font-serif text-display-lg font-light text-forest-900">
            Gyakori kérdések
          </h2>
        </AnimatedSection>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <AnimatedSection key={i} delay={i * 0.06}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-medium text-stone-800 text-sm leading-relaxed">{q}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-forest-900/8 flex items-center justify-center">
                    {open === i ? <Minus size={14} className="text-forest-700" /> : <Plus size={14} className="text-forest-700" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-4">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
}