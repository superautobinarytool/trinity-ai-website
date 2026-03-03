import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

const REVIEWS = [
  {
    title: "Best trading tool I have ever used",
    body: "Titans Algo completely changed how I trade. The signals are insanely accurate and the Discord community is incredibly supportive. Worth every penny.",
    author: "Alex M.",
    role: "Day Trader",
    initials: "AM",
    color: "#22c55e",
  },
  {
    title: "Up 40% in my first month",
    body: "I was skeptical at first but after the first week of live signals I was already up big. The AI picks up patterns I never would have caught alone.",
    author: "Sarah K.",
    role: "Swing Trader",
    initials: "SK",
    color: "#16a34a",
  },
  {
    title: "Incredible accuracy, incredible support",
    body: "The win rate speaks for itself. I have tried 5 other services and nothing comes close to the consistency Titans Algo delivers week after week.",
    author: "James T.",
    role: "Crypto Investor",
    initials: "JT",
    color: "#10b981",
  },
  {
    title: "Pays for itself in the first trade",
    body: "One signal covered my entire annual subscription. The fundamental analysis mixed with the AI layer is genuinely next-level. Highly recommend.",
    author: "Priya D.",
    role: "Options Trader",
    initials: "PD",
    color: "#f59e0b",
  },
  {
    title: "Life-changing for my portfolio",
    body: "Before Titans Algo I was making emotional trades. Now I follow the system and my drawdowns have shrunk massively while my gains grew.",
    author: "Marcus R.",
    role: "Position Trader",
    initials: "MR",
    color: "#22c55e",
  },
  {
    title: "The Discord alpha alone is worth it",
    body: "Even if you ignore the signals, the Discord channel has insight from traders with 10+ years experience. The whole ecosystem is top-tier.",
    author: "Lily C.",
    role: "Forex Trader",
    initials: "LC",
    color: "#38bdf8",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-yellow-400" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="w-4 h-4" />
      ))}
    </div>
  );
}

function TrustpilotCard() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 rounded-2xl bg-white p-8 shadow-lg">
      {/* Trustpilot star */}
      <div className="w-14 h-14 rounded-xl bg-[#00b67a] flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8" aria-hidden="true">
          <path d="M12 2l2.9 8.9H23l-7.4 5.4 2.8 8.7-7.4-5.4-7.4 5.4 2.8-8.7L1 10.9h8.1z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-black text-xl text-gray-900">Trustpilot</p>
        <div className="flex justify-center gap-0.5 mt-1 text-[#00b67a]">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="w-5 h-5" />
          ))}
        </div>
        <p className="mt-3 text-gray-600 text-sm leading-snug">Check out our other reviews and see what real traders are saying</p>
      </div>
      <a
        href="https://www.trustpilot.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold text-sm hover:bg-gray-900 hover:text-white transition-colors duration-200"
      >
        See More Reviews
      </a>
    </div>
  );
}

const CARDS_PER_PAGE = 4 as const; // 4 review cards + 1 Trustpilot = show 4 at once on desktop

export default function TestimonialsSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // We show CARDS_PER_PAGE-1 reviews + Trustpilot card = 4 visible; total pages based on REVIEWS length
  const VISIBLE = 3; // review cards per page
  const totalPages = Math.ceil(REVIEWS.length / VISIBLE);
  const [page, setPage] = useState(0);
  const [dir, setDir]   = useState(1);

  const prev = () => { setDir(-1); setPage(p => Math.max(0, p - 1)); };
  const next = () => { setDir(1);  setPage(p => Math.min(totalPages - 1, p + 1)); };

  const pageReviews = REVIEWS.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit:   (d: number) => ({ x: d * -60, opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <Section id="testimonials" className="overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white">
            Real traders,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg,#22c55e,#16a34a)" }}
            >
              real stories
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg sm:text-xl font-light">Trusted by 11,000+ active traders worldwide</p>
        </motion.div>

        {/* Carousel row */}
        <div className="relative flex items-center gap-4">
          {/* Prev arrow */}
          <button
            onClick={prev}
            disabled={page === 0}
            className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {/* Cards viewport */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {pageReviews.map((r) => (
                  <div
                    key={r.author}
                    className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1327] p-6 h-full"
                  >
                    <Stars />
                    <p className="font-bold text-white text-base leading-snug line-clamp-2">{r.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-4">{r.body}</p>
                    <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/[0.07]">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: `${r.color}33`, border: `1.5px solid ${r.color}66` }}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{r.author}</p>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Always show Trustpilot as 4th card */}
                <TrustpilotCard />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            disabled={page === totalPages - 1}
            className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white"
            aria-label="Next reviews"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }}
              aria-label={`Go to page ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${i === page ? "bg-green-400 w-6" : "bg-white/25 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
