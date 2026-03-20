import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import logoWhite from "@/assets/logo-long-white.png";

const NAV_LINKS = [
  { label: "Features",     href: "#features"     },
  { label: "Download",     href: "/download"      },
  { label: "Pricing",      href: "#pricing"       },
  { label: "Results",      href: "#testimonials"  },
  { label: "FAQ",          href: "#faq"           },
];

/** Fixed navigation bar — transparent at top, glass-blur on scroll. */
export default function Navbar({ topOffset = 0 }: { topOffset?: number }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navigate = useNavigate();
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      role="banner"
      className="fixed inset-x-0 z-40"
      style={{
        top: topOffset,
        background: scrolled ? "rgba(12,12,20,0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      <nav
        aria-label="Main navigation"
        className="container-xl flex items-center justify-between h-16"
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center focus-ring rounded-lg"
          aria-label="Project Trinity — home"
        >
          <img
            src={logoWhite}
            alt="Project Trinity"
            className="h-12 w-auto object-contain"
            draggable={false}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <button
                onClick={() => handleNavClick(href)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150 focus-ring"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" href="#">
            Sign In
          </Button>
          <Button variant="primary" size="sm" href="#pricing">
            Get Started
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition focus-ring"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{mobileOpen ? "Close" : "Menu"}</span>
          <motion.div
            animate={mobileOpen ? "open" : "closed"}
            className="w-5 h-4 flex flex-col justify-between"
          >
            <motion.span
              className="block h-0.5 bg-current rounded-full origin-center"
              variants={{ open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 bg-current rounded-full"
              variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block h-0.5  bg-current rounded-full origin-center"
              variants={{ open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden glass border-t border-white/[0.07]"
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition focus-ring"
                >
                  {label}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Button variant="secondary" size="md" href="#">
                  Sign In
                </Button>
                <Button variant="primary" size="md" href="#pricing">
                  Get Started Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
