import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.pricingRule.update({
      where: { id: params.id },
      data: {
        pricePerNight:  Number(body.pricePerNight),
        minNights:      Number(body.minNights),
        extraGuestFee:  Number(body.extraGuestFee),
        extraGuestFrom: Number(body.extraGuestFrom),
        isActive:       Boolean(body.isActive),
      },
    });

    return NextResponse.json({ success: true, data: {
      ...updated,
      dateFrom: updated.dateFrom?.toISOString() ?? null,
      dateTo:   updated.dateTo?.toISOString()   ?? null,
    }});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}