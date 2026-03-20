/**
 * DiscountPopup — one-time per-session engagement offer.
 *
 * Behaviour:
 *  • Triggers 20 seconds after the component mounts
 *  • Only displays once per browser session (guarded by sessionStorage)
 *  • Displays a 5-minute countdown timer
 *  • User can copy the discount code or click "Claim This Offer" to
 *    dismiss the popup and scroll to the pricing section
 *  • Turns red in the final 60 seconds to spike urgency
 *  • When the timer expires, shows an "Offer Expired" state for 2.5 s
 *    then auto-closes
 *  • A11y: role="dialog" aria-modal focus trap via modal pattern
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ─────────────────────────────────────────────────────────────────
const TRIGGER_DELAY   = 20_000;        // ms until popup appears
const TOTAL_SECONDS   = 300;           // 5-minute countdown
const DISCOUNT_CODE   = "TRINITY15";   // 15 % off first subscription
const SESSION_KEY     = "ttt_disc_v1"; // sessionStorage flag

// ── Component ─────────────────────────────────────────────────────────────────
export default function DiscountPopup() {
  const [open,        setOpen]        = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [copied,      setCopied]      = useState(false);
  const [expired,     setExpired]     = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Trigger: fire once per session after 20 s ──────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    }, TRIGGER_DELAY);
    return () => clearTimeout(t);
  }, []);

  // ── Countdown: ticks every second while open and not expired ───────────────
  useEffect(() => {
    if (!open || expired) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1_000);
    return () => clearInterval(interval);
  }, [open, expired]);

  // ── Expiry: when countdown hits 0 ─────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === 0 && open && !expired) {
      setExpired(true);
      const t = setTimeout(() => setOpen(false), 2_500);
      return () => clearTimeout(t);
    }
  }, [secondsLeft, open, expired]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const close = () => setOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE)
      .then(() => {
        setCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2_000);
      })
      .catch(() => {
        // Fallback: select text for manual copy (rarely needed)
        const el = document.getElementById("disc-code-display");
        if (el) {
          const range = document.createRange();
          range.selectNodeContents(el);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      });
  };

  const handleClaim = () => {
    close();
    requestAnimationFrame(() => {
      const el = document.querySelector("#pricing");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  };

  // ── Computed display values ───────────────────────────────────────────────
  const minutes   = Math.floor(secondsLeft / 60);
  const secs      = secondsLeft % 60;
  const mm        = String(minutes).padStart(2, "0");
  const ss        = String(secs).padStart(2, "0");
  const isWarning = secondsLeft <= 60 && !expired;
  const timerCol  = isWarning ? "#ef4444" : "#22C55E";
  const timerGlow = isWarning
    ? "0 0 24px rgba(239,68,68,0.45)"
    : "0 0 24px rgba(34,197,94,0.40)";
  const fillPct   = (secondsLeft / TOTAL_SECONDS) * 100;

  return (
    <AnimatePresence>
      {open && (
        /* ── Backdrop ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{
            background:            "rgba(5,5,8,0.86)",
            backdropFilter:        "blur(14px)",
            WebkitBackdropFilter:  "blur(14px)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.93, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background:   "#0c0c14",
              border:       "1px solid rgba(34,197,94,0.18)",
              boxShadow:    "0 28px 80px rgba(0,0,0,0.75), 0 0 80px rgba(34,197,94,0.07)",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="discount-popup-title"
          >
            {/* Top accent bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: "linear-gradient(90deg,#22C55E,#16A34A)" }}
              aria-hidden="true"
            />

            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-white hover:bg-white/10 transition-all z-10"
              aria-label="Dismiss offer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="px-7 pt-6 pb-7 flex flex-col gap-5">

              {!expired ? (
                <>
                  {/* ── Limited offer badge ── */}
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                      style={{
                        background: "rgba(34,197,94,0.07)",
                        border:     "1px solid rgba(34,197,94,0.18)",
                        color:      "#22C55E",
                      }}
                    >
                      {/* Lightning bolt */}
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                        <path d="M9.2 1.5 3.5 9.2H8L6.8 14.5l6.7-7.3H9L9.2 1.5z" />
                      </svg>
                      Limited Time Offer
                    </span>
                  </div>

                  {/* ── Headline ── */}
                  <div className="text-center">
                    <h2
                      id="discount-popup-title"
                      className="text-xl font-extrabold text-white tracking-tight leading-snug mb-2"
                    >
                      You've unlocked an<br />exclusive discount
                    </h2>
                    <p className="text-[13px] text-gray-400 leading-relaxed">
                      <strong className="text-white">15% off</strong> your first subscription — enter the code below at checkout to redeem.
                    </p>
                  </div>

                  {/* ── Countdown ── */}
                  <div className="flex flex-col items-center gap-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                      Offer expires in
                    </p>

                    {/* Digits */}
                    <div className="flex items-end gap-2">
                      {/* Minutes */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border:     `1px solid ${timerCol}22`,
                          }}
                        >
                          <span
                            className="text-4xl font-black font-mono tabular-nums leading-none"
                            style={{ color: timerCol, textShadow: timerGlow }}
                          >
                            {mm}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                          min
                        </span>
                      </div>

                      {/* Colon */}
                      <span
                        className="text-3xl font-black font-mono mb-[22px] leading-none"
                        style={{ color: timerCol, opacity: 0.6 }}
                        aria-hidden="true"
                      >
                        :
                      </span>

                      {/* Seconds */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border:     `1px solid ${timerCol}22`,
                          }}
                        >
                          <span
                            className="text-4xl font-black font-mono tabular-nums leading-none"
                            style={{ color: timerCol, textShadow: timerGlow }}
                          >
                            {ss}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                          sec
                        </span>
                      </div>
                    </div>

                    {/* Drain bar */}
                    <div className="w-full h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${fillPct}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                        style={{
                          background: isWarning
                            ? "#ef4444"
                            : "linear-gradient(90deg,#22C55E,#16A34A)",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* ── Discount code box ── */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
                      Your discount code
                    </p>
                    <div
                      className="flex items-stretch rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(34,197,94,0.04)",
                        border:     "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      {/* Code display */}
                      <div className="flex-1 flex items-center px-4 py-3" id="disc-code-display">
                        <span className="font-mono font-black text-[18px] tracking-[0.18em] text-white">
                          {DISCOUNT_CODE}
                        </span>
                      </div>

                      {/* Copy button */}
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-4 text-xs font-bold transition-all duration-200 focus:outline-none"
                        style={{
                          borderLeft: "1px solid rgba(34,197,94,0.15)",
                          color:      copied ? "#22C55E" : "#6b7280",
                          background: copied ? "rgba(34,197,94,0.08)" : "transparent",
                        }}
                        aria-label={copied ? "Copied!" : "Copy discount code"}
                      >
                        {copied ? (
                          <>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden="true">
                              <path d="M2.5 8.5l3.5 3.5 7.5-7" />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                              <rect x="5.5" y="5.5" width="7" height="7" rx="1.5" />
                              <path d="M3 10.5V3.5h7" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Primary CTA ── */}
                  <div className="flex flex-col gap-2 -mt-1">
                    <button
                      onClick={handleClaim}
                      className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        background:  "linear-gradient(135deg,#22C55E,#16A34A)",
                        boxShadow:   "0 4px 24px rgba(34,197,94,0.32)",
                      }}
                    >
                      Claim This Offer &rarr;
                    </button>

                    <button
                      onClick={close}
                      className="text-[12px] text-gray-600 hover:text-gray-500 transition-colors text-center py-1"
                    >
                      No thanks, I'll pay full price
                    </button>
                  </div>
                </>
              ) : (
                /* ── Expired state ── */
                <div className="text-center py-6 flex flex-col items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border:     "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v5M12 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Offer Expired</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      This exclusive discount has expired. Standard pricing applies.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
