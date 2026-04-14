"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, ArrowRight, ChevronDown } from "lucide-react";
import { format, addDays } from "date-fns";
import { hu }     from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { useBookingStore } from "@/store/bookingStore";
import "react-day-picker/dist/style.css";

type Panel = "none" | "checkin" | "checkout" | "guests";

function GuestRow({
  label, value, min = 0, atMax = false, onChange,
}: {
  label: string; value: number; min?: number; atMax?: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40 flex items-center justify-center"
        >−</button>
        <span className="w-5 text-center font-medium text-stone-800 text-sm">{value}</span>
        <button
          onClick={() => { if (!atMax) onChange(value + 1); }}
          disabled={atMax}
          className="w-7 h-7 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40 flex items-center justify-center"
        >+</button>
      </div>
    </div>
  );
}

export default function BookingWidget() {
  const router = useRouter();
  const {
    setCheckIn:       storeSetCheckIn,
    setCheckOut:      storeSetCheckOut,
    setAdults:        storeSetAdults,
    setTeens:         storeSetTeens,
    setBabies:        storeSetBabies,
    setChildren2to6:  storeSetChildren2to6,
    setChildren6to12: storeSetChildren6to12,
  } = useBookingStore();

  const [checkIn, setCheckIn]             = useState<Date | null>(null);
  const [checkOut, setCheckOut]           = useState<Date | null>(null);
  const [adults, setAdults]               = useState(2);
  const [teens, setTeens]                 = useState(0);
  const [babies, setBabies]               = useState(0);
  const [children2to6, setChildren2to6]   = useState(0);
  const [children6to12, setChildren6to12] = useState(0);
  const [panel, setPanel]                 = useState<Panel>("none");
  const [isMobile, setIsMobile]           = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ bottom: 0, left: 0, width: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = (p: Panel) => setPanel((prev) => (prev === p ? "none" : p));
  const fmt    = (d: Date | null) => d ? format(d, "MMM d.", { locale: hu }) : null;

  const MAX_GUESTS  = 4;
  const totalGuests = adults + teens + babies + children2to6 + children6to12;
  const hasChildren = teens + babies + children2to6 + children6to12 > 0;
  const guestLabel  = hasChildren
    ? adults + " felnőtt, " + (teens + babies + children2to6 + children6to12) + " gyerek"
    : adults + " felnőtt";

  useEffect(() => {
    if (panel === "none" || !widgetRef.current) return;
    const updatePos = () => {
      if (!widgetRef.current) return;
      const rect = widgetRef.current.getBoundingClientRect();
      setPanelPos({
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

  const handleBooking = () => {
    storeSetCheckIn(checkIn);
    storeSetCheckOut(checkOut);
    storeSetAdults(adults);
    storeSetTeens(teens);
    storeSetBabies(babies);
    storeSetChildren2to6(children2to6);
    storeSetChildren6to12(children6to12);
    router.push("/foglalas");
  };

  return (
    <div className="relative max-w-3xl" ref={widgetRef}>

      {/* Mobil gomb */}
      <div className="sm:hidden">
        <motion.a
          href="/foglalas"
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 text-forest-900 font-medium text-sm tracking-wide"
        >
          <Calendar size={18} className="text-forest-700" />
          Foglaljon most
          <ArrowRight size={16} className="text-terra-400" />
        </motion.a>
      </div>

      {/* Desktop widget sáv */}
      <div className="hidden sm:block bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
        <div className="flex flex-row divide-x divide-stone-100">

          {/* Check-in */}
          <button
            onClick={() => toggle("checkin")}
            className={"flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none transition-colors " + (panel === "checkin" ? "bg-amber-50/70" : "")}
          >
            <Calendar size={18} className="text-forest-700 shrink-0" />
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Érkezés</p>
              <p className={"text-sm font-medium " + (checkIn ? "text-stone-800" : "text-stone-400")}>
                {fmt(checkIn) ?? "Válassz dátumot"}
              </p>
            </div>
            <ChevronDown size={14} className={"ml-auto text-stone-400 transition-transform " + (panel === "checkin" ? "rotate-180" : "")} />
          </button>

          {/* Check-out */}
          <button
            onClick={() => toggle("checkout")}
            className={"flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 transition-colors " + (panel === "checkout" ? "bg-amber-50/70" : "")}
          >
            <Calendar size={18} className="text-forest-700 shrink-0" />
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Távozás</p>
              <p className={"text-sm font-medium " + (checkOut ? "text-stone-800" : "text-stone-400")}>
                {fmt(checkOut) ?? "Válassz dátumot"}
              </p>
            </div>
            <ChevronDown size={14} className={"ml-auto text-stone-400 transition-transform " + (panel === "checkout" ? "rotate-180" : "")} />
          </button>

          {/* Vendégek */}
          <button
            onClick={() => toggle("guests")}
            className={"flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50/50 transition-colors " + (panel === "guests" ? "bg-amber-50/70" : "")}
          >
            <Users size={18} className="text-forest-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Vendégek</p>
              <p className="text-sm font-medium text-stone-800 truncate">{guestLabel}</p>
            </div>
            <ChevronDown size={14} className={"ml-auto text-stone-400 shrink-0 transition-transform " + (panel === "guests" ? "rotate-180" : "")} />
          </button>

          {/* CTA */}
          <div className="flex items-center px-4 py-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBooking}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-forest-900 text-cream text-xs font-medium tracking-[0.15em] uppercase rounded-xl hover:bg-forest-700 transition-colors"
            >
              Foglalás <ArrowRight size={14} />
            </motion.button>
          </div>

        </div>
      </div>

      {/* Panelek */}
      <AnimatePresence>
        {(panel === "checkin" || panel === "checkout") && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom:   panelPos.bottom,
              left:     isMobile ? 8 : panelPos.left,
              right:    isMobile ? 8 : "auto",
              zIndex:   9999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-4"
          >
            <DayPicker
              mode="range"
              selected={{ from: checkIn ?? undefined, to: checkOut ?? undefined }}
              onSelect={(range) => {
                const from = range?.from ?? null;
                const to   = range?.to   ?? null;
                setCheckIn(from);
                setCheckOut(to);
                storeSetCheckIn(from);
                storeSetCheckOut(to);
                if (from && to) setPanel("none");
              }}
              startMonth={new Date()}
              endMonth={addDays(new Date(), 365)}
              disabled={{ before: new Date(), after: addDays(new Date(), 365) }}
              numberOfMonths={isMobile ? 1 : 2}
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
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom:   panelPos.bottom,
              left:     isMobile ? 8 : Math.max(8, panelPos.left + panelPos.width - 300),
              right:    isMobile ? 8 : "auto",
              zIndex:   9999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-5 w-[300px]"
          >
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
              Vendégek
            </p>

            <GuestRow
              label="Felnőtt (18+ év)"
              value={adults}
              min={1}
              atMax={totalGuests >= MAX_GUESTS}
              onChange={(n) => { setAdults(n); storeSetAdults(n); }}
            />
            <GuestRow
              label="Baba (0–2 év) – ingyenes"
              value={babies}
              atMax={totalGuests >= MAX_GUESTS}
              onChange={(n) => { setBabies(n); storeSetBabies(n); }}
            />
            <GuestRow
              label="Kisgyerek (2–6 év)"
              value={children2to6}
              atMax={totalGuests >= MAX_GUESTS}
              onChange={(n) => { setChildren2to6(n); storeSetChildren2to6(n); }}
            />
            <GuestRow
              label="Gyerek (6–12 év)"
              value={children6to12}
              atMax={totalGuests >= MAX_GUESTS}
              onChange={(n) => { setChildren6to12(n); storeSetChildren6to12(n); }}
            />
            <GuestRow
              label="Fiatal (12–18 év)"
              value={teens}
              atMax={totalGuests >= MAX_GUESTS}
              onChange={(n) => { setTeens(n); storeSetTeens(n); }}
            />

            <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500 space-y-1">
              {babies > 0 && (
                <p>• Baba: <strong className="text-forest-700">ingyenes</strong></p>
              )}
              <p>• IFA: <strong>450 Ft/felnőtt/éj</strong> (18+)</p>
              <p className="pt-1 border-t border-stone-100 font-medium text-stone-700">
                Összesen: {totalGuests} fő
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {panel !== "none" && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setPanel("none")} />
      )}
    </div>
  );
}