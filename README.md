# Milán Kuckó — Vendégház

Luxus vendégház foglalási és adminisztrációs rendszer. A Milán Kuckó vendégház (Miskolctapolca) számára készült Next.js alapú webalkalmazás, teljes online foglalási folyamattal és admin felülettel.

---

## Tech stack

| Réteg | Technológia |
|---|---|
| Frontend | Next.js 14 (App Router), React 18 |
| Stílus | Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Next.js API Routes |
| Adatbázis | PostgreSQL (Supabase) + Prisma 7 |
| Email | Resend |
| Képtárolás | Supabase Storage |

---

## Funkciók

**Vendégoldal**
- Foglalási naptár dátumválasztóval és vendégszám megadással
- Valós idejű árkalkuláció (szezonális, hétvégi, gyerekárak, kedvezmények)
- Elérhetőség ellenőrzés
- Extra szolgáltatások (reggeli, romantikus bekészítés stb.)
- Galéria, kapcsolatfelvétel, ÁSZF, adatvédelmi tájékoztató

**Admin felület** (`/admin`)
- Foglalások kezelése (jóváhagyás, lemondás, előleg, fizetve státusz)
- Havi foglalási naptár
- Időszak blokkolás (pl. karbantartás)
- Szezonális árszabályok és árnaptár
- Kedvezmények kezelése
- Extra szolgáltatások szerkesztése
- Hero szekció, Rólunk, Felszereltség, Galéria szerkesztő
- iCal szinkron (Szállás.hu, Booking.com)

---

## Fejlesztői indítás

```bash
npm install
npm run dev
```

Az alkalmazás a `http://localhost:3000` címen érhető el.

---

## Környezeti változók

Hozz létre egy `.env.local` fájlt a gyökérkönyvtárban:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

ADMIN_PASSWORD=...
ADMIN_SESSION_TOKEN=...

RESEND_API_KEY=...
FROM_EMAIL=...
ADMIN_EMAIL=...

NEXT_PUBLIC_SITE_URL=...

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

CRON_SECRET=...
ICAL_SZALLAS_HU=
ICAL_BOOKING_COM=
```

A Prisma CLI-hez szükséges egy `prisma.config.ts` a gyökérkönyvtárban (nincs verziókezelve):

```ts
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## Adatbázis

```bash
npx prisma db push      # séma szinkronizálás
npx prisma generate     # kliens generálás
npx prisma studio       # adatbázis böngésző
npm run db:seed         # kezdeti adatok feltöltése
```

---

## Parancsok

```bash
npm run dev       # fejlesztői szerver (port 3000)
npm run build     # production build
npm run start     # production szerver
npm run lint      # ESLint
```
