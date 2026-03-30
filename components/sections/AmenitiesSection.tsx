"use client";

import { motion } from "framer-motion";
import {
  Waves, Wifi, Wind, Tv, Coffee, UtensilsCrossed,
  Car, Flame, TreePine, Baby, Wine, Shirt
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const AMENITIES = [
  { icon: Waves, label: "Jacuzzi", desc: "Privát, korlátlan használat" },
  { icon: Flame, label: "Kandalló", desc: "Hangulatos esti tűz" },
  { icon: Wind, label: "Klíma", desc: "Fűtés és hűtés egész évben" },
  { icon: Wifi, label: "Ingyenes WiFi", desc: "Nagy sebességű internet" },
  { icon: Tv, label: "Smart TV", desc: "Síkképernyős, műholdas" },
  { icon: UtensilsCrossed, label: "Felszerelt konyha", desc: "Főzőlap, mosogatógép, mikró" },
  { icon: Coffee, label: "Bekészített tea és kávé", desc: "Tea-/kávéfőző bekészítve" },
  { icon: Wine, label: "Ajándék üveg bor", desc: "Minden érkezéskor" },
  { icon: Car, label: "Ingyenes parkoló", desc: "Saját, privát beálló" },
  { icon: TreePine, label: "Hatalmas privát kert", desc: "Grill, bogrács, szalonnasütő" },
  { icon: Shirt, label: "Fürdőköpeny & törölköző", desc: "Minden vendégnek" },
  { icon: Baby, label: "Bababarát szállás", desc: "Kiságy, fürdetőkád, etetőkészlet" },
];

export default function AmenitiesSection() {
  return (
    <section id="felszereltseg" className="section-py bg-forest-900 overflow-hidden">
      <div className="container-custom">

        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-terra-300 text-xs font-medium tracking-[0.2em] uppercase mb-4">
            <span className="h-px w-8 bg-terra-400/60" />
            Felszereltség
            <span className="h-px w-8 bg-terra-400/60" />
          </div>
          <h2 className="font-serif text-display-lg font-light text-cream mb-4">
            Minden, amire szüksége van
          </h2>
          <p className="text-cream/60 max-w-xl mx-auto leading-relaxed">
            A Milán Kuckó prémium felszereltséggel várja vendégeit –
            hogy az első pillanattól fogva csak a pihenésre kelljen gondolni.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AMENITIES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-colors cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-terra-400/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-terra-300" />
              </div>
              <p className="text-cream font-medium text-sm mb-1">{label}</p>
              <p className="text-cream/50 text-xs">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}