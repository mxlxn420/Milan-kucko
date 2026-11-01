import { prisma }        from "@/lib/prisma";

// Statikus, CDN-ről kiszolgált oldal: admin mentéskor revalidatePath frissíti,
// óránként pedig magától is (a lejárt árszezonok miatt).
export const revalidate = 3600;
import HeroSection      from "@/components/sections/HeroSection";
import AboutSection     from "@/components/sections/AboutSection";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import GallerySection   from "@/components/sections/GallerySection";
import PricingSection   from "@/components/sections/PricingSection";
import ReviewsSection   from "@/components/sections/ReviewsSection";
import FaqSection       from "@/components/sections/FaqSection";
import ContactSection   from "@/components/sections/ContactSection";
import { HERO_DEFAULTS, ABOUT_DEFAULTS, AMENITIES_DEFAULTS } from "@/lib/contentDefaults";
import { FAQS }                 from "@/lib/faqs";
import { pageMetadata, jsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title:       "Milán Kuckó | Prémium pihenés Miskolctapolcán",
  description: "Romantikus vendégház privát jacuzzival és kandallóval Miskolctapolcán. Foglaljon közvetlenül – nincsenek extra díjak!",
  path:        "/",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type":        "Question",
    name:           q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default async function HomePage() {
  const [heroRow, aboutRow, amenitiesRow, galleryRow] = await Promise.all([
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
    prisma.amenitiesContent.findUnique({ where: { id: "singleton" } }),
    prisma.galleryContent.findUnique({ where: { id: "singleton" } }),
  ]);

  const heroData = {
    subtitle:      heroRow?.subtitle      ?? HERO_DEFAULTS.subtitle,
    titleBefore:   heroRow?.titleBefore   ?? HERO_DEFAULTS.titleBefore,
    titleEmphasis: heroRow?.titleEmphasis ?? HERO_DEFAULTS.titleEmphasis,
    titleAfter:    heroRow?.titleAfter    ?? HERO_DEFAULTS.titleAfter,
    description:   heroRow?.description   ?? HERO_DEFAULTS.description,
    highlights:    (heroRow?.highlights   ?? HERO_DEFAULTS.highlights) as { icon: string; label: string }[],
    slides:        (heroRow?.slides       ?? HERO_DEFAULTS.slides)     as { src: string; alt: string }[],
  };

  const aboutData = {
    heading1:     aboutRow?.heading1     ?? ABOUT_DEFAULTS.heading1,
    heading2:     aboutRow?.heading2     ?? ABOUT_DEFAULTS.heading2,
    description1: aboutRow?.description1 ?? ABOUT_DEFAULTS.description1,
    description2: aboutRow?.description2 ?? ABOUT_DEFAULTS.description2,
    mainImage:    (aboutRow?.mainImage   ?? ABOUT_DEFAULTS.mainImage)  as { src: string; alt: string },
    floatImage:   (aboutRow?.floatImage  ?? ABOUT_DEFAULTS.floatImage) as { src: string; alt: string },
    values:       (aboutRow?.values      ?? ABOUT_DEFAULTS.values)     as { icon: string; title: string; text: string }[],
    nearby:       (aboutRow?.nearby      ?? ABOUT_DEFAULTS.nearby)     as string[],
  };

  const amenitiesData = {
    subtitle:    amenitiesRow?.subtitle    ?? AMENITIES_DEFAULTS.subtitle,
    heading:     amenitiesRow?.heading     ?? AMENITIES_DEFAULTS.heading,
    description: amenitiesRow?.description ?? AMENITIES_DEFAULTS.description,
    items:       (amenitiesRow?.items      ?? AMENITIES_DEFAULTS.items) as { icon: string; label: string; desc: string }[],
  };

  const galleryFeatured = (galleryRow?.featured ?? null) as { src: string; alt: string }[] | null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />
      <HeroSection data={heroData} />
      <AboutSection data={aboutData} />
      <AmenitiesSection data={amenitiesData} />
      <GallerySection featured={galleryFeatured ?? undefined} />
      <PricingSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
