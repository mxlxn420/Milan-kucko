import type { Metadata } from "next";

export const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://milankucko.hu";
export const SITE_NAME = "Milán Kuckó";
export const OG_IMAGE  = { url: "/og-image.jpg", width: 1200, height: 630, alt: "Milán Kuckó – vendégház privát jacuzzival Miskolctapolcán" };

// Oldalanként saját canonical + OG/Twitter adatok.
// A Next a metadata objektumokat sekélyen olvasztja össze, ezért az openGraph-ot teljesen meg kell adni.
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  return {
    title:       path === "/" ? { absolute: title } : title,
    description,
    alternates:  { canonical: path },
    openGraph: {
      type:     "website",
      locale:   "hu_HU",
      url:      path,
      siteName: SITE_NAME,
      title:    fullTitle,
      description,
      images:   [OG_IMAGE],
    },
    twitter: {
      card:   "summary_large_image",
      title:  fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

// JSON-LD biztonságos beágyazása (a "<" escapelése az XSS ellen)
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
