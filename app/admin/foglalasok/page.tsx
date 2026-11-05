import { cookies }       from "next/headers";
import { redirect }      from "next/navigation";
import Link              from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Prisma }   from "@prisma/client";
import { prisma }        from "@/lib/prisma";
import AdminBookingsList from "@/components/admin/AdminBookingsList";
import AdminBookingFilters from "@/components/admin/AdminBookingFilters";
import {
  BOOKINGS_PAGE_SIZE,
  bookingListHref,
  countActiveFilters,
  hasDateFilter,
  parseBookingListParams,
  todayInBudapest,
  utcMidnight,
  type BookingListParams,
} from "@/lib/bookingListParams";

function buildWhere(p: BookingListParams): Prisma.BookingWhereInput {
  const and: Prisma.BookingWhereInput[] = [];

  if (p.status) and.push({ status: p.status });
  // Az "-ig" dátum befoglaló: < másnap 00:00 (UTC, ahogy a foglalások tárolva vannak)
  if (p.inFrom)  and.push({ checkIn:  { gte: utcMidnight(p.inFrom) } });
  if (p.inTo)    and.push({ checkIn:  { lt:  utcMidnight(p.inTo, 1) } });
  if (p.outFrom) and.push({ checkOut: { gte: utcMidnight(p.outFrom) } });
  if (p.outTo)   and.push({ checkOut: { lt:  utcMidnight(p.outTo, 1) } });

  // Alapból csak a közelgő és folyamatban lévő tételek (távozás ma vagy később).
  // Dátumszűrő vagy a "Korábbi tételek is" kapcsoló esetén nem rejtünk el semmit.
  if (!p.past && !hasDateFilter(p)) {
    and.push({ checkOut: { gte: utcMidnight(todayInBudapest()) } });
  }

  return and.length ? { AND: and } : {};
}

export default async function AdminFoglalasok({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const params = parseBookingListParams(await searchParams);
  const where  = buildWhere(params);

  // A számláló ugyanazzal a feltétellel számol, mint a lista
  const total      = await prisma.booking.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / BOOKINGS_PAGE_SIZE));
  const page       = Math.min(params.page, totalPages);
  const current    = { ...params, page };

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: [{ [params.sort]: params.dir }, { createdAt: "asc" }, { id: "asc" }],
    skip: (page - 1) * BOOKINGS_PAGE_SIZE,
    take: BOOKINGS_PAGE_SIZE,
  });

  const filtered = countActiveFilters(params) > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-stone-800">Foglalások</h1>
        <p className="text-stone-500 text-sm mt-1">
          {filtered ? `${total} találat` : `${total} közelgő tétel`}
        </p>
      </div>

      <AdminBookingFilters params={current} />

      <AdminBookingsList
        bookings={bookings}
        sortParams={current}
        emptyMessage={filtered ? "Nincs a szűrőknek megfelelő tétel." : "Nincs közelgő foglalás."}
      />

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Lapozás">
          {page > 1 ? (
            <Link
              href={bookingListHref({ ...current, page: page - 1 })}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white shadow-card text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft size={16} /> Előző
            </Link>
          ) : <span />}
          <span className="text-sm text-stone-500">{page} / {totalPages}. oldal</span>
          {page < totalPages ? (
            <Link
              href={bookingListHref({ ...current, page: page + 1 })}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white shadow-card text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Következő <ChevronRight size={16} />
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
