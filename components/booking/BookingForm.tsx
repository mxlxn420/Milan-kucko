"use client";

import { useState } from "react";
import { motion }   from "framer-motion";
import { ArrowLeft, ArrowRight, User, Mail, Phone, MessageSquare } from "lucide-react";
import { formatDateHu, formatCurrency } from "@/lib/utils";
import type { BookingData } from "./BookingPage";

interface Props {
  bookingData: BookingData;
  onBack:      () => void;
  onSuccess:   (bookingId: string) => void;
}

export default function BookingForm({ bookingData, onBack, onSuccess }: Props) {
  const [form, setForm] = useState({
    name:  "",
    email: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName:      form.name,
          guestEmail:     form.email,
          guestPhone:     form.phone,
          numberOfGuests: bookingData.guests,
          notes:          form.notes || null,
          checkIn:        bookingData.checkIn.toISOString(),
          checkOut:       bookingData.checkOut.toISOString(),
          basePrice:      bookingData.basePrice,
          guestSurcharge: bookingData.guestSurcharge,
          cleaningFee:    0,
          touristTax:     bookingData.touristTax,
          totalPrice:     bookingData.totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ismeretlen hiba");
      }

      onSuccess(data.data.id);
    } catch (err: any) {
      setError(err.message || "Hiba történt. Kérjük próbálja újra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl shadow-card p-8 space-y-5">
        <h2 className="font-serif text-xl text-forest-900 mb-6">Adja meg adatait</h2>

        <div>
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
            <User size={12} className="inline mr-1" />Teljes név *
          </label>
          <input
            className="input-base"
            placeholder="Kovács Anna"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
              <Mail size={12} className="inline mr-1" />E-mail *
            </label>
            <input
              className="input-base"
              type="email"
              placeholder="email@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
              <Phone size={12} className="inline mr-1" />Telefon *
            </label>
            <input
              className="input-base"
              placeholder="+36 30 123 4567"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
            <MessageSquare size={12} className="inline mr-1" />Megjegyzés
          </label>
          <textarea
            className="input-base resize-none"
            rows={4}
            placeholder="Pl. késői érkezés, különleges kérés, babakiságy igény..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="aszf"
            required
            className="mt-1 accent-forest-900"
          />
          <label htmlFor="aszf" className="text-sm text-stone-500 leading-relaxed">
            Elfogadom az{" "}
            <a href="/aszf" target="_blank" className="text-forest-700 underline hover:text-forest-900">
              Általános Szerződési Feltételeket
            </a>{" "}
            és az{" "}
            <a href="/adatvedelem" target="_blank" className="text-forest-700 underline hover:text-forest-900">
              Adatvédelmi tájékoztatót
            </a>.
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={15} /> Vissza
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Küldés...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Foglalás elküldése <ArrowRight size={15} />
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Összefoglaló */}
      <div className="bg-forest-900 rounded-3xl shadow-card p-6 text-cream h-fit">
        <h3 className="font-serif text-xl mb-6 text-cream">Foglalás összefoglalója</h3>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-cream/60">Érkezés</span>
            <span>{formatDateHu(bookingData.checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream/60">Távozás</span>
            <span>{formatDateHu(bookingData.checkOut)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream/60">Éjszakák</span>
            <span>{bookingData.nights} éj</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream/60">Vendégek</span>
            <span>{bookingData.guests} fő</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-cream/60">Szállás ({bookingData.nights} éj)</span>
            <span>{formatCurrency(bookingData.basePrice * bookingData.nights)}</span>
          </div>
          {bookingData.guestSurcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-cream/60">Extra vendég</span>
              <span>{formatCurrency(bookingData.guestSurcharge)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-cream/60">IFA</span>
            <span>{formatCurrency(bookingData.touristTax)}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-cream/80 font-medium">Végösszeg</span>
          <span className="font-serif text-2xl text-cream">
            {formatCurrency(bookingData.totalPrice)}
          </span>
        </div>

        <p className="text-xs text-cream/40 mt-4 leading-relaxed">
          A foglalás elküldése után e-mailben visszaigazolást küldünk.
          Fizetés helyszínen vagy előre utalással.
        </p>
      </div>

    </div>
  );
}