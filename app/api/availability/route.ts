import { NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";

// GET – foglalt dátumok lekérdezése a naptárhoz
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "PAID", "BLOCKED"] },
        checkOut: { gte: new Date() }, // Csak jövőbeli
      },
      select: {
        checkIn:  true,
        checkOut: true,
        status:   true,
      },
    });

    const blocked = await prisma.blockedPeriod.findMany({
      where: {
        dateTo: { gte: new Date() },
      },
      select: {
        dateFrom: true,
        dateTo:   true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}