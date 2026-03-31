import { cookies }        from "next/headers";
import { redirect }        from "next/navigation";
import { prisma }          from "@/lib/prisma";
import AdminDiscounts      from "@/components/admin/AdminDiscounts";

export default async function AdminKedvezmenyek() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const discounts = await prisma.discount.findMany({
    orderBy: { stayFrom: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Kedvezmények</h1>
        <p className="text-stone-500 text-sm mt-1">
          Időszakos kedvezmények — a kedvezmény automatikusan levonódik a foglalás végösszegéből
        </p>
      </div>
      <AdminDiscounts
        discounts={discounts.map((d) => ({
          ...d,
          stayFrom:    d.stayFrom.toISOString(),
          stayTo:      d.stayTo.toISOString(),
          bookingFrom: d.bookingFrom?.toISOString() ?? null,
          bookingTo:   d.bookingTo?.toISOString()   ?? null,
        }))}
      />
    </div>
  );
}
