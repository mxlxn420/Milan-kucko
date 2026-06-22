import { NextRequest, NextResponse } from "next/server";
import { syncIcalFeeds }            from "@/lib/icalSync";
import { sendIcalSyncErrorEmail }   from "@/lib/email";

// cron-jobs.org hívja óránként — CRON_SECRET-tel védett
export async function GET(req: NextRequest) {
  const secret   = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncIcalFeeds();

  const failed = results
    .filter((r): r is typeof r & { error: string } => !!r.error)
    .map(r => ({ source: r.source, error: r.error }));

  if (failed.length > 0) {
    await sendIcalSyncErrorEmail(failed);
  }

  return NextResponse.json({ success: true, results });
}
