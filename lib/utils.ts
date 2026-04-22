import { differenceInCalendarDays, format, isWithinInterval } from "date-fns";
import { hu } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PriceBreakdown, PricingRule, BookedDateRange } from "@/types";

export const CLEANING_FEE      = 0;   // jelenleg nem számítjuk fel
export const TOURIST_TAX       = 500;   // per fő / éj
export const MIN_NIGHTS        = 2;
export const MAX_GUESTS        = 6;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

  for (const rule of period) {
    const from = new Date(rule.dateFrom!);
    const to   = new Date(rule.dateTo!);
    if (
      isWithinInterval(checkIn,  { start: from, end: to }) ||
      isWithinInterval(checkOut, { start: from, end: to })
    ) return rule;
  }
  return active.find((r) => !r.dateFrom && !r.dateTo) ?? null;
}

export function getRuleForNight(date: Date, rules: PricingRule[]): PricingRule | null {
  const active = rules.filter((r) => r.isActive).sort((a, b) => b.priority - a.priority);
  return (
    active.find((r) => {
      if (!r.dateFrom || !r.dateTo) return false;
      return date >= new Date(r.dateFrom) && date <= new Date(r.dateTo);
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

export function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  guests: number,
  rules: PricingRule[]
): PriceBreakdown {
  const nights = differenceInCalendarDays(checkOut, checkIn);

  if (nights <= 0) return {
    nights: 0, pricePerNight: 0, baseTotal: 0, childTotal2to6: 0, childTotal6to12: 0,
    guestSurcharge: 0, cleaningFee: CLEANING_FEE, touristTax: 0, total: 0,
    minNights: MIN_NIGHTS, isValid: false,
    validationError: "A távozás napjának az érkezés utánra kell esnie.",
  };

  const rule = getApplicablePricingRule(checkIn, checkOut, rules);
  if (!rule) return {
    nights, pricePerNight: 0, baseTotal: 0, childTotal2to6: 0, childTotal6to12: 0,
    guestSurcharge: 0, cleaningFee: CLEANING_FEE, touristTax: 0, total: 0,
    minNights: MIN_NIGHTS, isValid: false,
    validationError: "Nem található áradat. Kérjük, vegye fel velünk a kapcsolatot.",
  };

  if (nights < rule.minNights) return {
    nights, pricePerNight: rule.pricePerNight, baseTotal: 0, childTotal2to6: 0, childTotal6to12: 0,
    guestSurcharge: 0, cleaningFee: CLEANING_FEE, touristTax: 0, total: 0,
    minNights: rule.minNights, isValid: false,
    validationError: `Ebben az időszakban minimum ${rule.minNights} éjszakára foglalhat.`,
  };

  const baseTotal      = rule.pricePerNight * nights;
  const extraGuests    = Math.max(0, guests - (rule.extraGuestFrom - 1));
  const guestSurcharge = extraGuests * rule.extraGuestFee * nights;
  const touristTax     = guests * TOURIST_TAX * nights;
  const total          = baseTotal + guestSurcharge + CLEANING_FEE + touristTax;

  return {
    nights, pricePerNight: rule.pricePerNight, baseTotal, childTotal2to6: 0, childTotal6to12: 0,
    guestSurcharge, cleaningFee: CLEANING_FEE, touristTax, total, minNights: rule.minNights, isValid: true,
  };
}

export function isDateBooked(date: Date, ranges: BookedDateRange[]): boolean {
  return ranges.some(({ checkIn, checkOut }) =>
    isWithinInterval(date, { start: new Date(checkIn), end: new Date(checkOut) })
  );
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