import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Foglalás nem található" }, { status: 404 });
    }

    if (booking.depositPaidAt) {
      return NextResponse.json({ success: false, error: "Az előleg már be van fizetve" }, { status: 409 });
    }

    const body = await req.json().catch(() => ({}));
    const depositPaidAt     = body.paidAt ? new Date(body.paidAt) : new Date();
    const depositPaidAmount = body.paidAmount != null ? Number(body.paidAmount) : null;
    const depositPaidMethod = body.paidMethod ?? null;

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        depositPaidAt,
        depositPaidAmount,
        depositPaidMethod,
        status: booking.status === "PENDING" ? "CONFIRMED" : booking.status,
      },
    });

    // Email küldés
    let emailSent = false;
    let emailError: string | null = null;
    try {
      const { sendDepositConfirmationEmail } = await import("@/lib/email");
      await sendDepositConfirmationEmail({
        guestName:     booking.guestName,
        guestEmail:    booking.guestEmail,
        checkIn:       format(new Date(booking.checkIn), "yyyy-MM-dd"),
        checkOut:      format(new Date(booking.checkOut), "yyyy-MM-dd"),
        nights:        booking.nights,
        guests:        booking.numberOfGuests,
        totalPrice:    booking.totalPrice,
        depositAmount: booking.depositAmount,
        bookingId:     booking.id,
      });
      emailSent = true;
    } catch (err: any) {
      emailError = err?.message ?? "Ismeretlen email hiba";
      console.error("Előleg email hiba:", emailError);
    }

    return NextResponse.json({ success: true, data: updated, emailSent, emailError });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
