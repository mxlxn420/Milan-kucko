import { cookies }    from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminPricing   from "@/components/admin/AdminPricing";

export default async function AdminArak() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const [rules, policies] = await Promise.all([
    prisma.pricingRule.findMany({ orderBy: { priority: "desc" } }),
    prisma.bookingPolicy.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Árak</h1>
        <p className="text-stone-500 text-sm mt-1">Szezonális árak szerkesztése</p>
      </div>
      <AdminPricing
        rules={rules.map((r) => ({
          ...r,
          dateFrom: r.dateFrom?.toISOString() ?? null,
          dateTo:   r.dateTo?.toISOString()   ?? null,
        }))}
        policies={policies.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
