import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const blocked = await prisma.blockedPeriod.findMany({ orderBy: { dateFrom: "asc" } });
  return NextResponse.json({
    success: true,
    data: blocked.map((b) => ({
      ...b,
      dateFrom: b.dateFrom.toISOString(),
      dateTo:   b.dateTo.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { dateFrom, dateTo } = body;
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 200) : null;

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ success: false, error: "A dátumok megadása kötelező" }, { status: 400 });
    }

    const from = new Date(dateFrom);
    const to   = new Date(dateTo);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json({ success: false, error: "Érvénytelen dátum" }, { status: 400 });
    }

    // A dateFrom…dateTo mindkét vége zárt nap, így egyetlen nap is lezárható (to == from)
    if (to < from) {
      return NextResponse.json({ success: false, error: "A záró dátum nem lehet a kezdő dátum előtt" }, { status: 400 });
    }

    const blocked = await prisma.blockedPeriod.create({
      data: {
        dateFrom: from,
        dateTo:   to,
        reason:   reason || null,
      },
    });

    return NextResponse.json({ success: true, data: {
      ...blocked,
      dateFrom: blocked.dateFrom.toISOString(),
      dateTo:   blocked.dateTo.toISOString(),
    }});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}