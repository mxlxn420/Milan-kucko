"use client";

import { useState } from "react";
import {
  isWeekend, addWeeks, subWeeks, startOfWeek, addDays,
  format, isSameDay,
} from "date-fns";
import { hu } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PricingRule } from "@/types";

interface Props {
  rules: PricingRule[];
}

function getApplicableRule(date: Date, rules: PricingRule[]): PricingRule | null {
  if (!rules.length) return null;
  const sorted = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  for (const rule of sorted) {
    if (rule.dateFrom && rule.dateTo) {
      const from = new Date(rule.dateFrom);
      const to   = new Date(rule.dateTo);
      if (date >= from && date <= to) return rule;
    }
  }
  return sorted.find((r) => !r.dateFrom && !r.dateTo) ?? null;
}

function getPriceForDay(date: Date, rule: PricingRule): number {
  if (rule.weekendPrice > 0 && isWeekend(date)) return rule.weekendPrice;
  return rule.pricePerNight;
}

const RULE_COLORS = [
  { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800",   badge: "bg-blue-100 text-blue-700"   },
  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  badge: "bg-amber-100 text-amber-700" },
  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", badge: "bg-purple-100 text-purple-700" },
  { bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-800",   badge: "bg-teal-100 text-teal-700"   },
  { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800",   badge: "bg-rose-100 text-rose-700"   },
];
const BASE_COLOR = { bg: "bg-stone-50", border: "border-stone-200", text: "text-stone-700", badge: "bg-stone-100 text-stone-600" };

export default function AdminPriceCalendar({ rules }: Props) {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(today, { weekStartsOn: 1 })
  );

  const seasonRules = rules.filter((r) => r.dateFrom || r.dateTo);
  const ruleColorMap: Record<string, typeof BASE_COLOR> = {};
  seasonRules.forEach((r, i) => {
    ruleColorMap[r.id] = RULE_COLORS[i % RULE_COLORS.length];
  });
  const baseRule = rules.find((r) => !r.dateFrom && !r.dateTo);
  if (baseRule) ruleColorMap[baseRule.id] = BASE_COLOR;

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = days[6];

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      {/* Fejléc */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="font-medium text-stone-800">
            {format(weekStart, "yyyy. MMM d.", { locale: hu })}
          </span>
          <span className="text-stone-400 mx-2">–</span>
          <span className="font-medium text-stone-800">
            {format(weekEnd, "MMM d.", { locale: hu })}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekStart((w) => subWeeks(w, 1))}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekStart(startOfWeek(today, { weekStartsOn: 1 }))}
            className="px-3 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs text-stone-600 transition-colors"
          >
            Ezen a héten
          </button>
          <button
            onClick={() => setWeekStart((w) => addWeeks(w, 1))}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Heti rács */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const rule    = getApplicableRule(day, rules);
          const price   = rule ? getPriceForDay(day, rule) : null;
          const colors  = rule ? (ruleColorMap[rule.id] ?? BASE_COLOR) : BASE_COLOR;
          const weekend = isWeekend(day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`rounded-2xl border p-3 flex flex-col gap-1.5 ${colors.bg} ${colors.border} ${isToday ? "ring-2 ring-forest-500 ring-offset-1" : ""}`}
            >
              {/* Nap fejléc */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${weekend ? "text-red-500" : "text-stone-500"}`}>
                  {format(day, "EEE", { locale: hu }).toUpperCase()}
                </span>
                <span className={`text-sm font-bold ${colors.text}`}>
                  {format(day, "d")}
                </span>
              </div>

              {rule ? (
                <>
                  {/* Szabály neve */}
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit ${colors.badge}`}>
                    {rule.name}
                  </span>

                  {/* Szállás ár */}
                  <div className="mt-0.5">
                    <p className="text-[10px] text-stone-400 leading-none">Szállás/éj</p>
                    <p className={`text-xs font-bold ${colors.text}`}>{formatCurrency(price!)}</p>
                    {rule.weekendPrice > 0 && !weekend && (
                      <p className="text-[10px] text-stone-400">hétvégén: {formatCurrency(rule.weekendPrice)}</p>
                    )}
                  </div>

                  {/* Gyerek árak */}
                  {(rule.childPrice2to6 > 0 || rule.childPrice6to12 > 0) && (
                    <div className="border-t border-current border-opacity-10 pt-1.5 space-y-0.5">
                      {rule.childPrice2to6 > 0 && (
                        <div>
                          <p className="text-[10px] text-stone-400 leading-none">Gyerek 2–6</p>
                          <p className={`text-xs font-semibold ${colors.text}`}>{formatCurrency(rule.childPrice2to6)}</p>
                        </div>
                      )}
                      {rule.childPrice6to12 > 0 && (
                        <div>
                          <p className="text-[10px] text-stone-400 leading-none">Gyerek 6–12</p>
                          <p className={`text-xs font-semibold ${colors.text}`}>{formatCurrency(rule.childPrice6to12)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Min. éjszaka + előfoglalás */}
                  {(rule.minNights > 1 || (rule as any).minAdvanceDays > 0) && (
                    <div className="border-t border-current border-opacity-10 pt-1.5 space-y-0.5">
                      {rule.minNights > 1 && (
                        <div>
                          <p className="text-[10px] text-stone-400 leading-none">Min. foglalás</p>
                          <p className={`text-xs font-semibold ${colors.text}`}>{rule.minNights} éj</p>
                        </div>
                      )}
                      {(rule as any).minAdvanceDays > 0 && (
                        <div>
                          <p className="text-[10px] text-stone-400 leading-none">Előfoglalás</p>
                          <p className={`text-xs font-semibold ${colors.text}`}>{(rule as any).minAdvanceDays} nap</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[11px] text-stone-400 mt-1">Nincs aktív szabály</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Jelmagyarázat */}
      {rules.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-stone-100">
          {rules.map((rule) => {
            const colors = ruleColorMap[rule.id] ?? BASE_COLOR;
            return (
              <div key={rule.id} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                {rule.name}
                {rule.dateFrom && rule.dateTo && (
                  <span className="opacity-60">
                    ({format(new Date(rule.dateFrom), "MM.dd.")}–{format(new Date(rule.dateTo), "MM.dd.")})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
