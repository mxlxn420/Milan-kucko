import { format } from "date-fns";
import { hu } from "date-fns/locale";
import type { PricingRule } from "@/types";

export const CLEANING_FEE      = 0;   // jelenleg nem számítjuk fel
export const TOURIST_TAX       = 450;   // per fő / éj
export const MAX_GUESTS        = 4;

// Robustus dátum összehasonlítás: a tárolt dateFrom/dateTo lehet 22:00 UTC
// (ha DayPicker toISOString()-gel lett mentve Magyarországról), ezért
// helyi dátumstringet hasonlítunk, nem UTC timestampet.
function toDateStr(d: Date | string): string {
  return format(typeof d === "string" ? new Date(d) : d, "yyyy-MM-dd");
}

export function getApplicablePricingRule(
  checkIn: Date,
  checkOut: Date,
  rules: PricingRule[]
): PricingRule | null {
  const active = rules.filter((r) => r.isActive);
  const period = active
    .filter((r) => r.dateFrom && r.dateTo)
    .sort((a, b) => b.priority - a.priority);

  const ciStr = toDateStr(checkIn);
  const coStr = toDateStr(checkOut);

  for (const rule of period) {
    const fromStr = toDateStr(rule.dateFrom!);
    const toStr   = toDateStr(rule.dateTo!);
    if (
      (ciStr >= fromStr && ciStr <= toStr) ||
      (coStr >= fromStr && coStr <= toStr)
    ) return rule;
  }
  return active.find((r) => !r.dateFrom && !r.dateTo) ?? null;
}

export function getRuleForNight(date: Date, rules: PricingRule[]): PricingRule | null {
  const active  = rules.filter((r) => r.isActive).sort((a, b) => b.priority - a.priority);
  const dateStr = toDateStr(date);
  return (
    active.find((r) => {
      if (!r.dateFrom || !r.dateTo) return false;
      return dateStr >= toDateStr(r.dateFrom) && dateStr <= toDateStr(r.dateTo);
    }) ?? active.find((r) => !r.dateFrom && !r.dateTo) ?? null
  );
}

export function getNightRateFromRule(rule: PricingRule, date: Date, personCount: number): number {
  const isWeekend = [5, 6].includes(date.getDay());
  let tier1to2: number, tier3: number, tier4: number;
  if (isWeekend) {
    const wkday3 = (rule as any).price3 > 0 ? (rule as any).price3 : rule.pricePerNight;
    const wkday4 = (rule as any).price4 > 0 ? (rule as any).price4 : wkday3;
    tier1to2 = rule.weekendPrice > 0 ? rule.weekendPrice : rule.pricePerNight;
    tier3 = (rule as any).weekendPrice3 > 0 ? (rule as any).weekendPrice3 : wkday3;
    tier4 = (rule as any).weekendPrice4 > 0 ? (rule as any).weekendPrice4 : wkday4;
  } else {
    tier1to2 = rule.pricePerNight;
    tier3 = (rule as any).price3 > 0 ? (rule as any).price3 : tier1to2;
    tier4 = (rule as any).price4 > 0 ? (rule as any).price4 : tier3;
  }
  return personCount >= 4 ? tier4 : personCount >= 3 ? tier3 : tier1to2;
}

export function getAdminNightBreakdown(
  checkIn: Date,
  checkOut: Date,
  rules: PricingRule[],
  personCount: number
): { count: number; rate: number }[] {
  const groups: { count: number; rate: number }[] = [];
  const cur = new Date(checkIn);
  while (cur < checkOut) {
    const rule = getRuleForNight(cur, rules);
    const rate = rule ? getNightRateFromRule(rule, cur, personCount) : 0;
    if (groups.length > 0 && groups[groups.length - 1].rate === rate) {
      groups[groups.length - 1].count++;
    } else {
      groups.push({ count: 1, rate });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return groups;
}

export function formatDateHu(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy. MMMM d.", { locale: hu });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency", currency: "HUF",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}