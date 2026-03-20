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
    tag:     "AI Signal Precision",
    title:   "One signal. Fired in 47 milliseconds.",
    desc:    "The moment Trinity's AI locks onto a high-probability setup, the trade executes on your broker — before hesitation can cost you the window. No manual entry. No second-guessing. Pure machine precision at inhuman speed.",
    points:  ["Proprietary AI signal engine — 25+ assets", "Sub-50ms execution directly to your broker", "Zero emotional interference, ever", "Runs 24/7 without you watching"],
  },
  {
    Icon:    LayoutDashboardIcon,
    color:   "from-[#16A34A] to-[#15803D]",
    glow:    "purple" as const,
    badge:   "purple" as const,
    tag:     "Verified Accuracy",
    title:   "80%+ signal accuracy. Every trade, tracked live.",
    desc:    "Trinity's live performance dashboard plots every trade the moment it closes — cumulative P&L, win rate, and session trend updating in real time. You never guess. You always know exactly where you stand.",
    points:  ["Live session profit graph", "Real-time win/loss tracking", "Per-trade result logged instantly", "Full trade history, one click away"],
  },
  {
    Icon:    AnalyticsIcon,
    color:   "from-emerald-400 to-teal-400",
    glow:    "cyan" as const,
    badge:   "green" as const,
    tag:     "Compounding Engine",
    title:   "Small stakes. Exponential returns.",
    desc:    "Trinity's compounding engine automatically reinvests each winning trade into a larger next trade — turning consistent AI accuracy into exponential account growth. One winning session doesn't just profit. It multiplies. Switch modes instantly. Trinity saves your config.",
    points:  ["Compounding: reinvest wins exponentially", "Auto-scales stake with every victory", "Precision flat mode for steady consistent flow", "One-click switch — config saved automatically"],
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
