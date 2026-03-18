"use client";

import { useState } from "react";
import { formatDateHu, formatCurrency } from "@/lib/utils";
import { Check, X, Clock, CreditCard } from "lucide-react";
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
  const [list, setList]       = useState<Booking[]>(bookings);
  const [loading, setLoading] = useState<string | null>(null);

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
        setList((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
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
                <tr key={booking.id} className="hover:bg-stone-50 transition-colors">
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
                  <td className="px-5 py-4">
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}