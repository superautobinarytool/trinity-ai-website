import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

/* ─────────────────────────────────────────────────────────────────────────────
   DEMO VIDEOS — direct MP4 video URLs for each demo slot.
   Replace videoUrl values with your own links at any time.
   ───────────────────────────────────────────────────────────────────────────── */
const DEMOS = [
  {
    id: 0,
    videoUrl: "https://videotourl.com/videos/1773935023130-278c04c1-7eba-433d-bece-0b83ff5ce6ac.mp4",
    badge: "Live Signal Capture",
    accent: "#00e5be",
    title: "AI flags the winning trade before your eyes even register it.",
    sub:
      "Watch Trinity's engine scan EUR/USD in real time, classify a CALL signal with 84% confidence, and execute on Quotex — in under 200 milliseconds. You cannot do that manually.",
    bars: [35, 48, 42, 60, 52, 72, 61, 80, 68, 88, 76, 93, 82, 100],
  },
  {
    id: 1,
    videoUrl: "https://videotourl.com/videos/1773935156030-47640820-6d0a-4d6d-95c5-060180fe16bc.mp4",
    badge: "Zero-Delay Auto Execution",
    accent: "#22c55e",
    title: "47ms. Signal fires. Trade executes. You didn't touch anything.",
    sub:
      "The cursor moves on its own. The button clicks. The position opens. This is what sub-50ms machine execution actually looks like — an unedited live recording, not a slideshow.",
    bars: [28, 45, 36, 58, 48, 65, 55, 77, 64, 83, 70, 90, 78, 100],
  },
  {
    id: 2,
    videoUrl: "https://videotourl.com/videos/1773935176730-8b12e855-acbc-43b7-9c4b-f7275c85e57d.mp4",
    badge: "Linear Compounding — 30 Days",
    accent: "#4ade80",
    title: "$200 in. $1,100 out. Not one manual trade placed.",
    sub:
      "30 consecutive days on Linear Compounding strategy, EUR/USD. Every winning trade reinvested. Every dollar building exponentially on the last. The compounding snowball, fully automated.",
    bars: [20, 28, 35, 42, 50, 58, 67, 74, 80, 86, 90, 94, 97, 100],
  },
  {
    id: 3,
    videoUrl: "https://videotourl.com/videos/1773935195345-00e350ab-510c-48d9-9613-c2c53f8e2aa1.mp4",
    badge: "Martingale Recovery — Real Session",
    accent: "#f59e0b",
    title: "5 losses in a row. Still closed the session in profit.",
    sub:
      "Trinity's Martingale mode scales the stake after each loss, hits the recovery trade, and flips the session from red to green. Engineered specifically to turn losing streaks into winning outcomes.",
    bars: [60, 45, 30, 18, 12, 8, 25, 48, 70, 85, 92, 96, 99, 100],
  },
] as const;

type Demo = (typeof DEMOS)[number];

/* ── Animated placeholder / video embed ── */
function VideoArea({ demo, playing, onPlay, onUserPause }: { demo: Demo; playing: boolean; onPlay: () => void; onUserPause: () => void }) {
  if (playing && demo.videoUrl) {
    return (
      <video
        className="w-full h-full object-cover"
        src={demo.videoUrl}
        autoPlay
        muted
        controls
        playsInline
        title={demo.title}
        onPause={(e) => { if (!e.currentTarget.ended) onUserPause(); }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: "linear-gradient(160deg, #040e1e 0%, #071528 60%, #050a18 100%)" }}
    >
      {/* Animated chart bars */}
      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {demo.bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-[9px] rounded-t-sm"
            style={{
              background:
                i >= demo.bars.length - 4
                  ? `linear-gradient(to top, ${demo.accent}, ${demo.accent}aa)`
                  : "rgba(255,255,255,0.07)",
              transformOrigin: "bottom",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.05 + i * 0.03, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ height: `${h * 0.72}px` }} />
          </motion.div>
        ))}
      </div>

      {/* Live indicator strip */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: `${demo.accent}1a`,
          border: `1px solid ${demo.accent}44`,
          color: demo.accent,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: demo.accent }} />
        LIVE SESSION RECORDING
      </div>

      {/* Play button */}
      <motion.button
        onClick={onPlay}
        className="w-[68px] h-[68px] rounded-full flex items-center justify-center border-2"
        style={{
          background: demo.videoUrl ? `${demo.accent}22` : "rgba(255,255,255,0.04)",
          borderColor: demo.videoUrl ? demo.accent : "rgba(255,255,255,0.12)",
          boxShadow: demo.videoUrl ? `0 0 48px ${demo.accent}44` : "none",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={demo.videoUrl ? "Play demo video" : "Video coming soon"}
      >
        {demo.videoUrl ? (
          <svg viewBox="0 0 24 24" fill={demo.accent} className="w-7 h-7 translate-x-0.5" aria-hidden="true">
            <path d="M6.75 5.25 17.25 12 6.75 18.75V5.25Z" />
          </svg>
        ) : (
          <span className="text-gray-500 text-xs font-medium text-center leading-tight px-1">Coming<br />Soon</span>
        )}
      </motion.button>

      {demo.videoUrl && (
        <p className="text-xs font-semibold" style={{ color: `${demo.accent}cc` }}>
          Click to play
        </p>
      )}
    </div>
  );
}

/* ── Main section ── */
export default function VideoDemoSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir]             = useState(1);
  const [playing, setPlaying]     = useState(false);

  const autoScrollRef = useRef(true); // flips false when user takes manual control
  const activeIdxRef  = useRef(0);    // mirrors activeIdx for use inside interval closure

  // Keep ref in sync with state
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  // Autoplay + 3-second looping auto-advance when section enters viewport
  useEffect(() => {
    if (!inView) return;
    setPlaying(true);
    const id = setInterval(() => {
      if (!autoScrollRef.current) return;
      const next = (activeIdxRef.current + 1) % DEMOS.length;
      setDir(1);
      setActiveIdx(next);
      setPlaying(false);
      setTimeout(() => setPlaying(true), 560);
    }, 3000);
    return () => clearInterval(id);
  }, [inView]);

  const stopAutoScroll = () => { autoScrollRef.current = false; };

  const goTo = (i: number) => {
    if (i === activeIdx) return;
    stopAutoScroll();
    setDir(i > activeIdx ? 1 : -1);
    setActiveIdx(i);
    setPlaying(false);
    // Re-trigger autoplay after slide transition completes
    setTimeout(() => setPlaying(true), 560);
  };
  const prev = () => activeIdx > 0 && goTo(activeIdx - 1);
  const next = () => activeIdx < DEMOS.length - 1 && goTo(activeIdx + 1);

  const slideVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 72, filter: "blur(4px)" }),
    center: { opacity: 1, x: 0,       filter: "blur(0px)", transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
    exit:   (d: number) => ({ opacity: 0, x: d * -72, filter: "blur(4px)", transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }),
  };

  const demo = DEMOS[activeIdx];

  return (
    <Section id="demo" className="bg-[#040d1a]">
      <div ref={ref} className="max-w-5xl mx-auto px-4">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <Badge variant="cyan" className="mb-5">Platform In Action</Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.08]">
            Watch it trade.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Then try to say you don&apos;t need it.</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-8">
            Four unedited sessions from real Trinity users. No cherry-picking. No cuts.
            Just raw, unfiltered performance — captured live.
          </p>
        </motion.div>

        {/* ── Slide counter + dots + arrows ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center justify-between mb-6 sm:mb-7 gap-2"
        >
          {/* Counter */}
          <span className="text-sm font-mono text-gray-600 tabular-nums select-none">
            {String(activeIdx + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(DEMOS.length).padStart(2, "0")}
          </span>

          {/* Pill dots */}
          <div className="flex gap-2 items-center">
            {DEMOS.map((d, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to demo ${i + 1}`}
                style={{
                  height: 8,
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  width: i === activeIdx ? 28 : 8,
                  background: i === activeIdx ? demo.accent : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={activeIdx === 0}
              className="w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] disabled:opacity-25 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
              aria-label="Previous demo"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={activeIdx === DEMOS.length - 1}
              className="w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] disabled:opacity-25 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
              aria-label="Next demo"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

            {/* ── Demo Card ── */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={activeIdx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${demo.accent}2a`,
              boxShadow: `0 0 80px ${demo.accent}12, 0 48px 96px rgba(0,0,0,0.65)`,
            }}
          >
            {/* Badge bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: `1px solid ${demo.accent}1e`, background: "rgba(4,14,30,0.9)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: demo.accent }}
                />
                <span className="text-xs font-bold tracking-wide uppercase" style={{ color: demo.accent }}>
                  {demo.badge}
                </span>
              </div>
              <span className="text-[11px] text-gray-600 font-mono tracking-wide">
                Trinity AI · Verified Session
              </span>
            </div>

            {/* 16:9 video area */}
            <div className="relative w-full" style={{ paddingTop: "56.25%", background: "#040e1e" }}>
              <div className="absolute inset-0">
                <VideoArea demo={demo} playing={playing} onPlay={() => setPlaying(true)} onUserPause={stopAutoScroll} />
              </div>
            </div>

            {/* Title + description */}
            <div
              className="px-4 py-5 sm:px-8 sm:py-7 grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-start"
              style={{ background: "linear-gradient(180deg, #040e1e 0%, #030b18 100%)" }}
            >
              <div>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-snug">
                  {demo.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{demo.sub}</p>
              </div>

              {/* Trust chip */}
              <div
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold self-center"
                style={{
                  background: `${demo.accent}12`,
                  border: `1px solid ${demo.accent}30`,
                  color: demo.accent,
                }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Session
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Mini thumbnail strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-2 sm:gap-3 mt-5 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => goTo(i)}
              className="flex-1 rounded-xl overflow-hidden transition-all duration-300 text-left"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${i === activeIdx ? d.accent + "66" : "rgba(255,255,255,0.07)"}`,
                boxShadow: i === activeIdx ? `0 0 16px ${d.accent}22` : "none",
                opacity: i === activeIdx ? 1 : 0.55,
              }}
              aria-label={`Switch to demo: ${d.badge}`}
            >
              <div
                className="px-3 py-3"
                style={{ borderBottom: `1px solid ${d.accent}16` }}
              >
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase"
                  style={{ color: i === activeIdx ? d.accent : "rgba(255,255,255,0.35)" }}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${i === activeIdx ? "animate-pulse" : ""}`}
                    style={{ background: d.accent, opacity: i === activeIdx ? 1 : 0.5 }}
                  />
                  {d.badge.split(" ")[0]}
                </span>
              </div>
              <div className="px-3 py-2">
                <p className="text-[11px] text-gray-400 leading-tight line-clamp-2 hidden sm:block">{d.title}</p>
              </div>
            </button>
          ))}
        </motion.div>

      </div>
    </Section>
  );
}
