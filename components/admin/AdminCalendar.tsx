"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { hu }        from "date-fns/locale";
import { motion }    from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { formatDateHu }    from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface BookingItem {
  id:        string;
  checkIn:   string;
  checkOut:  string;
  status:    string;
  guestName: string;
}

interface BlockedItem {
  id:       string;
  dateFrom: string;
  dateTo:   string;
  reason?:  string | null;
}

interface Props {
  bookings: BookingItem[];
  blocked:  BlockedItem[];
}

export default function AdminCalendar({ bookings, blocked: initialBlocked }: Props) {
  const [blocked, setBlocked]   = useState<BlockedItem[]>(initialBlocked);
  const [range, setRange]       = useState<{ from?: Date; to?: Date }>({});
  const [reason, setReason]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Foglalt napok
  const bookedDays = bookings.flatMap(({ checkIn, checkOut }) => {
    const days = [];
    const cur  = new Date(checkIn);
    const end  = new Date(checkOut);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  });

  // Blokkolt napok
  const blockedDays = blocked.flatMap(({ dateFrom, dateTo }) => {
    const days = [];
    const cur  = new Date(dateFrom);
    const end  = new Date(dateTo);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  });

  const handleBlock = async () => {
    if (!range.from || !range.to) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/block", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          dateFrom: range.from.toISOString(),
          dateTo:   range.to.toISOString(),
          reason:   reason || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBlocked((prev) => [...prev, data.data]);
        setRange({});
        setReason("");
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await fetch(`/api/admin/block/${id}`, { method: "DELETE" });
      setBlocked((prev) => prev.filter((b) => b.id !== id));
    } catch {
      console.error("Feloldás sikertelen");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Naptár */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6">
        <DayPicker
          mode="range"
          selected={{ from: range.from, to: range.to }}
          onSelect={(r) => {
            setRange({ from: r?.from, to: r?.to });
            if (r?.from) setShowForm(true);
          }}
          numberOfMonths={2}
          locale={hu}
          modifiers={{
            booked:  bookedDays,
            blocked: blockedDays,
          }}
          modifiersStyles={{
            booked:  { backgroundColor: "#dceade", color: "#1a3a2a" },
            blocked: { backgroundColor: "#f5e6d8", color: "#a86435", textDecoration: "line-through" },
          }}
        />

        {/* Jelmagyarázat */}
        <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-stone-100">
          {[
            { color: "bg-forest-900", label: "Kiválasztott"  },
            { color: "bg-forest-100", label: "Foglalt"        },
            { color: "bg-terra-100",  label: "Blokkolt"       },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-stone-500">
              <span className={`w-4 h-4 rounded-full ${color} inline-block`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Jobb panel */}
      <div className="space-y-4">

        {/* Blokkolás form */}
        {showForm && range.from && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-stone-800">Napok blokkolása</h3>
              <button onClick={() => { setShowForm(false); setRange({}); }}>
                <X size={16} className="text-stone-400" />
              </button>
            </div>
            <div className="text-sm text-stone-600 mb-3">
              <span className="font-medium">{formatDateHu(range.from)}</span>
              {range.to && range.to !== range.from && (
                <> – <span className="font-medium">{formatDateHu(range.to)}</span></>
              )}
            </div>
            <input
              className="input-base mb-3"
              placeholder="Megjegyzés (pl. karbantartás)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              onClick={handleBlock}
              disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3"
            >
              <Plus size={14} />
              {loading ? "Mentés..." : "Blokkolás"}
            </button>
          </motion.div>
        )}

        {/* Blokkolt időszakok listája */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-medium text-stone-800 mb-4">Blokkolt időszakok</h3>
          {blocked.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-4">
              Nincs blokkolt időszak
            </p>
          ) : (
            <div className="space-y-2">
              {blocked.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-terra-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {formatDateHu(b.dateFrom)} – {formatDateHu(b.dateTo)}
                    </p>
                    {b.reason && (
                      <p className="text-xs text-stone-400 mt-0.5">{b.reason}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(b.id)}
                    className="w-7 h-7 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}