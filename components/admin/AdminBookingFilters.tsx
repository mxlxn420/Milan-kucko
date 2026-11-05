"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  bookingListHref,
  countActiveFilters,
  hasDateFilter,
  parseIsoDate,
  type BookingListParams,
  type BookingSort,
  type BookingStatusParam,
  type SortDir,
} from "@/lib/bookingListParams";

interface Props {
  params: BookingListParams;
}

const SORT_OPTIONS: { value: `${BookingSort}:${SortDir}`; label: string }[] = [
  { value: "checkIn:asc",   label: "Érkezés (legkorábbi elöl)" },
  { value: "checkIn:desc",  label: "Érkezés (legkésőbbi elöl)" },
  { value: "checkOut:asc",  label: "Távozás (legkorábbi elöl)" },
  { value: "checkOut:desc", label: "Távozás (legkésőbbi elöl)" },
];

// 16px mobilon (iOS ne nagyítson rá), asztalin a megszokott text-sm
const fieldClass =
  "w-full min-w-0 border border-stone-200 rounded-lg px-3 py-2 text-base md:text-sm bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-500/30";
const labelClass = "block text-xs font-medium text-stone-500 mb-1";

export default function AdminBookingFilters({ params }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(params);

  // Szűrőváltáskor vissza az 1. oldalra
  const go = (next: BookingListParams) => {
    startTransition(() => router.push(bookingListHref({ ...next, page: 1 }), { scroll: false }));
  };

  const setDate = (key: "inFrom" | "inTo" | "outFrom" | "outTo", value: string) => {
    go({ ...params, [key]: parseIsoDate(value) });
  };

  const dateRange = (
    title: string,
    fromKey: "inFrom" | "outFrom",
    toKey: "inTo" | "outTo",
  ) => (
    <fieldset className="min-w-0">
      <legend className={labelClass}>{title}</legend>
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0">
          <span className="sr-only">{title} -tól</span>
          <input
            type="date"
            value={params[fromKey] ?? ""}
            max={params[toKey] ?? undefined}
            onChange={(e) => setDate(fromKey, e.target.value)}
            className={fieldClass}
            aria-label={`${title} -tól`}
          />
          <span className="block text-[11px] text-stone-400 mt-0.5">-tól</span>
        </label>
        <label className="min-w-0">
          <span className="sr-only">{title} -ig</span>
          <input
            type="date"
            value={params[toKey] ?? ""}
            min={params[fromKey] ?? undefined}
            onChange={(e) => setDate(toKey, e.target.value)}
            className={fieldClass}
            aria-label={`${title} -ig`}
          />
          <span className="block text-[11px] text-stone-400 mt-0.5">-ig</span>
        </label>
      </div>
    </fieldset>
  );

  return (
    <section
      className={`bg-white rounded-2xl shadow-card mb-6 transition-opacity ${isPending ? "opacity-60" : ""}`}
      aria-busy={isPending}
    >
      {/* Fejléc: mobilon összecsukható */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="md:hidden w-full flex items-center justify-between gap-2 px-4 py-3.5 text-left"
        aria-expanded={open}
        aria-controls="booking-filters-body"
      >
        <span className="flex items-center gap-2 font-medium text-stone-800">
          <SlidersHorizontal size={16} className="text-stone-500" />
          Szűrők és rendezés
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-forest-600 text-white text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown size={18} className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        id="booking-filters-body"
        className={`${open ? "block" : "hidden"} md:block px-4 pb-4 md:p-5 border-t border-stone-100 md:border-t-0`}
      >
        <div className="hidden md:flex items-center gap-2 mb-4 text-sm font-medium text-stone-700">
          <SlidersHorizontal size={15} className="text-stone-500" />
          Szűrők
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-forest-600 text-white text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 pt-4 md:pt-0">
          {/* Rendezés: csak mobilon, asztalin a táblázat fejlécéből */}
          <div className="md:hidden min-w-0">
            <label htmlFor="booking-sort" className={labelClass}>Rendezés</label>
            <select
              id="booking-sort"
              value={`${params.sort}:${params.dir}`}
              onChange={(e) => {
                const [sort, dir] = e.target.value.split(":") as [BookingSort, SortDir];
                go({ ...params, sort, dir });
              }}
              className={fieldClass}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label htmlFor="booking-status" className={labelClass}>Státusz</label>
            <select
              id="booking-status"
              value={params.status ?? ""}
              onChange={(e) => go({ ...params, status: (e.target.value || null) as BookingStatusParam | null })}
              className={fieldClass}
            >
              <option value="">Összes</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>{BOOKING_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {dateRange("Érkezés", "inFrom", "inTo")}
          {dateRange("Távozás", "outFrom", "outTo")}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <span className="relative inline-flex">
              <input
                type="checkbox"
                checked={params.past}
                onChange={(e) => go({ ...params, past: e.target.checked })}
                className="peer sr-only"
              />
              <span className="w-10 h-6 rounded-full bg-stone-200 peer-checked:bg-forest-600 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-forest-500/40" />
              <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </span>
            <span className="text-sm text-stone-700">
              Korábbi tételek is
              {hasDateFilter(params) && !params.past && (
                <span className="block text-xs text-stone-400">Dátumszűrőnél a korábbiak is látszanak</span>
              )}
            </span>
          </label>

          {activeCount > 0 && (
            <button
              type="button"
              // A rendezést megtartja, csak a szűrőket törli
              onClick={() => go({ ...params, status: null, inFrom: null, inTo: null, outFrom: null, outTo: null, past: false })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <X size={14} />
              Szűrők törlése
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
