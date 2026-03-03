import { useRef } from "react";
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

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    badge: "20% Off",
    popular: false,
    originalPrice: "$67",
    price: "$54",
    cents: ".39",
    period: "/ mo",
    sub: "$54.39 once, then $67.99 / mo",
    gem: <BlueDiamond />,
    cta: "Subscribe",
    ctaHref: "https://discord.gg/titansalgo",
    featuresLabel: "All Pro features:",
    features: [
      "Live AI signals (stocks, crypto, forex)",
      "Real-time Discord alerts",
      "Weekly market analysis",
      "Strategy builder access",
      "Basic back-testing tools",
      "Community support",
    ],
    light: false,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    badge: "30% Off",
    popular: true,
    originalPrice: "$97",
    price: "$67",
    cents: ".99",
    period: "/ mo",
    sub: "$67.99 once, then $97.99 / mo",
    gem: <PurpleCrystal />,
    cta: "Subscribe",
    ctaHref: "https://discord.gg/titansalgo",
    featuresLabel: "Everything in Pro, plus:",
    features: [
      "Priority high-conviction signals",
      "AI portfolio optimizer",
      "1-on-1 onboarding call",
      "Advanced back-testing suite",
      "Exclusive quant strategies",
      "Early access to new tools",
    ],
    light: true,
  },
];

export default function PricingSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="pricing" className="bg-[#080d1a]">
      <div ref={ref} className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white">
            Simple,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#22c55e,#16a34a)" }}>
              transparent pricing
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg sm:text-xl font-light">No hidden fees. Cancel anytime.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl overflow-hidden flex flex-col p-8 ${
                plan.light
                  ? "bg-white text-gray-900 shadow-[0_8px_60px_rgba(139,92,246,0.25)]"
                  : "bg-[#0c1327] border border-white/[0.09] shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-white"
              }`}
            >
              {/* Gem icon – top right */}
              <div className="absolute top-5 right-5 w-14 h-14">
                {plan.gem}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${plan.light ? "border-gray-300 text-gray-700 bg-gray-100" : "border-white/20 text-gray-300 bg-white/5"}`}>
                  {plan.badge}
                </span>
                {plan.popular && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    Popular
                  </span>
                )}
              </div>

              {/* Plan name */}
              <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${plan.light ? "text-gray-500" : "text-gray-400"}`}>{plan.name}</p>

              {/* Strikethrough original */}
              <p className={`text-sm line-through mb-1 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>{plan.originalPrice}.99 / mo</p>

              {/* Main price */}
              <div className="flex items-start gap-0.5 mb-1">
                <span className={`text-xl font-bold mt-2 ${plan.light ? "text-gray-800" : "text-white"}`}>$</span>
                <span className={`font-display text-6xl font-extrabold leading-none tracking-tightest ${plan.light ? "text-gray-900" : "text-white"}`}>{plan.price.replace("$", "")}</span>
                <div className="flex flex-col justify-end pb-1">
                  <span className={`text-2xl font-bold ${plan.light ? "text-gray-800" : "text-white"}`}>{plan.cents}</span>
                  <span className={`text-sm font-semibold ${plan.light ? "text-gray-500" : "text-gray-400"}`}>{plan.period}</span>
                </div>
              </div>
              <p className={`text-xs mb-7 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>{plan.sub}</p>

              {/* Features */}
              <p className={`text-sm font-bold mb-4 ${plan.light ? "text-gray-700" : "text-gray-300"}`}>{plan.featuresLabel}</p>
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <GreenCheck />
                    <span className={`text-sm ${plan.light ? "text-gray-700" : "text-gray-300"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.light
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {plan.cta} &rarr;
              </a>
              <p className={`text-xs text-center mt-3 ${plan.light ? "text-gray-400" : "text-gray-500"}`}>30-day money-back guarantee</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
