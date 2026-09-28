import { NextResponse }   from "next/server";
import { syncIcalFeeds } from "@/lib/icalSync";
import { requireAdmin }  from "@/lib/adminAuth";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const results = await syncIcalFeeds();
  return NextResponse.json({ success: true, results });
}
