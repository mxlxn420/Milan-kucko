function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  bookingId: string;
  notes?: string | null;
  basePrice?: number;
  guestSurcharge?: number;
  touristTax?: number;
}

function formatHuf(amount: number): string {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── VENDÉG EMAIL HTML ───────────────────────────────────────
function guestEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foglalás visszaigazolása</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,58,42,0.08);">
          
          <!-- Fejléc -->
          <tr>
            <td style="background:#1a3a2a;padding:40px;text-align:center;">
              <p style="color:#f5f0e8;font-size:28px;font-weight:300;margin:0;letter-spacing:-0.02em;">
                Milán Kuckó
              </p>
              <p style="color:rgba(245,240,232,0.6);font-size:12px;margin:8px 0 0;font-family:sans-serif;letter-spacing:0.2em;text-transform:uppercase;">
                Miskolctapolca · Bencések útja 117/A
              </p>
            </td>
          </tr>

          <!-- Tartalom -->
          <tr>
            <td style="padding:40px;">
              
              <p style="font-size:20px;color:#1a3a2a;margin:0 0 16px;">
                Kedves ${escapeHtml(data.guestName)}!
              </p>
              
              <p style="font-family:sans-serif;font-size:14px;color:#737373;line-height:1.7;margin:0 0 24px;">
                Köszönjük foglalási kérelmét! Megkaptuk igényét és hamarosan 
                felvesszük Önnel a kapcsolatot a végleges visszaigazoláshoz.
              </p>

              <!-- Foglalási azonosító -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <p style="font-family:sans-serif;font-size:12px;color:#a8a8a8;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">
                      Foglalási azonosító
                    </p>
                    <span style="background:#1a3a2a;color:#f5f0e8;font-family:monospace;font-size:16px;padding:8px 20px;border-radius:8px;letter-spacing:0.15em;">
                      ${data.bookingId}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Foglalás részletei -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#1a3a2a;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 16px;">
                      Foglalás részletei
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Érkezés</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatDate(data.checkIn)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Távozás</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatDate(data.checkOut)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Éjszakák</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${data.nights} éj</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Vendégek</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${data.guests} fő</td>
                      </tr>
                      ${data.guestSurcharge && data.guestSurcharge > 0 ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Extra vendég felár</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatHuf(data.guestSurcharge)}</td>
                      </tr>` : ""}
                      ${data.touristTax && data.touristTax > 0 ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">IFA</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatHuf(data.touristTax)}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:12px 0 0;font-family:sans-serif;font-size:16px;color:#1a3a2a;font-weight:600;">Végösszeg</td>
                        <td style="padding:12px 0 0;font-family:sans-serif;font-size:18px;color:#1a3a2a;font-weight:700;text-align:right;">${formatHuf(data.totalPrice)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tudnivalók -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8d9b5;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#1a3a2a;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px;">
                      Tudnivalók
                    </p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">🕑 Bejelentkezés: 15:00 – 20:00</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">🕙 Kijelentkezés: 8:00 – 11:00</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">📍 3519 Miskolctapolca, Bencések útja 117/A</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">📞 +36 30 845 4923</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">💳 Fizetés helyszínen vagy előre utalással</p>
                    ${data.notes ? `<p style="font-family:sans-serif;font-size:13px;color:#525252;margin:12px 0 0;padding-top:12px;border-top:1px solid #e8d9b5;">💬 Megjegyzés: ${escapeHtml(data.notes)}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Előleg fizetési kötelezettség -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a3a2a;border-radius:12px;margin-bottom:24px;">
  <tr>
    <td style="padding:24px;">
      <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:rgba(245,240,232,0.6);text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px;">
        ⚠️ Fontos – Előleg fizetése
      </p>
      <p style="font-family:sans-serif;font-size:22px;font-weight:700;color:#f5f0e8;margin:0 0 4px;">
        ${formatHuf(Math.round(data.totalPrice * 0.3))}
      </p>
      <p style="font-family:sans-serif;font-size:12px;color:rgba(245,240,232,0.6);margin:0 0 16px;">
        A végösszeg 30%-a (${formatHuf(data.totalPrice)})
      </p>
      <p style="font-family:sans-serif;font-size:14px;color:#f5f0e8;margin:0 0 8px;font-weight:500;">
        Kérjük, az előleget <strong style="color:#d4a878;">48 órán belül</strong> utalja át az alábbi bankszámlára:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.08);border-radius:8px;margin-top:12px;">
        <tr>
          <td style="padding:16px;">
            <p style="font-family:sans-serif;font-size:13px;color:rgba(245,240,232,0.7);margin:0 0 6px;">Számlatulajdonos</p>
            <p style="font-family:sans-serif;font-size:14px;color:#f5f0e8;font-weight:600;margin:0 0 12px;">Martis Ferenc</p>
            <p style="font-family:sans-serif;font-size:13px;color:rgba(245,240,232,0.7);margin:0 0 6px;">Bankszámlaszám</p>
            <p style="font-family:monospace;font-size:15px;color:#f5f0e8;font-weight:600;margin:0 0 12px;letter-spacing:0.05em;">12345678-12345678-12345678</p>
            <p style="font-family:sans-serif;font-size:13px;color:rgba(245,240,232,0.7);margin:0 0 6px;">Közlemény</p>
            <p style="font-family:monospace;font-size:14px;color:#d4a878;font-weight:600;margin:0;">${escapeHtml(data.guestName)}</p>
          </td>
        </tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:rgba(245,240,232,0.5);margin:12px 0 0;">
        ⚠️ Az előleg beérkezéséig a foglalás nem végleges. 
        Ha 48 órán belül nem érkezik meg az előleg, a foglalást töröljük.
      </p>
    </td>
  </tr>
</table>

<!-- Mi történik ezután -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5e6d8;border-radius:12px;margin-bottom:24px;">
  <tr>
    <td style="padding:20px;">
      <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#a86435;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 10px;">
        Mi történik ezután?
      </p>
      <p style="font-family:sans-serif;font-size:13px;color:#8a4e25;margin:4px 0;">✓ Előleg utalása 48 órán belül (${formatHuf(Math.round(data.totalPrice * 0.3))})</p>
      <p style="font-family:sans-serif;font-size:13px;color:#8a4e25;margin:4px 0;">✓ Előleg beérkezése után végleges a foglalás</p>
      <p style="font-family:sans-serif;font-size:13px;color:#8a4e25;margin:4px 0;">✓ Maradék összeg (${formatHuf(data.totalPrice - Math.round(data.totalPrice * 0.3))}) helyszínen fizetendő</p>
      <p style="font-family:sans-serif;font-size:13px;color:#8a4e25;margin:4px 0;">✓ Bejelentkezési instrukciók e-mailben érkezés előtt</p>
    </td>
  </tr>
</table>


              <p style="font-family:sans-serif;font-size:13px;color:#a8a8a8;line-height:1.6;margin:0;">
                Kérdése esetén hívjon minket a <strong>+36 30 845 4923</strong> számon 
                vagy írjon az <strong>milan.kucko117@gmail.com</strong> címre.
              </p>

            </td>
          </tr>

          <!-- Lábléc -->
          <tr>
            <td style="background:#f5f0e8;padding:24px 40px;text-align:center;border-top:1px solid #e8d9b5;">
              <p style="font-family:sans-serif;font-size:12px;color:#a8a8a8;margin:0;">
                Milán Kuckó · milan.kucko117@gmail.com · +36 30 845 4923
              </p>
              <p style="font-family:sans-serif;font-size:11px;color:#d4d4d4;margin:4px 0 0;">
                Ez egy automatikus értesítő e-mail. Kérjük, ne válaszoljon rá.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── ADMIN ÉRTESÍTŐ EMAIL HTML ───────────────────────────────
function adminEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f5f0e8;font-family:sans-serif;">
  <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;margin:0 auto;">
    <tr>
      <td style="background:#1a3a2a;padding:24px;text-align:center;">
        <p style="color:#f5f0e8;font-size:18px;margin:0;">🏡 Új foglalási kérelem!</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
          <tr><td style="padding:8px 0;color:#737373;border-bottom:1px solid #f0f0f0;">Vendég neve</td><td style="padding:8px 0;font-weight:600;border-bottom:1px solid #f0f0f0;text-align:right;">${escapeHtml(data.guestName)}</td></tr>
          <tr><td style="padding:8px 0;color:#737373;border-bottom:1px solid #f0f0f0;">E-mail</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${escapeHtml(data.guestEmail)}</td></tr>
          <tr><td style="padding:8px 0;color:#737373;border-bottom:1px solid #f0f0f0;">Érkezés</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatDate(data.checkIn)}</td></tr>
          <tr><td style="padding:8px 0;color:#737373;border-bottom:1px solid #f0f0f0;">Távozás</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatDate(data.checkOut)}</td></tr>
          <tr><td style="padding:8px 0;color:#737373;border-bottom:1px solid #f0f0f0;">Vendégek</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${data.guests} fő · ${data.nights} éj</td></tr>
          <tr><td style="padding:12px 0 0;font-weight:600;color:#1a3a2a;font-size:16px;">Végösszeg</td><td style="padding:12px 0 0;font-weight:700;color:#1a3a2a;font-size:18px;text-align:right;">${formatHuf(data.totalPrice)}</td></tr>
        </table>
        ${data.notes ? `<p style="margin:16px 0 0;padding:12px;background:#f5f0e8;border-radius:8px;font-size:13px;color:#525252;">💬 ${escapeHtml(data.notes)}</p>` : ""}
        <p style="margin:16px 0 0;font-size:12px;color:#a8a8a8;">Azonosító: <strong>${data.bookingId}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/foglalasok" 
           style="display:inline-block;margin-top:16px;background:#1a3a2a;color:#f5f0e8;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;">
          Admin felületen megtekintés →
        </a>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── ELŐLEG VISSZAIGAZOLÓ EMAIL HTML ────────────────────────
function depositConfirmationHtml(data: BookingEmailData & { depositAmount: number; remaining: number; depositMethod?: string | null }): string {
  return `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,58,42,0.08);">

          <!-- Fejléc -->
          <tr>
            <td style="background:#1a3a2a;padding:40px;text-align:center;">
              <p style="color:#f5f0e8;font-size:28px;font-weight:300;margin:0;letter-spacing:-0.02em;">Milán Kuckó</p>
              <p style="color:rgba(245,240,232,0.6);font-size:12px;margin:8px 0 0;font-family:sans-serif;letter-spacing:0.2em;text-transform:uppercase;">Miskolctapolca · Bencések útja 117/A</p>
            </td>
          </tr>

          <!-- Tartalom -->
          <tr>
            <td style="padding:40px;">

              <!-- Megerősítés banner -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#d4edda;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <p style="font-size:32px;margin:0 0 8px;">✅</p>
                    <p style="font-family:sans-serif;font-size:18px;font-weight:700;color:#1a5c2a;margin:0 0 4px;">Előleg megérkezett!</p>
                    <p style="font-family:sans-serif;font-size:14px;color:#2d7a3a;margin:0;">A foglalása most már végleges.</p>
                  </td>
                </tr>
              </table>

              <p style="font-size:20px;color:#1a3a2a;margin:0 0 16px;">Kedves ${escapeHtml(data.guestName)}!</p>
              <p style="font-family:sans-serif;font-size:14px;color:#737373;line-height:1.7;margin:0 0 24px;">
                Örömmel értesítjük, hogy az előleg beérkezett. Foglalása végleges, várjuk Önt szeretettel!
              </p>

              <!-- Foglalási azonosító -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <p style="font-family:sans-serif;font-size:12px;color:#a8a8a8;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Foglalási azonosító</p>
                    <span style="background:#1a3a2a;color:#f5f0e8;font-family:monospace;font-size:16px;padding:8px 20px;border-radius:8px;letter-spacing:0.15em;">${data.bookingId}</span>
                  </td>
                </tr>
              </table>

              <!-- Foglalás adatai -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#1a3a2a;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 16px;">Foglalás részletei</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Érkezés</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatDate(data.checkIn)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Távozás</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${formatDate(data.checkOut)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Éjszakák</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#2a2a2a;font-weight:500;text-align:right;">${data.nights} éj</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#737373;">Befizetett előleg</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e8d9b5;font-family:sans-serif;font-size:14px;color:#1a5c2a;font-weight:600;text-align:right;">✓ ${formatHuf(data.depositAmount)}${data.depositMethod ? ` <span style="font-size:12px;font-weight:400;color:#737373;">(${data.depositMethod === "transfer" ? "átutalás" : data.depositMethod === "szep" ? "SZÉP kártya" : data.depositMethod})</span>` : ""}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;font-family:sans-serif;font-size:14px;color:#737373;">Helyszínen fizetendő</td>
                        <td style="padding:12px 0 0;font-family:sans-serif;font-size:18px;color:#1a3a2a;font-weight:700;text-align:right;">${formatHuf(data.remaining)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tudnivalók -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8d9b5;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#1a3a2a;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px;">Tudnivalók</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">🕑 Bejelentkezés: 14:00 – 20:00</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">🕙 Kijelentkezés: 10:00-ig</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">📍 3519 Miskolctapolca, Bencések útja 117/A</p>
                    <p style="font-family:sans-serif;font-size:13px;color:#525252;margin:4px 0;">📞 +36 30 845 4923</p>
                  </td>
                </tr>
              </table>

              <p style="font-family:sans-serif;font-size:13px;color:#a8a8a8;line-height:1.6;margin:0;">
                Kérdése esetén hívjon minket a <strong>+36 30 845 4923</strong> számon vagy írjon az <strong>milan.kucko117@gmail.com</strong> címre.
              </p>

            </td>
          </tr>

          <!-- Lábléc -->
          <tr>
            <td style="background:#f5f0e8;padding:24px 40px;text-align:center;border-top:1px solid #e8d9b5;">
              <p style="font-family:sans-serif;font-size:12px;color:#a8a8a8;margin:0;">Milán Kuckó · milan.kucko117@gmail.com · +36 30 845 4923</p>
              <p style="font-family:sans-serif;font-size:11px;color:#d4d4d4;margin:4px 0 0;">Ez egy automatikus értesítő e-mail. Kérjük, ne válaszoljon rá.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── ELŐLEG VISSZAIGAZOLÓ EMAIL KÜLDŐ ───────────────────────
export async function sendDepositConfirmationEmail(params: {
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  depositAmount: number;
  depositMethod?: string | null;
  bookingId: string;
}): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL  = process.env.FROM_EMAIL  ?? "onboarding@resend.dev";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? FROM_EMAIL;

  const remaining = params.totalPrice - params.depositAmount;
  const html = depositConfirmationHtml({ ...params, remaining, depositMethod: params.depositMethod });

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxxxxx") {
    console.log("📧 [DEV] Előleg visszaigazoló email szimulálva:", {
      to: params.guestEmail,
      subject: `Előleg befizetve – ${params.bookingId}`,
    });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:     `Milán Kuckó <${FROM_EMAIL}>`,
      to:       [params.guestEmail],
      reply_to: [ADMIN_EMAIL],
      subject:  `✅ Előleg befizetve – ${params.bookingId}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Előleg email hiba:", err);
  }
}

// ─── FŐ EMAIL KÜLDŐ FÜGGVÉNY ─────────────────────────────────
export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.FROM_EMAIL ?? "info@milankucko.hu";

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxxxxx") {
    console.log("📧 [DEV] Email küldés szimulálva:", {
      to: data.guestEmail,
      subject: `Foglalás visszaigazolása – ${data.bookingId}`,
    });
    return;
  }

  // Vendég emailje
  const guestRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:     `Milán Kuckó <${FROM_EMAIL}>`,
      to:       [data.guestEmail],
      reply_to: [ADMIN_EMAIL],
      subject:  `✓ Foglalás visszaigazolása – ${data.bookingId}`,
      html:     guestEmailHtml(data),
    }),
  });

  if (!guestRes.ok) {
    const err = await guestRes.text();
    console.error("Vendég email hiba:", err);
  }

  // Admin értesítő
  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Milán Kuckó Foglalások <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      subject: `🏡 Új foglalás: ${data.guestName} – ${formatDate(data.checkIn)}`,
      html: adminEmailHtml(data),
    }),
  });

  if (!adminRes.ok) {
    const err = await adminRes.text();
    console.error("Admin email hiba:", err);
  }
}

// ─── TÖRLÉSI / ELUTASÍTÁSI EMAIL ─────────────────────────────

function cancellationEmailHtml(data: {
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  bookingId: string;
  adminNote?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Foglalás törlése</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Fejléc -->
      <tr><td style="background:#1a3a2a;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
        <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:rgba(245,240,232,0.5);text-transform:uppercase;letter-spacing:0.2em;margin:0 0 8px;">Milán Kuckó</p>
        <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:300;color:#f5f0e8;margin:0;">Foglalás törölve</h1>
      </td></tr>

      <!-- Tartalom -->
      <tr><td style="background:#ffffff;padding:32px;">
        <p style="font-family:sans-serif;font-size:15px;color:#3d3d3d;margin:0 0 16px;">
          Kedves <strong>${escapeHtml(data.guestName)}</strong>!
        </p>
        <p style="font-family:sans-serif;font-size:14px;color:#666;margin:0 0 24px;line-height:1.6;">
          Sajnálattal értesítjük, hogy az alábbi foglalása törlésre került.
        </p>

        <!-- Foglalás adatai -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:20px;">
            <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#8a7a6a;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px;">Foglalás részletei</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:sans-serif;font-size:13px;color:#8a7a6a;padding:4px 0;">Érkezés</td>
                <td style="font-family:sans-serif;font-size:13px;color:#3d3d3d;font-weight:600;text-align:right;padding:4px 0;">${data.checkIn}</td>
              </tr>
              <tr>
                <td style="font-family:sans-serif;font-size:13px;color:#8a7a6a;padding:4px 0;">Távozás</td>
                <td style="font-family:sans-serif;font-size:13px;color:#3d3d3d;font-weight:600;text-align:right;padding:4px 0;">${data.checkOut}</td>
              </tr>
              <tr>
                <td style="font-family:sans-serif;font-size:13px;color:#8a7a6a;padding:4px 0;">Éjszakák</td>
                <td style="font-family:sans-serif;font-size:13px;color:#3d3d3d;font-weight:600;text-align:right;padding:4px 0;">${data.nights} éj</td>
              </tr>
            </table>
          </td></tr>
        </table>

        ${data.adminNote ? `
        <!-- Admin megjegyzés -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-left:3px solid #d4a878;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <tr><td style="padding:16px 20px;">
            <p style="font-family:sans-serif;font-size:11px;font-weight:600;color:#a86435;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px;">Megjegyzés</p>
            <p style="font-family:sans-serif;font-size:14px;color:#3d3d3d;margin:0;line-height:1.6;">${escapeHtml(data.adminNote)}</p>
          </td></tr>
        </table>
        ` : ""}

        <p style="font-family:sans-serif;font-size:14px;color:#666;margin:0 0 8px;line-height:1.6;">
          Ha kérdése van, kérjük vegye fel velünk a kapcsolatot.
        </p>
      </td></tr>

      <!-- Lábléc -->
      <tr><td style="background:#f0ebe3;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
        <p style="font-family:sans-serif;font-size:12px;color:#a8a8a8;margin:0;">Milán Kuckó · Miskolctapolca, Bencések útja 117/A</p>
        <p style="font-family:sans-serif;font-size:11px;color:#c0c0c0;margin:6px 0 0;">Azonosító: ${data.bookingId}</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendCancellationEmail(params: {
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  bookingId: string;
  adminNote?: string;
}): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL  = process.env.FROM_EMAIL  ?? "onboarding@resend.dev";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? FROM_EMAIL;

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxxxxx") {
    console.log("📧 [DEV] Törlési email szimulálva:", { to: params.guestEmail, note: params.adminNote });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:     `Milán Kuckó <${FROM_EMAIL}>`,
      to:       [params.guestEmail],
      reply_to: [ADMIN_EMAIL],
      subject:  `Foglalás törölve – ${params.bookingId}`,
      html:     cancellationEmailHtml(params),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Törlési email hiba:", err);
  }
}