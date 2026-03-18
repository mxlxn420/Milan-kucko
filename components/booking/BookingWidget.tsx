"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, ArrowRight, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Panel = "none" | "checkin" | "checkout" | "guests";

export default function BookingWidget() {
  const router = useRouter();
  const [checkIn, setCheckIn]   = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests]     = useState(2);
  const [panel, setPanel]       = useState<Panel>("none");

  const widgetRef  = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ bottom: 0, left: 0, width: 0 });

  const toggle = (p: Panel) => setPanel((prev) => (prev === p ? "none" : p));
  const fmt    = (d: Date | null) => d ? format(d, "MMM d.", { locale: hu }) : null;

  useEffect(() => {
    if (panel === "none" || !widgetRef.current) return;

    const updatePos = () => {
      if (!widgetRef.current) return;
      const rect = widgetRef.current.getBoundingClientRect();
      setPanelPos({
        // Felülről számítva: ablak magassága - widget teteje + 8px rés
        bottom: window.innerHeight - rect.top + 8,
        left:   rect.left,
        width:  rect.width,
      });
    };

    updatePos();
    window.addEventListener("scroll", updatePos, { passive: true });
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [panel]);

  return (
    <div className="relative max-w-3xl" ref={widgetRef}>

      {/* Widget sáv */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-stone-100">

          {/* Check-in */}
          <button
            onClick={() => toggle("checkin")}
            className={`flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none transition-colors ${panel === "checkin" ? "bg-amber-50/70" : ""}`}
          >
            <Calendar size={18} className="text-forest-700 shrink-0" />
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Érkezés</p>
              <p className={`text-sm font-medium ${checkIn ? "text-stone-800" : "text-stone-400"}`}>
                {fmt(checkIn) ?? "Válassz dátumot"}
              </p>
            </div>
            <ChevronDown size={14} className={`ml-auto text-stone-400 transition-transform duration-200 ${panel === "checkin" ? "rotate-180" : ""}`} />
          </button>

          {/* Check-out */}
          <button
            onClick={() => toggle("checkout")}
            className={`flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 transition-colors ${panel === "checkout" ? "bg-amber-50/70" : ""}`}
          >
            <Calendar size={18} className="text-forest-700 shrink-0" />
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Távozás</p>
              <p className={`text-sm font-medium ${checkOut ? "text-stone-800" : "text-stone-400"}`}>
                {fmt(checkOut) ?? "Válassz dátumot"}
              </p>
            </div>
            <ChevronDown size={14} className={`ml-auto text-stone-400 transition-transform duration-200 ${panel === "checkout" ? "rotate-180" : ""}`} />
          </button>

          {/* Vendégek */}
          <button
            onClick={() => toggle("guests")}
            className={`flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 transition-colors ${panel === "guests" ? "bg-amber-50/70" : ""}`}
          >
            <Users size={18} className="text-forest-700 shrink-0" />
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Vendégek</p>
              <p className="text-sm font-medium text-stone-800">{guests} fő</p>
            </div>
            <ChevronDown size={14} className={`ml-auto text-stone-400 transition-transform duration-200 ${panel === "guests" ? "rotate-180" : ""}`} />
          </button>

          {/* CTA */}
          <div className="flex items-center px-4 py-3 sm:py-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/foglalas")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-forest-900 text-cream text-xs font-medium tracking-[0.15em] uppercase rounded-xl hover:bg-forest-700 transition-colors"
            >
              Foglalás <ArrowRight size={14} />
            </motion.button>
          </div>

        </div>
      </div>

      {/* ── FELFELÉ nyíló panelek (fixed) ──────────────────── */}
      <AnimatePresence>
        {(panel === "checkin" || panel === "checkout") && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom:   panelPos.bottom,
              left:     panelPos.left,
              zIndex:   9999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-4"
          >
            <DayPicker
              mode="range"
              selected={{ from: checkIn ?? undefined, to: checkOut ?? undefined }}
              onSelect={(range) => {
                setCheckIn(range?.from ?? null);
                setCheckOut(range?.to ?? null);
                if (range?.from && range?.to) setPanel("none");
              }}
              fromDate={new Date()}
              numberOfMonths={2}
              locale={hu}
            />
          </motion.div>
        )}

        {panel === "guests" && (
          <motion.div
            key="guests"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom:   panelPos.bottom,
              left:     panelPos.left + panelPos.width - 240,
              zIndex:   9999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-5 w-60"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-700">Vendégek száma</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                >−</button>
                <span className="w-5 text-center font-medium text-stone-800">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(4, guests + 1))}
                  className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                >+</button>
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-3 pt-3 border-t border-stone-100">
              Max. 4 fő. 3+ főtől extra felár.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Háttér kattintásra bezár */}
      {panel !== "none" && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setPanel("none")}
        />
      )}

    </div>
  );
}