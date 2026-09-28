import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_FEATURED = [
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/84109780a14e15320d471707.jpg",   alt: "Kuck\u00F3 k\u00FCls\u0151"    },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/1d8393e59f7cf1e1360a0b52.jpg",       alt: "Jacuzzi"                        },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/b34a71d4f4629640ac9f3f64.jpg",         alt: "Nappali"                        },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/fbc5be93c7acfd4a253099bd.jpg",        alt: "H\u00E1l\u00F3szoba"           },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/396b5f78cffb11612963a3a3.jpg",           alt: "Konyha"                        },
  { src: "https://vofoqouomsbcnmqcecpp.supabase.co/storage/v1/object/public/gallery/6af320e1373873e865bc6a13.jpg", alt: "F\u00FCrd\u0151"               },
];

export async function GET() {
  try {
    const row = await prisma.galleryContent.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({
      success: true,
      data: {
        featured:   (row?.featured   ?? DEFAULT_FEATURED),
        categories: (row?.categories ?? null),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { featured, categories } = body;

    if (!featured || !categories) {
      return NextResponse.json({ success: false, error: "Hi\u00E1nyz\u00F3 k\u00F6telez\u0151 mez\u0151k" }, { status: 400 });
    }

    if (!Array.isArray(featured)) {
      return NextResponse.json({ success: false, error: "A featured mező tömb kell legyen" }, { status: 400 });
    }
    for (const item of featured) {
      if (typeof item?.src !== "string" || typeof item?.alt !== "string") {
        return NextResponse.json({ success: false, error: "Minden featured elemnek van src és alt mezője (string)" }, { status: 400 });
      }
    }

    if (!Array.isArray(categories)) {
      return NextResponse.json({ success: false, error: "A categories mező tömb kell legyen" }, { status: 400 });
    }
    for (const cat of categories) {
      if (typeof cat?.label !== "string") {
        return NextResponse.json({ success: false, error: "Minden kategóriának van label mezője (string)" }, { status: 400 });
      }
      if (cat.images !== undefined && !Array.isArray(cat.images)) {
        return NextResponse.json({ success: false, error: "A kategória images mezője tömb kell legyen" }, { status: 400 });
      }
    }

    const row = await prisma.galleryContent.upsert({
      where:  { id: "singleton" },
      update: { featured, categories },
      create: { id: "singleton", featured, categories },
    });

    return NextResponse.json({ success: true, data: row });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
