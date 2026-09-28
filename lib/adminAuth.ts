import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_token";

// Konstans idejű összehasonlítás, hogy a válaszidőből ne lehessen a tokenre következtetni.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isValidAdminToken(token: string | undefined): boolean {
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  return !!token && !!expectedToken && safeEqual(token, expectedToken);
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return isValidAdminToken(store.get(ADMIN_COOKIE)?.value);
}

// Minden admin route handler elején hívandó – a proxy.ts mellett második védelmi vonal.
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminAuthed()) return null;
  return NextResponse.json({ success: false, error: "Nincs jogosultság" }, { status: 401 });
}
