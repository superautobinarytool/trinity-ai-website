import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import LogoBar from "@/components/sections/LogoBar";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

/**
 * Home page — assembles all sections in logical marketing funnel order.
 *
 * Page hierarchy:
 * 1. AnnouncementBar  — countdown + offer (fixed, 36px)
 * 2. Navbar           — glass-blur nav (fixed, top: 36px)
 * 3. HeroSection      — headline, dashboard mock, stats
 * 4. LogoBar          — scrolling platform compatibility ticker
 * 5. FeaturesSection  — 3 feature pillars (signals, automation, analytics)
 * 6. ProductShowcase  — deep-dive alternating product sections
 * 7. TestimonialsSection — masonry review cards
 * 8. PricingSection   — monthly/yearly toggle, Pro & Pro+ cards
 * 9. FAQSection       — animated accordion
 * 10. CTASection      — final conversion push
 * 11. Footer          — links, legal, socials
 */
export default function Home() {
  return (
    <>
      {/* Fixed overlays */}
      <AnnouncementBar />
      <Navbar />

      {/* Page content */}
      <main id="main-content">
        <HeroSection />
        <LogoBar />
        <FeaturesSection />
        <ProductShowcase />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
