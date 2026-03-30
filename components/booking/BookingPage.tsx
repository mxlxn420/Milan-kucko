"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/bookingStore";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm     from "@/components/booking/BookingForm";
import BookingSuccess  from "@/components/booking/BookingSuccess";

export type BookingStep = "calendar" | "form" | "success";

export interface BookingData {
  checkIn:         Date;
  checkOut:        Date;
  guests:          number;
  adults:          number;
  teens:           number;
  babies:          number;
  children2to6:    number;
  children6to12:   number;
  nights:          number;
  weekdayNights:   number;
  weekendNights:   number;
  weekdayRate:     number;
  weekendRate:     number;
  totalPrice:      number;
  basePrice:       number;
  childPrice2to6:  number;
  childPrice6to12: number;
  guestSurcharge:  number;
  touristTax:      number;
}

export default function BookingPage() {
  const store = useBookingStore();
  const [step, setStep]               = useState<BookingStep>("calendar");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId]     = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="container-custom max-w-4xl">

        {/* Fejléc */}
        <div className="text-center mb-12">
          <div className="section-badge">Foglalás</div>
          <h1 className="font-serif text-display-lg font-light text-forest-900">
            Milán Kuckó foglalása
          </h1>
          <p className="text-stone-500 mt-3">
            Bencések útja 117/A, Miskolctapolca · Max. 4 fő
          </p>
        </div>

        {/* Lépés indikátor */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[
            { key: "calendar", label: "1. Dátum"   },
            { key: "form",     label: "2. Adatok"  },
            { key: "success",  label: "3. Kész"    },
          ].map(({ key, label }, i) => (
            <div key={key} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                step === key
                  ? "bg-forest-900 text-cream"
                  : (step === "form" && key === "calendar") || step === "success"
                  ? "bg-forest-100 text-forest-700"
                  : "bg-stone-100 text-stone-400"
              }`}>
                {label}
              </div>
              {i < 2 && <div className="w-8 h-px bg-stone-200" />}
            </div>
          ))}
        </div>

        {/* Tartalom */}
        <AnimatePresence mode="wait">
          {step === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BookingCalendar
                onNext={(data) => {
                  setBookingData(data);
                  setStep("form");
                }}
              />
            </motion.div>
          )}

          {step === "form" && bookingData && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BookingForm
                bookingData={bookingData}
                onBack={() => setStep("calendar")}
                onSuccess={(id) => {
                  setBookingId(id);
                  setStep("success");
                  store.reset(); // ← store törlése sikeres foglalás után
                }}
              />
            </motion.div>
          )}

          {step === "success" && bookingData && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <BookingSuccess
                bookingData={bookingData}
                bookingId={bookingId ?? ""}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}