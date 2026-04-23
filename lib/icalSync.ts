import { prisma } from "@/lib/prisma";

const SOURCES = [
  { envKey: "ICAL_SZALLAS_HU",    label: "szallas.hu"    },
  { envKey: "ICAL_BOOKING_COM",   label: "booking.com"   },
  { envKey: "ICAL_APPARTMAN_HU",  label: "appartman.hu"  },
];

/** Egy YYYYMMDD stringből Date objektum (UTC éjfél) */
function parseIcalDate(s: string): Date {
  const clean = s.slice(0, 8);
  return new Date(`${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}T00:00:00Z`);
}

/** Minimális iCal parser — csak VEVENT blokkokat vesz figyelembe */
function parseIcal(text: string): { start: Date; end: Date; summary: string }[] {
  const events: { start: Date; end: Date; summary: string }[] = [];
  const blocks = text.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const startMatch   = block.match(/DTSTART(?:;[^:\r\n]*)?:(\d{8})/);
    const endMatch     = block.match(/DTEND(?:;[^:\r\n]*)?:(\d{8})/);
    const summaryMatch = block.match(/SUMMARY:([^\r\n]+)/);

    if (!startMatch || !endMatch) continue;

    const start = parseIcalDate(startMatch[1]);
    // iCal-ban a DTEND kizáró (a kivétel napja = checkout) — azt is blokkoljuk
    const end   = parseIcalDate(endMatch[1]);

    if (end <= start) continue; // üres esemény kihagyva

    events.push({
      start,
      end,
      summary: summaryMatch?.[1]?.trim() ?? "Foglalt",
    });
  }

  return events;
}

export interface SyncResult {
  source:   string;
  added:    number;
  removed:  number;
  error?:   string;
}

export async function syncIcalFeeds(): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const { envKey, label } of SOURCES) {
    const url = process.env[envKey];
    if (!url) continue;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      const events = parseIcal(text);

      // Régi iCal-importált rekordok törlése ebből a forrásból
      const deleted = await prisma.blockedPeriod.deleteMany({
        where: { reason: { startsWith: `[${label}]` } },
      });

      // Új rekordok létrehozása
      if (events.length > 0) {
        await prisma.blockedPeriod.createMany({
          data: events.map((e) => ({
            dateFrom: e.start,
            dateTo:   e.end,
            reason:   `[${label}] ${e.summary}`,
          })),
        });
      }

      results.push({ source: label, added: events.length, removed: deleted.count });
    } catch (err: unknown) {
      results.push({
        source: label,
        added:  0,
        removed: 0,
        error:  err instanceof Error ? err.message : "Ismeretlen hiba",
      });
    }
  }

  return results;
}
