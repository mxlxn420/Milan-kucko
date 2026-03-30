import { cookies }    from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminPolicy    from "@/components/admin/AdminPolicy";

export default async function AdminSzabalyok() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const policies = await prisma.bookingPolicy.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Szabályok</h1>
        <p className="text-stone-500 text-sm mt-1">Előleg és lemondási feltételek kezelése</p>
      </div>
      <AdminPolicy policies={policies} />
    </div>
  );
}
