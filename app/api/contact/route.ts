import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Hiányzó mezők" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}