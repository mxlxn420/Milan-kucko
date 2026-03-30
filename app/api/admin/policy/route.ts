import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const policies = await prisma.bookingPolicy.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: policies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, depositPercent, freeCancelDays, minAdvanceDays } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: "Név megadása kötelező" }, { status: 400 });

    const policy = await prisma.bookingPolicy.create({
      data: {
        name,
        depositPercent: Number(depositPercent) || 30,
        freeCancelDays: Number(freeCancelDays) || 7,
        minAdvanceDays: Number(minAdvanceDays) ?? 2,
      },
    });
    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
