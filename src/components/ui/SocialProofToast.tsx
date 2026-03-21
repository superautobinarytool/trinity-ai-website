/**
 * SocialProofToast — rotating purchase notification widget.
 *
 * Behaviour:
 *  • First toast appears after a random 5–9 s delay (feels organic, not instant)
 *  • Each toast is visible for 5.5 s with an animated drain bar
 *  • After hiding, a random 18–32 s gap before the next one (not spammy)
 *  • 50 international entries are shown in shuffled order; reshuffled on exhaustion
 *  • Desktop: fixed bottom-right (320 px wide)
 *  • Mobile:  full-width with 16 px side margins, sits above the bottom bar
 *  • Clicking the toast dismisses it early (good UX)
 *  • aria-live="polite" so screen readers announce arrivals non-intrusively
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Notification {
  name:     string;
  location: string;
  cc:       string;   // ISO 3166-1 alpha-2 country code (lowercase) for flagcdn.com
  plan:     string;
}

type ActiveNotification = Notification & { hoursAgo: number; uid: number };

// ── Data — 50 entries, diverse geography, skewed toward Pro Annual ─────────────
const NOTIFICATIONS: Notification[] = [
  { name: "James T.",      location: "New York, US",          cc: "us", plan: "Pro Annual"      },
  { name: "Sarah M.",      location: "London, UK",            cc: "gb", plan: "Starter Annual"  },
  { name: "Ahmad K.",      location: "Dubai, UAE",            cc: "ae", plan: "Pro Monthly"     },
  { name: "Priya S.",      location: "Singapore",             cc: "sg", plan: "Starter Annual"  },
  { name: "Lucas B.",      location: "Sydney, AU",            cc: "au", plan: "Pro Annual"      },
  { name: "Emma W.",       location: "Toronto, CA",           cc: "ca", plan: "Starter Monthly" },
  { name: "Michael C.",    location: "Berlin, DE",            cc: "de", plan: "Pro Annual"      },
  { name: "Yuki T.",       location: "Tokyo, JP",             cc: "jp", plan: "Pro Monthly"     },
  { name: "Sofia V.",      location: "Amsterdam, NL",         cc: "nl", plan: "Starter Annual"  },
  { name: "Raj P.",        location: "Mumbai, IN",            cc: "in", plan: "Pro Annual"      },
  { name: "Carlos M.",     location: "São Paulo, BR",         cc: "br", plan: "Starter Monthly" },
  { name: "Lisa H.",       location: "Paris, FR",             cc: "fr", plan: "Pro Annual"      },
  { name: "Daniel O.",     location: "Lagos, NG",             cc: "ng", plan: "Starter Annual"  },
  { name: "Amira F.",      location: "Cairo, EG",             cc: "eg", plan: "Pro Monthly"     },
  { name: "Kevin L.",      location: "Hong Kong",             cc: "hk", plan: "Pro Annual"      },
  { name: "Nina R.",       location: "Stockholm, SE",         cc: "se", plan: "Starter Annual"  },
  { name: "Omar A.",       location: "Riyadh, SA",            cc: "sa", plan: "Pro Annual"      },
  { name: "Taylor S.",     location: "Chicago, US",           cc: "us", plan: "Starter Monthly" },
  { name: "Isabella C.",   location: "Milan, IT",             cc: "it", plan: "Pro Annual"      },
  { name: "Marcus J.",     location: "Johannesburg, ZA",      cc: "za", plan: "Starter Annual"  },
  { name: "Chen W.",       location: "Shanghai, CN",          cc: "cn", plan: "Pro Monthly"     },
  { name: "Fatima H.",     location: "Istanbul, TR",          cc: "tr", plan: "Pro Annual"      },
  { name: "Nathan B.",     location: "Melbourne, AU",         cc: "au", plan: "Starter Annual"  },
  { name: "Elena K.",      location: "Warsaw, PL",            cc: "pl", plan: "Pro Monthly"     },
  { name: "Arjun V.",      location: "Bangalore, IN",         cc: "in", plan: "Pro Annual"      },
  { name: "Mia L.",        location: "Barcelona, ES",         cc: "es", plan: "Starter Monthly" },
  { name: "Ryan O.",       location: "Dublin, IE",            cc: "ie", plan: "Pro Annual"      },
  { name: "Hana S.",       location: "Seoul, KR",             cc: "kr", plan: "Pro Annual"      },
  { name: "Felix M.",      location: "Zurich, CH",            cc: "ch", plan: "Starter Annual"  },
  { name: "Chloe P.",      location: "Montreal, CA",          cc: "ca", plan: "Pro Monthly"     },
  { name: "Ethan G.",      location: "Los Angeles, US",       cc: "us", plan: "Pro Annual"      },
  { name: "Aisha B.",      location: "Nairobi, KE",           cc: "ke", plan: "Starter Annual"  },
  { name: "Victor S.",     location: "Moscow, RU",            cc: "ru", plan: "Pro Monthly"     },
  { name: "Layla M.",      location: "Beirut, LB",            cc: "lb", plan: "Pro Annual"      },
  { name: "Jack T.",       location: "Auckland, NZ",          cc: "nz", plan: "Starter Annual"  },
  { name: "Mei L.",        location: "Taipei, TW",            cc: "tw", plan: "Pro Monthly"     },
  { name: "Benjamin F.",   location: "Frankfurt, DE",         cc: "de", plan: "Pro Annual"      },
  { name: "Ana C.",        location: "Buenos Aires, AR",      cc: "ar", plan: "Starter Annual"  },
  { name: "Zaid A.",       location: "Karachi, PK",           cc: "pk", plan: "Pro Monthly"     },
  { name: "Sophie D.",     location: "Brussels, BE",          cc: "be", plan: "Pro Annual"      },
  { name: "Alexander M.",  location: "Athens, GR",            cc: "gr", plan: "Starter Annual"  },
  { name: "Yuna K.",       location: "Osaka, JP",             cc: "jp", plan: "Starter Monthly" },
  { name: "Hassan O.",     location: "Accra, GH",             cc: "gh", plan: "Pro Annual"      },
  { name: "Anna V.",       location: "Vienna, AT",            cc: "at", plan: "Starter Annual"  },
  { name: "Oliver B.",     location: "Edinburgh, UK",         cc: "gb", plan: "Pro Monthly"     },
  { name: "Sophia R.",     location: "Lisbon, PT",            cc: "pt", plan: "Pro Annual"      },
  { name: "Noah C.",       location: "Houston, US",           cc: "us", plan: "Starter Annual"  },
  { name: "Rin T.",        location: "Kuala Lumpur, MY",      cc: "my", plan: "Pro Annual"      },
  { name: "Marco B.",      location: "Rome, IT",              cc: "it", plan: "Pro Annual"      },
  { name: "Camille D.",    location: "Lyon, FR",              cc: "fr", plan: "Pro Annual"      },
];

// ── Timing constants ──────────────────────────────────────────────────────────
const VISIBLE_MS      = 7_500;          // how long each toast is on screen
const INITIAL_MIN_MS  = 5_000;          // earliest first-appearance
const INITIAL_MAX_MS  = 9_000;          // latest first-appearance
const GAP_MIN_MS      = 18_000;         // shortest gap between toasts
const GAP_MAX_MS      = 32_000;         // longest gap between toasts

// ── Plan accent colours ───────────────────────────────────────────────────────
const PLAN_COLOUR: Record<string, string> = {
  "Pro Annual":      "#22C55E",
  "Pro Monthly":     "#4ade80",
  "Starter Annual":  "#86efac",
  "Starter Monthly": "#d1fae5",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fisherYates(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeLabel(hoursAgo: number): string {
  if (hoursAgo === 1) return "1 hour ago";
  return `${hoursAgo} hours ago`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SocialProofToast() {
  const [active, setActive] = useState<ActiveNotification | null>(null);

  // Stable refs — no stale-closure risk
  const mountedRef    = useRef(true);
  const shuffledRef   = useRef<number[]>([]);
  const posRef        = useRef(0);
  const timeoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uidRef        = useRef(0);
  const showNextRef   = useRef<() => void>(() => { /* populated in effect */ });

  useEffect(() => {
    mountedRef.current  = true;
    shuffledRef.current = fisherYates(NOTIFICATIONS.map((_, i) => i));

    function showNext() {
      if (!mountedRef.current) return;

      // Reshuffle when all entries have been shown
      if (posRef.current >= shuffledRef.current.length) {
        shuffledRef.current = fisherYates(NOTIFICATIONS.map((_, i) => i));
        posRef.current = 0;
      }

      const idx = shuffledRef.current[posRef.current++];
      setActive({
        ...NOTIFICATIONS[idx],
        hoursAgo: rnd(1, 23),
        uid: ++uidRef.current,
      });

      // Hide after VISIBLE_MS, then queue next after a random gap
      timeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setActive(null);
        timeoutRef.current = setTimeout(showNext, rnd(GAP_MIN_MS, GAP_MAX_MS));
      }, VISIBLE_MS);
    }

    // Store in ref so `dismiss` can trigger the next cycle too
    showNextRef.current = showNext;

    // First appearance after a randomised warm-up delay
    timeoutRef.current = setTimeout(showNext, rnd(INITIAL_MIN_MS, INITIAL_MAX_MS));

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Called when user clicks the toast to dismiss it early
  const dismiss = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(null);
    // Resume cycle after a normal gap
    timeoutRef.current = setTimeout(
      () => showNextRef.current(),
      rnd(GAP_MIN_MS, GAP_MAX_MS),
    );
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 pointer-events-none select-none"
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.uid}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={dismiss}
            className="pointer-events-auto relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background:   "#0c0c14",
              border:       "1px solid rgba(255,255,255,0.08)",
              boxShadow:    "0 16px 56px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Left green accent stripe */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: "linear-gradient(180deg,#22C55E 0%,#16A34A 100%)" }}
              aria-hidden="true"
            />

            {/* Content row */}
            <div className="flex items-center gap-3 pl-5 pr-4 py-3">

              {/* Avatar with flag overlay */}
              <div className="relative flex-shrink-0" aria-hidden="true">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black leading-none"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    border:     "1px solid rgba(34,197,94,0.22)",
                    color:      "#22C55E",
                  }}
                >
                  {initials(active.name)}
                </div>
                {/* Flag image badge — bottom-right of avatar */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-[22px] h-[22px] rounded-full overflow-hidden"
                  style={{
                    background: "#0c0c14",
                    border:     "1.5px solid rgba(255,255,255,0.1)",
                    padding:    "2px",
                  }}
                >
                  <img
                    src={`https://flagcdn.com/20x15/${active.cc}.png`}
                    srcSet={`https://flagcdn.com/40x30/${active.cc}.png 2x`}
                    width={14}
                    height={11}
                    alt={active.cc.toUpperCase()}
                    className="rounded-[1px] object-cover"
                    style={{ display: "block" }}
                  />
                </span>
              </div>

              {/* Text block */}
              <div className="flex-1 min-w-0">
                {/* Name + verified tick */}
                <div className="flex items-center gap-1.5 mb-[3px]">
                  <span className="text-[13px] font-bold text-white leading-tight truncate">
                    {active.name}
                  </span>
                  {/* Verified badge */}
                  <svg viewBox="0 0 16 16" fill="none" className="w-[14px] h-[14px] flex-shrink-0" aria-hidden="true">
                    <circle cx="8" cy="8" r="8"  fill="#22C55E" fillOpacity="0.15" />
                    <circle cx="8" cy="8" r="7"  stroke="#22C55E" strokeOpacity="0.35" strokeWidth="1" />
                    <path stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5.2 8.1l2 2 3.8-3.4" />
                  </svg>
                </div>

                {/* Purchased line */}
                <p className="text-[12px] text-gray-400 leading-snug truncate">
                  purchased{" "}
                  <span
                    className="font-semibold"
                    style={{ color: PLAN_COLOUR[active.plan] ?? "#22C55E" }}
                  >
                    {active.plan}
                  </span>
                </p>

                {/* Location + time — flag removed from here, shown on avatar */}
                <p className="text-[11px] text-gray-600 mt-[3px] truncate">
                  {active.location}
                  <span className="text-gray-700 mx-1">·</span>
                  {timeLabel(active.hoursAgo)}
                </p>
              </div>
            </div>

            {/* Drain progress bar — empties over VISIBLE_MS */}
            <motion.div
              className="h-[2px]"
              style={{ background: "linear-gradient(90deg,#22C55E,#16A34A)", transformOrigin: "left center" }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: VISIBLE_MS / 1000, ease: "linear" }}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
