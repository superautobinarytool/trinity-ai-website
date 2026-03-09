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
        <div className="relative rounded-xl overflow-hidden shadow-[0_50px_160px_rgba(0,0,0,0.9)] border border-white/[0.08]" style={{ background: "#1c1c1c" }}>

          {/* ── TOP BAR ── */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-white/[0.07]" style={{ background: "#252525" }}>
            {/* Pair selector */}
            <div className="flex items-center gap-2">
              <div className="flex rounded overflow-hidden border border-white/[0.1] text-[11px] font-bold">
                <span className="px-3 py-1" style={{ background: "#a855f7", color: "#fff" }}>CURRENCIES</span>
                <span className="px-3 py-1 text-gray-500" style={{ background: "#1c1c1c" }}>CRYPTO</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-white/[0.12] text-white text-[12px] font-bold" style={{ background: "#2a2a2a" }}>
                EUR/USD
                <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {/* Trading mode toggle */}
            <div className="flex items-center gap-2 ml-4">
              <div className="w-8 h-4 rounded-full border border-white/20 flex items-center px-0.5" style={{ background: "#333" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#555" }} />
              </div>
              <span className="text-[11px] text-gray-400 font-semibold">MANUAL</span>
            </div>
            <div className="ml-2 text-[10px] text-gray-600">Trading Mode</div>
            {/* Version badge */}
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
              <span className="text-[10px] text-gray-600 font-mono">trinity v2.4</span>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex" style={{ background: "#1c1c1c" }}>

            {/* Icon sidebar — matches screenshot left nav */}
            <div className="w-11 shrink-0 border-r border-white/[0.06] flex flex-col items-center py-3 gap-4" style={{ background: "#1a1a1a" }}>
              {[
                <svg key="menu" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
                <svg key="chart" className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
                <svg key="user" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
                <svg key="cog"  className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
              ].map((icon, i) => (
                <button key={i} className={`w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-gray-200 transition-colors ${i===1 ? "text-blue-400" : ""}`}>{icon}</button>
              ))}
              <div className="mt-auto">
                <button className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
              </div>
            </div>

            {/* Center — chart + profit curve */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Candlestick chart area — blue border exactly like screenshot */}
              <div className="relative m-2 rounded border-2" style={{ borderColor: "#1e6fb5", background: "#000", minHeight: "230px" }}>
                {/* Price axis right */}
                <div className="absolute right-0 top-0 bottom-0 w-14 flex flex-col justify-between py-2 pr-1.5 text-right pointer-events-none">
                  {["1.1590","1.1585","1.1580","1.1576","1.1570","1.1565","1.1560","1.1555","1.1550","1.1545"].map(p => (
                    <span key={p} className="text-[8px] font-mono" style={{ color: "#888" }}>{p}</span>
                  ))}
                </div>
                {/* Current price chip */}
                <div className="absolute right-14 top-[48%] px-1.5 py-0.5 text-[9px] font-bold text-black font-mono" style={{ background: "#22d4aa", borderRadius: "2px" }}>1.15763</div>

                {/* Grid */}
                <div className="absolute inset-0 right-14" style={{ paddingBottom: "18px" }}>
                  {[0.2,0.4,0.6,0.8].map(p => (
                    <div key={p} className="absolute inset-x-0 border-t border-dashed" style={{ top: `${p*100}%`, borderColor: "rgba(255,255,255,0.05)" }} />
                  ))}

                  {/* Time axis */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between px-1 pb-0.5">
                    {["9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45"].map(t => (
                      <span key={t} className="text-[7px] font-mono" style={{ color: "#666" }}>{t}</span>
                    ))}
                  </div>

                  {/* Candles — teal/red exactly like screenshot */}
                  <div className="absolute inset-x-1 top-1" style={{ bottom: "18px", display: "flex", alignItems: "flex-end", gap: "2px" }}>
                    {[
                      {lo:18,hi:74,o:38,c:62,up:true},{lo:30,hi:68,o:62,c:38,up:false},{lo:22,hi:65,o:36,c:58,up:true},
                      {lo:28,hi:72,o:50,c:70,up:true},{lo:20,hi:66,o:66,c:28,up:false},{lo:15,hi:60,o:28,c:52,up:true},
                      {lo:25,hi:68,o:42,c:62,up:true},{lo:32,hi:72,o:65,c:35,up:false},{lo:28,hi:65,o:38,c:60,up:true},
                      {lo:42,hi:78,o:58,c:75,up:true},{lo:38,hi:74,o:74,c:40,up:false},{lo:35,hi:70,o:42,c:68,up:true},
                      {lo:55,hi:88,o:66,c:85,up:true},{lo:50,hi:84,o:84,c:52,up:false},{lo:48,hi:82,o:55,c:78,up:true},
                      {lo:60,hi:92,o:72,c:89,up:true},{lo:55,hi:88,o:88,c:58,up:false},{lo:54,hi:85,o:60,c:82,up:true},
                      {lo:62,hi:90,o:74,c:87,up:true},{lo:58,hi:88,o:87,c:60,up:false},{lo:56,hi:84,o:60,c:80,up:true},
                      {lo:65,hi:92,o:77,c:89,up:true},{lo:60,hi:88,o:88,c:62,up:false},{lo:58,hi:88,o:64,c:85,up:true},
                      {lo:64,hi:94,o:76,c:91,up:true},{lo:60,hi:90,o:90,c:62,up:false},{lo:58,hi:88,o:64,c:86,up:true},
                      {lo:68,hi:96,o:80,c:93,up:true},{lo:62,hi:90,o:90,c:64,up:false},{lo:60,hi:90,o:66,c:88,up:true},
                      {lo:70,hi:96,o:82,c:94,up:true},{lo:65,hi:92,o:92,c:67,up:false},
                    ].map(({ lo, hi, o, c, up }, i) => {
                      const scale = 0.88;
                      const loP = lo * scale, hiP = hi * scale;
                      const oP = o * scale, cP = c * scale;
                      const bodyLo = Math.min(oP, cP), bodyHi = Math.max(oP, cP);
                      return (
                        <div key={i} className="relative flex-1 flex items-end" style={{ height: "100%" }}>
                          {/* wick */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-px"
                               style={{ bottom: `${loP}%`, height: `${hiP - loP}%`, background: up ? "#22d4aa" : "#ef4444", opacity: 0.8 }} />
                          {/* body */}
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={inView ? { scaleY: 1 } : {}}
                            transition={{ delay: 0.55 + i * 0.025, duration: 0.35, ease: "easeOut" }}
                            className="absolute w-full"
                            style={{
                              bottom: `${bodyLo}%`,
                              height: `${Math.max(bodyHi - bodyLo, 2)}%`,
                              background: up ? "#22d4aa" : "#ef4444",
                              transformOrigin: "bottom",
                              borderRadius: "1px",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TradingView watermark */}
                <div className="absolute bottom-4 left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#333" }}>
                  <span className="text-[8px] font-black text-blue-400">TV</span>
                </div>
              </div>

              {/* ── PROFIT CURVE ── */}
              <div className="mx-2 mb-2 rounded border border-white/[0.06]" style={{ background: "#141414" }}>
                <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.05]">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#22d4aa" }} />
                  <span className="text-[10px] font-bold text-gray-300">PROFIT CURVE</span>
                  <span className="text-[9px] text-gray-600">◆ LAST 100 TRADES</span>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-[11px] font-black" style={{ color: "#22c55e" }}>+$511.04</span>
                    <span className="text-[9px] text-gray-500">100 trades</span>
                    <span className="text-[9px] font-bold" style={{ color: "#22c55e" }}>◆ 85.0% win</span>
                  </div>
                </div>

                {/* Area chart — matches the steadily rising green curve */}
                <div className="relative px-2 py-1" style={{ height: "80px" }}>
                  <svg className="w-full h-full" viewBox="0 0 400 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {/* Rising curve matching screenshot — almost flat start, strong rise toward end */}
                    <motion.path
                      d="M0,66 C20,65 40,63 60,62 C80,61 90,60 110,58 C130,56 140,54 160,51 C180,48 190,45 210,42 C230,38 240,34 260,30 C280,25 290,20 310,15 C330,10 350,6 370,3 L400,1 L400,70 L0,70 Z"
                      fill="url(#profitGrad)"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 1.0, duration: 0.8 }}
                    />
                    <motion.path
                      d="M0,66 C20,65 40,63 60,62 C80,61 90,60 110,58 C130,56 140,54 160,51 C180,48 190,45 210,42 C230,38 240,34 260,30 C280,25 290,20 310,15 C330,10 350,6 370,3 L400,1"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ delay: 1.0, duration: 1.4, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute left-2 bottom-1 text-[8px] text-gray-600 font-mono">↑ Older</div>
                  <div className="absolute right-2 bottom-1 text-[8px] text-gray-600 font-mono">Latest ↑</div>
                </div>

                {/* Signal history strip at bottom */}
                <div className="flex items-center gap-3 px-3 py-2 border-t border-white/[0.05]">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2563eb" }} />
                  <span className="text-[9px] text-gray-500 font-bold">SIGNAL HISTORY (LAST 10)</span>
                  <div className="flex gap-1 ml-2">
                    {[1,1,1,0,1,1,1,0,1,1].map((win, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ delay: 1.2 + i * 0.06, type: "spring", stiffness: 300 }}
                        className="w-5 h-5 rounded text-[8px] font-black flex items-center justify-center"
                        style={{ background: win ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: win ? "#4ade80" : "#f87171" }}
                      >{win ? "▲" : "▼"}</motion.div>
                    ))}
                  </div>
                  <span className="ml-auto text-[9px] font-bold text-green-400">8 CALL</span>
                  <span className="text-[9px] font-bold text-red-400">2 PUT</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT CONTROL PANEL — exact match to screenshot ── */}
            <div className="w-48 shrink-0 border-l border-white/[0.07] flex flex-col" style={{ background: "#1c1c1c" }}>

              {/* TIMEFRAME */}
              <div className="px-3 pt-3 pb-2 border-b border-white/[0.06]">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Timeframe</p>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded border border-white/[0.1] text-white text-[11px] font-semibold" style={{ background: "#2a2a2a" }}>
                  1 Minute
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* START / STOP buttons */}
              <div className="flex gap-2 px-3 py-3 border-b border-white/[0.06]">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[11px] font-black text-white transition-transform hover:scale-[1.03] active:scale-[0.97]" style={{ background: "#1d4ed8" }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  START
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[11px] font-black text-white" style={{ background: "#dc2626" }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
                  STOP
                </button>
              </div>

              {/* READY TO START status box */}
              <div className="mx-3 mt-3 rounded border border-white/[0.08] flex flex-col items-center justify-center py-4" style={{ background: "#252525" }}>
                {/* Pause icon */}
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2 h-6 rounded-sm" style={{ background: "#555" }} />
                  <div className="w-2 h-6 rounded-sm" style={{ background: "#555" }} />
                </div>
                <p className="text-[11px] font-black text-white tracking-wide">READY TO START</p>
                <p className="text-[8px] text-gray-500 mt-1 text-center leading-tight px-2">Press START button to begin receiving signals</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-0 mt-3 border-t border-white/[0.06]">
                {/* TRADE AMOUNT */}
                <div className="px-3 py-2.5 border-b border-white/[0.05]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Trade Amount</p>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded border border-white/[0.1] text-white text-[12px] font-bold tabular-nums" style={{ background: "#2a2a2a" }}>
                    10
                    <div className="flex flex-col gap-0.5">
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* TRADING STRATEGY */}
                <div className="px-3 py-2.5 border-b border-white/[0.05]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Trading Strategy</p>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded border border-white/[0.1] text-white text-[11px] font-semibold" style={{ background: "#2a2a2a" }}>
                    Compounding
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* COMPOUNDING STEPS */}
                <div className="px-3 py-2.5 border-b border-white/[0.05]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Compounding Steps</p>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded border border-white/[0.1] text-white text-[12px] font-bold tabular-nums" style={{ background: "#2a2a2a" }}>
                    0
                    <div className="flex flex-col gap-0.5">
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-600 mt-1">0 = Unlimited steps</p>
                </div>

                {/* BROKER PROFIT % */}
                <div className="px-3 py-2.5">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Broker Profit %</p>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded border border-white/[0.1] text-white text-[12px] font-bold tabular-nums" style={{ background: "#2a2a2a" }}>
                    77
                    <div className="flex flex-col gap-0.5">
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                      <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE SETTINGS */}
              <div className="px-3 pb-3 mt-auto">
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded text-[11px] font-black text-white transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ background: "#16a34a" }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  SAVE SETTINGS
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-600 font-mono tracking-wider">
          Trinity — live interface · EUR/USD · Compounding strategy active
        </p>
      </motion.div>
    </section>
  );
}
