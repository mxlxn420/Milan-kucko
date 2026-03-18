import { cookies }    from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminCalendar  from "@/components/admin/AdminCalendar";

export default async function AdminNaptar() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where:   { status: { in: ["PENDING", "CONFIRMED", "PAID"] } },
      select:  { checkIn: true, checkOut: true, status: true, guestName: true, id: true },
      orderBy: { checkIn: "asc" },
    }),
    prisma.blockedPeriod.findMany({
      orderBy: { dateFrom: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Naptár</h1>
        <p className="text-stone-500 text-sm mt-1">Foglalt és blokkolt napok</p>
      </div>
      <AdminCalendar
        bookings={bookings.map((b) => ({
          ...b,
          checkIn:  b.checkIn.toISOString(),
          checkOut: b.checkOut.toISOString(),
        }))}
        blocked={blocked.map((b) => ({
          ...b,
          dateFrom: b.dateFrom.toISOString(),
          dateTo:   b.dateTo.toISOString(),
        }))}
      />
    </div>
  );
}