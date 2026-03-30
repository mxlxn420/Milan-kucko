import { NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";

export async function GET() {
  try {
    const [bookings, blocked, policy] = await Promise.all([
      prisma.booking.findMany({
        where: {
          status:   { in: ["PENDING", "CONFIRMED", "PAID", "BLOCKED"] },
          checkOut: { gte: new Date() },
        },
        select: {
          checkIn:  true,
          checkOut: true,
          status:   true,
        },
      }),
      prisma.blockedPeriod.findMany({
        where: { dateTo: { gte: new Date() } },
        select: { dateFrom: true, dateTo: true },
      }),
      prisma.pricingRule.findFirst({
        where:   { isActive: true },
        orderBy: { priority: "desc" },
        select:  { minAdvanceDays: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        minAdvanceDays: policy?.minAdvanceDays ?? 2,
        bookings: bookings.map((b) => ({
          checkIn:  b.checkIn.toISOString(),
          checkOut: b.checkOut.toISOString(),
          status:   b.status,
        })),
        blocked: blocked.map((b) => ({
          checkIn:  b.dateFrom.toISOString(),
          checkOut: b.dateTo.toISOString(),
          status:   "BLOCKED",
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}
