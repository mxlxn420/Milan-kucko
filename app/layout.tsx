import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import ViewportFix from "@/components/ui/ViewportFix";
import MotionProvider from "@/components/ui/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, OG_IMAGE, jsonLd } from "@/lib/seo";
import { HERO_DEFAULTS } from "@/lib/contentDefaults";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "Milán Kuckó | Prémium pihenés Miskolctapolcán",
    template: "%s | Milán Kuckó",
  },
  description:
    "Romantikus vendégház privát jacuzzival és kandallóval Miskolctapolcán. Foglaljon közvetlenül – nincsenek extra díjak!",
  applicationName: SITE_NAME,
  keywords: [
    "milán kuckó",
    "miskolctapolca szállás",
    "jacuzzi szállás",
    "romantikus vendégház miskolc",
    "privát jacuzzi szállás",
    "vendégház miskolctapolca",
    "hétvégi pihenés borsod",
    "kandalló szállás",
  ],
  openGraph: {
    type:        "website",
    locale:      "hu_HU",
    siteName:    SITE_NAME,
    title:       "Milán Kuckó | Prémium pihenés Miskolctapolcán",
    description: "Romantikus vendégház privát jacuzzival Miskolctapolcán.",
    images:      [OG_IMAGE],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Milán Kuckó | Prémium pihenés Miskolctapolcán",
    description: "Romantikus vendégház privát jacuzzival Miskolctapolcán.",
    images:      [OG_IMAGE.url],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

const lodgingJsonLd = {
  "@context":  "https://schema.org",
  "@type":     "LodgingBusiness",
  "@id":       `${SITE_URL}/#lodging`,
  name:        SITE_NAME,
  description: "Romantikus vendégház privát jacuzzival, kandallóval és hatalmas kerttel Miskolctapolca csendes zsákutcájában, maximum 2+2 fő részére. Az egész ház kizárólag a vendégeké.",
  url:         SITE_URL,
  image: [
    `${SITE_URL}${OG_IMAGE.url}`,
    ...HERO_DEFAULTS.slides.map((s) => s.src),
  ],
  telephone:   "+36 30 845 4923",
  email:       "milan.kucko117@gmail.com",
  address: {
    "@type":         "PostalAddress",
    streetAddress:   "Bencések útja 117/A",
    addressLocality: "Miskolctapolca",
    addressRegion:   "Borsod-Abaúj-Zemplén",
    postalCode:      "3519",
    addressCountry:  "HU",
  },
  geo: {
    "@type":    "GeoCoordinates",
    latitude:   48.0731645,
    longitude:  20.7470249,
  },
  hasMap:       "https://www.google.com/maps?q=48.0731645,20.7470249",
  priceRange:   "$$",
  currenciesAccepted: "HUF",
  checkinTime:  "15:00",
  checkoutTime: "11:00",
  petsAllowed:  false,
  numberOfRooms: 1,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Privát jacuzzi",   value: true },
    { "@type": "LocationFeatureSpecification", name: "Kandalló",         value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi",            value: true },
    { "@type": "LocationFeatureSpecification", name: "Klíma",            value: true },
    { "@type": "LocationFeatureSpecification", name: "Ingyenes parkoló", value: true },
    { "@type": "LocationFeatureSpecification", name: "Privát kert",      value: true },
    { "@type": "LocationFeatureSpecification", name: "Felszerelt konyha", value: true },
  ],
  containsPlace: {
    "@type":       "Accommodation",
    name:          "Milán Kuckó vendégház",
    occupancy:     { "@type": "QuantitativeValue", maxValue: 4 },
    petsAllowed:   false,
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=100070831690258",
  ],
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#1a3a2a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${playfair.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(lodgingJsonLd)}
        />
      </head>
      <body className="font-sans bg-cream text-stone-800 antialiased">
        <ViewportFix />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}