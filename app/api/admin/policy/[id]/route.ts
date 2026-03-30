import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, depositPercent, freeCancelDays, minAdvanceDays } = await req.json();
    const policy = await prisma.bookingPolicy.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined            ? { name }                                : {}),
        ...(depositPercent !== undefined  ? { depositPercent: Number(depositPercent) } : {}),
        ...(freeCancelDays !== undefined  ? { freeCancelDays: Number(freeCancelDays) } : {}),
        ...(minAdvanceDays !== undefined  ? { minAdvanceDays: Number(minAdvanceDays) } : {}),
      },
    });
    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Policy törlése előtt megszüntetjük a hivatkozásokat
    await prisma.pricingRule.updateMany({
      where:  { policyId: params.id },
      data:   { policyId: null },
    });
    await prisma.bookingPolicy.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
