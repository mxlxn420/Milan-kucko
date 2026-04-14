import { NextResponse }   from "next/server";
import { syncIcalFeeds } from "@/lib/icalSync";

// Middleware védi ezt a végpontot (/api/admin/* matcher)
export async function POST() {
  const results = await syncIcalFeeds();
  return NextResponse.json({ success: true, results });
}
