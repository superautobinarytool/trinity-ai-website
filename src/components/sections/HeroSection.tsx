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

      {/* Trinity Software — faithful UI recreation */}
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

        {/* ── Trinity App Window ── */}
        <div
          className="relative rounded-xl overflow-hidden shadow-[0_60px_180px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{ background: "#161b2c" }}
        >
          {/* ── TOP BAR ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
            style={{ background: "#1a1f30" }}
          >
            {/* Pair type pills */}
            <div className="flex rounded-md overflow-hidden border border-white/[0.1]">
              <span className="px-4 py-1.5 text-[12px] font-black text-white tracking-wide" style={{ background: "#7c3aed" }}>CURRENCIES</span>
              <span className="px-4 py-1.5 text-[12px] font-semibold text-gray-500" style={{ background: "#252836" }}>CRYPTO</span>
            </div>
            {/* EUR/USD dropdown */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.12] text-white text-[13px] font-bold"
              style={{ background: "#252836" }}
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
          <div className="flex" style={{ background: "#161b2c" }}>

            {/* ── LEFT ICON NAV ── */}
            <div
              className="w-10 shrink-0 flex flex-col items-center py-4 gap-5 border-r border-white/[0.05]"
              style={{ background: "#161b2c" }}
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

              {/* ── CANDLESTICK CHART ── black bg, blue border */}
              <div
                className="relative rounded-sm overflow-hidden"
                style={{ background: "#000", border: "2px solid #1a6bb0", height: "280px" }}
              >
                {/* Price axis - right */}
                <div className="absolute right-0 top-0 bottom-4 w-14 flex flex-col justify-between py-2 border-l border-white/[0.06]" style={{ background: "#0a0a0a" }}>
                  {["1.1590","1.1585","1.1580","1.1576","1.1570","1.1565","1.1560","1.1555","1.1550","1.1545"].map(p => (
                    <span key={p} className="pr-1.5 text-right text-[9px] font-mono" style={{ color: "#888" }}>{p}</span>
                  ))}
                </div>

                {/* Current price label — teal chip */}
                <div
                  className="absolute z-10 px-1.5 py-0.5 text-[9px] font-bold text-black font-mono rounded-sm"
                  style={{ background: "#00e5be", right: "56px", top: "44%" }}
                >
                  1.15763
                </div>

                {/* Chart canvas area */}
                <div className="absolute inset-0" style={{ right: "56px", bottom: "18px" }}>
                  {/* Horizontal grid lines */}
                  {[0.15,0.3,0.45,0.6,0.75,0.9].map(p => (
                    <div key={p} className="absolute inset-x-0 border-t" style={{ top: `${p*100}%`, borderColor: "rgba(255,255,255,0.04)" }} />
                  ))}

                  {/* Candles — fat, tall, exactly matching screenshot pattern */}
                  {(() => {
                    // Each candle: [low%, high%, open%, close%] — % from bottom of chart
                    const candles: [number,number,number,number][] = [
                      [8,62,18,55],[5,58,52,12],[10,65,15,60],[8,60,55,14],[12,68,18,62],
                      [15,72,64,20],[10,62,18,55],[8,64,58,14],[14,70,20,65],[12,68,62,18],
                      [18,75,24,70],[22,78,72,28],[16,72,26,68],[20,76,70,24],[25,82,32,78],
                      [28,80,78,32],[30,85,38,80],[35,88,84,40],[32,84,40,78],[38,88,82,42],
                      [40,90,46,85],[42,88,85,46],[38,84,44,79],[44,92,50,88],[46,90,87,50],
                      [42,88,48,84],[50,92,56,88],[52,90,86,56],[48,88,54,83],[55,92,60,88],
                      [54,88,86,58],[56,90,62,86],
                    ];
                    return candles.map(([lo,hi,op,cl], i) => {
                      const up = cl > op;
                      const bodyLo = Math.min(op,cl), bodyHi = Math.max(op,cl);
                      const color = up ? "#00e5be" : "#f23645";
                      return (
                        <div key={i} className="absolute flex flex-col items-center" style={{
                          left: `${1 + i * (98/candles.length)}%`,
                          width: `${(98/candles.length)*0.65}%`,
                          top: 0, bottom: 0,
                        }}>
                          {/* Wick */}
                          <div className="absolute w-px" style={{ bottom:`${lo}%`, height:`${hi-lo}%`, background: color, opacity:0.7, left:"50%", transform:"translateX(-50%)" }}/>
                          {/* Body */}
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={inView ? { scaleY: 1 } : {}}
                            transition={{ delay: 0.5 + i * 0.022, duration: 0.3, ease: "easeOut" }}
                            className="absolute w-full rounded-[1px]"
                            style={{ bottom:`${bodyLo}%`, height:`${Math.max(bodyHi-bodyLo,2.5)}%`, background: color, transformOrigin:"bottom" }}
                          />
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Time axis */}
                <div className="absolute bottom-0 inset-x-0 h-[18px] flex items-center border-t border-white/[0.06]" style={{ paddingRight: "56px", background: "#0a0a0a" }}>
                  <div className="flex justify-between w-full px-1">
                    {["9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45"].map(t=>(
                      <span key={t} className="text-[7.5px] font-mono" style={{ color:"#555" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* TV logo watermark */}
                <div className="absolute bottom-5 left-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background:"#2a2a2a" }}>
                  <span className="text-[9px] font-black text-white">TV</span>
                </div>
              </div>

              {/* ── PROFIT CURVE ── */}
              <div className="rounded-sm border border-white/[0.06]" style={{ background: "#111520" }}>
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "#00e5be" }} />
                  <span className="text-[10px] font-black text-white tracking-widest">PROFIT CURVE</span>
                  <span className="text-[9px] font-semibold" style={{ color:"#888" }}>◆ LAST 100 TRADES</span>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-[12px] font-black tabular-nums" style={{ color:"#22c55e" }}>+$511.04</span>
                    <span className="text-[10px]" style={{ color:"#666" }}>100 trades</span>
                    <span className="text-[10px] font-bold" style={{ color:"#22c55e" }}>◆ 85.0% win</span>
                  </div>
                </div>

                {/* Area chart — flat start, exponential rise toward end */}
                <div className="relative" style={{ height: "90px" }}>
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
            </div>

            {/* ── RIGHT CONTROL PANEL ── */}
            <div
              className="w-52 shrink-0 flex flex-col border-l border-white/[0.06]"
              style={{ background: "#161b2c" }}
            >
              {/* TIMEFRAME */}
              <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Timeframe</p>
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1] text-white text-[12px] font-semibold cursor-pointer hover:border-white/20 transition-colors"
                  style={{ background: "#1e2436" }}
                >
                  1 Minute
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              {/* START / STOP */}
              <div className="flex gap-2 px-4 py-3 border-b border-white/[0.06]">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[12px] font-black text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: "#1d4ed8" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  START
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[12px] font-black text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: "#dc2626" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>
                  STOP
                </button>
              </div>

              {/* READY TO START */}
              <div className="mx-4 my-3 rounded-md flex flex-col items-center justify-center py-5 border border-white/[0.07]" style={{ background: "#1e2436" }}>
                <div className="flex gap-2 mb-3">
                  <div className="w-[10px] h-7 rounded-sm" style={{ background: "#444" }} />
                  <div className="w-[10px] h-7 rounded-sm" style={{ background: "#444" }} />
                </div>
                <p className="text-[11px] font-black text-white tracking-widest">READY TO START</p>
                <p className="text-[9px] text-center leading-relaxed mt-1 px-3" style={{ color: "#666" }}>
                  Press START button to begin receiving signals
                </p>
              </div>

              {/* TRADE AMOUNT */}
              <div className="px-4 pb-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Trade Amount</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#1e2436" }}>
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
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1] cursor-pointer hover:border-white/20 transition-colors" style={{ background: "#1e2436" }}>
                  <span className="text-[12px] font-semibold text-white">Compounding</span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              {/* COMPOUNDING STEPS */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Compounding Steps</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#1e2436" }}>
                  <span className="text-[13px] font-bold text-white tabular-nums">0</span>
                  <div className="flex flex-col gap-px">
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg></button>
                    <button className="text-gray-500 hover:text-gray-200"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg></button>
                  </div>
                </div>
                <p className="text-[9px] mt-1.5" style={{ color: "#555" }}>0 = Unlimited steps</p>
              </div>

              {/* BROKER PROFIT % */}
              <div className="px-4 py-3">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.18em] mb-2">Broker Profit %</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.1]" style={{ background: "#1e2436" }}>
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
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-600 font-mono tracking-wider">
          Trinity · live interface · EUR/USD · Compounding strategy active
        </p>
      </motion.div>
    </section>
  );
}