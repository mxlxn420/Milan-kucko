"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, ArrowUpRight } from "lucide-react";

const NAV = [
  { label: "Rólunk",        href: "/#rolunk"        },
  { label: "Felszereltség", href: "/#felszereltseg" },
  { label: "Galéria",       href: "/#galeria"       },
  { label: "Árak",          href: "/#arak"          },
  { label: "GYIK",          href: "/#gyik"          },
  { label: "Kapcsolat",     href: "/#kapcsolat"     },
];

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream/70">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Branding */}
          <div>
            <Link href="/" className="block mb-5">
              <p className="font-serif text-3xl font-light text-cream">Milán Kuckó</p>
              <p className="text-xs text-cream/50 tracking-[0.25em] uppercase mt-1">Miskolctapolca</p>
            </Link>
            <p className="text-sm leading-relaxed text-cream/60 mb-6">
              Romantikus nyaraló privát dézsafürdővel és szaunával, Miskolctapolca szívében.
            </p>
            <div className="flex gap-3">
              {[{ icon: Facebook, label: "Facebook" }, { icon: Instagram, label: "Instagram" }].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/50 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigáció */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream mb-6">Navigáció</h3>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="group flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Elérhetőség */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream mb-6">Elérhetőség</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://maps.google.com/?q=Miskolctapolca" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-cream/60 hover:text-cream transition-colors group"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-terra-400" />
                  3519 Miskolctapolca, Miskolc
                </a>
              </li>
              <li>
                <a href="tel:+36301234567" className="flex items-center gap-3 text-sm text-cream/60 hover:text-cream transition-colors">
                  <Phone size={16} className="shrink-0 text-terra-400" />
                  +36 30 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:info@milankucko.hu" className="flex items-center gap-3 text-sm text-cream/60 hover:text-cream transition-colors">
                  <Mail size={16} className="shrink-0 text-terra-400" />
                  info@milankucko.hu
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream mb-6">Foglalás</h3>
            <p className="text-sm text-cream/60 mb-5 leading-relaxed">
              Foglaljon közvetlenül tőlünk – nincsenek extra díjak.
            </p>
            <Link href="/foglalas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terra-400 text-white text-xs font-medium tracking-[0.15em] uppercase rounded-full hover:bg-terra-500 transition-all hover:-translate-y-0.5"
            >
              Szabad dátumok <ArrowUpRight size={14} />
            </Link>
            <div className="mt-5 p-4 rounded-xl border border-cream/10 bg-white/5 text-sm">
              <div className="flex justify-between text-cream/60 mb-1">
                <span>Érkezés</span><span className="text-cream">14:00–20:00</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Távozás</span><span className="text-cream">10:00-ig</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Milán Kuckó – Minden jog fenntartva.</p>
          <div className="flex gap-6">
            <Link href="/adatvedelem" className="hover:text-cream/70 transition-colors">Adatvédelem</Link>
            <Link href="/aszf" className="hover:text-cream/70 transition-colors">ÁSZF</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}