import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Adatvédelmi tájékoztató – Milán Kuckó",
  description: "Adatvédelmi tájékoztató – Milán Kuckó vendégház, Miskolctapolca",
};

export default function AdatvedelemPage() {
  return (
    <main className="min-h-screen bg-cream pt-28 pb-20">
      <div className="container-custom max-w-3xl">

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-forest-800 transition-colors mb-10">
          <ArrowLeft size={15} />
          Vissza a főoldalra
        </Link>

        <h1 className="font-serif text-4xl text-forest-900 mb-2">Adatvédelmi tájékoztató</h1>
        <p className="text-stone-400 text-sm mb-12">Hatályos: 2026. január 1-től</p>

        <div className="prose prose-stone max-w-none space-y-10 text-stone-700 leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">1. Az adatkezelő adatai</h2>
            <p>Adatkezelő neve: Milán Kuckó vendégház</p>
            <p>Képviselő: Martisné Csekes Beáta</p>
            <p>Cím: 3519 Miskolctapolca, Bencések útja 117/A</p>
            <p>Telefon: +36 30 845 4923</p>
            <p>E-mail: milan.kucko117@gmail.com</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">2. Az adatkezelés jogalapja és célja</h2>
            <p>
              Az adatkezelés jogalapja az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont),
              illetve szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont).
            </p>
            <p className="mt-3">Az adatkezelés céljai:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Szállásfoglalás lebonyolítása és visszaigazolása</li>
              <li>Kapcsolattartás a vendéggel</li>
              <li>Jogszabályi kötelezettségek teljesítése (pl. vendégkönyv, NTAK bejelentés)</li>
              <li>Számlázás és pénzügyi nyilvántartás</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">3. A kezelt személyes adatok köre</h2>
            <p>Foglalás során az alábbi adatokat kérjük meg:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Teljes név</li>
              <li>E-mail-cím</li>
              <li>Telefonszám</li>
              <li>Lakcím</li>
              <li>Érkezés és távozás időpontja</li>
              <li>Vendégek száma (felnőttek, gyermekek)</li>
              <li>Fizetési mód</li>
              <li>Esetleges megjegyzés / különleges kérés</li>
            </ul>
            <p className="mt-3">
              Jogszabályi kötelezettség alapján a bejelentkezéskor személyazonosító okmány bemutatása szükséges
              (útlevél vagy személyi igazolvány), amelynek adatait a vendégkönyvbe rögzítjük.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">4. Az adatkezelés időtartama</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Foglalási adatok: a foglalást követő 5 évig (számviteli törvény alapján)</li>
              <li>Vendégkönyv adatai: jogszabályban meghatározott ideig</li>
              <li>Kapcsolatfelvételi üzenetek (kapcsolati form): az üzenet megválaszolását követő 1 évig, majd törlésre kerülnek</li>
              <li>Hozzájárulás visszavonása esetén: az adatokat haladéktalanul töröljük,
                kivéve ha jogszabály hosszabb megőrzési kötelezettséget ír elő</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">5. Adattovábbítás és adatfeldolgozók</h2>
            <p>
              Az Ön személyes adatait harmadik félnek nem adjuk át, kivéve az alábbi eseteket:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>NTAK (Nemzeti Turisztikai Adatszolgáltató Központ):</strong> jogszabályi
                kötelezettség alapján a szálláshely-szolgáltatók kötelesek a vendégadatokat bejelenteni.
              </li>
              <li>
                <strong>Resend (e-mail küldő szolgáltatás):</strong> a foglalási visszaigazolók küldéséhez
                külső e-mail szolgáltatót veszünk igénybe (Resend Inc., USA), amely az adatokat kizárólag
                az üzenet kézbesítéséhez használja. A harmadik országba történő adattovábbítás az Európai
                Bizottság által jóváhagyott általános szerződési feltételek (SCC) alapján történik.
              </li>
              <li>
                <strong>Vercel Analytics (webes látogatottság-mérés):</strong> weboldalunk látogatottságának
                mérése céljából a Vercel Inc. (San Francisco, USA) sütimentes analitikai megoldását
                alkalmazzuk. Ez az eszköz az oldalmegtekintések számát és az általános forgalmi
                adatokat rögzíti; személyes azonosításra alkalmas adatot (pl. nevet, e-mail-címet)
                nem tárol. Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés f) pontja (jogos érdek:
                a weboldal működésének javítása).
              </li>
              <li>
                <strong>Google Maps (interaktív térkép):</strong> weboldalunkon a helyszín megjelenítéséhez
                Google Maps térképet használunk (Google LLC, Mountain View, USA). A térkép betöltésekor
                a Google az Ön IP-címét és böngészőjére vonatkozó adatokat kezelheti saját
                adatvédelmi szabályzata szerint. A Google adatvédelmi tájékoztatója a{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest-700 underline hover:text-forest-900">
                  policies.google.com/privacy
                </a>{" "}
                oldalon érhető el.
              </li>
              <li>
                <strong>Upstash Redis (visszaélés-védelmi rendszer):</strong> a weboldalon beérkező
                foglalási és kapcsolatfelvételi kérések visszaélésszerű használatának megelőzése
                érdekében a beküldő IP-cím ideiglenesen (legfeljebb 1 óráig) tárolásra kerül az
                Upstash Inc. (USA) Redis-alapú szolgáltatásában. Az adatkezelés jogalapja a GDPR
                6. cikk (1) bekezdés f) pontja (jogos érdek: az informatikai rendszer biztonsága).
                A harmadik országba történő adattovábbítás az Európai Bizottság által jóváhagyott
                általános szerződési feltételek (SCC) alapján történik.
              </li>
              <li>
                <strong>Szallas.hu (online szállásfoglaló platform):</strong> a szálláshely
                foglaltsági naptárát szinkronizáljuk a Szallas.hu platformmal iCal formátumban.
                Az adatcsere kizárólag a foglalt időszakokat tartalmazza (érkezés és távozás
                dátuma), személyes vendégadatot nem továbbít.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">6. Az érintett jogai</h2>
            <p>Önnek joga van:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Hozzáféréshez:</strong> tájékoztatást kérhet a kezelt adatairól</li>
              <li><strong>Helyesbítéshez:</strong> kérheti pontatlan adatai kijavítását</li>
              <li><strong>Törléshez:</strong> kérheti adatai törlését, ha az adatkezelés már nem szükséges</li>
              <li><strong>Az adatkezelés korlátozásához</strong></li>
              <li><strong>Hordozhatósághoz:</strong> kérheti adatait géppel olvasható formátumban</li>
              <li><strong>Tiltakozáshoz:</strong> tiltakozhat az adatkezelés ellen</li>
            </ul>
            <p className="mt-3">
              Jogai gyakorlásához forduljon hozzánk az alábbi elérhetőségeken:
            </p>
            <p>E-mail: milan.kucko117@gmail.com</p>
            <p>Telefon: +36 30 845 4923</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">7. Jogorvoslat</h2>
            <p>
              Ha úgy véli, hogy adatkezelésünk sérti a GDPR rendelkezéseit, panaszt tehet a
              Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH):
            </p>
            <p className="mt-2">Cím: 1055 Budapest, Falk Miksa utca 9–11.</p>
            <p>Telefon: +36 1 391 1400</p>
            <p>Web: naih.hu</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">8. Cookie-k (sütik)</h2>
            <p>
              Weboldalunk kizárólag a működéshez szükséges munkamenet-cookie-kat használ (pl. admin bejelentkezés).
              Hirdető vagy marketing célú cookie-kat nem alkalmazunk.
            </p>
            <p className="mt-3">
              A látogatottságméréshez használt Vercel Analytics sütimentes megoldást alkalmaz – cookie-t
              nem helyez el az Ön eszközén. A Google Maps beágyazott térkép betöltésekor a Google
              saját cookie-kat helyezhet el; ezek kezeléséről a Google adatvédelmi szabályzata rendelkezik.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">9. Adatbiztonság</h2>
            <p>
              Az Ön személyes adatait biztonságos, titkosított kapcsolaton (HTTPS) keresztül kezeljük.
              Az adatok tárolása megbízható, európai adatközpontban üzemelő felhőszolgáltatáson
              (Supabase/PostgreSQL) történik.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-forest-900 mb-3">10. Tájékoztató módosítása</h2>
            <p>
              Fenntartjuk a jogot, hogy jelen tájékoztatót módosítsuk. A változásokról a weboldalon
              értesítjük látogatóinkat. Az aktuális verzió mindig ezen az oldalon érhető el.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-forest-800 transition-colors">
            <ArrowLeft size={15} />
            Vissza a főoldalra
          </Link>
        </div>

      </div>
    </main>
  );
}
