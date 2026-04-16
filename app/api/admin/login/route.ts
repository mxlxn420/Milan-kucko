import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, "60 m"),
  prefix: "admin_login",
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const { success, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfterMin = Math.ceil((reset - Date.now()) / 60000);
    return NextResponse.json(
      {
        success: false,
        error: `Túl sok sikertelen próbálkozás. Próbáld újra ${retryAfterMin} perc múlva.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";

    const ADMIN_PASSWORD      = process.env.ADMIN_PASSWORD;
    const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN;

    if (!ADMIN_PASSWORD || !ADMIN_SESSION_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Szerver konfiguráció hiánya" },
        { status: 500 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      const errorMsg =
        remaining === 0
          ? "Túl sok sikertelen próbálkozás. Próbáld újra 1 óra múlva."
          : `Hibás jelszó. Még ${remaining} próbálkozás maradt.`;

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", ADMIN_SESSION_TOKEN, {
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