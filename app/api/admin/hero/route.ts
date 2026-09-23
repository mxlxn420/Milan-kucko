import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HERO_DEFAULTS } from "@/lib/contentDefaults";

const DEFAULTS = { id: "singleton", ...HERO_DEFAULTS };

export async function GET() {
  try {
    const hero = await prisma.heroContent.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({ success: true, data: hero ?? DEFAULTS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { subtitle, titleBefore, titleEmphasis, titleAfter, description, highlights, slides } = body;

    if (!subtitle || !titleBefore || !titleEmphasis || !titleAfter || !description || !highlights || !slides) {
      return NextResponse.json({ success: false, error: "Hiányzó kötelező mezők" }, { status: 400 });
    }

    const hero = await prisma.heroContent.upsert({
      where:  { id: "singleton" },
      update: { subtitle, titleBefore, titleEmphasis, titleAfter, description, highlights, slides },
      create: { id: "singleton", subtitle, titleBefore, titleEmphasis, titleAfter, description, highlights, slides },
    });

    return NextResponse.json({ success: true, data: hero });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
