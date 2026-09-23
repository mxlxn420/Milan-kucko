import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ABOUT_DEFAULTS } from "@/lib/contentDefaults";

const DEFAULTS = { id: "singleton", ...ABOUT_DEFAULTS };

export async function GET() {
  try {
    const about = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({ success: true, data: about ?? DEFAULTS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { heading1, heading2, description1, description2, mainImage, floatImage, values, nearby } = body;

    if (!heading1 || !heading2 || !description1 || !description2 || !mainImage || !floatImage || !values || !nearby) {
      return NextResponse.json({ success: false, error: "Hiányzó kötelező mezők" }, { status: 400 });
    }

    const about = await prisma.aboutContent.upsert({
      where:  { id: "singleton" },
      update: { heading1, heading2, description1, description2, mainImage, floatImage, values, nearby },
      create: { id: "singleton", heading1, heading2, description1, description2, mainImage, floatImage, values, nearby },
    });

    return NextResponse.json({ success: true, data: about });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
