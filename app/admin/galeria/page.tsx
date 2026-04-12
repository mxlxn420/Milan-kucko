import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import { prisma }    from "@/lib/prisma";
import AdminGallery  from "@/components/admin/AdminGallery";
import { DEFAULT_CATEGORIES } from "@/components/sections/GaleriaPage";

const DEFAULT_FEATURED = [
  { src: "/images/haz/IMG_8537 kicsi.jpg",   alt: "Kuck\u00F3 k\u00FCls\u0151" },
  { src: "/images/jacuzzi/jacuzzi.jpg",       alt: "Jacuzzi"                    },
  { src: "/images/belso/nappali.jpg",         alt: "Nappali"                    },
  { src: "/images/belso/haloszoba.jpg",        alt: "H\u00E1l\u00F3szoba"       },
  { src: "/images/belso/konyha.jpg",           alt: "Konyha"                    },
  { src: "/images/belso/f\u00FCrd\u0151.jpg", alt: "F\u00FCrd\u0151"            },
];

export default async function AdminGaleriaPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.galleryContent.findUnique({ where: { id: "singleton" } });

  const data = {
    featured:   (row?.featured   ?? DEFAULT_FEATURED)   as { src: string; alt: string }[],
    categories: (row?.categories ?? DEFAULT_CATEGORIES) as typeof DEFAULT_CATEGORIES,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Galéria</h1>
        <p className="text-stone-500 text-sm mt-1">
          Főoldali kiemelt képek és a teljes galéria kategóriái
        </p>
      </div>
      <AdminGallery initial={data} />
    </div>
  );
}
