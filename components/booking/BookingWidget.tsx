"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, ArrowRight, ChevronDown } from "lucide-react";
import { format, addDays } from "date-fns";
import { hu }     from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { useBookingStore } from "@/store/bookingStore";
import { MAX_GUESTS, TOURIST_TAX } from "@/lib/utils";
import "react-day-picker/dist/style.css";

type Panel = "none" | "checkin" | "checkout" | "guests";

interface PanelPos {
  top?:      number;
  bottom?:   number;
  left:      number;
  maxHeight: number;
  below:     boolean;
}

const PANEL_GAP  = 8;   // távolság a widgettől
const EDGE_GAP   = 8;   // minimális távolság a képernyő szélétől
const GUESTS_W   = 300;

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
  const [twoMonths, setTwoMonths]         = useState(true);
  const [mounted, setMounted]             = useState(false);
  const [pos, setPos]                     = useState<PanelPos | null>(null);

  const widgetRef = useRef<HTMLDivElement>(null);
  // A panelek belső tartalma, külön state-ben: panelváltáskor a kilépő animáció nem nullázza ki az újat.
  // (A ref nem mehet közvetlenül az AnimatePresence gyerekére, ezért a panel a tartalom szülője.)
  const [calendarEl, setCalendarEl] = useState<HTMLDivElement | null>(null);
  const [guestsEl, setGuestsEl]     = useState<HTMLDivElement | null>(null);
  const panelEl = panel === "guests" ? guestsEl : panel === "none" ? null : calendarEl;

  useEffect(() => {
    setMounted(true);
    const check = () => setTwoMonths(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = (p: Panel) => setPanel((prev) => (prev === p ? "none" : p));
  const fmt    = (d: Date | null) => d ? format(d, "MMM d.", { locale: hu }) : null;

  const totalGuests = adults + teens + babies + children2to6 + children6to12;
  const hasChildren = teens + babies + children2to6 + children6to12 > 0;
  const guestLabel  = hasChildren
    ? adults + " felnőtt, " + (teens + babies + children2to6 + children6to12) + " gyerek"
    : adults + " felnőtt";

  // A panel oda nyílik (a widget alá vagy fölé), ahol elfér – ha sehol, akkor ahol több a hely, görgethetően
  const place = useCallback(() => {
    const widget = widgetRef.current;
    const el     = panelEl?.parentElement;
    if (!widget || !el) return;

    const rect    = widget.getBoundingClientRect();
    const navbarH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navbar-h")) || 80;

    // Ha a widget kigörgetett a képből, a panel se lógjon a semmiben
    if (rect.bottom < navbarH || rect.top > window.innerHeight) { setPanel("none"); return; }

    const height  = el.scrollHeight;
    const width   = el.offsetWidth;

    const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP - EDGE_GAP;
    const spaceAbove = rect.top - PANEL_GAP - navbarH - EDGE_GAP;
    const below = height <= spaceBelow || (height > spaceAbove && spaceBelow > spaceAbove);

    const preferredLeft = panel === "guests" ? rect.right - width : rect.left;
    const left = Math.max(EDGE_GAP, Math.min(preferredLeft, window.innerWidth - width - EDGE_GAP));

    setPos(below
      ? { top: rect.bottom + PANEL_GAP, left, maxHeight: Math.max(200, spaceBelow), below }
      : { bottom: window.innerHeight - rect.top + PANEL_GAP, left, maxHeight: Math.max(200, spaceAbove), below });
  }, [panel, panelEl]);

  useLayoutEffect(() => {
    if (!panelEl) { setPos(null); return; }
    place();

    // A naptár magassága hónapváltáskor változhat (5 vagy 6 hét)
    const observer = new ResizeObserver(place);
    observer.observe(panelEl);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel("none"); };

    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.removeEventListener("keydown", onKey);
    };
  }, [panelEl, twoMonths, place]);

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

  const panelStyle: React.CSSProperties = {
    position:   "fixed",
    top:        pos?.top,
    bottom:     pos?.bottom,
    left:       pos?.left ?? 0,
    maxHeight:  pos?.maxHeight,
    visibility: pos ? "visible" : "hidden",
    zIndex:     9999,
  };
  const panelMotion = {
    initial:    { opacity: 0, y: pos?.below ? -12 : 12 },
    animate:    { opacity: 1, y: 0 },
    exit:       { opacity: 0, y: pos?.below ? -12 : 12 },
    transition: { duration: 0.25 },
  };

  const fieldClass = (active: boolean) =>
    "flex items-center gap-3 md:gap-2 lg:gap-3 px-5 md:px-4 lg:px-5 py-4 short:py-3 text-left hover:bg-amber-50/50 transition-colors min-w-0 " +
    (active ? "bg-amber-50/70" : "");

  return (
    <div className="relative max-w-3xl" ref={widgetRef}>

      {/* Mobil gomb */}
      <div className="sm:hidden">
        <Link
          href="/foglalas"
          className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 text-forest-900 font-medium text-sm tracking-wide active:scale-[0.97] transition-transform"
        >
          <Calendar size={18} className="text-forest-700" />
          Foglaljon most
          <ArrowRight size={16} className="text-terra-400" />
        </Link>
      </div>

      {/* Desktop / tablet widget sáv – sm-en 2×2 rács, md-től egy sor */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">

        {/* Check-in */}
        <button
          onClick={() => toggle("checkin")}
          className={fieldClass(panel === "checkin") + " border-r border-b md:border-b-0 border-stone-100"}
        >
          <Calendar size={18} className="text-forest-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Érkezés</p>
            <p className={"text-sm font-medium whitespace-nowrap truncate " + (checkIn ? "text-stone-800" : "text-stone-400")}>
              {fmt(checkIn) ?? "Válassz dátumot"}
            </p>
          </div>
          <ChevronDown size={14} className={"ml-auto text-stone-400 shrink-0 md:hidden transition-transform " + (panel === "checkin" ? "rotate-180" : "")} />
        </button>

        {/* Check-out */}
        <button
          onClick={() => toggle("checkout")}
          className={fieldClass(panel === "checkout") + " border-b md:border-b-0 md:border-r border-stone-100"}
        >
          <Calendar size={18} className="text-forest-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Távozás</p>
            <p className={"text-sm font-medium whitespace-nowrap truncate " + (checkOut ? "text-stone-800" : "text-stone-400")}>
              {fmt(checkOut) ?? "Válassz dátumot"}
            </p>
          </div>
          <ChevronDown size={14} className={"ml-auto text-stone-400 shrink-0 md:hidden transition-transform " + (panel === "checkout" ? "rotate-180" : "")} />
        </button>

        {/* Vendégek */}
        <button
          onClick={() => toggle("guests")}
          className={fieldClass(panel === "guests") + " border-r border-stone-100"}
        >
          <Users size={18} className="text-forest-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-0.5">Vendégek</p>
            <p className="text-sm font-medium text-stone-800 whitespace-nowrap truncate">{guestLabel}</p>
          </div>
          <ChevronDown size={14} className={"ml-auto text-stone-400 shrink-0 transition-transform " + (panel === "guests" ? "rotate-180" : "")} />
        </button>

        {/* CTA */}
        <div className="flex items-center px-4 py-4 short:py-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBooking}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 short:py-3 bg-forest-900 text-cream text-xs font-medium tracking-[0.15em] uppercase rounded-xl hover:bg-forest-700 transition-colors whitespace-nowrap"
          >
            Foglalás <ArrowRight size={14} />
          </motion.button>
        </div>

      </div>

      {/* Panelek – portálban, hogy a hero transzformációi és rétegei ne vágják le / csúsztassák el őket */}
      {mounted && createPortal(
        <>
          {panel !== "none" && (
            <div className="fixed inset-0 z-[9998]" onClick={() => setPanel("none")} />
          )}
          <AnimatePresence>
            {(panel === "checkin" || panel === "checkout") && (
              <motion.div
                key="calendar"
                {...panelMotion}
                style={panelStyle}
                className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-4 overflow-y-auto"
              >
                <div ref={setCalendarEl}>
                  <DayPicker
                    mode="range"
                    selected={{ from: checkIn ?? undefined, to: checkOut ?? undefined }}
                    onSelect={(range) => {
                      const from = range?.from ?? null;
                      // A DayPicker az első kattintásra from = to tartományt ad – ez még csak az érkezés
                      const to   = range?.to && from && range.to.getTime() !== from.getTime() ? range.to : null;
                      setCheckIn(from);
                      setCheckOut(to);
                      storeSetCheckIn(from);
                      storeSetCheckOut(to);
                      if (from && to) setPanel("none");
                    }}
                    startMonth={new Date()}
                    endMonth={addDays(new Date(), 365)}
                    disabled={{ before: new Date(), after: addDays(new Date(), 365) }}
                    numberOfMonths={twoMonths ? 2 : 1}
                    locale={hu}
                  />
                </div>
              </motion.div>
            )}

            {panel === "guests" && (
              <motion.div
                key="guests"
                {...panelMotion}
                style={{ ...panelStyle, width: GUESTS_W }}
                className="bg-white rounded-2xl shadow-2xl border border-stone-100 p-5 overflow-y-auto"
              >
                <div ref={setGuestsEl}>
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
                    <p>• IFA: <strong>{TOURIST_TAX} Ft/felnőtt/éj</strong> (18+)</p>
                    <p className="pt-1 border-t border-stone-100 font-medium text-stone-700">
                      Összesen: {totalGuests} fő
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
