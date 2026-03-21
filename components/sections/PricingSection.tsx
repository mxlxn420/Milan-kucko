import { prisma }   from "@/lib/prisma";
import Link         from "next/link";
import { Check, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Szerver komponens – közvetlenül az adatbázisból olvas
export default async function PricingSection() {
  // Aktív árazási szabályok lekérése
  const rules = await prisma.pricingRule.findMany({
    where:   { isActive: true },
    orderBy: { priority: "desc" },
  });

  const formatDate = (d: Date | string | null | undefined) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("hu-HU", { month: "long" });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("hu-HU").format(price);

  return (
    <section id="arak" className="section-py bg-cream">
      <div className="container-custom">

        <AnimatedSection className="text-center mb-16">
          <div className="section-badge">Árak</div>
          <h2 className="font-serif text-display-lg font-light text-forest-900 mb-4">
            Átlátható árazás
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            Nincsenek rejtett költségek.
          </p>
        </AnimatedSection>

        {/* Szezonális árak */}
        {rules.length === 0 ? (
          <div className="text-center text-stone-400 py-12">
            Hamarosan frissítjük az árainkat.
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${rules.length >= 4 ? "lg:grid-cols-4" : rules.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5 mb-12`}>
            {rules.map((rule, i) => {
              const isDark    = i === 0; // Legmagasabb prioritású = kiemelt
              const fromMonth = formatDate(rule.dateFrom);
              const toMonth   = formatDate(rule.dateTo);
              const period    = fromMonth && toMonth
                ? `${fromMonth} – ${toMonth}`
                : "Alap ár";

              return (
                <div
                  key={rule.id}
                  className={`relative rounded-3xl p-7 ${
                    isDark
                      ? "bg-forest-900 text-cream"
                      : i % 2 === 0 ? "bg-stone-100" : "bg-terra-100"
                  }`}
                >

                  <p className={`text-xs font-medium tracking-[0.15em] uppercase mb-1 ${isDark ? "text-cream/60" : "text-stone-500"}`}>
                    {period}
                  </p>

                  <h3 className={`font-serif text-xl mb-2 ${isDark ? "text-cream" : "text-forest-900"}`}>
                    {rule.name}
                  </h3>

                  {/* Hétköznapi ár */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`font-serif text-3xl font-light ${isDark ? "text-cream" : "text-forest-900"}`}>
                      {formatPrice(rule.pricePerNight)}
                    </span>
                    <span className={`text-sm ${isDark ? "text-cream/60" : "text-stone-500"}`}>Ft / éj</span>
                  </div>

                  {/* Hétvégi ár ha különbözik */}
                  {(rule as any).weekendPrice > 0 && (rule as any).weekendPrice !== rule.pricePerNight && (
                    <p className={`text-xs mb-4 ${isDark ? "text-cream/50" : "text-stone-400"}`}>
                      Hétvége: {formatPrice((rule as any).weekendPrice)} Ft / éj
                    </p>
                  )}

                  {/* Feature lista */}
                  <ul className="space-y-2 my-5">
                    {[
                      "Privát jacuzzi",
                      "Ingyenes WiFi",
                      "Ingyenes parkoló",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-terra-400 shrink-0" />
                        <span className={isDark ? "text-cream/80" : "text-stone-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Gyerek árak */}
                  {((rule as any).childPrice2to6 > 0 || (rule as any).childPrice6to12 > 0) && (
                    <div className={`text-xs space-y-1 pt-3 border-t ${isDark ? "border-white/10 text-cream/50" : "border-stone-200 text-stone-400"}`}>
                      {(rule as any).childPrice2to6 > 0 && (
                        <p>Kisgyerek (2–6): +{formatPrice((rule as any).childPrice2to6)} Ft/éj</p>
                      )}
                      {(rule as any).childPrice6to12 > 0 && (
                        <p>Gyerek (6–12): +{formatPrice((rule as any).childPrice6to12)} Ft/éj</p>
                      )}
                    </div>
                  )}

                  <p className={`text-xs mt-3 ${isDark ? "text-cream/40" : "text-stone-400"}`}>
                    Min. {rule.minNights} éjszaka
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Egyéb díjak */}
        <AnimatedSection className="bg-white rounded-3xl p-8 mb-10 max-w-2xl mx-auto shadow-card">
          <h3 className="font-serif text-xl text-forest-900 mb-5">Egyéb díjak</h3>
          <div className="divide-y divide-stone-100">
            <div className="flex justify-between py-3 text-sm">
              <span className="text-stone-600">IFA (18+ évesekre)</span>
              <span className="font-medium text-stone-800">450 Ft / fő / éj</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-stone-600">0–2 éves baba</span>
              <span className="font-medium text-stone-800">Ingyenes</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-stone-600">Háziállat</span>
              <span className="font-medium text-stone-800">Nem hozható</span>
            </div>
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