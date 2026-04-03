import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/ui/Icons";

/* ─────────────────────────────────────────────────────────────────────────────
   VIDEO TESTIMONIALS — direct MP4 video URLs for each portrait card.
   Replace videoUrl values with your own links at any time.
   ───────────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    id: 0,
    videoUrl: "https://videotourl.com/videos/1775188956797-5b0db00b-7038-48e7-837c-c2f2bc978f39.mp4",
    name: "Aman D.",
    role: "Pocket Option Trader",
    flag: "🇮🇳",
    profit: "+$2,100",
    period: "This Month",
    stars: 5,
    quote:
      "I started with $300 and turned compounding on from day one. By end of month I had $2,100. Every win rolled straight into the next trade and the growth was exponential. Trinity just kept stacking gains — genuinely life-changing.",
    color: "#f59e0b",
  },
  {
    id: 1,
    videoUrl: "https://videotourl.com/videos/1775188104760-21e0434f-14ec-4ed9-ba67-f72f58456861.mp4",
    name: "Nour A.",
    role: "Binary Options Trader",
    flag: "🇪🇬",
    profit: "+$1,580",
    period: "Week 2",
    stars: 5,
    quote:
      "I never believed a bot could do this consistently. Trinity proved me wrong. Every session I just set it up, walk away, and come back to green. It's completely changed how I trade.",
    color: "#22c55e",
  },
  {
    id: 2,
    videoUrl: "https://videotourl.com/videos/1775188909408-77078c81-6220-4a73-ba05-dbd4307525f8.mp4",
    name: "AntinR.",
    role: "Quotex Trader",
    flag: "🇨🇴",
    profit: "+$890",
    period: "First Session",
    stars: 5,
    quote:
      "Trinity removed every emotional decision from my hands. No more chasing losses, no overtrading, no revenge trades. Now I just watch the profit graph rise.",
    color: "#10b981",
  },
  {
    id: 3,
    videoUrl: "https://videotourl.com/videos/1775189451449-00222357-cce8-4ce1-aaca-110836ed66f5.mp4",
    name: "Marcus R.",
    role: "Deriv Trader",
    flag: "🇿🇦",
    profit: "+$440",
    period: "Day One",
    stars: 5,
    quote:
      "Connected Trinity to Deriv, enabled Compounding mode, pressed START. Didn't touch it for 4 hours. Came back to $440 profit. I'm a complete believer now.",
    color: "#22c55e",
  },
  {
    id: 4,
    videoUrl: "https://videotourl.com/videos/1775189939337-d9b205e1-041b-4b43-a38c-7ce406777880.mp4",
    name: "James T.",
    role: "IQ Option Trader",
    flag: "🇳🇬",
    profit: "+$3,200",
    period: "30 Days",
    stars: 5,
    quote:
      "847 trades tracked over 30 days. 82.4% winners. The compounding strategy turned my $200 starting balance into $1,100 in a month. I've never seen anything like it.",
    color: "#16a34a",
  },
  {
    id: 5,
    videoUrl: "https://videotourl.com/videos/1775191242938-9a5a57ac-96c6-4098-845c-d9954336ceaf.mp4",
    name: "Carlos M.",
    role: "Full-Time Trader",
    flag: "🇪🇸",
    profit: "+$1,240",
    period: "Week 1",
    stars: 5,
    quote:
      "I was manually trading binary options for 2 years and never hit consistent profit. First week with Trinity on Quotex I was up $1,240. The bot literally does not hesitate. It's insane.",
    color: "#4ade80",
  },
];

const CARD_W   = 252;                        // portrait card width  (px)
const CARD_H   = Math.round(CARD_W * 16 / 9); // 9:16 = 448 px tall
const GAP      = 28;                         // gap between cards
const ITEM_W   = CARD_W + GAP;              // track step per card  (280 px)

/* ── Stars row ── */
function Stars({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className="w-3.5 h-3.5"
          style={{ color: i < count ? "#fbbf24" : "rgba(255,255,255,0.15)" }}
        />
      ))}
    </div>
  );
}

/* ── Individual testimonial card ── */
function TestimonialCard({
  t,
  isCenter,
  sectionInView,
  onUserPause,
  onClick,
}: {
  t: (typeof TESTIMONIALS)[number];
  isCenter: boolean;
  sectionInView: boolean;
  onUserPause: () => void;
  onClick?: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  // Reset player when card leaves center focus
  useEffect(() => {
    if (!isCenter) setPlaying(false);
  }, [isCenter]);

  // Auto-play the center card when the section enters the viewport
  useEffect(() => {
    if (isCenter && sectionInView) setPlaying(true);
  }, [isCenter, sectionInView]);

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex flex-col"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: "linear-gradient(175deg, #080f1e 0%, #050b16 100%)",
        border: isCenter
          ? `1.5px solid ${t.color}55`
          : "1.5px solid rgba(255,255,255,0.06)",
        boxShadow: isCenter
          ? `0 0 80px ${t.color}25, 0 32px 80px rgba(0,0,0,0.7)`
          : "0 16px 40px rgba(0,0,0,0.5)",
        cursor: isCenter ? "default" : "pointer",
      }}
      onClick={!isCenter ? onClick : undefined}
      tabIndex={!isCenter ? 0 : undefined}
      onKeyDown={(e) => { if (!isCenter && (e.key === "Enter" || e.key === " ")) onClick?.(); }}
      role={!isCenter ? "button" : undefined}
      aria-label={!isCenter ? `View ${t.name}'s testimonial` : undefined}
    >
      {/* ── Video area (top ~65%) ── */}
      <div className="flex-1 relative overflow-hidden">
        {t.videoUrl && isCenter && playing ? (
          /* Native MP4 video — only mounted when center + play pressed */
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={t.videoUrl}
            autoPlay
            muted
            controls
            playsInline
            title={`${t.name} testimonial`}
            onPause={(e) => { if (!e.currentTarget.ended) onUserPause(); }}
          />
        ) : (
          /* Placeholder / thumbnail */
          <>
            {/* Subtle gradient bg */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${t.color}18 0%, transparent 70%),
                             linear-gradient(180deg, #06101f 0%, #040c18 100%)`,
              }}
            />

            {/* Floating profit badge */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
                style={{
                  background: `${t.color}18`,
                  border: `1px solid ${t.color}44`,
                  color: t.color,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: t.color }} />
                {t.profit} &nbsp;{t.period}
              </div>
            </div>

            {/* Quote text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-16 pb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 mb-3 opacity-25"
                fill={t.color}
                aria-hidden="true"
              >
                <path d="M11.048 3H3v8.571C3 15.66 6.476 19 10.714 19v-2.857c-2.095 0-4.762-1.715-4.762-4.572H11.048V3zm10.904 0H13.9v8.571C13.9 15.66 17.376 19 21.614 19v-2.857c-2.095 0-4.762-1.715-4.762-4.572h4.1V3z" />
              </svg>
              <p
                className="text-center text-[13px] leading-[1.65] font-light"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Play button — only on center card */}
            {isCenter && (
              <motion.button
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white"
                style={{
                  background: t.videoUrl ? t.color : "rgba(255,255,255,0.08)",
                  boxShadow: t.videoUrl ? `0 0 28px ${t.color}55` : "none",
                  cursor: t.videoUrl ? "pointer" : "default",
                }}
                onClick={() => t.videoUrl && setPlaying(true)}
                whileHover={t.videoUrl ? { scale: 1.05 } : {}}
                whileTap={t.videoUrl ? { scale: 0.96 } : {}}
                aria-label={t.videoUrl ? "Play testimonial video" : "Video coming soon"}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="white"
                  className="w-4 h-4"
                  aria-hidden="true"
                  style={{ opacity: t.videoUrl ? 1 : 0.4 }}
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {t.videoUrl ? "Watch Video" : "Video Coming Soon"}
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* ── Bottom info strip ── */}
      <div
        className="flex-shrink-0 px-4 py-4 flex items-center gap-3"
        style={{
          borderTop: `1px solid ${isCenter ? t.color + "30" : "rgba(255,255,255,0.05)"}`,
          background: isCenter
            ? `linear-gradient(90deg, ${t.color}0d 0%, transparent 100%)`
            : "transparent",
        }}
      >
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}88 100%)` }}
          aria-hidden="true"
        >
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-bold truncate"
              style={{ color: isCenter ? "white" : "rgba(255,255,255,0.55)" }}
            >
              {t.name}
            </span>
            <span className="text-xs">{t.flag}</span>
          </div>
          <Stars count={t.stars} color={t.color} />
        </div>

        {/* Result badge */}
        {isCenter && (
          <div
            className="flex-shrink-0 text-right text-[11px] font-black"
            style={{ color: t.color }}
          >
            {t.profit}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main section ── */
export default function VideoTestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });

  /* Centering math */
  const containerRef               = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState<number | null>(null);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setContainerW(el.offsetWidth);
      setMounted(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [activeIdx, setActiveIdx] = useState(0);

  const autoScrollRef = useRef(true); // flips false when user takes manual control
  const activeIdxRef  = useRef(0);    // mirrors activeIdx for use inside interval closure

  // Keep ref in sync with state
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  // 5-second looping auto-advance when section enters viewport
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      if (!autoScrollRef.current) return;
      const next = (activeIdxRef.current + 1) % TESTIMONIALS.length;
      setActiveIdx(next);
    }, 5000);
    return () => clearInterval(id);
  }, [inView]);

  const stopAutoScroll = () => { autoScrollRef.current = false; };

  const trackX =
    containerW != null
      ? (containerW - CARD_W) / 2 - activeIdx * ITEM_W
      : 0;

  const goTo = (i: number) => {
    if (i < 0 || i >= TESTIMONIALS.length) return;
    stopAutoScroll();
    setActiveIdx(i);
  };
  const prev = () => goTo(activeIdx - 1);
  const next = () => goTo(activeIdx + 1);

  const activeColor = TESTIMONIALS[activeIdx].color;

  return (
    <Section id="video-testimonials" className="bg-[#050508] overflow-hidden">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <Badge variant="green" className="mb-5">Real People · Real Results</Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4 sm:mb-5 leading-[1.1]">
            They filmed it themselves.
            <br />
            <span className="gradient-text">No script. No filters. No edits.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-light max-w-2xl mx-auto leading-7 sm:leading-8">
            These aren&apos;t actors. These are Trinity users who hit record on their phones, opened
            their broker accounts, and showed you exactly what Trinity did for them.
          </p>
        </motion.div>

        {/* ── 3-card carousel ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: mounted ? 1 : 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Slider container — clipped, with edge gradient masks */}
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: CARD_H + 16 }}
          >
            {/* Left fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-20"
              style={{
                width: "20%",
                background: "linear-gradient(90deg, #050508 15%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            {/* Right fade */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-20"
              style={{
                width: "20%",
                background: "linear-gradient(270deg, #050508 15%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Track */}
            <motion.div
              className="absolute top-2 flex items-center"
              style={{ gap: GAP, left: 0 }}
              animate={{ x: trackX }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              {TESTIMONIALS.map((t, i) => {
                const pos     = i - activeIdx;
                const isCenter = pos === 0;
                const inView3  = Math.abs(pos) <= 1;

                return (
                  <motion.div
                    key={t.id}
                    animate={{
                      scale:  isCenter ? 1 : 0.84,
                      filter: isCenter ? "blur(0px) brightness(1)" : "blur(8px) brightness(0.38)",
                      zIndex: isCenter ? 10 : 1,
                    }}
                    transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flexShrink: 0,
                      transformOrigin: "center center",
                      opacity: inView3 ? 1 : 0,
                    }}
                  >
                    <TestimonialCard
                      t={t}
                      isCenter={isCenter}
                      sectionInView={inView}
                      onUserPause={stopAutoScroll}
                      onClick={() => {
                        if (pos === -1) prev();
                        if (pos === 1) next();
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* ── Navigation ── */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            {/* Dot indicators */}
            <div className="flex gap-2.5 items-center">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`View testimonial ${i + 1}`}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    transition: "all 0.35s ease",
                    width: i === activeIdx ? 30 : 8,
                    background: i === activeIdx ? t.color : "rgba(255,255,255,0.18)",
                  }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={prev}
                  disabled={activeIdx === 0}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Name label */}
                <div
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold"
                  style={{
                    background: `${activeColor}12`,
                    border: `1px solid ${activeColor}35`,
                    color: activeColor,
                    minWidth: 140,
                    maxWidth: 220,
                    justifyContent: "center",
                    transition: "all 0.35s ease",
                  }}
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ background: activeColor }} />
                  {TESTIMONIALS[activeIdx].name} &nbsp;·&nbsp; {TESTIMONIALS[activeIdx].profit}
                </div>

                <button
                  onClick={next}
                  disabled={activeIdx === TESTIMONIALS.length - 1}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

            {/* Trust row */}
            <p className="text-xs text-gray-600 font-light text-center">
              {TESTIMONIALS.length} verified testimonials &nbsp;·&nbsp; 11,000+ active traders &nbsp;·&nbsp; 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
