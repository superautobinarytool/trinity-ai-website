import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import { LockClosedIcon, ArrowUturnLeftIcon, BoltFilledIcon, ArrowRightIcon } from "@/components/ui/Icons";

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const up: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Ambient chart particles — defined once to avoid regeneration on every render
const AMBIENT_DOTS = [
  { id:0, cx:90,  cy:60,  delay:0,    dur:3.5 },
  { id:1, cx:230, cy:140, delay:0.8,  dur:4.1 },
  { id:2, cx:380, cy:45,  delay:1.5,  dur:3.8 },
  { id:3, cx:520, cy:180, delay:0.3,  dur:4.6 },
  { id:4, cx:660, cy:80,  delay:1.2,  dur:3.2 },
  { id:5, cx:760, cy:160, delay:2.1,  dur:4.0 },
];

// Brand-matched WIN particles — symmetric radial burst from live candle centre
// 24 particles across 3 distance rings, brand palette only: teal · green · gold
const WIN_PARTICLES: Array<{
  dx: number; dy: number; c: string; d: number;
  w: number; h: number; br: number;
}> = (() => {
  const PALETTE = ["#00e5be", "#4ade80", "#22c55e", "#fbbf24", "#00e5be", "#4ade80"];
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const rad   = (angle * Math.PI) / 180;
    const dist  = 52 + (i % 3) * 42; // 52 / 94 / 136 px — three rings
    const isBar = i % 5 === 0;        // every 5th is a thin vertical dash
    return {
      dx: +(Math.cos(rad) * dist).toFixed(1),
      dy: +(Math.sin(rad) * dist).toFixed(1),
      c:  PALETTE[i % PALETTE.length],
      d:  (i % 4) * 0.028,          // tight stagger: 0 / 0.028 / 0.056 / 0.084 s
      w:  isBar ? 2 : 5,
      h:  isBar ? 13 : 5,
      br: isBar ? 2 : 99,
    };
  });
})();

// ── Background scene — all data defined at module level (no Math.random on render) ──
const ORBS = [
  { x: "14%",  y: "22%", size: 520, color: "0,185,222",  alpha: 0.11, dx: [0, 55,-30, 0] as number[], dy: [0, 28, 65, 0] as number[], dur: 26 },
  { x: "82%",  y: "10%", size: 600, color: "0,229,190",  alpha: 0.08, dx: [0,-48, 20, 0] as number[], dy: [0, 52,-28, 0] as number[], dur: 33 },
  { x: "58%",  y: "76%", size: 440, color: "34,197,94",  alpha: 0.07, dx: [0, 32,-22, 0] as number[], dy: [0,-38, 14, 0] as number[], dur: 23 },
  { x: "22%",  y: "74%", size: 380, color: "96,165,250", alpha: 0.07, dx: [0,-28, 40, 0] as number[], dy: [0,-20, 18, 0] as number[], dur: 29 },
];

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  cx: +((i * 137.508) % 100).toFixed(1),
  cy: +((i * 97.831 + 11.3) % 100).toFixed(1),
  r:  i % 8 === 0 ? 0.22 : i % 4 === 0 ? 0.16 : 0.10,
  delay: +((i * 0.31) % 6).toFixed(2),
  dur:   +(2.5 + (i % 7) * 0.6).toFixed(2),
  peak:  i % 6 === 0 ? 0.80 : i % 3 === 0 ? 0.50 : 0.30,
}));

const DIAMONDS = [
  { cx:  5, cy: 13, s: 11, dur: 44, d:  0, op: 0.18 },
  { cx: 94, cy:  8, s:  8, dur: 56, d:  5, op: 0.14 },
  { cx:  4, cy: 53, s: 10, dur: 48, d: 10, op: 0.16 },
  { cx: 96, cy: 47, s: 13, dur: 40, d:  2, op: 0.13 },
  { cx: 50, cy: 96, s:  8, dur: 52, d:  7, op: 0.15 },
  { cx:  7, cy: 87, s:  9, dur: 46, d: 12, op: 0.14 },
  { cx: 93, cy: 82, s: 11, dur: 38, d:  4, op: 0.14 },
  { cx: 48, cy:  3, s:  7, dur: 50, d:  8, op: 0.16 },
];

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x:     +((i * 59.7 + 5) % 92 + 4).toFixed(1),
  delay: +((i * 0.72) % 9).toFixed(2),
  dur:   +(5.5 + (i % 5) * 1.4).toFixed(2),
  r:      i % 4 === 0 ? 0.20 : 0.13,
}));

function HeroBackground() {
  return (
    <>
      {/* Drifting gradient orbs */}
      {ORBS.map((o, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: o.x, top: o.y,
            width: `${o.size}px`, height: `${o.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${o.color},${o.alpha}) 0%, transparent 70%)`,
            filter: "blur(55px)",
            marginLeft: `-${o.size / 2}px`,
            marginTop:  `-${o.size / 2}px`,
            willChange: "transform",
          }}
          animate={{ x: o.dx, y: o.dy }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Slow-rotating diamond outlines */}
      {DIAMONDS.map(({ cx, cy, s, dur, d, op }, i) => (
        <motion.div
          key={`dia-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${cx}%`, top: `${cy}%`,
            width: `${s * 2}px`, height: `${s * 2}px`,
            marginLeft: `-${s}px`, marginTop: `-${s}px`,
            border: `0.8px solid rgba(0,229,190,${op})`,
            transformOrigin: "center",
          }}
          animate={{ rotate: [45, 405] }}
          transition={{ duration: dur, delay: d, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* SVG layer: star field + rising sparks */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {STARS.map(({ id, cx, cy, r, delay, dur, peak }) => (
          <motion.circle
            key={id}
            cx={cx} cy={cy} r={r}
            fill="white"
            animate={{ opacity: [0, peak, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {SPARKS.map(({ id, x, delay, dur, r }) => (
          <motion.circle
            key={`sp-${id}`}
            cx={x} r={r}
            fill="rgba(0,229,190,0.65)"
            animate={{ cy: [105, -5], opacity: [0, 0.65, 0.5, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.08, 0.85, 1] }}
          />
        ))}
      </svg>

      {/* Sweeping teal scan lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {([{ top: "23%", delay: 0, dur: 12, rd: 10 }, { top: "57%", delay: 5, dur: 17, rd: 13 }, { top: "81%", delay: 11, dur: 14, rd: 11 }] as const).map(({ top, delay, dur, rd }, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top,
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(0,229,190,0) 12%, rgba(0,229,190,0.22) 38%, rgba(0,229,190,0.32) 50%, rgba(0,229,190,0.22) 62%, rgba(0,229,190,0) 88%, transparent 100%)",
              filter: "blur(0.5px)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "200vw" }}
            transition={{ duration: dur, delay, repeat: Infinity, repeatDelay: rd, ease: "linear" }}
          />
        ))}
      </div>
    </>
  );
}

export default function HeroSection({ headerHeight = 110 }: { headerHeight?: number }) {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const mockupContainerRef = useRef<HTMLDivElement>(null);
  const [mockupScale, setMockupScale] = useState(1);
  const NATURAL_W = 1060;
  const NATURAL_H = 600;

  useEffect(() => {
    const el = mockupContainerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setMockupScale(Math.min(1, el.clientWidth / NATURAL_W));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Trade animation loop ─────────────────────────────────
  const [animPhase, setAnimPhase] = useState<0|1|2|3|4>(0);
  const [profitVal, setProfitVal] = useState(511.04);
  // Live candle forming progress 0→1
  const [liveProgress, setLiveProgress] = useState(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveRafRef = useRef<number | null>(null);
  const loopStartedRef = useRef(false);

  // Animate live candle growing smoothly
  useEffect(() => {
    let start: number | null = null;
    const DURATION = 3800;
    const frame = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / DURATION, 1);
      setLiveProgress(p);
      if (p < 1) liveRafRef.current = requestAnimationFrame(frame);
      else {
        start = null;
        liveRafRef.current = requestAnimationFrame(frame);
      }
    };
    if (inView) liveRafRef.current = requestAnimationFrame(frame);
    return () => { if (liveRafRef.current) cancelAnimationFrame(liveRafRef.current); };
  }, [inView]);

  useEffect(() => {
    if (!inView || loopStartedRef.current) return;
    loopStartedRef.current = true;
    // Phase durations: idle, click, scan+signal, executing, win celebration
    const DURS = [3200, 620, 1800, 900, 2800];
    let currentPhase = 0;
    const tick = () => {
      const next = ((currentPhase + 1) % 5) as 0|1|2|3|4;
      currentPhase = next;
      setAnimPhase(next);
      if (next === 4) setProfitVal(v => parseFloat((v + 8.50).toFixed(2)));
      phaseTimerRef.current = setTimeout(tick, DURS[next]);
    };
    phaseTimerRef.current = setTimeout(tick, 3800);
    return () => { if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current); };
  }, [inView]);

  // Phase-reactive window box shadow (switches smoothly per phase)
  const PHASE_SHADOW = [
    "0 60px 180px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.07)",
    "0 60px 180px rgba(0,0,0,0.92), 0 0 0 1px rgba(96,165,250,0.55), 0 0 50px rgba(96,165,250,0.22)",
    "0 60px 180px rgba(0,0,0,0.92), 0 0 0 2px rgba(0,229,190,0.8), 0 0 80px rgba(0,229,190,0.45), 0 0 130px rgba(0,229,190,0.18)",
    "0 60px 180px rgba(0,0,0,0.92), 0 0 0 1.5px rgba(251,191,36,0.6), 0 0 48px rgba(251,191,36,0.22)",
    "0 60px 180px rgba(0,0,0,0.92), 0 0 0 2.5px rgba(34,197,94,0.9), 0 0 100px rgba(34,197,94,0.55), 0 0 200px rgba(34,197,94,0.28)",
  ] as const;

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
      {/* Soft top ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 55% at 50% -2%, rgba(0,180,222,0.20) 0%, rgba(0,100,180,0.09) 48%, transparent 70%)" }}
        aria-hidden="true"
      />
      {/* Subtle teal line grid — fades toward edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,229,190,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,190,0.028) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 88% 82% at 50% 38%, black 5%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <HeroBackground />
      <div className="absolute bottom-0 inset-x-0 h-60 bg-gradient-to-t from-[#040d1a] to-transparent pointer-events-none" aria-hidden="true" />

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

      {/* Trinity Software — pixel-perfect replica */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-20 w-full max-w-6xl mx-auto px-6"
        aria-hidden="true"
      >
        {/* Glow halos */}
        <div className="absolute inset-x-16 -bottom-8 h-32 bg-[#22C55E]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute inset-x-40 -bottom-2 h-16 bg-emerald-400/10 blur-2xl rounded-full pointer-events-none" />

        {/* ── Trinity App Window — charcoal #2a2a2a exactly matching screenshot ── */}
        <div ref={mockupContainerRef} className="w-full">
        <motion.div
          className="relative rounded-xl overflow-hidden"
          animate={{ boxShadow: PHASE_SHADOW[animPhase] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            background: "#2a2a2a",
            ...(mockupScale < 1 ? {
              width: `${NATURAL_W}px`,
              transform: `scale(${mockupScale})`,
              transformOrigin: "top left",
              marginBottom: `${(mockupScale - 1) * NATURAL_H}px`,
            } : {}),
          }}
        >
          {/* ── TOP BAR ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
            style={{ background: "#333333" }}
          >
            {/* Pair type pills */}
            <div className="flex rounded-md overflow-hidden border border-white/[0.1]">
              <span className="px-4 py-1.5 text-[12px] font-black text-white tracking-wide" style={{ background: "#d946ef" }}>CURRENCIES</span>
              <span className="px-4 py-1.5 text-[12px] font-semibold text-gray-400" style={{ background: "#2a2a2a" }}>CRYPTO</span>
            </div>
            {/* EUR/USD dropdown */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.12] text-white text-[13px] font-bold"
              style={{ background: "#2a2a2a" }}
            >
              EUR/USD
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Trading mode toggle */}
            <div className="flex items-center gap-2 ml-2">
              <div className="w-9 h-5 rounded-full flex items-center px-0.5" style={{ background: "#333" }}>
                <div className="w-4 h-4 rounded-full" style={{ background: "#666" }} />
              </div>
              <span className="text-[13px] font-bold text-white">MANUAL</span>
              <span className="text-[11px] text-gray-500 ml-1">Trading Mode</span>
            </div>
            {/* Live badge */}
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "rgba(34,197,94,0.18)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
              <span className="text-[12px] font-semibold" style={{ color: "#7c3aed" }}>trinity v2.4</span>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex" style={{ background: "#252525" }}>

            {/* ── LEFT ICON NAV ── */}
            <div
              className="w-10 shrink-0 flex flex-col items-center py-4 gap-5 border-r border-white/[0.05]"
              style={{ background: "#1e1e1e" }}
            >
              {/* Hamburger */}
              <button className="text-gray-600 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              {/* Bar chart - active/blue */}
              <button style={{ color: "#60a5fa" }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16v-5h2v5H7zm4-9v9h2V7h-2zm4 4v5h2v-5h-2z"/></svg>
              </button>
              {/* User */}
              <button className="text-gray-600 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </button>
              {/* Settings */}
              <button className="text-gray-600 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
              <div className="mt-auto">
                <button className="text-gray-700 hover:text-gray-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
              </div>
            </div>

            {/* ── MAIN CONTENT AREA ── */}
            <div className="flex-1 flex flex-col min-w-0 p-2 gap-2">

              {/* ── CANDLESTICK CHART ── */}
              <div
                className="relative rounded-sm overflow-hidden"
                style={{ background: "#000", border: "2px solid #1a6bb0", height: "340px" }}
              >
                {/* Price axis - right */}
                <div className="absolute right-0 top-0 bottom-4 w-14 flex flex-col justify-between py-1 border-l border-white/[0.06] z-10" style={{ background: "#0a0a0a" }}>
                  {["1.1600","1.1595","1.1590","1.1585","1.1580","1.1575","1.1570","1.1565","1.1560","1.1555"].map((p,i) => (
                    <span key={p} className={`pr-1.5 text-right text-[8.5px] font-mono ${i===3?"font-bold":""}`}
                      style={{ color: i===3 ? "#00e5be" : "#666" }}>{p}</span>
                  ))}
                </div>

                {/* SVG chart — realistic OHLC candles on a proper price scale */}
                {(() => {
                  // Zoomed price scale: 1.1552 (bottom) to 1.1602 (top) = 50 pip range
                  // Action zone (1.1565–1.1598) sits in the vertical middle of the chart
                  const W = 820, H = 302;
                  const priceMin = 1.1552, priceMax = 1.1602;
                  const pxPerPip = H / (priceMax - priceMin);
                  const toY = (p: number) => H - (p - priceMin) * pxPerPip;

                  // Realistic OHLC chain — chained open=prev_close, realistic wicks
                  type C = { o:number; h:number; l:number; c:number };
                  const raw: C[] = [
                    // Acceleration — marubozu-style, tight wicks
                    {o:1.1556,h:1.1564,l:1.1552,c:1.1563},
                    {o:1.1563,h:1.1566,l:1.1554,c:1.1557},// pullback
                    {o:1.1557,h:1.1569,l:1.1553,c:1.1568},
                    {o:1.1568,h:1.1575,l:1.1562,c:1.1574},
                    {o:1.1574,h:1.1579,l:1.1566,c:1.1570},// doji
                    {o:1.1570,h:1.1580,l:1.1566,c:1.1579},
                    // Climax — shooting stars, long wicks
                    {o:1.1579,h:1.1592,l:1.1574,c:1.1582},
                    {o:1.1582,h:1.1596,l:1.1576,c:1.1579},// shooting star
                    {o:1.1579,h:1.1588,l:1.1572,c:1.1585},
                    {o:1.1585,h:1.1590,l:1.1578,c:1.1580},
                    // Breakout continuation
                    {o:1.1580,h:1.1592,l:1.1577,c:1.1590},
                    {o:1.1590,h:1.1596,l:1.1584,c:1.1594},
                    {o:1.1594,h:1.1598,l:1.1586,c:1.1590},
                    // Current (live) — strong bullish CALL candle forming
                    {o:1.1590,h:1.1598,l:1.1584,c:1.1597},
                  ];
                  const candleCount = raw.length;
                  // 14 candles in the left half — live candle at chart center, wider bodies
                  const GAP = (W * 0.52) / candleCount;
                  const BW  = GAP * 0.78;

                  // Last candle forms live — c interpolates from o toward target
                  const liveCandle = raw[candleCount - 1];
                  const liveC = liveCandle.o + (liveCandle.c - liveCandle.o) * liveProgress;
                  const liveH = liveCandle.o + (liveCandle.h - liveCandle.o) * Math.min(liveProgress * 1.4, 1);
                  const liveL = liveCandle.o - (liveCandle.o - liveCandle.l) * Math.min(liveProgress * 1.2, 1);

                  return (
                    <svg
                      className="absolute"
                      style={{ left: 0, top: 0, bottom: "20px", width: "calc(100% - 56px)", height: "calc(100% - 20px)" }}
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Grid lines */}
                      {[0.2,0.35,0.5,0.65,0.8].map(r => (
                        <line key={r} x1={0} y1={H*r} x2={W} y2={H*r}
                          stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
                      ))}

                      {/* Horizontal price level lines */}
                      {[1.1560,1.1575,1.1590].map(p => (
                        <line key={p} x1={0} y1={toY(p)} x2={W} y2={toY(p)}
                          stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 5" />
                      ))}

                      {/* Ambient floating particles — always on, very faint */}
                      {AMBIENT_DOTS.map(({id, cx, cy, delay, dur}) => (
                        <motion.circle
                          key={`amb-${id}`}
                          cx={cx} cy={cy} r={1.8}
                          fill="rgba(0,229,190,0.45)"
                          animate={{ opacity:[0.08,0.45,0.08], cy:[cy,cy-9,cy] }}
                          style={{ transformOrigin:`${cx}px ${cy}px` }}
                          transition={{ duration:dur, delay, repeat:Infinity, ease:"easeInOut" }}
                        />
                      ))}

                      {/* Historical candles */}
                      {raw.slice(0, candleCount - 1).map((c, i) => {
                        const x  = GAP * (i + 1);
                        const up = c.c >= c.o;
                        const col = up ? "#00e5be" : "#f23645";
                        const yO = toY(c.o), yC = toY(c.c), yH = toY(c.h), yL = toY(c.l);
                        const bodyTop = Math.min(yO, yC);
                        const bodyH   = Math.max(Math.abs(yC - yO), 1.5);
                        return (
                          <g key={i}>
                            {/* Wick */}
                            <line x1={x} y1={yH} x2={x} y2={yL}
                              stroke={col} strokeWidth={1} opacity={0.75} />
                            {/* Body */}
                            <motion.rect
                              x={x - BW/2} width={BW}
                              y={bodyTop} height={bodyH}
                              fill={col}
                              initial={{ scaleY: 0, originY: yO }}
                              animate={inView ? { scaleY: 1 } : {}}
                              style={{ transformOrigin: `${x}px ${yO}px` }}
                              transition={{ delay: 0.3 + i * 0.028, duration: 0.25, ease: "easeOut" }}
                            />
                          </g>
                        );
                      })}

                      {/* LIVE forming candle */}
                      {(() => {
                        const i = candleCount - 1;
                        const x = GAP * (i + 1);
                        const up = liveC >= liveCandle.o;
                        const col = up ? "#00e5be" : "#f23645";
                        const yO = toY(liveCandle.o);
                        const yC = toY(liveC);
                        const yH = toY(liveH);
                        const yL = toY(liveL);
                        const bodyTop = Math.min(yO, yC);
                        const bodyH   = Math.max(Math.abs(yC - yO), 1.5);
                        return (
                          <g>
                            <line x1={x} y1={yH} x2={x} y2={yL} stroke={col} strokeWidth={1} opacity={0.8} />
                            <rect x={x - BW/2} width={BW} y={bodyTop} height={bodyH} fill={col} opacity={0.95} />
                            {/* Blinking top wick tip */}
                            <motion.circle cx={x} cy={yH} r={2} fill={col}
                              animate={{ opacity: [1, 0.2, 1] }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }} />
                          </g>
                        );
                      })()}

                      {/* Signal overlay — phase 2: concentric rings + arrow */}
                      {animPhase === 2 && (() => {
                        const scx = GAP * candleCount;
                        const scy = toY(1.1582);
                        return (
                          <g>
                            {/* Expanding concentric rings */}
                            {([0,1,2] as const).map(ri => (
                              <motion.circle key={`ring-${ri}`}
                                cx={scx} cy={scy} r={8}
                                fill="none" stroke="#00e5be" strokeWidth={1.5}
                                style={{ transformOrigin:`${scx}px ${scy}px`, opacity:0 }}
                                animate={{ scale:[1,7], opacity:[0.85,0] }}
                                transition={{ duration:1.7, delay:ri*0.52, repeat:Infinity, ease:"easeOut" }}
                              />
                            ))}
                            {/* Core pulsing dot */}
                            <motion.circle
                              cx={scx} cy={scy} r={5}
                              fill="#00e5be"
                              style={{ filter:"drop-shadow(0 0 10px #00e5be) drop-shadow(0 0 22px rgba(0,229,190,0.6))" }}
                              animate={{ scale:[1,1.5,1], opacity:[1,0.7,1] }}
                              transition={{ duration:0.75, repeat:Infinity, ease:"easeInOut" }}
                            />
                            {/* Upward arrow with glow */}
                            <motion.polygon
                              points={`${scx},${scy-20} ${scx-9},${scy-7} ${scx+9},${scy-7}`}
                              fill="#00e5be"
                              style={{ filter:"drop-shadow(0 0 10px #00e5be) drop-shadow(0 0 24px rgba(0,229,190,0.55))" }}
                              initial={{ opacity:0 }}
                              animate={{ opacity:[0,1,0.8,1] }}
                              transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                            />
                            {/* CALL label */}
                            <motion.text
                              x={scx} y={scy-28}
                              textAnchor="middle"
                              fontSize={9} fontWeight={900} fill="#00e5be"
                              style={{ letterSpacing:2, filter:"drop-shadow(0 0 6px #00e5be)" }}
                              initial={{ opacity:0 }}
                              animate={{ opacity:1 }}
                              transition={{ delay:0.2, duration:0.3 }}
                            >CALL</motion.text>
                            {/* Full-width dashed level line */}
                            <motion.line
                              x1={0} y1={scy} x2={W} y2={scy}
                              stroke="rgba(0,229,190,0.22)" strokeWidth={1} strokeDasharray="5 4"
                              initial={{ pathLength:0 }}
                              animate={{ pathLength:1 }}
                              transition={{ duration:0.9, ease:"linear" }}
                            />
                          </g>
                        );
                      })()}
                    </svg>
                  );
                })()}

                {/* ── Laser scan beam — phase 1 ── */}
                <AnimatePresence>
                  {animPhase === 1 && (
                    <motion.div
                      key="laser"
                      className="absolute inset-y-0 pointer-events-none"
                      style={{
                        width: "4px", zIndex: 14,
                        background: "linear-gradient(180deg, transparent 4%, #00e5be 28%, #e0fff8 50%, #00e5be 72%, transparent 96%)",
                        boxShadow: "0 0 14px 7px rgba(0,229,190,0.75), 0 0 40px 16px rgba(0,229,190,0.35), 0 0 60px 22px rgba(0,229,190,0.15)",
                      }}
                      initial={{ left: "0%", opacity: 0 }}
                      animate={{ left: "calc(100% - 60px)", opacity: [0, 1, 1, 1, 0.7] }}
                      transition={{ duration: 0.52, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </AnimatePresence>

                {/* Current price chip — animate position subtly */}
                <motion.div
                  className="absolute z-10 px-1.5 py-0.5 text-[9px] font-bold text-black font-mono rounded-sm"
                  style={{ background: "#00e5be", right: "58px", top: `${32 + Math.sin(liveProgress * Math.PI * 2) * 1.5}%` }}
                >
                  {(1.1590 + (liveProgress * 0.0006 - 0.0003)).toFixed(5)}
                </motion.div>

                {/* ── Glow radial when signal fires — phase 2 ── */}
                <AnimatePresence>
                  {animPhase === 2 && (
                    <motion.div
                      key="signalglow"
                      className="absolute inset-0 pointer-events-none z-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.18, 0.08, 0.18, 0] }}
                      transition={{ duration: 1.8, times: [0,0.15,0.5,0.75,1] }}
                      style={{ background: "radial-gradient(ellipse 60% 50% at 70% 45%, rgba(0,229,190,0.35) 0%, transparent 70%)" }}
                    />
                  )}
                </AnimatePresence>

                {/* ── WIN celebration — phase 4 ── */}

                {/* 1. Radial flash — teal/green brand colours, instant */}
                {animPhase === 4 && (
                  <motion.div
                    key={`winflash-${profitVal}`}
                    className="absolute inset-0 pointer-events-none z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.55, 0.10, 0.30, 0] }}
                    transition={{ duration: 0.65, times: [0, 0.08, 0.28, 0.52, 1], ease: "easeOut" }}
                    style={{ background: "radial-gradient(ellipse 65% 55% at 52% 52%, rgba(0,229,190,0.42), rgba(34,197,94,0.22), transparent)" }}
                  />
                )}

                {/* 2. Geometric radial particle burst — all from live candle anchor */}
                {animPhase === 4 && WIN_PARTICLES.map(({ dx, dy, c, d, w, h, br }, i) => (
                  <motion.div
                    key={`wp-${i}-${profitVal}`}
                    className="absolute pointer-events-none z-30"
                    style={{
                      left: "52%", top: "52%",
                      width: `${w}px`, height: `${h}px`,
                      borderRadius: `${br}px`,
                      background: c,
                      boxShadow: `0 0 7px ${c}`,
                      marginLeft: `${-w / 2}px`, marginTop: `${-h / 2}px`,
                    }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      x: [0, dx * 0.5, dx * 1.08, dx],
                      y: [0, dy * 0.5, dy * 1.08, dy],
                      scale: [0, 1.6, 1.1, 0.4],
                      opacity: [1, 1, 0.7, 0],
                      rotate: [0, 0, (i % 2 === 0 ? 1 : -1) * 75],
                    }}
                    transition={{ delay: d, duration: 1.05, ease: [0.22, 1, 0.36, 1], times: [0, 0.32, 0.62, 1] }}
                  />
                ))}

                {/* 3. WIN amount card — glass pill, teal border, branded typography */}
                {animPhase === 4 && (
                  <div
                    className="absolute z-40 pointer-events-none select-none"
                    style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                  >
                    <motion.div
                      key={`wincard-${profitVal}`}
                      initial={{ scale: 0.52, opacity: 0, y: 10 }}
                      animate={{
                        scale:   [0.52, 1.12, 1.0,  1.0,  0.88],
                        opacity: [0,    1,    1,    1,    0   ],
                        y:       [10,  -3,   -8,  -22,  -52  ],
                      }}
                      transition={{ delay: 0.16, duration: 2.5, times: [0, 0.12, 0.24, 0.70, 1.0], ease: "easeOut" }}
                      style={{
                        padding: "13px 24px",
                        background: "rgba(2, 12, 26, 0.90)",
                        border: "1px solid rgba(0,229,190,0.55)",
                        borderRadius: "10px",
                        boxShadow: [
                          "0 0 0 1px rgba(0,229,190,0.12)",
                          "0 0 28px rgba(0,229,190,0.30)",
                          "0 0 72px rgba(0,229,190,0.14)",
                          "inset 0 1px 0 rgba(0,229,190,0.18)",
                        ].join(", "),
                        backdropFilter: "blur(18px) saturate(1.8)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        minWidth: "134px",
                      }}
                    >
                      {/* Teal top accent line */}
                      <div style={{
                        position: "absolute", top: 0, left: "16px", right: "16px", height: "2px",
                        background: "linear-gradient(90deg, transparent, #00e5be, #4ade80, transparent)",
                        borderRadius: "2px",
                      }} />
                      {/* Amount */}
                      <div style={{
                        fontSize: "36px",
                        fontWeight: 900,
                        fontFamily: "'Inter', 'DM Sans', system-ui, monospace",
                        background: "linear-gradient(135deg, #00e5be 0%, #4ade80 55%, #22c55e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}>+$8.50</div>
                      {/* Label */}
                      <div style={{
                        fontSize: "8px",
                        fontWeight: 900,
                        letterSpacing: "0.26em",
                        color: "rgba(0,229,190,0.62)",
                        marginTop: "6px",
                        textTransform: "uppercase",
                        fontFamily: "monospace",
                      }}>TRADE WON · EUR/USD</div>
                    </motion.div>
                  </div>
                )}

                {/* Time axis */}
                <div className="absolute bottom-0 inset-x-0 h-[20px] flex items-center border-t border-white/[0.06]" style={{ paddingRight: "56px", background: "#050505" }}>
                  <div className="flex justify-between w-full px-2">
                    {["9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45"].map(t=>(
                      <span key={t} className="text-[7.5px] font-mono" style={{ color:"#444" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* TV watermark */}
                <div className="absolute bottom-6 left-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background:"#2a2a2a", opacity:0.7 }}>
                  <span className="text-[9px] font-black text-white">TV</span>
                </div>
              </div>

              {/* ── PROFIT CURVE ── */}
              <div className="rounded-sm border border-white/[0.06]" style={{ background: "#252525" }}>
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "#00e5be" }} />
                  <span className="text-[10px] font-black text-white tracking-widest">PROFIT CURVE</span>
                  <span className="text-[9px] font-semibold" style={{ color:"#888" }}>◆ LAST 100 TRADES</span>
                  <div className="ml-auto flex items-center gap-4">
                    <motion.span
                      key={profitVal}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-[12px] font-black tabular-nums"
                      style={{ color: "#22c55e" }}
                    >+${profitVal.toFixed(2)}</motion.span>
                    <span className="text-[10px]" style={{ color:"#666" }}>100 trades</span>
                    <span className="text-[10px] font-bold" style={{ color:"#22c55e" }}>◆ 85.0% win</span>
                  </div>
                </div>

                {/* Area chart — flat start, exponential rise toward end */}
                <div className="relative" style={{ height: "72px" }}>
                  <svg className="w-full h-full" viewBox="0 0 1000 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                        <stop offset="85%" stopColor="#22c55e" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,78 L80,76 L160,74 L240,72 L300,70 L360,67 L400,64 L440,60 L480,55 L520,49 L560,42 L600,35 L650,27 L700,19 L750,12 L800,7 L850,4 L900,2 L950,1 L1000,0 L1000,80 L0,80 Z"
                      fill="url(#pg2)"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 1.0, duration: 0.8 }}
                    />
                    <motion.path
                      d="M0,78 L80,76 L160,74 L240,72 L300,70 L360,67 L400,64 L440,60 L480,55 L520,49 L560,42 L600,35 L650,27 L700,19 L750,12 L800,7 L850,4 L900,2 L950,1 L1000,0"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1.8"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ delay: 1.0, duration: 1.6, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute bottom-1 left-3 text-[8px] font-mono" style={{ color:"#444" }}>↑ Older</div>
                  <div className="absolute bottom-1 right-3 text-[8px] font-mono" style={{ color:"#444" }}>Latest ↑</div>
                </div>

                {/* ── SIGNAL HISTORY ── */}
                <div className="flex items-center gap-2 px-3 py-2 border-t border-white/[0.05]">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "#2563eb" }} />
                  <span className="text-[9px] font-black text-white tracking-widest">SIGNAL HISTORY (LAST 10)</span>
                  <div className="flex gap-1 ml-2">
                    {([1,1,1,0,1,1,1,0,1,1] as const).map((win, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 1.2 + i * 0.07, type: "spring", stiffness: 320, damping: 18 }}
                        className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black"
                        style={{
                          background: win ? "rgba(0,229,190,0.18)" : "rgba(242,54,69,0.18)",
                          border: `1px solid ${win ? "rgba(0,229,190,0.35)" : "rgba(242,54,69,0.35)"}`,
                          color: win ? "#00e5be" : "#f23645",
                        }}
                      >
                        {win ? "▲" : "▼"}
                      </motion.div>
                    ))}
                  </div>
                  <span className="ml-auto text-[10px] font-black" style={{ color:"#4ade80" }}>8 CALL</span>
                  <span className="text-[10px] font-black" style={{ color:"#f23645" }}>2 PUT</span>
                </div>
              </div>

              {/* ── SESSION OVERVIEW + TRADE LOG ── */}
              <div className="flex-1 rounded-sm border border-white/[0.06] flex flex-col" style={{ background: "#252525", minHeight: 0 }}>
                {/* Header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "#7c3aed" }} />
                  <span className="text-[10px] font-black text-white tracking-widest">SESSION OVERVIEW</span>
                  <span className="ml-auto text-[9px] font-mono" style={{ color: "#444" }}>live · auto-updated</span>
                </div>

                {/* 4 stat chips */}
                <div className="grid grid-cols-4 border-b border-white/[0.05]" style={{ borderRight: "none" }}>
                  {([
                    { label: "TRADES",    value: "12",      color: "#60a5fa" },
                    { label: "WIN RATE",  value: "83.3%",   color: "#00e5be" },
                    { label: "SESSION P&L", value: "+$68",  color: "#22c55e" },
                    { label: "WIN STREAK", value: "3×",     color: "#fbbf24" },
                  ] as const).map(({ label, value, color }, ci) => (
                    <motion.div
                      key={label}
                      className="flex flex-col items-center justify-center py-2.5 gap-0.5"
                      style={{ borderRight: ci < 3 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.3 + ci * 0.07, duration: 0.35, ease: "easeOut" }}
                    >
                      <span className="text-[7.5px] font-black tracking-widest" style={{ color: "#555" }}>{label}</span>
                      <span className="text-[13px] font-black tabular-nums" style={{ color }}>{value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Trade log */}
                <div className="flex-1 overflow-hidden">
                  {/* Column headers */}
                  <div className="grid px-3 py-1.5 border-b border-white/[0.04]" style={{ gridTemplateColumns: "56px 1fr 68px 52px 60px" }}>
                    {["TIME", "PAIR", "DIRECTION", "RESULT", "P/L"].map(h => (
                      <span key={h} className="text-[7px] font-black tracking-widest" style={{ color: "#3a3a3a" }}>{h}</span>
                    ))}
                  </div>
                  {/* Rows */}
                  {([
                    { time: "13:44", pair: "EUR/USD", dir: "CALL",  win: true  },
                    { time: "13:31", pair: "EUR/USD", dir: "CALL",  win: true  },
                    { time: "13:18", pair: "EUR/USD", dir: "PUT",   win: false },
                    { time: "13:05", pair: "EUR/USD", dir: "CALL",  win: true  },
                    { time: "12:52", pair: "GBP/USD", dir: "CALL",  win: true  },
                  ] as const).map((row, ri) => (
                    <motion.div
                      key={ri}
                      className="grid px-3 py-1.5 items-center"
                      style={{
                        gridTemplateColumns: "56px 1fr 68px 52px 60px",
                        background: ri % 2 === 1 ? "rgba(255,255,255,0.018)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.025)",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.45 + ri * 0.07, duration: 0.3, ease: "easeOut" }}
                    >
                      <span className="text-[8.5px] font-mono" style={{ color: "#555" }}>{row.time}</span>
                      <span className="text-[8.5px] font-bold text-white">{row.pair}</span>
                      <span className="text-[8.5px] font-black" style={{ color: row.dir === "CALL" ? "#00e5be" : "#f23645" }}>
                        {row.dir === "CALL" ? "▲" : "▼"}&nbsp;{row.dir}
                      </span>
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded text-center"
                        style={{
                          background: row.win ? "rgba(0,229,190,0.12)" : "rgba(242,54,69,0.12)",
                          color: row.win ? "#00e5be" : "#f23645",
                          border: `1px solid ${row.win ? "rgba(0,229,190,0.25)" : "rgba(242,54,69,0.25)"}`,
                        }}
                      >{row.win ? "WIN" : "LOSS"}</span>
                      <span className="text-[8.5px] font-black" style={{ color: row.win ? "#22c55e" : "#f23645" }}>
                        {row.win ? "+$8.50" : "-$10.00"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT CONTROL PANEL ── */}
            <div
              className="w-52 shrink-0 flex flex-col border-l border-white/[0.06]"
              style={{ background: "#2d2d2d" }}
            >
              {/* TIMEFRAME */}
              <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Timeframe</p>
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1] text-white text-[12px] font-semibold cursor-pointer hover:border-white/20 transition-colors"
                  style={{ background: "#3a3a3a" }}
                >
                  1 Minute
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              {/* START / STOP */}
              <div className="flex gap-2 px-4 py-3 border-b border-white/[0.06]">
                <motion.button
                  animate={
                    animPhase === 1
                      ? { scale: 0.90, boxShadow: "0 0 28px rgba(29,78,216,0.95)" }
                      : (animPhase === 2 || animPhase === 3)
                      ? { scale: 1, boxShadow: "0 0 14px rgba(29,78,216,0.55)" }
                      : { scale: 1, boxShadow: "0 0 0px rgba(29,78,216,0)" }
                  }
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[12px] font-black text-white"
                  style={{ background: "#1d4ed8" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  START
                </motion.button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[12px] font-black text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: "#dc2626" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>
                  STOP
                </button>
              </div>

              {/* STATUS BOX — animated through trade cycle phases */}
              <div className="mx-4 my-3 rounded-md overflow-hidden border border-white/[0.07]" style={{ background: "#333333", height: "118px", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  {animPhase === 0 && (
                    <motion.div key="idle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center py-5">
                      <div className="flex gap-2 mb-3">
                        <div className="w-[10px] h-7 rounded-sm" style={{ background: "#444" }} />
                        <div className="w-[10px] h-7 rounded-sm" style={{ background: "#444" }} />
                      </div>
                      <p className="text-[11px] font-black text-white tracking-widest">READY TO START</p>
                      <p className="text-[9px] text-center leading-relaxed mt-1 px-3" style={{ color: "#666" }}>Press START to begin receiving signals</p>
                    </motion.div>
                  )}
                  {animPhase === 1 && (
                    <motion.div key="processing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                      className="flex flex-col items-center justify-center py-5 gap-2">
                      <div className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2" style={{ borderColor: "#60a5fa", borderTopColor: "transparent" }} />
                        <p className="text-[11px] font-black tracking-widest" style={{ color: "#60a5fa" }}>SCANNING...</p>
                      </div>
                      <motion.div className="flex gap-0.5"
                        initial="hidden" animate="show"
                        variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }}
                      >
                        {[1,1,0,1,0,1,1,1].map((v,i) => (
                          <motion.div key={i}
                            variants={{ hidden:{ scaleY:0.2, opacity:0.3 }, show:{ scaleY:[0.2,1,0.5,0.9,0.3], opacity:1 } }}
                            transition={{ duration:0.5, repeat:Infinity, repeatType:"mirror", delay:i*0.05 }}
                            className="w-[3px] rounded-full"
                            style={{ height:"14px", background: v ? "#60a5fa" : "#3b5fc0", transformOrigin:"bottom" }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                  {animPhase === 2 && (
                    <motion.div key="signal" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, ease:[0.22,1,0.36,1] }}
                      className="flex flex-col items-center justify-center py-5 gap-1">
                      {/* Pulsing ring */}
                      <div className="relative mb-1">
                        <motion.div className="absolute inset-0 rounded-full"
                          animate={{ scale:[1,2.2], opacity:[0.6,0] }}
                          transition={{ duration:1.1, repeat:Infinity, ease:"easeOut" }}
                          style={{ background:"rgba(0,229,190,0.35)" }} />
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background:"rgba(0,229,190,0.15)", border:"1.5px solid rgba(0,229,190,0.6)" }}>
                          <span style={{ color:"#00e5be", fontSize:"14px", fontWeight:900 }}>▲</span>
                        </div>
                      </div>
                      <p className="text-[12px] font-black tracking-widest" style={{ color: "#00e5be" }}>CALL SIGNAL</p>
                      <p className="text-[9px]" style={{ color: "rgba(0,229,190,0.55)" }}>EUR/USD · 1 Min · 94% conf.</p>
                    </motion.div>
                  )}
                  {animPhase === 3 && (
                    <motion.div key="executing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center py-5 gap-1.5">
                      {/* Progress bar */}
                      <div className="w-[80%] h-1 rounded-full mb-1" style={{ background:"#2a2a2a" }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width:"0%" }} animate={{ width:"100%" }}
                          transition={{ duration:0.85, ease:"linear" }}
                          style={{ background:"linear-gradient(90deg,#fbbf24,#f97316)" }} />
                      </div>
                      <p className="text-[11px] font-black tracking-widest" style={{ color: "#fbbf24" }}>⚡ EXECUTING</p>
                      <p className="text-[9px]" style={{ color: "#666" }}>Placing trade on broker...</p>
                    </motion.div>
                  )}
                  {animPhase === 4 && (
                    <motion.div key="win" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.32, type: "spring", stiffness: 360, damping: 20 }}
                      className="flex flex-col items-center justify-center py-5 gap-1">
                      {/* Checkmark with burst */}
                      <div className="relative mb-1">
                        <motion.div className="absolute inset-0 rounded-full"
                          initial={{ scale:0.5, opacity:0.8 }} animate={{ scale:2.5, opacity:0 }}
                          transition={{ duration:0.6, ease:"easeOut" }}
                          style={{ background:"rgba(34,197,94,0.4)" }} />
                        <div className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background:"rgba(34,197,94,0.2)", border:"2px solid rgba(34,197,94,0.7)" }}>
                          <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.1, type:"spring", stiffness:400, damping:18 }}
                            style={{ color:"#22c55e", fontSize:"18px", fontWeight:900, lineHeight:1 }}>✓</motion.span>
                        </div>
                      </div>
                      <motion.p
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
                        className="text-[13px] font-black tracking-widest" style={{ color: "#22c55e" }}>WIN +$8.50</motion.p>
                      <p className="text-[9px]" style={{ color: "rgba(34,197,94,0.55)" }}>Trade completed</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TRADE AMOUNT */}
              <div className="px-4 pb-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Trade Amount</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#3a3a3a" }}>
                  <span className="text-[13px] font-bold text-white tabular-nums">10</span>
                  <div className="flex flex-col gap-px">
                    <button className="text-gray-500 hover:text-gray-200 leading-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg>
                    </button>
                    <button className="text-gray-500 hover:text-gray-200 leading-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* TRADING STRATEGY */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Trading Strategy</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1] cursor-pointer hover:border-white/20 transition-colors" style={{ background: "#3a3a3a" }}>
                  <span className="text-[12px] font-semibold text-white">Compounding</span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              {/* COMPOUNDING STEPS */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Compounding Steps</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#3a3a3a" }}>
                  <span className="text-[13px] font-bold text-white tabular-nums">0</span>
                  <div className="flex flex-col gap-px">
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg></button>
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg></button>
                  </div>
                </div>
                <p className="text-[9px] mt-1.5" style={{ color: "#555" }}>0 = Unlimited steps</p>
              </div>

              {/* MAX DAILY LOSS */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em]">Max Daily Loss</p>
                  <div className="flex items-center gap-1">
                    <div className="w-7 h-3.5 rounded-full relative flex items-center" style={{ background: "#1a6bb0" }}>
                      <div className="absolute right-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                    </div>
                    <span className="text-[8px] font-black" style={{ color: "#60a5fa" }}>ON</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#3a3a3a" }}>
                  <span className="text-[13px] font-bold text-white tabular-nums">50</span>
                  <div className="flex flex-col gap-px">
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg></button>
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg></button>
                  </div>
                </div>
                <p className="text-[9px] mt-1.5" style={{ color: "#555" }}>Stop bot if daily loss &gt; $50</p>
              </div>

              {/* BROKER PROFIT % */}
              <div className="px-4 py-3">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Broker Profit %</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#3a3a3a" }}>
                  <span className="text-[13px] font-bold text-white tabular-nums">77</span>
                  <div className="flex flex-col gap-px">
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg></button>
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg></button>
                  </div>
                </div>
              </div>

              {/* SAVE SETTINGS */}
              <div className="px-4 pb-4 mt-auto">
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-[12px] font-black text-white tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#16a34a" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                  SAVE SETTINGS
                </button>
              </div>
            </div>
          </div>

          {/* ── Diagonal shimmer sweep across whole window — phase 4 ── */}
          <AnimatePresence>
            {animPhase === 4 && (
              <motion.div
                key={`shimmer-${profitVal}`}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ zIndex: 48 }}
              >
                <motion.div
                  className="absolute top-0 bottom-0"
                  style={{
                    width: "45%",
                    background: "linear-gradient(108deg, transparent 18%, rgba(255,255,255,0.055) 42%, rgba(0,229,190,0.13) 52%, rgba(255,255,255,0.04) 62%, transparent 80%)",
                    willChange: "transform",
                  }}
                  initial={{ left: "-45%" }}
                  animate={{ left: "155%" }}
                  transition={{ duration: 0.88, delay: 0.06, ease: [0.25,0.46,0.45,0.94] }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Idle breathing glow ring — phase 0 ── */}
          {animPhase === 0 && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ zIndex: 0, boxShadow: "inset 0 0 0 1px rgba(0,229,190,0)" }}
              animate={{ boxShadow: ["inset 0 0 0 1px rgba(0,229,190,0.0)","inset 0 0 0 1px rgba(0,229,190,0.2)","inset 0 0 0 1px rgba(0,229,190,0.0)"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>

        </div>{/* end mockupContainerRef */}
        <p className="mt-4 text-center text-[11px] text-gray-600 font-mono tracking-wider">
          Trinity · live interface · EUR/USD · Compounding strategy active
        </p>
      </motion.div>
    </section>
  );
}