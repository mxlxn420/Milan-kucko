import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import { prisma }    from "@/lib/prisma";
import AdminGallery  from "@/components/admin/AdminGallery";
import { DEFAULT_CATEGORIES } from "@/components/sections/GaleriaPage";

const DEFAULT_FEATURED = [
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/84109780a14e15320d471707.jpg",   alt: "Kuck\u00F3 k\u00FCls\u0151" },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/1d8393e59f7cf1e1360a0b52.jpg",       alt: "Jacuzzi"                    },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/b34a71d4f4629640ac9f3f64.jpg",         alt: "Nappali"                    },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/fbc5be93c7acfd4a253099bd.jpg",        alt: "H\u00E1l\u00F3szoba"       },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/396b5f78cffb11612963a3a3.jpg",           alt: "Konyha"                    },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/6af320e1373873e865bc6a13.jpg", alt: "F\u00FCrd\u0151"            },
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
