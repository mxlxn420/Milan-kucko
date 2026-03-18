"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const SEASONS = [
  {
    name: "Téli szezon",
    period: "Dec – Feb",
    price: "45 000",
    minNights: 2,
    color: "bg-stone-100",
    features: ["2 fő alapár", "Privát dézsafürdő", "Finn szauna", "Ingyenes parkoló"],
  },
  {
    name: "Tavaszi szezon",
    period: "Már – Jún",
    price: "52 000",
    minNights: 2,
    color: "bg-forest-50",
    features: ["2 fő alapár", "Privát dézsafürdő", "Finn szauna", "Ingyenes parkoló"],
  },
  {
    name: "Főszezon",
    period: "Júl – Aug",
    price: "65 000",
    minNights: 2,
    color: "bg-forest-900",
    dark: true,
    badge: "Legnépszerűbb",
    features: ["2 fő alapár", "Privát dézsafürdő", "Finn szauna", "Ingyenes parkoló"],
  },
  {
    name: "Őszi szezon",
    period: "Szept – Nov",
    price: "50 000",
    minNights: 2,
    color: "bg-terra-100",
    features: ["2 fő alapár", "Privát dézsafürdő", "Finn szauna", "Ingyenes parkoló"],
  },
];

const EXTRAS = [
  { label: "IFA (idegenforgalmi adó)", price: "500 Ft / fő / éj"  },
  { label: "Háziállat",               price: "Nem hozható"        },
];

export default function PricingSection() {
  return (
    <section id="arak" className="section-py bg-cream">
      <div className="container-custom">

        <AnimatedSection className="text-center mb-16">
          <div className="section-badge">Árak</div>
          <h2 className="font-serif text-display-lg font-light text-forest-900 mb-4">
            Átlátható árazás
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            Nincsenek rejtett költségek. Az ár tartalmazza a dézsafürdő és szauna használatát.
          </p>
        </AnimatedSection>

        {/* Szezonális árak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {SEASONS.map(({ name, period, price, minNights, color, dark, badge, features }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-3xl p-7 ${color} ${dark ? "text-cream" : "text-stone-800"}`}
            >
              {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terra-400 text-white text-[10px] font-medium tracking-widest uppercase px-4 py-1.5 rounded-full">
                  {badge}
                </span>
              )}
              <p className={`text-xs font-medium tracking-[0.15em] uppercase mb-1 ${dark ? "text-cream/60" : "text-stone-500"}`}>
                {period}
              </p>
              <h3 className={`font-serif text-xl mb-1 ${dark ? "text-cream" : "text-forest-900"}`}>{name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className={`font-serif text-3xl font-light ${dark ? "text-cream" : "text-forest-900"}`}>{price}</span>
                <span className={`text-sm ${dark ? "text-cream/60" : "text-stone-500"}`}>Ft / éj</span>
              </div>
              <ul className="space-y-2 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-terra-400 shrink-0" />
                    <span className={dark ? "text-cream/80" : "text-stone-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-xs ${dark ? "text-cream/50" : "text-stone-400"}`}>
                Min. {minNights} éjszaka
              </p>
            </motion.div>
          ))}
        </div>

        {/* Extra díjak */}
        <AnimatedSection className="bg-white rounded-3xl p-8 mb-10 max-w-2xl mx-auto shadow-card">
          <h3 className="font-serif text-xl text-forest-900 mb-5">Egyéb díjak</h3>
          <div className="divide-y divide-stone-100">
            {EXTRAS.map(({ label, price }) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <span className="text-stone-600">{label}</span>
                <span className="font-medium text-stone-800">{price}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center">
          <Link href="/foglalas" className="btn-primary">
            Foglaljon most <ArrowRight size={16} />
          </Link>
        </AnimatedSection>

      </div>
    </section>
  );
}