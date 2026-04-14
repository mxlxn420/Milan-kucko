import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";
import { cookies } from "next/headers";

// Prisma-t try-catch-ben importálunk
async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

async function isAuthed(): Promise<boolean> {
  const store         = await cookies();
  const token         = store.get("admin_token")?.value;
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  return !!token && !!expectedToken && token === expectedToken;
}

// ─── GET ────────────────────────────────────────────────────
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ success: false, error: "Nincs jogosultság" }, { status: 401 });
  }
  try {
    const prisma = await getPrisma();
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
      guestAddress,
      numberOfGuests,
      notes,
      checkIn,
      checkOut,
      basePrice,
      guestSurcharge,
      cleaningFee,
      touristTax,
      totalPrice,
      extraServices,
      extraServicesTotal,
    } = body;

    // Validáció
    if (!guestName || !guestEmail || !guestPhone || !guestAddress || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    if (!body.numberOfAdults || Number(body.numberOfAdults) < 1) {
      return NextResponse.json(
        { success: false, error: "Legalább 1 felnőtt szükséges!" },
        { status: 400 }
      );
    }

    // Max. kapacitás ellenőrzés (babák nem számítanak)
    const adults        = Number(body.numberOfAdults        ?? 0);
    const teens         = Number(body.numberOfTeens         ?? 0);
    const babies        = Number(body.numberOfBabies        ?? 0);
    const children2to6  = Number(body.numberOfChildren2to6  ?? 0);
    const children6to12 = Number(body.numberOfChildren6to12 ?? 0);
    const paidGuests    = adults + teens + babies + children2to6 + children6to12;
    if (paidGuests > 4) {
      return NextResponse.json(
        { success: false, error: "Maximum 4 fő foglalható!" },
        { status: 400 }
      );
    }

    // Dátum-only string (yyyy-MM-dd) → UTC éjfél, timezone-mentes összehasonlításhoz
    const checkInDate  = new Date(checkIn  + "T00:00:00Z");
    const checkOutDate = new Date(checkOut + "T00:00:00Z");
    const nights = differenceInCalendarDays(checkOutDate, checkInDate);

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
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: "Ez az időszak már foglalt!" },
        { status: 409 }
      );
    }

    // Előleg kiszámítása az érvényes árrule policy-ja alapján
    const applicableRule = await prisma.pricingRule.findFirst({
      where: {
        isActive: true,
        OR: [
          { dateFrom: null, dateTo: null },
          { dateFrom: { lte: checkInDate }, dateTo: { gte: checkInDate } },
        ],
      },
      orderBy: { priority: "desc" },
      include: { policy: true },
    });
    // Kedvezmény keresés — szállás időszak + opcionális foglalási ablak
    const now = new Date();
    const applicableDiscount = await prisma.discount.findFirst({
      where: {
        isActive: true,
        stayFrom: { lte: checkInDate },
        stayTo:   { gte: checkInDate },
        OR: [
          { bookingFrom: null, bookingTo: null },
          { bookingFrom: { lte: now }, bookingTo: null },
          { bookingFrom: null, bookingTo: { gte: now } },
          { bookingFrom: { lte: now }, bookingTo: { gte: now } },
        ],
      },
      orderBy: { discountPercent: "desc" },
    });

    const discountPercent = applicableDiscount?.discountPercent ?? 0;
    const rawTotal        = Number(totalPrice);
    // Kedvezmény csak a szállásdíjra vonatkozik (IFA és extra szolgáltatások nélkül)
    const discountBase    = rawTotal - Number(touristTax) - Number(extraServicesTotal);
    const discountAmount  = discountPercent > 0
      ? Math.round(discountBase * discountPercent / 100)
      : 0;
    const finalTotal = rawTotal - discountAmount;

    const depositPercent = (applicableRule as any)?.policy?.depositPercent ?? 30;
    const depositAmount  = Math.round(finalTotal * depositPercent / 100);

    // Foglalás ID
    const bookingRef = "MK-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Mentés
    const booking = await prisma.booking.create({
      data: {
        id: bookingRef,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress: guestAddress || null,
        numberOfGuests:        Number(numberOfGuests)              || 2,
        numberOfAdults:        Number(body.numberOfAdults)        || 2,
        numberOfTeens:         Number(body.numberOfTeens)         || 0,
        numberOfBabies:        Number(body.numberOfBabies)        || 0,
        numberOfChildren2to6:  Number(body.numberOfChildren2to6)  || 0,
        numberOfChildren6to12: Number(body.numberOfChildren6to12) || 0,
        notes: notes || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        basePrice: Number(basePrice),
        childPrice2to6: Number(body.childPrice2to6) || 0,
        childPrice6to12: Number(body.childPrice6to12) || 0,
        guestSurcharge: Number(guestSurcharge) || 0,
        cleaningFee:    Number(cleaningFee)    || 0,
        touristTax:     Number(touristTax)     || 0,
        totalPrice: finalTotal,
        discountPercent,
        discountAmount,
        depositAmount,
        extraServices:     extraServices     ?? null,
        extraServicesTotal: Number(extraServicesTotal) || 0,
        paymentMethod:     body.paymentMethod ?? null,
        status: "PENDING",
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
        guests: Number(numberOfGuests),
        totalPrice: Number(totalPrice),
        bookingId: bookingRef,
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