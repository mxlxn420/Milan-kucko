"use client";

import { useState } from "react";
import { formatDateHu, formatCurrency } from "@/lib/utils";
import { Check, X, Clock, CreditCard, ChevronRight } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  PENDING:   { label: "Függőben",   color: "bg-yellow-100 text-yellow-700"  },
  CONFIRMED: { label: "Jóváhagyva", color: "bg-blue-100 text-blue-700"      },
  PAID:      { label: "Fizetve",    color: "bg-green-100 text-green-700"     },
  CANCELLED: { label: "Lemondva",   color: "bg-red-100 text-red-700"         },
  BLOCKED:   { label: "Blokkolt",   color: "bg-stone-100 text-stone-600"     },
};

interface Props {
  bookings: Booking[];
}

export default function AdminBookingsList({ bookings }: Props) {
  const [list, setList]                   = useState<Booking[]>(bookings);
  const [loading, setLoading]             = useState<string | null>(null);
  const [selected, setSelected]           = useState<Booking | null>(null);

  const updateStatus = async (id: string, status: BookingStatus) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setList((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
      }
    } finally {
      setLoading(null);
    }
  };

  if (!list.length) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-12 text-center text-stone-400">
        Még nincsenek foglalások.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {["Azonosító", "Vendég", "Érkezés", "Távozás", "Fő", "Összeg", "Státusz", "Műveletek"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((booking) => {
                const statusCfg = STATUS_CONFIG[booking.status as BookingStatus];
                return (
                  <tr
                    key={booking.id}
                    onClick={() => setSelected(booking)}
                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-stone-500">
                      {booking.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-stone-800">{booking.guestName}</p>
                      <p className="text-xs text-stone-400">{booking.guestEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {formatDateHu(booking.checkIn)}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {formatDateHu(booking.checkOut)}
                    </td>
                    <td className="px-5 py-4 text-stone-600 text-center">
                      {booking.numberOfGuests}
                    </td>
                    <td className="px-5 py-4 font-medium text-stone-800">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => updateStatus(booking.id, "CONFIRMED")}
                              disabled={loading === booking.id}
                              className="w-7 h-7 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center transition-colors"
                              title="Jóváhagyás"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => updateStatus(booking.id, "CANCELLED")}
                              disabled={loading === booking.id}
                              className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                              title="Lemondás"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => updateStatus(booking.id, "PAID")}
                            disabled={loading === booking.id}
                            className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                            title="Fizetve"
                          >
                            <CreditCard size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(booking)}
                          className="w-7 h-7 rounded-lg bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center transition-colors"
                          title="Részletek"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Részletes nézet – modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-luxury w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fejléc */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <div>
                <p className="font-mono text-xs text-stone-400">{selected.id}</p>
                <h2 className="font-serif text-xl text-stone-800 mt-0.5">{selected.guestName}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selected.status as BookingStatus].color}`}>
                  {STATUS_CONFIG[selected.status as BookingStatus].label}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Kapcsolat */}
              <section>
                <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Kapcsolat</h3>
                <div className="space-y-1 text-sm text-stone-700">
                  <p>{selected.guestEmail}</p>
                  <p>{selected.guestPhone}</p>
                </div>
              </section>

              {/* Dátumok */}
              <section>
                <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Tartózkodás</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-0.5">Érkezés</p>
                    <p className="font-medium text-stone-800">{formatDateHu(selected.checkIn)}</p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-0.5">Távozás</p>
                    <p className="font-medium text-stone-800">{formatDateHu(selected.checkOut)}</p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-0.5">Éjszakák</p>
                    <p className="font-medium text-stone-800">{selected.nights} éj</p>
                  </div>
                </div>
              </section>

              {/* Vendégek */}
              <section>
                <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Vendégek</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between bg-stone-50 rounded-xl px-3 py-2">
                    <span className="text-stone-500">Összes</span>
                    <span className="font-medium text-stone-800">{selected.numberOfGuests} fő</span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-xl px-3 py-2">
                    <span className="text-stone-500">Felnőtt</span>
                    <span className="font-medium text-stone-800">{selected.numberOfAdults} fő</span>
                  </div>
                  {selected.numberOfChildren2to6 > 0 && (
                    <div className="flex justify-between bg-stone-50 rounded-xl px-3 py-2">
                      <span className="text-stone-500">Gyerek (2–6)</span>
                      <span className="font-medium text-stone-800">{selected.numberOfChildren2to6} fő</span>
                    </div>
                  )}
                  {selected.numberOfChildren6to12 > 0 && (
                    <div className="flex justify-between bg-stone-50 rounded-xl px-3 py-2">
                      <span className="text-stone-500">Gyerek (6–12)</span>
                      <span className="font-medium text-stone-800">{selected.numberOfChildren6to12} fő</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Árak */}
              <section>
                <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Árösszesítő</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Szállás × {selected.nights} éj</span>
                    <span>{formatCurrency(selected.basePrice * selected.nights)}</span>
                  </div>
                  {selected.numberOfChildren2to6 > 0 && selected.childPrice2to6 > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Gyerek (2–6) × {selected.numberOfChildren2to6} fő × {selected.nights} éj</span>
                      <span>{formatCurrency(selected.childPrice2to6 * selected.numberOfChildren2to6 * selected.nights)}</span>
                    </div>
                  )}
                  {selected.numberOfChildren6to12 > 0 && selected.childPrice6to12 > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Gyerek (6–12) × {selected.numberOfChildren6to12} fő × {selected.nights} éj</span>
                      <span>{formatCurrency(selected.childPrice6to12 * selected.numberOfChildren6to12 * selected.nights)}</span>
                    </div>
                  )}
                  {selected.touristTax > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Idegenforgalmi adó</span>
                      <span>{formatCurrency(selected.touristTax)}</span>
                    </div>
                  )}
                  {selected.cleaningFee > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Takarítási díj</span>
                      <span>{formatCurrency(selected.cleaningFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-stone-800 border-t border-stone-100 pt-2 mt-2">
                    <span>Összesen</span>
                    <span>{formatCurrency(selected.totalPrice)}</span>
                  </div>
                </div>
              </section>

              {/* Megjegyzés */}
              {selected.notes && (
                <section>
                  <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Megjegyzés</h3>
                  <p className="text-sm text-stone-700 bg-stone-50 rounded-xl px-3 py-2">{selected.notes}</p>
                </section>
              )}

              {/* Műveletek */}
              {(selected.status === "PENDING" || selected.status === "CONFIRMED") && (
                <section className="flex gap-2 pt-1">
                  {selected.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(selected.id, "CONFIRMED")}
                        disabled={loading === selected.id}
                        className="flex-1 py-2.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium transition-colors"
                      >
                        Jóváhagyás
                      </button>
                      <button
                        onClick={() => updateStatus(selected.id, "CANCELLED")}
                        disabled={loading === selected.id}
                        className="flex-1 py-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 text-sm font-medium transition-colors"
                      >
                        Lemondás
                      </button>
                    </>
                  )}
                  {selected.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateStatus(selected.id, "PAID")}
                      disabled={loading === selected.id}
                      className="flex-1 py-2.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm font-medium transition-colors"
                    >
                      Megjelölés fizetettként
                    </button>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
