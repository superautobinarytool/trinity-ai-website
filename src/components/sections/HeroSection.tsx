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

      {/* Software Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-20 w-full max-w-6xl mx-auto px-6"
        aria-hidden="true"
      >
        {/* Green glow halo */}
        <div className="absolute inset-x-16 -bottom-8 h-32 bg-[#22C55E]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute inset-x-32 -bottom-2 h-16 bg-emerald-400/10 blur-2xl rounded-full pointer-events-none" />

        {/* ── Main app window ── */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_50px_150px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]">

          {/* Title bar */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.07]"
               style={{ background: "#0a0d1a" }}>
            <div className="flex gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
            </div>
            {/* Nav tabs */}
            <div className="flex items-center gap-1 ml-2">
              {["Dashboard","Signals","History","Settings"].map((t, i) => (
                <span key={t} className={`px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${i === 0 ? "bg-white/[0.1] text-white" : "text-gray-500 hover:text-gray-300"}`}>{t}</span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                AUTO-TRADING ON
              </span>
              <span className="text-[10px] text-gray-600 font-mono">v2.4.1</span>
            </div>
          </div>

          {/* Body: sidebar + chart + signals */}
          <div className="flex" style={{ background: "#080b17", minHeight: "400px" }}>

            {/* Left sidebar — asset list */}
            <div className="w-44 shrink-0 border-r border-white/[0.06] flex flex-col" style={{ background: "#080b17" }}>
              <div className="px-3 py-2.5 border-b border-white/[0.04]">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Watchlist</p>
              </div>
              {[
                { pair: "EUR/USD", chg: "+1.87%", up: true  },
                { pair: "GBP/USD", chg: "-0.42%", up: false },
                { pair: "USD/JPY", chg: "+0.95%", up: true  },
                { pair: "BTC/USD", chg: "+3.21%", up: true  },
                { pair: "ETH/USD", chg: "+2.14%", up: true  },
                { pair: "XAU/USD", chg: "-0.18%", up: false },
              ].map(({ pair, chg, up }, i) => (
                <div key={pair}
                     className={`flex items-center justify-between px-3 py-2.5 border-b border-white/[0.03] cursor-pointer ${i === 0 ? "bg-green-500/[0.08] border-l-2 border-l-green-500" : "hover:bg-white/[0.03]"}`}>
                  <div>
                    <p className={`text-[11px] font-bold ${i === 0 ? "text-white" : "text-gray-400"}`}>{pair}</p>
                  </div>
                  <span className={`text-[10px] font-semibold tabular-nums ${up ? "text-green-400" : "text-red-400"}`}>{chg}</span>
                </div>
              ))}
              {/* Strategy selector */}
              <div className="mt-auto px-3 py-3 border-t border-white/[0.06]">
                <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1.5">Strategy</p>
                <div className="flex flex-col gap-1">
                  {[{n:"Linear",a:true},{n:"Compound",a:false},{n:"Martingale",a:false}].map(({n,a})=>(
                    <span key={n} className={`text-[10px] px-2 py-1 rounded font-semibold ${a ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-600"}`}>{n}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Center — chart area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chart toolbar */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05]" style={{ background: "#080b17" }}>
                <span className="text-white font-bold text-sm">EUR / USD</span>
                <span className="text-gray-500 text-xs">1.08524</span>
                <span className="text-green-400 text-xs font-semibold">▲ 0.00018</span>
                <div className="flex gap-1 ml-3">
                  {["1M","5M","15M","1H","4H"].map((t, i) => (
                    <span key={t} className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${i === 0 ? "bg-green-500/20 text-green-400" : "text-gray-600 hover:text-gray-400"}`}>{t}</span>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  live · scanning
                </div>
              </div>

              {/* Candlestick chart (CSS drawn) */}
              <div className="relative flex-1 flex items-end px-4 py-4 gap-[3px]" style={{ minHeight: "220px", background: "linear-gradient(180deg,#07091430 0%,#080b17 100%)" }}>
                {/* Grid lines */}
                {[0.25,0.5,0.75].map(p => (
                  <div key={p} className="absolute inset-x-0 border-t border-white/[0.03]" style={{ bottom: `${p*100}%` }} />
                ))}
                {/* Candles */}
                {[
                  {b:22,h:62,open:45,close:62,up:true},
                  {b:34,h:55,open:55,close:34,up:false},
                  {b:28,h:58,open:32,close:58,up:true},
                  {b:40,h:68,open:58,close:68,up:true},
                  {b:35,h:60,open:60,close:35,up:false},
                  {b:30,h:52,open:33,close:52,up:true},
                  {b:42,h:72,open:50,close:72,up:true},
                  {b:38,h:65,open:65,close:38,up:false},
                  {b:44,h:74,open:48,close:74,up:true},
                  {b:50,h:80,open:74,close:80,up:true},
                  {b:46,h:75,open:75,close:46,up:false},
                  {b:52,h:82,open:55,close:82,up:true},
                  {b:58,h:88,open:82,close:88,up:true},
                  {b:54,h:84,open:84,close:54,up:false},
                  {b:60,h:90,open:63,close:90,up:true},
                ].map(({b,h,up}, i) => {
                  const bodyBot = Math.min(b,h)*0.9, bodyTop = Math.max(b,h)*0.9;
                  const bodyH = bodyTop - bodyBot;
                  return (
                    <div key={i} className="relative flex-1 flex flex-col items-center justify-end" style={{ height: "100%" }}>
                      {/* wick */}
                      <div className="absolute w-px" style={{
                        bottom: `${b*0.9}%`, height: `${(h-b)*0.9}%`,
                        background: up ? "#22c55e80" : "#ef444480"
                      }}/>
                      {/* body */}
                      <motion.div
                        initial={{ scaleY: 0, originY: 1 }}
                        animate={inView ? { scaleY: 1 } : {}}
                        transition={{ delay: 0.6 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                        className="absolute w-full rounded-sm"
                        style={{
                          bottom: `${bodyBot}%`, height: `${Math.max(bodyH, 3)}%`,
                          background: up
                            ? "linear-gradient(to top,#16a34a,#22c55e)"
                            : "linear-gradient(to top,#b91c1c,#ef4444)",
                          transformOrigin: "bottom"
                        }}
                      />
                    </div>
                  );
                })}

                {/* CALL signal overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  className="absolute bottom-[72%] right-[12%] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/50 shadow-lg shadow-green-500/20"
                  style={{ background: "rgba(22,163,74,0.25)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-green-400 font-black text-sm">▲ CALL</span>
                  <span className="text-[10px] text-green-300 font-mono">91% conf.</span>
                </motion.div>
              </div>

              {/* Bottom stats strip */}
              <div className="grid grid-cols-4 divide-x divide-white/[0.05] border-t border-white/[0.05]">
                {[
                  {label:"Win Rate",  value:"80%+",  color:"#22c55e"},
                  {label:"Today P&L", value:"+$827",  color:"#22c55e"},
                  {label:"Execution", value:"<50ms", color:"#34d399"},
                  {label:"Trades",    value:"47",    color:"#a78bfa"},
                ].map(({label,value,color})=>(
                  <div key={label} className="px-4 py-3 text-center" style={{ background: "#080b17" }}>
                    <p className="text-base font-black tabular-nums" style={{color}}>{value}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — live signals */}
            <div className="w-52 shrink-0 border-l border-white/[0.06] flex flex-col" style={{ background: "#07090f" }}>
              <div className="px-3 py-2.5 border-b border-white/[0.04]">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">AI Signals</p>
              </div>

              {/* Signal cards */}
              {[
                {pair:"EUR/USD", dir:"CALL", conf:91, win:true, fired:true},
                {pair:"GBP/USD", dir:"PUT",  conf:87, win:true, fired:true},
                {pair:"BTC/USD", dir:"CALL", conf:84, win:false, fired:false},
              ].map(({pair,dir,conf,win,fired},i)=>(
                <motion.div
                  key={pair}
                  initial={{opacity:0, x:20}}
                  animate={inView ? {opacity:1,x:0} : {}}
                  transition={{delay: 0.9 + i*0.15, duration:0.4}}
                  className="mx-2 my-1.5 rounded-lg p-2.5 border border-white/[0.06]"
                  style={{ background: fired ? "rgba(22,163,74,0.08)" : "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-white">{pair}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${dir==="CALL" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{dir}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden mr-2">
                      <div className="h-full rounded-full bg-green-500" style={{width:`${conf}%`}} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{conf}%</span>
                  </div>
                  {fired && <p className="text-[9px] text-green-500 mt-1 font-semibold">● Executed on broker</p>}
                </motion.div>
              ))}

              {/* Recent trades */}
              <div className="px-3 py-2 border-t border-white/[0.05] mt-1">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Recent Trades</p>
                {[
                  {pair:"EUR/USD", result:"+$247", win:true},
                  {pair:"GBP/USD", result:"+$180", win:true},
                  {pair:"USD/JPY", result:"+$200", win:true},
                  {pair:"BTC/USD", result:"-$50",  win:false},
                  {pair:"EUR/USD", result:"+$200", win:true},
                ].map(({pair,result,win},i)=>(
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/[0.03]">
                    <span className="text-[10px] text-gray-500">{pair}</span>
                    <span className={`text-[10px] font-bold tabular-nums ${win ? "text-green-400" : "text-red-400"}`}>{result}</span>
                  </div>
                ))}
              </div>

              {/* Total profit badge */}
              <div className="mx-2 mb-2 mt-auto rounded-lg p-3 border border-green-500/25" style={{ background: "rgba(22,163,74,0.1)" }}>
                <p className="text-[9px] text-green-500 uppercase tracking-widest font-bold">Today's Profit</p>
                <p className="text-xl font-black text-green-400 tabular-nums mt-0.5">+$827</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-600 font-mono tracking-wider">
          Trinity AI dashboard — scanning 25+ assets in real time
        </p>
      </motion.div>
    </section>
  );
}
