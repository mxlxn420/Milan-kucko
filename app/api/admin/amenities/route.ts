import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AMENITIES_DEFAULTS } from "@/lib/contentDefaults";

const DEFAULTS = { id: "singleton", ...AMENITIES_DEFAULTS };

export async function GET() {
  try {
    const amenities = await prisma.amenitiesContent.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({ success: true, data: amenities ?? DEFAULTS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { subtitle, heading, description, items } = body;

    if (!subtitle || !heading || !description || !items) {
      return NextResponse.json({ success: false, error: "Hi\u00E1nyz\u00F3 k\u00F6telez\u0151 mez\u0151k" }, { status: 400 });
    }

    const amenities = await prisma.amenitiesContent.upsert({
      where:  { id: "singleton" },
      update: { subtitle, heading, description, items },
      create: { id: "singleton", subtitle, heading, description, items },
    });

    return NextResponse.json({ success: true, data: amenities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
