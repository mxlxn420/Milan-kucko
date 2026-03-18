import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "milan2025admin";

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Hibás jelszó" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   60 * 60 * 24 * 7, // 7 nap
      path:     "/",
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 }
    );
  }
}