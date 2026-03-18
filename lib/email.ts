// E-mail küldés Resend-del
// Ha még nincs Resend fiókod: resend.com → ingyenes 3000 email/hó

interface BookingEmailData {
    guestName:   string;
    guestEmail:  string;
    checkIn:     string;
    checkOut:    string;
    nights:      number;
    guests:      number;
    totalPrice:  number;
    bookingId:   string;
    notes?:      string;
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
      year: "numeric", month: "long", day: "numeric",
    });
  }
  
  // Vendégnek küldött visszaigazoló email HTML
  function guestEmailHtml(data: BookingEmailData): string {
    return `
      <!DOCTYPE html>
      <html lang="hu">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Georgia, serif; background: #f5f0e8; margin: 0; padding: 40px 20px; }
          .card { background: white; max-width: 560px; margin: 0 auto; border-radius: 16px; overflow: hidden; }
          .header { background: #1a3a2a; padding: 40px; text-align: center; }
          .header h1 { color: #f5f0e8; font-size: 28px; font-weight: 300; margin: 0; }
          .header p { color: rgba(245,240,232,0.6); font-size: 13px; margin: 8px 0 0; font-family: sans-serif; }
          .body { padding: 40px; }
          .greeting { font-size: 18px; color: #1a3a2a; margin-bottom: 16px; }
          .text { font-family: sans-serif; font-size: 14px; color: #737373; line-height: 1.7; margin-bottom: 24px; }
          .details { background: #f5f0e8; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e8d9b5; font-family: sans-serif; font-size: 14px; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #737373; }
          .detail-value { color: #2a2a2a; font-weight: 500; }
          .total { font-size: 18px !important; color: #1a3a2a !important; }
          .info-box { border: 1px solid #e8d9b5; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .info-box h3 { font-family: sans-serif; font-size: 13px; font-weight: 600; color: #1a3a2a; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; }
          .info-item { font-family: sans-serif; font-size: 13px; color: #525252; padding: 4px 0; }
          .footer { background: #f5f0e8; padding: 24px 40px; text-align: center; }
          .footer p { font-family: sans-serif; font-size: 12px; color: #a8a8a8; margin: 4px 0; }
          .booking-id { display: inline-block; background: #1a3a2a; color: #f5f0e8; font-family: monospace; font-size: 14px; padding: 6px 16px; border-radius: 6px; letter-spacing: 0.1em; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Milán Kuckó</h1>
            <p>Miskolctapolca · Bencések útja 117/A</p>
          </div>
          <div class="body">
            <p class="greeting">Kedves ${data.guestName}!</p>
            <p class="text">
              Köszönjük foglalását! Megkaptuk kérelmét, és hamarosan felvesszük Önnel a kapcsolatot 
              a végleges visszaigazoláshoz. Foglalási azonosítója:
            </p>
            <div style="text-align:center; margin-bottom: 24px;">
              <span class="booking-id">${data.bookingId}</span>
            </div>
  
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Érkezés</span>
                <span class="detail-value">${formatDate(data.checkIn)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Távozás</span>
                <span class="detail-value">${formatDate(data.checkOut)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Éjszakák</span>
                <span class="detail-value">${data.nights} éj</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vendégek</span>
                <span class="detail-value">${data.guests} fő</span>
              </div>
              <div class="detail-row">
                <span class="detail-label total">Végösszeg</span>
                <span class="detail-value total">${formatHuf(data.totalPrice)}</span>
              </div>
            </div>
  
            <div class="info-box">
              <h3>Tudnivalók</h3>
              <div class="info-item">🕑 Bejelentkezés: 14:00 – 20:00</div>
              <div class="info-item">🕙 Kijelentkezés: 10:00-ig</div>
              <div class="info-item">📍 3519 Miskolctapolca, Bencések útja 117/A</div>
              <div class="info-item">📞 +36 30 123 4567</div>
              ${data.notes ? `<div class="info-item" style="margin-top:8px; padding-top:8px; border-top: 1px solid #e8d9b5;">💬 Megjegyzés: ${data.notes}</div>` : ""}
            </div>
  
            <p class="text">
              Fizetés helyszínen készpénzzel vagy bankkártyával, illetve előre utalással lehetséges.
              Kérdése esetén hívjon minket vagy írjon e-mailt!
            </p>
          </div>
          <div class="footer">
            <p>Milán Kuckó · info@milankucko.hu · +36 30 123 4567</p>
            <p>Ez egy automatikus értesítő e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  // Admin értesítő email
  function adminEmailHtml(data: BookingEmailData): string {
    return `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a3a2a;">🏡 Új foglalási kérelem!</h2>
        <table style="width:100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px; color: #737373;">Vendég</td><td style="padding: 8px; font-weight:600;">${data.guestName}</td></tr>
          <tr><td style="padding: 8px; color: #737373;">E-mail</td><td style="padding: 8px;">${data.guestEmail}</td></tr>
          <tr><td style="padding: 8px; color: #737373;">Érkezés</td><td style="padding: 8px;">${formatDate(data.checkIn)}</td></tr>
          <tr><td style="padding: 8px; color: #737373;">Távozás</td><td style="padding: 8px;">${formatDate(data.checkOut)}</td></tr>
          <tr><td style="padding: 8px; color: #737373;">Vendégek</td><td style="padding: 8px;">${data.guests} fő · ${data.nights} éj</td></tr>
          <tr><td style="padding: 8px; color: #737373;">Összeg</td><td style="padding: 8px; font-weight:600; color:#1a3a2a;">${formatHuf(data.totalPrice)}</td></tr>
          ${data.notes ? `<tr><td style="padding: 8px; color: #737373;">Megjegyzés</td><td style="padding: 8px;">${data.notes}</td></tr>` : ""}
        </table>
        <p style="margin-top: 20px; color: #525252; font-size: 13px;">
          Azonosító: <strong>${data.bookingId}</strong>
        </p>
      </div>
    `;
  }
  
  // ─── FŐ EMAIL KÜLDŐ FÜGGVÉNY ─────────────────────────────────
  export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
    // Ha nincs Resend kulcs, csak logoljuk (fejlesztés közben)
    if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxxxxx") {
      console.log("📧 [DEV] Email küldés szimulálva:", {
        to: data.guestEmail,
        subject: `Foglalás visszaigazolása – ${data.bookingId}`,
      });
      return;
    }
  
    // Vendég emailje
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    `Milán Kuckó <${process.env.FROM_EMAIL ?? "foglalas@milankucko.hu"}>`,
        to:      [data.guestEmail],
        subject: `✓ Foglalás visszaigazolása – ${data.bookingId}`,
        html:    guestEmailHtml(data),
      }),
    });
  
    // Admin értesítő
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    `Milán Kuckó Foglalások <${process.env.FROM_EMAIL ?? "foglalas@milankucko.hu"}>`,
        to:      [process.env.FROM_EMAIL ?? "info@milankucko.hu"],
        subject: `🏡 Új foglalás: ${data.guestName} – ${formatDate(data.checkIn)}`,
        html:    adminEmailHtml(data),
      }),
    });
  }