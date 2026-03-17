import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "Milán Kuckó | Prémium pihenés Miskolctapolcán",
    template: "%s | Milán Kuckó",
  },
  description:
    "Romantikus nyaraló privát dézsafürdővel és szaunával Miskolctapolcán. Foglaljon közvetlenül – nincsenek extra díjak!",
  keywords: ["milán kuckó", "miskolctapolca szállás", "dézsafürdő", "szauna", "nyaraló"],
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "https://milankucko.hu",
    siteName: "Milán Kuckó",
    title: "Milán Kuckó | Prémium pihenés Miskolctapolcán",
    description: "Romantikus nyaraló privát dézsafürdővel és szaunával Miskolctapolcán.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a3a2a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${playfair.variable} ${jost.variable}`}>
      <body className="font-sans bg-cream text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}