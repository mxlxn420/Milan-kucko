import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { dateFrom, dateTo, reason } = await req.json();

    const blocked = await prisma.blockedPeriod.create({
      data: {
        dateFrom: new Date(dateFrom),
        dateTo:   new Date(dateTo),
        reason:   reason || null,
      },
    });

    return NextResponse.json({ success: true, data: {
      ...blocked,
      dateFrom: blocked.dateFrom.toISOString(),
      dateTo:   blocked.dateTo.toISOString(),
    }});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}