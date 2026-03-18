import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── GET – egy foglalás adatai ───────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Foglalás nem található" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}

// ─── PATCH – foglalás státuszának frissítése (admin) ─────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body   = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "PAID", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen státusz" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data:  {
        status,
        ...(status === "PAID" ? { paidAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}

// ─── DELETE – foglalás törlése (admin) ───────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}