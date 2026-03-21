import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    console.log("PATCH pricing body:", body); // DEBUG

    const updated = await prisma.pricingRule.update({
      where: { id: params.id },
      data: {
        name:            body.name,
        pricePerNight:   Number(body.pricePerNight),
        weekendPrice:    Number(body.weekendPrice)    || 0,
        childPrice2to6:  Number(body.childPrice2to6)  || 0,
        childPrice6to12: Number(body.childPrice6to12) || 0,
        dateFrom:        body.dateFrom ? new Date(body.dateFrom) : null,
        dateTo:          body.dateTo   ? new Date(body.dateTo)   : null,
        minNights:       Number(body.minNights)       || 2,
        isActive:        Boolean(body.isActive),
        priority:        Number(body.priority)        || 0,
      },
    });

    console.log("PATCH pricing result:", updated); // DEBUG

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        weekendPrice:    (updated as any).weekendPrice    ?? 0,
        childPrice2to6:  (updated as any).childPrice2to6  ?? 0,
        childPrice6to12: (updated as any).childPrice6to12 ?? 0,
        dateFrom: updated.dateFrom?.toISOString() ?? null,
        dateTo:   updated.dateTo?.toISOString()   ?? null,
      },
    });
  } catch (error: any) {
    console.error("PATCH pricing error:", error);
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pricingRule.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}