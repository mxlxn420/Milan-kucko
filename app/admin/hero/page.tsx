import { cookies }   from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminHero      from "@/components/admin/AdminHero";
import { HERO_DEFAULTS as DEFAULTS } from "@/lib/contentDefaults";

export default async function AdminHeroPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.heroContent.findUnique({ where: { id: "singleton" } });

  const data = {
    subtitle:      row?.subtitle      ?? DEFAULTS.subtitle,
    titleBefore:   row?.titleBefore   ?? DEFAULTS.titleBefore,
    titleEmphasis: row?.titleEmphasis ?? DEFAULTS.titleEmphasis,
    titleAfter:    row?.titleAfter    ?? DEFAULTS.titleAfter,
    description:   row?.description   ?? DEFAULTS.description,
    highlights:    (row?.highlights   ?? DEFAULTS.highlights) as { icon: string; label: string }[],
    slides:        (row?.slides       ?? DEFAULTS.slides)     as { src: string; alt: string }[],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Kezdőlap</h1>
        <p className="text-stone-500 text-sm mt-1">
          A főoldal fejlécének képei, szövegei és kiemelt jellemzői
        </p>
      </div>
      <AdminHero initial={data} />
    </div>
  );
}
