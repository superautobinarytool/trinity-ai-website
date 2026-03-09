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
          AI Signal Intelligence &mdash; 80%+ Verified Win Rate
        </motion.div>

        <motion.h1
          variants={up}
          className="font-display text-5xl sm:text-6xl lg:text-[5.25rem] font-extrabold tracking-tightest leading-[1.04] text-white mb-7"
        >
          The AI spots the trade.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #22C55E 0%, #16A34A 50%, #22C55E 100%)" }}
          >
            You collect the profit.
          </span>
        </motion.h1>

        <motion.p variants={up} className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 font-light">
          Trinity&apos;s AI analyses market data across 25+ assets in real time &mdash; finding
          high-probability setups <strong className="text-white font-semibold">invisible to the human eye</strong>.&nbsp;
          When it finds one, it fires instantly. No clicking. No hesitation. Just profit.
        </motion.p>

        <motion.div variants={up} className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/50 text-white font-semibold text-base bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Activate Risk-Free Access
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div variants={up} className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-400">
          {([
            { Icon: LockClosedIcon,     text: "Licensed & secured"    },
            { Icon: ArrowUturnLeftIcon, text: "30-day money-back"      },
            { Icon: BoltFilledIcon,     text: "Windows 10/11 — instant setup" },
          ] as const).map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Dashboard peek */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-6"
        aria-hidden="true"
      >
        <div className="absolute inset-x-10 -bottom-4 h-24 bg-[#22C55E]/15 blur-2xl rounded-full" />
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          style={{ background: "rgba(8,18,38,0.9)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.07]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-gray-400 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              trinity-dashboard · live signals
            </div>
          </div>
          <div className="grid grid-cols-4 gap-px bg-white/[0.05]">
            {[
              { label: "Win Rate",       value: "80%+",   color: "#22c55e" },
              { label: "Execution",     value: "<50ms",  color: "#16a34a" },
              { label: "Strategies",    value: "3x",     color: "#10b981" },
              { label: "Active Users",  value: "11K+",   color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#050d1e] px-5 py-5 text-center">
                <p className="text-2xl font-black tabular-nums" style={{ color }}>{value}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-5 flex items-end gap-1.5 h-24 bg-[#050d1e]">
            {[30,52,44,68,59,78,65,84,72,90,76,95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{ delay: 0.7 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                className="flex-1 rounded-t-sm"
                style={{ background: i === 11 ? "linear-gradient(to top,#00b5e2,#38d9f5)" : "rgba(0,181,226,0.25)", minHeight: "4px" }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
