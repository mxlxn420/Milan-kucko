import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";
import { cookies } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRuleForNight, getNightRateFromRule, TOURIST_TAX, CLEANING_FEE } from "@/lib/utils";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, "60 m"),
  prefix: "bookings",
});

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { success: false, error: "Túl sok foglalási kísérlet. Próbáld újra 1 óra múlva." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const {
      guestName,
      guestEmail,
      guestPhone,
      guestAddress,
      notes,
      checkIn,
      checkOut,
      extraServices,
    } = body;

    // Hossz- és típus-validáció
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof guestName    === "string" && guestName.length    > 100) return NextResponse.json({ success: false, error: "A név maximum 100 karakter lehet" },     { status: 400 });
    if (typeof guestEmail   === "string" && guestEmail.length   > 200) return NextResponse.json({ success: false, error: "Az e-mail maximum 200 karakter lehet" }, { status: 400 });
    if (typeof guestPhone   === "string" && guestPhone.length   > 30)  return NextResponse.json({ success: false, error: "A telefon maximum 30 karakter lehet" },  { status: 400 });
    if (typeof guestAddress === "string" && guestAddress.length > 200) return NextResponse.json({ success: false, error: "A lakcím maximum 200 karakter lehet" },  { status: 400 });
    if (typeof notes        === "string" && notes.length        > 1000) return NextResponse.json({ success: false, error: "A megjegyzés maximum 1000 karakter lehet" }, { status: 400 });

    // Validáció
    if (!guestName || !guestEmail || !guestPhone || !guestAddress || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(guestEmail)) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen e-mail cím" },
        { status: 400 }
      );
    }

    // Létszámok nem negatív egészre szorítva — negatív/tört szám nem csökkentheti az árat
    const toCount = (v: unknown) => Math.max(0, Math.min(20, Math.floor(Number(v) || 0)));
    const adults        = toCount(body.numberOfAdults);
    const teens         = toCount(body.numberOfTeens);
    const babies        = toCount(body.numberOfBabies);
    const children2to6  = toCount(body.numberOfChildren2to6);
    const children6to12 = toCount(body.numberOfChildren6to12);

    if (adults < 1) {
      return NextResponse.json(
        { success: false, error: "Legalább 1 felnőtt szükséges!" },
        { status: 400 }
      );
    }

    // Max. kapacitás ellenőrzés
    const paidGuests    = adults + teens + babies + children2to6 + children6to12;
    const numberOfGuests = paidGuests;
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

    // MinNights ellenőrzés: minden éjszakára megnézzük a szezon szabályát
    const allRules = await prisma.pricingRule.findMany({
      where: { isActive: true },
      orderBy: { priority: "desc" },
    });
    let effectiveMinNights = 1;
    const cur = new Date(checkInDate);
    while (cur < checkOutDate) {
      const rule =
        allRules.find((r) => r.dateFrom && r.dateTo && cur >= r.dateFrom && cur <= r.dateTo) ??
        allRules.find((r) => !r.dateFrom && !r.dateTo);
      if (rule && rule.minNights > effectiveMinNights) effectiveMinNights = rule.minNights;
      cur.setDate(cur.getDate() + 1);
    }
    if (nights < effectiveMinNights) {
      return NextResponse.json(
        { success: false, error: `Ebben az időszakban minimum ${effectiveMinNights} éjszakára lehet foglalni!` },
        { status: 400 }
      );
    }

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

    // Admin által lezárt (vagy iCal-ból importált) időszakok
    const blockedConflict = await prisma.blockedPeriod.findFirst({
      where: {
        dateFrom: { lt: checkOutDate },
        dateTo:   { gt: checkInDate  },
      },
    });

    if (conflict || blockedConflict) {
      return NextResponse.json(
        { success: false, error: "Ez az időszak már foglalt!" },
        { status: 409 }
      );
    }

    // Előleg kiszámítása az érvényes árrule policy-ja alapján
    // Először szezon-specifikus szabályt keresünk, ha nincs, akkor az alapértelmezettet
    const periodRule = await prisma.pricingRule.findFirst({
      where: {
        isActive: true,
        dateFrom: { not: null, lte: checkInDate },
        dateTo:   { not: null, gte: checkInDate },
      },
      orderBy: { priority: "desc" },
      include: { policy: true },
    });
    const applicableRule = periodRule ?? await prisma.pricingRule.findFirst({
      where:   { isActive: true, dateFrom: null, dateTo: null },
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

    // ─── Szerver oldali árszámítás (a kliens által küldött árak nem megbízhatók) ───
    // personCount: felnőtt + 12 év feletti (a kisebb gyerekek külön gyerekárral)
    const personCount = adults + teens;
    let basePrice = 0;
    const cur2 = new Date(checkInDate);
    while (cur2 < checkOutDate) {
      const rule = getRuleForNight(cur2, allRules);
      if (rule) basePrice += getNightRateFromRule(rule, cur2, personCount);
      cur2.setDate(cur2.getDate() + 1);
    }
    const checkInRule        = getRuleForNight(checkInDate, allRules);
    const childPrice2to6     = checkInRule?.childPrice2to6  ?? 0;
    const childPrice6to12    = checkInRule?.childPrice6to12 ?? 0;
    const accommodationTotal = basePrice
      + childPrice2to6  * children2to6  * nights
      + childPrice6to12 * children6to12 * nights;
    const touristTax = adults * nights * TOURIST_TAX;

    // Kedvezmény csak a szállásdíjra (IFA és extrák nélkül)
    const discountAmount = discountPercent > 0 ? Math.round(accommodationTotal * discountPercent / 100) : 0;

    // Extra szolgáltatások validálása az adatbázis alapján
    const requestedServiceIds = Array.isArray(extraServices)
      ? extraServices.map((s: any) => s?.id).filter((id: any) => typeof id === "string")
      : [];
    const dbServices = requestedServiceIds.length > 0
      ? await prisma.extraService.findMany({ where: { id: { in: requestedServiceIds }, isActive: true } })
      : [];
    let extraServicesTotal = 0;
    const seenServiceIds = new Set<string>();
    const validatedExtraServices = (Array.isArray(extraServices) ? extraServices : [])
      .map((sel: any) => {
        const dbSvc = dbServices.find((s) => s.id === sel?.id);
        if (!dbSvc || dbSvc.price == null || seenServiceIds.has(dbSvc.id)) return null;
        seenServiceIds.add(dbSvc.id);
        const quantity  = Math.max(1, Math.min(20, Math.round(Number(sel.quantity)) || 1));
        // PER_NIGHT: a vendég 1..foglalt éj között választhat
        const svcNights = dbSvc.pricingType === "PER_NIGHT"
          ? Math.max(1, Math.min(nights, Math.round(Number(sel.nights)) || nights))
          : 1;
        const total = dbSvc.price * quantity * svcNights;
        extraServicesTotal += total;
        return { id: dbSvc.id, name: dbSvc.name, pricingType: dbSvc.pricingType, price: dbSvc.price, quantity, nights: svcNights, total };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const finalTotal = Math.round(accommodationTotal + touristTax - discountAmount + extraServicesTotal);
    if (!finalTotal || finalTotal <= 0) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen ár" },
        { status: 400 }
      );
    }

    const depositPercent  = (applicableRule as any)?.policy?.depositPercent ?? 30;
    const freeCancelDays  = (applicableRule as any)?.policy?.freeCancelDays ?? 11;
    const depositAmount  = Math.round((finalTotal - touristTax) * depositPercent / 100);

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
        numberOfGuests,
        numberOfAdults:        adults,
        numberOfTeens:         teens,
        numberOfBabies:        babies,
        numberOfChildren2to6:  children2to6,
        numberOfChildren6to12: children6to12,
        notes: notes || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        basePrice,
        childPrice2to6,
        childPrice6to12,
        guestSurcharge: 0,
        cleaningFee:    CLEANING_FEE,
        touristTax,
        totalPrice: finalTotal,
        discountPercent,
        discountAmount,
        depositAmount,
        extraServices:     validatedExtraServices.length > 0 ? validatedExtraServices : undefined,
        extraServicesTotal,
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
        guestPhone,
        guestAddress,
        checkIn,
        checkOut,
        nights,
        guests: numberOfGuests,
        numberOfAdults: adults,
        totalPrice: finalTotal,
        bookingId: bookingRef,
        notes,
        basePrice,
        touristTax,
        depositAmount,
        depositPercent,
        freeCancelDays,
        extraServices: validatedExtraServices.map((s) => ({
          name:        s.name,
          total:       s.total,
          quantity:    s.quantity,
          nights:      s.nights,
          price:       s.price,
          pricingType: s.pricingType,
        })),
        extraServicesTotal,
        paymentMethod: body.paymentMethod ?? null,
        discountPercent,
        discountAmount,
        numberOfTeens:         teens,
        numberOfBabies:        babies,
        numberOfChildren2to6:  children2to6,
        numberOfChildren6to12: children6to12,
        childPrice2to6,
        childPrice6to12,
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