import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/discounts?checkIn=yyyy-MM-dd&checkOut=yyyy-MM-dd
// Returns the best applicable discount for the given stay period, checked at booking time (now)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn  = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "checkIn és checkOut kötelező" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn + "T00:00:00Z");
    const now         = new Date();

    // Discount is valid when:
    // 1. The stay (checkIn) falls within stayFrom–stayTo
    // 2. If bookingFrom/bookingTo are set, today must be within that window
    const discounts = await prisma.discount.findMany({
      where: {
        isActive: true,
        stayFrom: { lte: checkInDate },
        stayTo:   { gte: checkInDate },
        OR: [
          // No booking window restriction
          { bookingFrom: null, bookingTo: null },
          // Only bookingFrom set — "from this date onwards"
          { bookingFrom: { lte: now }, bookingTo: null },
          // Only bookingTo set — "until this date"
          { bookingFrom: null, bookingTo: { gte: now } },
          // Both set — must be within window
          { bookingFrom: { lte: now }, bookingTo: { gte: now } },
        ],
      },
      orderBy: { discountPercent: "desc" },
    });

    const best = discounts[0] ?? null;

    return NextResponse.json({
      success: true,
      data: best ? {
        id:              best.id,
        name:            best.name,
        discountPercent: best.discountPercent,
      } : null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
