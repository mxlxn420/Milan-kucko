import HeroSection      from "@/components/sections/HeroSection";
import AboutSection     from "@/components/sections/AboutSection";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import GallerySection   from "@/components/sections/GallerySection";
import PricingSection   from "@/components/sections/PricingSection";
import FaqSection       from "@/components/sections/FaqSection";
import ContactSection   from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AmenitiesSection />
      <GallerySection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}