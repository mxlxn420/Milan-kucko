import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rule = await prisma.pricingRule.create({
      data: {
        name:           body.name,
        pricePerNight:  Number(body.pricePerNight),
        weekendPrice:   Number(body.weekendPrice)    || 0,
        childPrice2to6: Number(body.childPrice2to6)  || 0,
        childPrice6to12:Number(body.childPrice6to12) || 0,
        dateFrom:       body.dateFrom ? new Date(body.dateFrom) : null,
        dateTo:         body.dateTo   ? new Date(body.dateTo)   : null,
        minNights:      Number(body.minNights)       || 2,
        minAdvanceDays: Number(body.minAdvanceDays) ?? 2,
        extraGuestFee:  0,
        extraGuestFrom: 3,
        isActive:       body.isActive ?? true,
        priority:       Number(body.priority)        || 5,
        policyId:       body.policyId ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...rule,
        weekendPrice:    (rule as any).weekendPrice    ?? 0,
        childPrice2to6:  (rule as any).childPrice2to6  ?? 0,
        childPrice6to12: (rule as any).childPrice6to12 ?? 0,
        dateFrom: rule.dateFrom?.toISOString() ?? null,
        dateTo:   rule.dateTo?.toISOString()   ?? null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}