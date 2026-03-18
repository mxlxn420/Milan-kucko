"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { hu } from "date-fns/locale";
import { Users, ArrowRight, AlertCircle } from "lucide-react";
import { formatDateHu, formatCurrency } from "@/lib/utils";
import type { BookingData } from "./BookingPage";
import "react-day-picker/dist/style.css";

// ─── ÁRKÉPZÉS ────────────────────────────────────────────────
// Ide írd be a valódi árakat!
const TOURIST_TAX  = 500; // per fő / éj

function getPricePerNight(checkIn: Date): number {
  const month = checkIn.getMonth() + 1;
  if ([7, 8].includes(month))           return 65_000; // Főszezon
  if ([3, 4, 5, 6].includes(month))     return 52_000; // Tavasz
  if ([9, 10, 11].includes(month))      return 50_000; // Ősz
  return 45_000;                                        // Tél/alap
}

function getMinNights(checkIn: Date): number {
  const month = checkIn.getMonth() + 1;
  if ([7, 8, 12].includes(month)) return 3;
  return 2;
}

// ─── FOGLALT NAPOK (később API-ból jön) ─────────────────────
const BOOKED_RANGES: { from: Date; to: Date }[] = [
  // Példa – töröld ki és az API tölti fel majd
  // { from: new Date("2025-04-10"), to: new Date("2025-04-13") },
];

function isBooked(date: Date): boolean {
  return BOOKED_RANGES.some(
    ({ from, to }) => date >= from && date <= to
  );
}

interface Props {
  onNext: (data: BookingData) => void;
}

export default function BookingCalendar({ onNext }: Props) {
  const [range, setRange]   = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [error, setError]   = useState<string | null>(null);

  const checkIn  = range?.from ?? null;
  const checkOut = range?.to   ?? null;
  const nights   = checkIn && checkOut
    ? differenceInCalendarDays(checkOut, checkIn)
    : 0;

  // Árkalkuláció
  const pricePerNight  = checkIn ? getPricePerNight(checkIn) : 45_000;
  const minNights      = checkIn ? getMinNights(checkIn) : 2;
  const baseTotal      = pricePerNight * nights;
  const extraGuests    = Math.max(0, guests - 2);
  const guestSurcharge = extraGuests * 3_000 * nights;
  const touristTax     = guests * TOURIST_TAX * nights;
  const total          = baseTotal + guestSurcharge + touristTax;

  const handleNext = () => {
    setError(null);
    if (!checkIn || !checkOut) {
      setError("Kérjük válasszon érkezési és távozási dátumot!");
      return;
    }
    if (nights < minNights) {
      setError(`Ebben az időszakban minimum ${minNights} éjszaka foglalható!`);
      return;
    }
    onNext({
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice:     total,
      basePrice:      pricePerNight,
      touristTax,
      guestSurcharge,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Naptár */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6">
        <h2 className="font-serif text-xl text-forest-900 mb-5">
          Válasszon dátumot
        </h2>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(r) => {
            setRange(r);
            setError(null);
          }}
          fromDate={new Date()}
          numberOfMonths={2}
          locale={hu}
          disabled={isBooked}
          modifiers={{ booked: BOOKED_RANGES.map((r) => ({ from: r.from, to: r.to })) }}
          modifiersClassNames={{ booked: "rdp-day_booked" }}
          styles={{
            months: { gap: "1rem" },
          }}
        />

        {/* Jelmagyarázat */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-4 h-4 rounded-full bg-forest-900 inline-block" />
            Kiválasztva
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-4 h-4 rounded-full bg-stone-200 inline-block" />
            Szabad
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-4 h-4 rounded-full bg-terra-200 inline-block" />
            Foglalt
          </div>
        </div>
      </div>

      {/* Összesítő oldalpanel */}
      <div className="flex flex-col gap-4">

        {/* Vendégszám */}
        <div className="bg-white rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-forest-700" />
            <h3 className="font-medium text-stone-800">Vendégek</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600">Fők száma</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
              >−</button>
              <span className="w-5 text-center font-medium">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(4, guests + 1))}
                className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
              >+</button>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-3">Max. 4 fő. 3-4. főtől +3 000 Ft/fő/éj.</p>
        </div>

        {/* Árösszesítő */}
        <div className="bg-white rounded-3xl shadow-card p-6 flex-1">
          <h3 className="font-medium text-stone-800 mb-4">Árösszesítő</h3>

          {nights > 0 ? (
            <>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-stone-500">{formatCurrency(pricePerNight)} × {nights} éj</span>
                  <span className="text-stone-800">{formatCurrency(baseTotal)}</span>
                </div>
                {guestSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Extra vendég felár</span>
                    <span className="text-stone-800">{formatCurrency(guestSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">IFA ({guests} fő)</span>
                  <span className="text-stone-800">{formatCurrency(touristTax)}</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold">
                <span className="text-stone-800">Összesen</span>
                <span className="text-forest-900 text-lg">{formatCurrency(total)}</span>
              </div>

              {/* Dátumok */}
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-1 text-xs text-stone-500">
                <div className="flex justify-between">
                  <span>Érkezés</span>
                  <span className="text-stone-700">{formatDateHu(checkIn!)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Távozás</span>
                  <span className="text-stone-700">{formatDateHu(checkOut!)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Min. éjszaka</span>
                  <span className="text-stone-700">{minNights} éj</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-400 text-center py-4">
              Válasszon dátumot az ár megtekintéséhez
            </p>
          )}
        </div>

        {/* Hiba */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100"
          >
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Tovább gomb */}
        <button
          onClick={handleNext}
          className="btn-primary w-full justify-center"
        >
          Tovább az adatokhoz <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}