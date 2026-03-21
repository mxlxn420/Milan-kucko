import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rules = await prisma.pricingRule.findMany({
      where:   { isActive: true },
      orderBy: { priority: "desc" },
    });

    const data = rules.map((r) => ({
      id:              r.id,
      name:            r.name,
      pricePerNight:   r.pricePerNight,
      weekendPrice:    (r as any).weekendPrice    ?? 0,
      childPrice2to6:  (r as any).childPrice2to6  ?? 0,
      childPrice6to12: (r as any).childPrice6to12 ?? 0,
      dateFrom:        r.dateFrom?.toISOString()  ?? null,
      dateTo:          r.dateTo?.toISOString()    ?? null,
      minNights:       r.minNights,
      isActive:        r.isActive,
      priority:        r.priority,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Pricing API hiba:", error);
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}