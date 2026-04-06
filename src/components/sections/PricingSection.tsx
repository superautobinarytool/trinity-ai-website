import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";

/* ── SVG gem icons ── */
function BlueDiamond() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="bd-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="bd-bot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>
      <polygon points="24,4 42,18 24,44 6,18" fill="url(#bd-bot)" />
      <polygon points="24,4 42,18 24,20 6,18" fill="url(#bd-top)" opacity="0.9" />
      <polygon points="24,4 6,18 24,20" fill="white" opacity="0.25" />
    </svg>
  );
}
function PurpleCrystal() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="pc-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="pc-bot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <polygon points="24,2 44,16 38,44 10,44 4,16" fill="url(#pc-bot)" />
      <polygon points="24,2 44,16 24,19 4,16" fill="url(#pc-top)" opacity="0.9" />
      <polygon points="24,2 4,16 24,19" fill="white" opacity="0.3" />
      {/* sparkle */}
      <circle cx="34" cy="10" r="2.5" fill="white" opacity="0.7" />
      <circle cx="38" cy="7" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

/* ── Green check ── */
function GreenCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#16a34a" />
      <path stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M6.5 10.5l2.5 2.5 4.5-5" />
    </svg>
  );
}
/* ── Gift icon (no emoji) ── */
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
/* ─────────────────────────────────────────────────────────────────────────────
   Plan catalogue — monthly prices + annual deal data
   ───────────────────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    popBadge: "Most Accessible",
    popular: false,
    gem: <BlueDiamond />,
    light: false,
    featuresLabel: "Everything included:",
    features: [
      "Trinity AI Trading Tool license (Windows 10/11)",
      "AI signal auto-execution — up to 70% verified accuracy",
      "25+ live trading pairs — real-time OTC & Forex market access",
      "Smart Compounding profit strategy",
      "Real-time profit tracking & intelligent money management suite",
      "Standard signal refresh & processing speed",
    ],
    monthly: {
      price: 99,
      sub: "Billed monthly  ·  Cancel anytime",
      cta: "Get Started Now",
      href: "/checkout?plan=starter",
    },
    annual: {
      totalPrice: 599,
      moEquivInt: 49,
      moEquivCents: ".92",
      normalMonthly: 99,
      savedTotal: 589,
      savePct: 50,
      monthsFree: 6,
      sub: "Just $599 billed once annually  ·  Cancel anytime",
      cta: "Get Started — Best Value",
      href: "/checkout?plan=starter-annual",
    },
  },
  {
    id: "ultimate",
    name: "Pro",
    popBadge: "Best Results",
    popular: true,
    gem: <PurpleCrystal />,
    light: true,
    featuresLabel: "Everything in Starter, plus:",
    features: [
      "60+ trading pairs with exclusive OTC market coverage",
      "80%+ verified AI signal accuracy — highest in any plan",
      "Priority signal feed — 1.8× faster execution speed",
      "Advanced AI compound scaling engine",
      "Dedicated 1-on-1 onboarding & live setup call",
      "Early access to all new features & beta releases",
      "Full OTC chart suite — trade after-hours markets unavailable elsewhere",
    ],
    monthly: {
      price: 199,
      sub: "Billed monthly  ·  Cancel anytime",
      cta: "Activate Pro Access",
      href: "/checkout?plan=pro",
    },
    annual: {
      totalPrice: 899,
      moEquivInt: 74,
      moEquivCents: ".92",
      normalMonthly: 199,
      savedTotal: 1489,
      savePct: 62,
      monthsFree: 7,
      sub: "Just $899 billed once annually  ·  Cancel anytime",
      cta: "Activate Pro — Best Value",
      href: "/checkout?plan=pro-annual",
    },
  },
];

export default function PricingSection() {
  const ref            = useRef<HTMLDivElement>(null);
  const inView         = useInView(ref, { once: true, amount: 0.1 });
  const [billAnnually, setBillAnnually] = useState(true);

  return (
    <Section id="pricing" className="bg-[#080d1a]">
      <div ref={ref} className="max-w-5xl mx-auto px-4">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
            One tool.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#22c55e,#16a34a)" }}>
              Unlimited upside.
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-400 text-base sm:text-lg font-light max-w-xl mx-auto">
            10 trades at 80% win rate with a $100 stake returns <strong className="text-white">$440 net profit</strong>. Add compounding and every session grows larger than the last. Trinity pays for itself in the first hour.
          </p>
        </motion.div>

        {/* ── Billing period toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-10 sm:mb-12"
        >
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]"
          >
            <button
              onClick={() => setBillAnnually(false)}
              aria-pressed={!billAnnually}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                !billAnnually
                  ? "bg-white/[0.11] text-white border border-white/[0.15] shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillAnnually(true)}
              aria-pressed={billAnnually}
              className={`flex items-center gap-2.5 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/30 ${
                billAnnually
                  ? "bg-[#22C55E]/[0.13] text-[#22C55E] border border-[#22C55E]/[0.22]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Annual
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide transition-all duration-200 ${
                billAnnually ? "bg-[#22C55E] text-white" : "bg-white/[0.08] text-gray-500"
              }`}>
                SAVE UP TO 62%
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => {
            const mo  = plan.monthly;
            const ann = plan.annual;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-2xl overflow-hidden flex flex-col p-5 sm:p-8 ${
                  plan.light
                    ? "bg-white text-gray-900 shadow-[0_8px_60px_rgba(139,92,246,0.25)]"
                    : "bg-[#0c1327] border border-white/[0.09] shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-white"
                }`}
              >
                {/* Gem icon */}
                <div className="absolute top-5 right-5 w-14 h-14">{plan.gem}</div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    plan.light ? "border-gray-300 text-gray-700 bg-gray-100" : "border-white/20 text-gray-300 bg-white/5"
                  }`}>
                    {plan.popBadge}
                  </span>
                  {plan.popular && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                      Popular
                    </span>
                  )}
                  {billAnnually && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-[#22C55E] text-white tracking-wide">
                      <GiftIcon className="w-3 h-3" />
                      {ann.monthsFree} MONTHS FREE
                    </span>
                  )}
                </div>

                {/* Plan name */}
                <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${plan.light ? "text-gray-500" : "text-gray-400"}`}>
                  {plan.name}
                </p>

                {/* Strikethrough — annual mode only */}
                {billAnnually && (
                  <p className={`text-sm line-through mb-1 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>
                    ${ann.normalMonthly}/mo if billed monthly
                  </p>
                )}

                {/* Main price */}
                <div className="flex items-start gap-0.5 mb-1">
                  <span className={`text-xl font-bold mt-2 ${plan.light ? "text-gray-800" : "text-white"}`}>$</span>
                  <span className={`font-display text-6xl font-extrabold leading-none tracking-tightest ${
                    plan.light ? "text-gray-900" : "text-white"
                  }`}>
                    {billAnnually ? ann.moEquivInt : mo.price}
                  </span>
                  <div className="flex flex-col justify-end pb-1">
                    {billAnnually && (
                      <span className={`text-2xl font-bold ${plan.light ? "text-gray-800" : "text-white"}`}>
                        {ann.moEquivCents}
                      </span>
                    )}
                    <span className={`text-sm font-semibold ${plan.light ? "text-gray-500" : "text-gray-400"}`}>
                      / mo
                    </span>
                  </div>
                </div>

                {/* Sub text */}
                <p className={`text-xs mb-4 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>
                  {billAnnually ? ann.sub : mo.sub}
                </p>

                {/* Annual savings callout */}
                {billAnnually && (
                  <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl mb-6 ${
                    plan.light
                      ? "bg-green-50 border border-green-200"
                      : "bg-[#22C55E]/[0.08] border border-[#22C55E]/20"
                  }`}>
                    <span className={`text-sm font-black whitespace-nowrap ${
                      plan.light ? "text-green-700" : "text-[#22C55E]"
                    }`}>
                      {ann.savePct}% OFF
                    </span>
                    <span className={`text-xs leading-snug ${plan.light ? "text-green-700" : "text-[#22C55E]/80"}`}>
                      You save ${ann.savedTotal.toLocaleString()} compared to monthly billing
                    </span>
                  </div>
                )}

                {/* Features */}
                <p className={`text-sm font-bold mb-4 ${plan.light ? "text-gray-700" : "text-gray-300"}`}>
                  {plan.featuresLabel}
                </p>
                <ul className="flex flex-col gap-3 flex-1 mb-8" role="list">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <GreenCheck />
                      <span className={`text-sm ${plan.light ? "text-gray-700" : "text-gray-300"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={billAnnually ? ann.href : mo.href}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    plan.light
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {billAnnually ? ann.cta : mo.cta} &rarr;
                </a>
                <p className={`text-xs text-center mt-3 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>
                  30-day money-back guarantee
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
