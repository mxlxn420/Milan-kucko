import { cookies }             from "next/headers";
import { redirect }            from "next/navigation";
import { prisma }              from "@/lib/prisma";
import AdminExtraServices      from "@/components/admin/AdminExtraServices";

export default async function AdminExtraSzolgaltatasok() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const services = await prisma.extraService.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Extra szolgáltatások</h1>
        <p className="text-stone-500 text-sm mt-1">Kérhető extra szolgáltatások kezelése</p>
      </div>
      <AdminExtraServices services={services} />
    </div>
  );
}
