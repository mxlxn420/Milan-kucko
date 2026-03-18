import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";

// Prisma-t try-catch-ben importálunk
async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

// ─── GET ────────────────────────────────────────────────────
export async function GET() {
  try {
    const prisma   = await getPrisma();
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error("GET /api/bookings hiba:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Szerver hiba" },
      { status: 500 }
    );
  }
}

// ─── POST ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      guestName,
      guestEmail,
      guestPhone,
      numberOfGuests,
      notes,
      checkIn,
      checkOut,
      basePrice,
      guestSurcharge,
      touristTax,
      totalPrice,
    } = body;

    // Validáció
    if (!guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights       = differenceInCalendarDays(checkOutDate, checkInDate);

    if (nights <= 0) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen dátumok" },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    // Ütközés ellenőrzés
    const conflict = await prisma.booking.findFirst({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "PAID"] },
        AND: [
          { checkIn:  { lt: checkOutDate } },
          { checkOut: { gt: checkInDate  } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: "Ez az időszak már foglalt!" },
        { status: 409 }
      );
    }

    // Foglalás ID
    const bookingRef = "MK-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Mentés
    const booking = await prisma.booking.create({
      data: {
        id:             bookingRef,
        guestName,
        guestEmail,
        guestPhone,
        numberOfGuests: Number(numberOfGuests) || 2,
        notes:          notes || null,
        checkIn:        checkInDate,
        checkOut:       checkOutDate,
        nights,
        basePrice:      Number(basePrice),
        guestSurcharge: Number(guestSurcharge) || 0,
        cleaningFee:    Number(cleaningFee)    || 8000,
        touristTax:     Number(touristTax)     || 0,
        totalPrice:     Number(totalPrice),
        status:         "PENDING",
      },
    });

    // Email (opcionális, nem töri el a foglalást)
    try {
      const { sendBookingEmails } = await import("@/lib/email");
      await sendBookingEmails({
        guestName,
        guestEmail,
        checkIn,
        checkOut,
        nights,
        guests:     Number(numberOfGuests),
        totalPrice: Number(totalPrice),
        bookingId:  bookingRef,
        notes,
      });
    } catch (emailErr) {
      console.error("Email hiba (foglalás mentve):", emailErr);
    }

    return NextResponse.json(
      { success: true, data: { id: booking.id } },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("POST /api/bookings hiba:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Szerver hiba" },
      { status: 500 }
    );
  }
}