import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, XMarkIcon, ArrowRightIcon } from "@/components/ui/Icons";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display font-black tabular-nums leading-none text-white
        text-sm sm:text-base
        bg-white/20 rounded-md px-2 py-1 min-w-[2rem] text-center
        shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
        {value}
      </span>
      <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/50 mt-0.5 hidden sm:block">
        {label}
      </span>
    </div>
  );
}

export default function AnnouncementBar({ onHeightChange }: { onHeightChange?: (h: number) => void }) {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 59, s: 59 });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el || !onHeightChange) return;
    const obs = new ResizeObserver(() => onHeightChange(el.offsetHeight));
    obs.observe(el);
    onHeightChange(el.offsetHeight);
    return () => obs.disconnect();
  }, [onHeightChange]);

  useEffect(() => {
    const target = Date.now() + (47 * 3600 + 59 * 60 + 59) * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={barRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 inset-x-0 z-50 overflow-hidden"
          role="banner"
          aria-label="Limited-time promotion"
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          />

          <div
            className="relative flex items-center justify-center gap-2 sm:gap-4 px-10 sm:px-16 py-2 sm:py-2.5 text-white"
            style={{ background: "linear-gradient(90deg, #14532D 0%, #16A34A 40%, #22C55E 60%, #16A34A 80%, #14532D 100%)" }}
          >
            {/* Live dot */}
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-200/80 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Live
            </span>

            {/* Separator */}
            <span className="hidden sm:block w-px h-4 bg-white/20" />

            {/* Main message */}
            <a
              href="#pricing"
              className="flex items-center gap-1.5 sm:gap-2 group min-w-0"
              aria-label="View pricing — 30 day risk free offer"
            >
              <TrendingUpIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-200 flex-shrink-0" />
              {/* Desktop */}
              <span className="hidden md:inline text-sm font-semibold tracking-tight">
                <strong className="font-extrabold text-white">Titan Algo is LIVE!</strong>
                <span className="text-green-100/90 mx-2">—</span>
                <span className="text-white/85">Start your edge with 30 Days Risk-Free at a limited discount</span>
              </span>
              {/* Tablet */}
              <span className="hidden sm:inline md:hidden text-sm font-semibold">
                <strong className="font-extrabold">Titan Algo LIVE</strong>
                <span className="text-green-100/80 mx-1.5">—</span>
                <span className="text-white/85">30 Days Risk-Free</span>
              </span>
              {/* Mobile */}
              <span className="sm:hidden text-xs font-bold tracking-tight">
                Titan Algo — 30 Days Free
              </span>
              <ArrowRightIcon className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </a>

            {/* Separator */}
            <span className="hidden sm:block w-px h-4 bg-white/20" />

            {/* Countdown */}
            <div className="flex items-end gap-1 flex-shrink-0" aria-label="Offer expires in">
              <CountdownUnit value={pad(timeLeft.h)} label="hrs" />
              <span className="font-black text-white/60 text-sm pb-1 leading-none">:</span>
              <CountdownUnit value={pad(timeLeft.m)} label="min" />
              <span className="font-black text-white/60 text-sm pb-1 leading-none">:</span>
              <CountdownUnit value={pad(timeLeft.s)} label="sec" />
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Dismiss announcement"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
