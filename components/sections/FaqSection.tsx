"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { FAQS } from "@/lib/faqs";

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
                  aria-expanded={open === i}
                  aria-controls={`gyik-valasz-${i}`}
                >
                  <span className="font-medium text-stone-800 text-sm leading-relaxed">{q}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-forest-900/8 flex items-center justify-center">
                    {open === i ? <Minus size={14} className="text-forest-700" /> : <Plus size={14} className="text-forest-700" />}
                  </span>
                </button>
                {/* A válasz mindig a DOM-ban van (keresők, AI-crawlerek), csak CSS-sel csukjuk össze */}
                <div
                  id={`gyik-valasz-${i}`}
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden" inert={open !== i}>
                    <p className="px-6 pb-5 text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-4">
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
}