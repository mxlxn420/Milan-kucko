import { cookies }       from "next/headers";
import { redirect }      from "next/navigation";
import { prisma }        from "@/lib/prisma";
import AdminAmenities    from "@/components/admin/AdminAmenities";
import { AMENITIES_DEFAULTS as DEFAULTS } from "@/lib/contentDefaults";

export default async function AdminFelszereltsegPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.amenitiesContent.findUnique({ where: { id: "singleton" } });

  const data = {
    subtitle:    row?.subtitle    ?? DEFAULTS.subtitle,
    heading:     row?.heading     ?? DEFAULTS.heading,
    description: row?.description ?? DEFAULTS.description,
    items:       (row?.items      ?? DEFAULTS.items) as { icon: string; label: string; desc: string }[],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Felszereltség szekció</h1>
        <p className="text-stone-500 text-sm mt-1">
          A főoldal felszereltség részének szövegei és elemei
        </p>
      </div>
      <AdminAmenities initial={data} />
    </div>
  );
}
