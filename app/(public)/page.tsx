import { prisma }        from "@/lib/prisma";
import HeroSection      from "@/components/sections/HeroSection";
import AboutSection     from "@/components/sections/AboutSection";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import GallerySection   from "@/components/sections/GallerySection";
import PricingSection   from "@/components/sections/PricingSection";
import ReviewsSection   from "@/components/sections/ReviewsSection";
import FaqSection       from "@/components/sections/FaqSection";
import ContactSection   from "@/components/sections/ContactSection";

const DEFAULT_SLIDES = [
  { src: "/images/haz/IMG_8519 kicsi.jpg",    alt: "Milán Kuckó – vendégház kívülről" },
  { src: "/images/jacuzzi/jacuzzikivilag.jpg", alt: "Privát jacuzzi"                  },
  { src: "/images/kert/kert.jpg",              alt: "Hatalmas privát kert"             },
] as { src: string; alt: string }[];

const HERO_DEFAULTS = {
  subtitle:      "Bencések útja 117/A, Miskolctapolca",
  titleBefore:   "A tökéletes ",
  titleEmphasis: "kikapcsolódás",
  titleAfter:    "csak rád vár.",
  description:   `Romantikus vendégház hatalmas kerttel és privát jacuzzival, Miskolctapolca csendes zsákutcájában. Csak ti vagytok az egész \u201Ebirtokon.\u201D`,
  highlights:    [{ icon: "Waves", label: "Privát jacuzzi" }, { icon: "Home", label: "Csak ti vagytok" }] as { icon: string; label: string }[],
  slides:        DEFAULT_SLIDES,
};

export default async function HomePage() {
  const row = await prisma.heroContent.findUnique({ where: { id: "singleton" } });

  const heroData = {
    subtitle:      row?.subtitle      ?? HERO_DEFAULTS.subtitle,
    titleBefore:   row?.titleBefore   ?? HERO_DEFAULTS.titleBefore,
    titleEmphasis: row?.titleEmphasis ?? HERO_DEFAULTS.titleEmphasis,
    titleAfter:    row?.titleAfter    ?? HERO_DEFAULTS.titleAfter,
    description:   row?.description   ?? HERO_DEFAULTS.description,
    highlights:    (row?.highlights   ?? HERO_DEFAULTS.highlights) as { icon: string; label: string }[],
    slides:        (row?.slides       ?? HERO_DEFAULTS.slides)     as { src: string; alt: string }[],
  };

  return (
    <>
      <HeroSection data={heroData} />
      <AboutSection />
      <AmenitiesSection />
      <GallerySection />
      <PricingSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
