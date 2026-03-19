import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Section from "@/components/ui/Section";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { BoltFilledIcon, LayoutDashboardIcon, AnalyticsIcon, CheckIcon } from "@/components/ui/Icons";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const FEATURES = [
  {
    Icon:    BoltFilledIcon,
    color:   "from-[#22C55E] to-[#16A34A]",
    glow:    "cyan" as const,
    badge:   "cyan" as const,
    tag:     "Auto Execution",
    title:   "Press START. Trinity fires.",
    desc:    "The moment Trinity AI generates a signal, Trinity clicks the trade on your broker — faster than any human ever could. No manual entry. No hesitation. No missed windows.",
    points:  ["Direct Trinity AI-to-broker connection", "Sub-50ms trade execution", "Zero emotional interference", "Works 24/7 without you watching"],
  },
  {
    Icon:    LayoutDashboardIcon,
    color:   "from-[#16A34A] to-[#15803D]",
    glow:    "purple" as const,
    badge:   "purple" as const,
    tag:     "Live Performance",
    title:   "80%+ win rate. Plotted live.",
    desc:    "Trinity's built-in real-time profit graph tracks every trade as it happens — cumulative P&L, win rate, and performance trend updating in real time. No spreadsheets. Just a rising curve.",
    points:  ["Live session P&L graph", "Real-time win/loss counter", "Per-trade result logged instantly", "Full trade history one click away"],
  },
  {
    Icon:    AnalyticsIcon,
    color:   "from-emerald-400 to-teal-400",
    glow:    "cyan" as const,
    badge:   "green" as const,
    tag:     "Money Strategies",
    title:   "Three strategies. One weapon.",
    desc:    "Linear keeps it safe. Compounding multiplies your wins exponentially. Martingale recovers losses and flips them into profit. Switch instantly. Save your config. Trinity remembers everything.",
    points:  ["Linear: flat disciplined staking", "Compounding: reinvest wins exponentially", "Martingale: turn losing streaks into wins", "Switch strategies with one click"],
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.15 });

  return (
    <Section id="features" className="bg-[#050508]" grid>
      <section ref={ref} aria-label="Platform features">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto"
        >
          <Badge variant="cyan" className="mb-4">
            Why 90% of traders fail — and how Trinity stops it
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4 sm:mb-5 leading-[1.1]">
            You&apos;re not losing because of bad luck.
            <br />
            <span className="gradient-text">You&apos;re losing because you&apos;re human.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-7 sm:leading-8 font-light">
            Emotion clouds judgement. Hesitation costs windows. Inconsistency kills edge.
            These are the three killers of every manual trader — and Trinity was engineered
            to remove all three, permanently.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {FEATURES.map(({ Icon, color, glow, badge, tag, title, desc, points }) => (
            <motion.div key={title} variants={cardV}>
              <GlowCard glowColor={glow} className="h-full p-5 sm:p-7 flex flex-col gap-4 sm:gap-5">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <Badge variant={badge} dot={false} className="mb-3 text-[11px]">
                    {tag}
                  </Badge>
                  <h3 className="font-display text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>

                <ul className="mt-auto space-y-2" role="list">
                  {points.map(pt => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckIcon className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </Section>
  );
}
