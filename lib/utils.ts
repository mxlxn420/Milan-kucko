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