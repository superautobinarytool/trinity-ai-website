import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoWhite from "@/assets/logo-white.png";
import { XMarkIcon } from "@/components/ui/Icons";

/* ── Link type ──────────────────────────────────────────────────────────── */
type FooterLink = { label: string } & (
  | { href: string; onClick?: undefined }
  | { onClick: () => void; href?: undefined }
);

const PRODUCT_LINKS: FooterLink[] = [
  { label: "Features",   href: "#features" },
  { label: "Products",   href: "#products" },
  { label: "Pricing",    href: "#pricing"  },
  { label: "Dashboard",  href: "#"         },
  { label: "AI Signals", href: "#"         },
];

const COMMUNITY_LINKS: FooterLink[] = [
  { label: "Community",  href: "https://t.me/trinitytradingai"  },
  { label: "Support",    href: "https://t.me/tti_mark_support"  },
];

const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/trinitytradingai",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@titansalgo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/titansalgo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/titansalgo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        {title}
      </h3>
      <ul className="space-y-3" role="list">
        {links.map(({ label, href, onClick }) => (
          <li key={label}>
            {onClick ? (
              <button
                type="button"
                onClick={onClick}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150 text-left"
              >
                {label}
              </button>
            ) : href?.startsWith("http") || href?.startsWith("#") ? (
              <a
                href={href}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            ) : (
              <Link
                to={href ?? "/"}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Disclaimer Modal ────────────────────────────────────────────────────── */
function DisclaimerModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.10] bg-[#0c0c14]"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
            <h2
              id="disclaimer-title"
              className="font-display font-bold text-white text-base sm:text-lg"
            >
              Trading Risk Disclaimer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close disclaimer"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all duration-150 flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 space-y-4 text-sm text-gray-400 leading-relaxed">
          <p className="text-gray-300">
            <strong className="text-white font-semibold">
              Please read this disclaimer carefully before using Trinity Trading AI.
            </strong>
          </p>

          {[
            {
              title: "Not Financial Advice",
              body: "All information, signals, analysis, and content provided by Trinity Trading AI are for educational and informational purposes only. Nothing on this platform constitutes financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the platform's content as such.",
            },
            {
              title: "Risk of Loss",
              body: "Trading financial instruments — including forex, CFDs, commodities, indices, and cryptocurrencies — involves a significant risk of loss and is not suitable for all investors. Carefully consider whether trading is appropriate for you in light of your financial circumstances, investment objectives, risk appetite, and level of experience.",
            },
            {
              title: "Past Performance",
              body: "Past performance of Trinity's AI signals and any historical trading results shown on this website are not indicative of future results. Markets are inherently unpredictable. Any stated accuracy rates represent historical averages and do not guarantee future outcomes.",
            },
            {
              title: "Automated Trading Risks",
              body: "Automated trading systems carry unique risks, including software failures, connectivity issues, and unanticipated market conditions. Trinity provides a tool to assist traders — it does not operate your account autonomously. You remain fully responsible for all trading decisions and resulting outcomes.",
            },
            {
              title: "Capital at Risk",
              body: "Never trade with money you cannot afford to lose in its entirety. Leveraged products can result in losses exceeding your initial deposit.",
            },
            {
              title: "Regulatory Notice",
              body: "Trinity Trading AI is a software tool provider. It is not a licensed financial adviser, broker, or investment firm. Ensure you comply with all applicable laws and regulations in your jurisdiction before trading.",
            },
          ].map(({ title, body }) => (
            <section key={title}>
              <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
              <p>{body}</p>
            </section>
          ))}

          <div className="pt-3 border-t border-white/[0.07]">
            <p className="text-xs text-gray-600">
              By using Trinity Trading AI you acknowledge that you have read, understood, and
              agreed to this disclaimer. Questions?{" "}
              <a
                href="https://t.me/tti_mark_support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors"
              >
                Contact us on Telegram
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-white/[0.07] flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/[0.07] border border-white/[0.10] hover:bg-white/[0.12] hover:border-white/[0.20] transition-all duration-150"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const LEGAL_LINKS: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use",   href: "/terms-of-use"   },
    { label: "Refund Policy",  href: "/refund-policy"  },
    { label: "Disclaimer",     onClick: () => setDisclaimerOpen(true) },
  ];

  return (
    <footer role="contentinfo" className="relative bg-[#050508] border-t border-white/[0.07]">
      {/* Top gradient separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/30 to-transparent" aria-hidden="true" />

      <div className="container-xl py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a href="/" className="flex items-center mb-6 w-fit" aria-label="Project Trinity home">
              <img
                src={logoWhite}
                alt="Project Trinity"
                className="h-14 w-auto object-contain"
                draggable={false}
              />
            </a>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              Institutional-grade trading signals and AI-powered automation for serious traders
              seeking consistent edge.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2" role="list" aria-label="Social media links">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <FooterColumn title="Product"   links={PRODUCT_LINKS}   />

          {/* Community */}
          <FooterColumn title="Community" links={COMMUNITY_LINKS} />

          {/* Legal — full width on mobile so all 4 links display cleanly */}
          <FooterColumn
            title="Legal"
            links={LEGAL_LINKS}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 sm:pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 text-center sm:text-left">
            © 2026 Project Trinity. All rights reserved. Trading involves risk — only trade with
            capital you can afford to lose.
          </p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {["VISA", "MC", "AMEX", "PayPal"].map(m => (
              <span
                key={m}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/[0.07] text-[10px] text-gray-500 font-mono"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer modal */}
      <AnimatePresence>
        {disclaimerOpen && (
          <DisclaimerModal onClose={() => setDisclaimerOpen(false)} />
        )}
      </AnimatePresence>
    </footer>
  );
}
