"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Users, Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const VALUES = [
  { icon: MapPin, title: "Zsákutcai csend",    text: "Miskolctapolca csendes sarkában, zsákutcában – mégis mindenhez közel. Az Ellipsum, Barlangfürdő csak 1 km-re!" },
  { icon: Users,  title: "Csak ti vagytok",    text: "Az egész kuckót kizárólag nektek tartjuk fenn. Nincs más vendég – teljes privát szféra, igazi intimszféra." },
];

const NEARBY = [
  "Ellipsum, Barlangfürdő – 1 km",
  "Avalon Park / Maya Játszópark – 2,5 km",
  "Miskolctapolcai Bobpálya",
  "Erdei kisvasút – Lillafüred",
  "Diósgyőri Vár",
  "Hámori tó & Zsófia kilátó",
];

export default function AboutSection() {
  return (
    <section id="rolunk" className="section-py bg-cream overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Képek */}
          <AnimatedSection direction="left" className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury">
              <Image
                src="/images/haz/Milán Kuckó vendégház kis.jpg"
                alt="Milán Kuckó – vendégház kívülről"
                fill sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Lebegő kép */}
            <motion.div
              className="absolute -bottom-8 -right-4 w-44 h-52 rounded-2xl overflow-hidden shadow-luxury border-4 border-cream"
              initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Image
                src="/images/belso/fürdő.jpg"
                alt="Jacuzzi este"
                fill sizes="176px"
                className="object-cover"
              />
            </motion.div>
            {/* Értékelés badge */}
            <motion.div
              className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-card px-5 py-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-terra-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-xs font-medium text-stone-700"><strong>5.0 / 5.0</strong> – Kiváló</p>
              <p className="text-[10px] text-stone-400">Google értékelés</p>
            </motion.div>
          </AnimatedSection>

          {/* Szöveg */}
          <AnimatedSection direction="right" delay={0.15} className="lg:pl-4">
            <div className="section-badge">Rólunk</div>
            <h2 className="font-serif text-display-lg font-light text-forest-900 mb-6">
              Egy kis kuckó,<br />
              <em className="italic">ahol az idő megáll.</em>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              A Milán Kuckó egy romantikus, gondosan berendezett vendégház Miskolctapolca
              csendes zsákutcájában – <strong>maximum 4 fő</strong> részére. Hatalmas kert, privát
              jacuzzi, kandalló és ajándék bor vár minden érkezőt.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Csak ti vagytok az egész „birtokon" – nincs más vendég, nincs zaj.
              Ugyanakkor Magyarország egyik legkedveltebb üdülőhelyén, a Bükk lábánál
              rengeteg program vár a közelben.
            </p>

            {/* Értékek */}
            <div className="space-y-5 mb-10">
              {VALUES.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-forest-900/8 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-forest-700" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800 mb-0.5">{title}</p>
                    <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Közeli látnivalók */}
            <div className="bg-forest-900/5 rounded-2xl p-5">
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-forest-700 mb-3">
                Közeli látnivalók
              </p>
              <div className="grid grid-cols-2 gap-2">
                {NEARBY.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-terra-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}