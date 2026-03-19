import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Section from "@/components/ui/Section";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  CheckCircleFilledIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

const up: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const PRODUCTS = [
  {
    category: "Auto-Execution",
    title: "The trade window is 3 seconds. Trinity fires in 47ms.",
    description:
      "Every binary options trade has a tiny execution window. If you click a second late, you lose the edge. Trinity AI generates the signal and executes on your broker in under 50 milliseconds — at machine speed, every single time. You will never miss a window again. Not one.",
    cta: "See How It Works",
    href: "#pricing",
    accent: "#22c55e",
    visual: (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
        {/* Mock chart terminal */}
        <div className="w-full rounded-xl border border-green-500/20 bg-[#060e08] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs font-mono text-green-400/70">AI Signal Engine · LIVE</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="p-4 flex items-end gap-1 h-28">
            {[35,52,41,67,55,72,61,80,68,88,74,93,79,95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i >= 10 ? "linear-gradient(to top,#22c55e,#4ade80)" : "rgba(34,197,94,0.2)", minHeight: 4 }} />
            ))}
          </div>
          <div className="px-4 py-3 flex flex-col gap-1.5 border-t border-green-500/10">
            {[
              { sym: "AAPL", act: "BUY", pct: "+4.2%" , col: "#10b981" },
              { sym: "BTC",  act: "BUY", pct: "+7.8%" , col: "#10b981" },
              { sym: "ETH",  act: "SELL",pct: "-2.1%" , col: "#ef4444" },
            ].map(r => (
              <div key={r.sym} className="flex items-center justify-between text-xs font-mono">
                <span className="text-green-300 font-bold">{r.sym}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${r.act === "BUY" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{r.act}</span>
                <span style={{ color: r.col }} className="font-bold">{r.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Live Trading Charts",
    title: "25+ live charts. No browser. No subscriptions. Just one window.",
    description:
      "Professional-grade live charts for EUR/USD, GBP/USD, BTC/USD, ETH/USD and 22 more pairs stream directly inside Trinity — while the bot trades simultaneously. No switching tabs. No extra tools. Everything in one place, running in real time.",
    cta: "Explore the Dashboard",
    href: "#pricing",
    accent: "#16a34a",
    visual: (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(22,163,74,0.12) 0%, transparent 70%)" }} />
        <div className="w-full flex flex-col gap-3">
          {([
            { time: "09:31 AM", Icon: TrendingUpIcon,          iconColor: "#10b981", msg: "TSLA BUY signal — target $285"        },
            { time: "11:14 AM", Icon: TrendingUpIcon,          iconColor: "#22c55e", msg: "BTC breakout above $72k confirmed"    },
            { time: "02:07 PM", Icon: ExclamationTriangleIcon, iconColor: "#f59e0b", msg: "SPY divergence detected — watch closely" },
            { time: "03:55 PM", Icon: CheckCircleFilledIcon,   iconColor: "#10b981", msg: "AAPL position closed +4.2% gain"       },
          ] as const).map(({ time, Icon, iconColor, msg }) => (
            <div key={time} className="flex items-center gap-3 p-3 rounded-xl bg-[#060e08] border border-green-500/15">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
              <span className="text-[10px] font-mono text-gray-500 flex-shrink-0 w-16">{time}</span>
              <span className="text-xs text-gray-200 leading-snug">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    category: "Trade Analytics",
    title: "Your profit curve, updating in real time. No spreadsheets. Ever.",
    description:
      "Every trade Trinity fires is logged the instant it closes — asset, direction, entry, result, P&L. Your live session graph plots cumulative performance trade by trade. You always know exactly where you stand. No guessing, no logging, no spreadsheets. Just a rising curve.",
    cta: "View Analytics Demo",
    href: "#pricing",
    accent: "#10b981",
    visual: (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 70%)" }} />
        <div className="w-full rounded-xl border border-emerald-500/20 bg-[#060f20] p-4 text-xs font-mono">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/70">strategy_v3.algo — back-testing…</span>
          </div>
          {[
            { label: "Total Trades",   value: "842",     color: "#e2e8f0" },
            { label: "Win Rate",       value: "87.3%",   color: "#10b981" },
            { label: "Profit Factor",  value: "3.41",    color: "#22c55e" },
            { label: "Max Drawdown",   value: "-4.2%",   color: "#f87171" },
            { label: "Sharpe Ratio",   value: "2.87",    color: "#a78bfa" },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-1.5 border-b border-emerald-500/10 last:border-0">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-bold" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function ProductCard({ product, index, inView }: {
  product: (typeof PRODUCTS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c1327]"
      style={{ boxShadow: `0 8px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)` }}
    >
      {/* Subtle gradient tint from accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: `radial-gradient(ellipse 60% 60% at 0% 50%, ${product.accent}15 0%, transparent 65%)` }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2">
        {/* Left: visual */}
        <div className="border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#080f1f]/50">
          {product.visual}
        </div>

        {/* Right: text */}
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-col justify-center gap-4 sm:gap-5 p-5 sm:p-8 lg:p-10"
        >
          <motion.span
            variants={up}
            className="text-sm font-bold tracking-wider uppercase"
            style={{ color: product.accent }}
          >
            {product.category}
          </motion.span>

          <motion.h3 variants={up} className="font-display text-xl sm:text-[1.85rem] font-bold text-white leading-tight tracking-tight">
            {product.title}
          </motion.h3>

          <motion.p variants={up} className="text-gray-400 text-base sm:text-lg leading-8 font-light">
            {product.description}
          </motion.p>

          <motion.a
            variants={up}
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white border border-white/20 bg-white/5 hover:bg-white/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {product.cta}
            <ArrowRightIcon className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <Section id="products">
      <div ref={ref} className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
            Everything inside one{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#22c55e,#16a34a)" }}>
              private platform.
            </span>
          </h2>
          <p className="mt-3 sm:mt-5 text-gray-400 text-base sm:text-lg leading-7 sm:leading-8 font-light max-w-xl mx-auto">
            Auto-execution. Live charts. Real-time analytics. All working together, all exclusive to verified Trinity users.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.category} product={product} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </Section>
  );
}
