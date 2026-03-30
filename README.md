# Milán Kuckó — Vendégház Webapp

Foglalási és adminisztrációs rendszer a Milán Kuckó vendégházhoz (Miskolctapolca).

## Technológiák

- **Next.js 14** (App Router)
- **Prisma 7** + **PostgreSQL** (Supabase)
- **Tailwind CSS** egyedi color rendszerrel
- **Framer Motion** animációkhoz
- **Zustand** foglalási state kezeléshez

## Fejlesztői indítás

```bash
npm install
npm run dev
```

Az alkalmazás a [http://localhost:3000](http://localhost:3000) címen érhető el.

## Környezeti változók

Hozz létre egy `.env.local` fájlt a gyökérkönyvtárban:

```env
DIRECT_URL=postgresql://...
ADMIN_PASSWORD=...
ADMIN_JWT_SECRET=...
RESEND_API_KEY=...
```

A Prisma CLI-hez szükséges egy `prisma.config.ts` a gyökérkönyvtárban (ez nincs verziókezelve):

```ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: "postgresql://...",
  },
});
```

## Adatbázis

```bash
npx prisma db push      # séma szinkronizálás
npx prisma generate     # kliens generálás
npx prisma studio       # adatbázis böngésző
```

## Elérhető parancsok

```bash
npm run dev       # fejlesztői szerver (port 3000)
npm run build     # production build
npm run start     # production szerver
npm run lint      # ESLint
```

## Funkciók

**Vendégoldal**
- Foglalási naptár dátum- és vendégszám választóval
- Dinamikus árkalkuláció (szezonális árak, hétvégi árak, gyerekárak)
- Elérhetőség ellenőrzés
- Galéria oldal
- Kapcsolatfelvételi űrlap

**Admin felület** (`/admin`)
- Foglalások kezelése (jóváhagyás, lemondás, fizetve státusz)
- Foglalás naptár (havi nézet, vendégnevekkel)
- Naptár blokkolás
- Szezonális árszabályok kezelése
- Árnaptár (hetes nézet, árak és szabályok naponta)
- Előleg és lemondási szabályok
- Min. előfoglalási idő szezononként
