import { useCallback, useState } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import LogoBar from "@/components/sections/LogoBar";
import FeaturesSection from "@/components/sections/FeaturesSection";
import VideoDemoSection from "@/components/sections/VideoDemoSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import SocialProofToast from "@/components/ui/SocialProofToast";
import DiscountPopup from "@/components/ui/DiscountPopup";

/**
 * Home page — assembles all sections in logical marketing funnel order.
 *
 * Page hierarchy:
 * 1. AnnouncementBar  — countdown + offer (fixed, 36px)
 * 2. Navbar           — glass-blur nav (fixed, top: 36px)
 * 3. HeroSection      — headline, dashboard mock, stats
 * 4. LogoBar          — scrolling platform compatibility ticker
 * 5. FeaturesSection  — 3 feature pillars (signals, automation, analytics)
 * 6. VideoTestimonialsSection — 9:16 portrait video testimonials (blur-side focus)
 * 7. VideoDemoSection — horizontal video demo slider (4 platform sessions)
 * 8. ProductShowcase  — deep-dive alternating product sections
 * 9. TestimonialsSection — masonry review cards
 * 10. PricingSection  — monthly/yearly toggle, Starter & Pro cards
 * 11. FAQSection      — animated accordion
 * 12. CTASection      — final conversion push
 * 13. Footer          — links, legal, socials
 */
export default function Home() {
  const [barHeight, setBarHeight] = useState(0);
  const onBarHeight = useCallback((h: number) => setBarHeight(h), []);

  return (
    <>
      <AnnouncementBar onHeightChange={onBarHeight} />
      <Navbar topOffset={barHeight} />

      <main id="main-content">
        {/* barHeight = announcement bar, +64 = navbar h-16, +48 = breathing room */}
        <HeroSection headerHeight={barHeight + 64} />
        <LogoBar />
        <FeaturesSection />
        <VideoTestimonialsSection />
        <VideoDemoSection />
        <ProductShowcase />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />

      {/* Fixed overlays — rendered outside main flow */}
      <SocialProofToast />
      <DiscountPopup />
    </>
  );
}
