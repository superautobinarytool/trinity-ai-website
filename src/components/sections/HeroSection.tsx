import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { LockClosedIcon, ArrowUturnLeftIcon, BoltFilledIcon, ArrowRightIcon } from "@/components/ui/Icons";

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const up: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Particles() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    dur: Math.random() * 4 + 4,
  }));
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      {dots.map(({ id, x, y, size, delay, dur }) => (
        <motion.circle
          key={id}
          cx={`${x}%`} cy={`${y}%`} r={size}
          fill="rgba(255,255,255,0.30)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export default function HeroSection({ headerHeight = 110 }: { headerHeight?: number }) {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Start trading like smart money"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center"
      style={{ paddingTop: headerHeight + 48, paddingBottom: "6rem" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#040d1a]" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 110% 70% at 50% -10%, rgba(0,180,220,0.38) 0%, rgba(0,100,180,0.18) 38%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#040d1a] to-transparent pointer-events-none" aria-hidden="true" />
      <Particles />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative z-10 max-w-3xl mx-auto px-6"
      >
        <motion.div variants={up} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 text-green-300 text-sm font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          The World&apos;s #1 Binary Options AI — 80%+ Win Rate Verified
        </motion.div>

        <motion.h1
          variants={up}
          className="font-display text-5xl sm:text-6xl lg:text-[5.25rem] font-extrabold tracking-tightest leading-[1.04] text-white mb-7"
        >
          While Others Lose,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #22C55E 0%, #16A34A 50%, #22C55E 100%)" }}
          >
            Trinity Prints Money.
          </span>
        </motion.h1>

        <motion.p variants={up} className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 font-light">
          90% of binary options traders lose — because they&apos;re slower, less disciplined, and less informed than the market.
          Trinity is the <strong className="text-white font-semibold">AI-powered binary options bot</strong> that eliminates all three:
          reading 25+ assets, firing high-probability CALL&nbsp;&amp;&nbsp;PUT signals, and executing on your broker in milliseconds.
          You press START. Trinity does the rest.
        </motion.p>

        <motion.div variants={up} className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/50 text-white font-semibold text-base bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Trinity — Start Profiting Today
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div variants={up} className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-400">
          {([
            { Icon: LockClosedIcon,     text: "Licensed & secured"         },
            { Icon: ArrowUturnLeftIcon, text: "30-day money-back guarantee" },
            { Icon: BoltFilledIcon,     text: "Works on IQ Option, Quotex, Deriv & more" },
          ] as const).map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Live TradingView Software Window */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-6"
        aria-hidden="true"
      >
        {/* Glow beneath */}
        <div className="absolute inset-x-20 -bottom-6 h-28 bg-[#22C55E]/20 blur-3xl rounded-full" />
        <div className="absolute inset-x-40 -bottom-2 h-16 bg-emerald-400/10 blur-2xl rounded-full" />

        {/* App window chrome */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_50px_140px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07]"
            style={{ background: "rgba(10,14,28,0.98)" }}
          >
            <div className="flex gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Mini stat pills */}
            <div className="flex items-center gap-2 ml-3">
              <span className="px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold tracking-wide">● LIVE</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400 text-[10px] font-mono">EUR/USD · 1M</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400 text-[10px] font-mono">WIN RATE 80%+</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              trinity · auto-trading
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-4 divide-x divide-white/[0.06] border-b border-white/[0.06]"
            style={{ background: "rgba(8,12,24,0.98)" }}
          >
            {[
              { label: "Win Rate",     value: "80%+",  color: "#22c55e" },
              { label: "Execution",   value: "<50ms", color: "#34d399" },
              { label: "Strategies",  value: "3",     color: "#a78bfa" },
              { label: "Active Users",value: "11K+",  color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-5 py-3 text-center">
                <p className="text-lg font-black tabular-nums leading-tight" style={{ color }}>{value}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Live TradingView chart */}
          <div className="relative" style={{ height: "420px", background: "#0b1120" }}>
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tv_trinity&symbol=EURUSD&interval=1&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=0b1120&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=0&locale=en&hide_top_toolbar=0&allow_symbol_change=0&watchlist=%5B%22EURUSD%22%2C%22GBPUSD%22%2C%22USDJPY%22%5D"
              title="Trinity Live Trading Chart"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
            {/* Corner watermark badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-green-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold text-green-400 tracking-wide">TRINITY AI ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-4 text-center text-xs text-gray-500 font-mono tracking-wider">
          LIVE EUR/USD · Trinity is scanning signals right now
        </p>
      </motion.div>
    </section>
  );
}
