// Statikus oldal – admin mentéskor revalidatePath frissíti
export const revalidate = 86400;

import { prisma }          from "@/lib/prisma";
import GaleriaPage, { DEFAULT_CATEGORIES } from "@/components/sections/GaleriaPage";
import type { GalleryCategory }            from "@/components/sections/GaleriaPage";
import { pageMetadata }                    from "@/lib/seo";

export const metadata = pageMetadata({
  title:       "Galéria",
  description: "Fotók a Milán Kuckóról: a ház, a privát jacuzzi, a belső terek, a hatalmas kert és terasz, a kilátás és Miskolctapolca környéke.",
  path:        "/galeria",
});

export default async function Galeria() {
  const row = await prisma.galleryContent.findUnique({ where: { id: "singleton" } });
  const categories = (row?.categories ?? DEFAULT_CATEGORIES) as GalleryCategory[];
  return <GaleriaPage categories={categories} />;
}
