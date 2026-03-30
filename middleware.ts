import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token || token !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Nincs jogosultság" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/((?!login).*)"],
};
