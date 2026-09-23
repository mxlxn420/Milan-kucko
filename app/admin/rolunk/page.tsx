import { cookies }    from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminAbout     from "@/components/admin/AdminAbout";
import { ABOUT_DEFAULTS as DEFAULTS } from "@/lib/contentDefaults";

export default async function AdminRolunkPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });

  const data = {
    heading1:     row?.heading1     ?? DEFAULTS.heading1,
    heading2:     row?.heading2     ?? DEFAULTS.heading2,
    description1: row?.description1 ?? DEFAULTS.description1,
    description2: row?.description2 ?? DEFAULTS.description2,
    mainImage:    (row?.mainImage   ?? DEFAULTS.mainImage)  as { src: string; alt: string },
    floatImage:   (row?.floatImage  ?? DEFAULTS.floatImage) as { src: string; alt: string },
    values:       (row?.values      ?? DEFAULTS.values)     as { icon: string; title: string; text: string }[],
    nearby:       (row?.nearby      ?? DEFAULTS.nearby)     as string[],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Rólunk szekció</h1>
        <p className="text-stone-500 text-sm mt-1">
          A főoldal "Rólunk" részének képei, szövegei, jellemzői és közeli látnivalói
        </p>
      </div>
      <AdminAbout initial={data} />
    </div>
  );
}
