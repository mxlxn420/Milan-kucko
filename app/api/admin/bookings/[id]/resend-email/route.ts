import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Foglalás nem található" }, { status: 404 });
    }

    const { sendBookingEmails } = await import("@/lib/email");
    await sendBookingEmails({
      guestName:             booking.guestName,
      guestEmail:            booking.guestEmail,
      guestPhone:            booking.guestPhone     ?? undefined,
      guestAddress:          booking.guestAddress   ?? undefined,
      checkIn:               format(new Date(booking.checkIn),  "yyyy-MM-dd"),
      checkOut:              format(new Date(booking.checkOut), "yyyy-MM-dd"),
      nights:                booking.nights,
      guests:                booking.numberOfGuests,
      numberOfAdults:        booking.numberOfAdults        ?? undefined,
      numberOfTeens:         booking.numberOfTeens         ?? undefined,
      numberOfBabies:        booking.numberOfBabies        ?? undefined,
      numberOfChildren2to6:  booking.numberOfChildren2to6  ?? undefined,
      numberOfChildren6to12: booking.numberOfChildren6to12 ?? undefined,
      totalPrice:            booking.totalPrice,
      bookingId:             booking.id,
      notes:                 booking.notes,
      basePrice:             booking.basePrice      ?? undefined,
      touristTax:            booking.touristTax     ?? undefined,
      guestSurcharge:        booking.guestSurcharge ?? undefined,
      depositAmount:         booking.depositAmount  ?? undefined,
      childPrice2to6:        booking.childPrice2to6  ?? undefined,
      childPrice6to12:       booking.childPrice6to12 ?? undefined,
      extraServices: Array.isArray(booking.extraServices)
        ? (booking.extraServices as any[]).map((s: any) => ({
            name:        String(s.name ?? ""),
            total:       Number(s.total ?? 0),
            quantity:    s.quantity  != null ? Number(s.quantity)  : undefined,
            nights:      s.nights    != null ? Number(s.nights)    : undefined,
            price:       s.price     != null ? Number(s.price)     : undefined,
            pricingType: s.pricingType ?? undefined,
          }))
        : [],
      extraServicesTotal: booking.extraServicesTotal ?? undefined,
      paymentMethod:      (booking as any).paymentMethod ?? null,
      discountPercent:    booking.discountPercent ?? undefined,
      discountAmount:     booking.discountAmount  ?? undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "Email küldési hiba" }, { status: 500 });
  }
}
