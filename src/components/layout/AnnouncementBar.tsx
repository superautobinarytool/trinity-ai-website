import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUpIcon, XMarkIcon } from "@/components/ui/Icons";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 59, s: 59 });

  useEffect(() => {
    const target = Date.now() + (47 * 3600 + 59 * 60 + 59) * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
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
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 inset-x-0 z-50 overflow-hidden"
          role="banner"
          aria-label="Promotion announcement"
        >
          <div
            className="h-full flex items-center justify-center gap-3 px-4 text-white text-sm font-semibold"
            style={{ background: "linear-gradient(90deg, #15803D 0%, #22C55E 50%, #15803D 100%)", backgroundSize: "200% 100%" }}
          >
            {/* Text */}
            <span className="hidden sm:inline shrink-0 flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4 text-white/80" />
              <strong>Titan Algo is LIVE!</strong> &nbsp;Start your edge — 30 Days Risk-Free at a limited discount!
            </span>
            <span className="sm:hidden font-bold flex items-center gap-1.5">
              <TrendingUpIcon className="w-4 h-4" />
              Titan Algo LIVE — 30 Days Free!
            </span>

            {/* Countdown */}
            <div className="flex items-center gap-1 font-display font-black text-base tabular-nums">
              <span className="bg-white/20 rounded px-1.5 py-0.5 leading-none">{pad(timeLeft.h)}</span>
              <span className="opacity-70 text-xs">:</span>
              <span className="bg-white/20 rounded px-1.5 py-0.5 leading-none">{pad(timeLeft.m)}</span>
              <span className="opacity-70 text-xs">:</span>
              <span className="bg-white/20 rounded px-1.5 py-0.5 leading-none">{pad(timeLeft.s)}</span>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss announcement"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
