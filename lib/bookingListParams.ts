// A Foglalások lista URL paraméterei: ellenőrzés, alapértékek és link-építés.
// Tiszta függvények (nincs Prisma import), így kliens komponensből is használható.

export const BOOKING_SORTS = ["checkIn", "checkOut"] as const;
export const SORT_DIRS = ["asc", "desc"] as const;
export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "PAID", "CANCELLED", "BLOCKED"] as const;

export type BookingSort = (typeof BOOKING_SORTS)[number];
export type SortDir = (typeof SORT_DIRS)[number];
export type BookingStatusParam = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatusParam, string> = {
  PENDING:   "Előlegre vár",
  CONFIRMED: "Jóváhagyva",
  PAID:      "Fizetve",
  CANCELLED: "Elutasítva",
  BLOCKED:   "Zárva",
};

export const BOOKINGS_PAGE_SIZE = 20;

export interface BookingListParams {
  sort: BookingSort;
  dir: SortDir;
  status: BookingStatusParam | null;
  inFrom: string | null;
  inTo: string | null;
  outFrom: string | null;
  outTo: string | null;
  past: boolean;
  page: number;
}

export const DEFAULT_BOOKING_LIST_PARAMS: BookingListParams = {
  sort: "checkIn",
  dir: "asc",
  status: null,
  inFrom: null,
  inTo: null,
  outFrom: null,
  outTo: null,
  past: false,
  page: 1,
};

type RawParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function oneOf<T extends string>(list: readonly T[], v: string | undefined): T | null {
  return v !== undefined && (list as readonly string[]).includes(v) ? (v as T) : null;
}

/** Csak valódi naptári dátumot fogad el yyyy-MM-dd formátumban. */
export function parseIsoDate(v: string | undefined): string | null {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return null;
  return v;
}

/** Az érvénytelen értékeket figyelmen kívül hagyja (alapértékre esik vissza). */
export function parseBookingListParams(raw: RawParams): BookingListParams {
  const pageNum = Number(first(raw.page));
  return {
    sort:    oneOf(BOOKING_SORTS, first(raw.sort)) ?? DEFAULT_BOOKING_LIST_PARAMS.sort,
    dir:     oneOf(SORT_DIRS, first(raw.dir)) ?? DEFAULT_BOOKING_LIST_PARAMS.dir,
    status:  oneOf(BOOKING_STATUSES, first(raw.status)),
    inFrom:  parseIsoDate(first(raw.inFrom)),
    inTo:    parseIsoDate(first(raw.inTo)),
    outFrom: parseIsoDate(first(raw.outFrom)),
    outTo:   parseIsoDate(first(raw.outTo)),
    past:    first(raw.past) === "1",
    page:    Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1,
  };
}

export function hasDateFilter(p: BookingListParams): boolean {
  return Boolean(p.inFrom || p.inTo || p.outFrom || p.outTo);
}

/** Aktív szűrők száma (a rendezés és a lapozás nem szűrő). */
export function countActiveFilters(p: BookingListParams): number {
  return [p.status, p.inFrom, p.inTo, p.outFrom, p.outTo, p.past || null].filter(Boolean).length;
}

/** Csak a nem alapértelmezett értékeket teszi az URL-be. */
export function bookingListHref(p: BookingListParams, basePath = "/admin/foglalasok"): string {
  const q = new URLSearchParams();
  if (p.sort !== DEFAULT_BOOKING_LIST_PARAMS.sort || p.dir !== DEFAULT_BOOKING_LIST_PARAMS.dir) {
    q.set("sort", p.sort);
    q.set("dir", p.dir);
  }
  if (p.status)  q.set("status", p.status);
  if (p.inFrom)  q.set("inFrom", p.inFrom);
  if (p.inTo)    q.set("inTo", p.inTo);
  if (p.outFrom) q.set("outFrom", p.outFrom);
  if (p.outTo)   q.set("outTo", p.outTo);
  if (p.past)    q.set("past", "1");
  if (p.page > 1) q.set("page", String(p.page));
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

/** Fejlécre kattintás: ugyanaz az oszlop → irányváltás, másik oszlop → növekvő. */
export function toggleSort(p: BookingListParams, col: BookingSort): BookingListParams {
  const dir: SortDir = p.sort === col ? (p.dir === "asc" ? "desc" : "asc") : "asc";
  return { ...p, sort: col, dir, page: 1 };
}

/** A mai nap Europe/Budapest szerint, yyyy-MM-dd formátumban. */
export function todayInBudapest(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * A foglalások dátumai UTC éjfélként vannak tárolva ("yyyy-MM-dd" + "T00:00:00Z"),
 * ezért a szűrőhatárokat is így számoljuk.
 */
export function utcMidnight(isoDate: string, addDays = 0): Date {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + addDays);
  return d;
}
