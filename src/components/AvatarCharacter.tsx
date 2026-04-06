/**
 * AvatarCharacter — animated brand mascot widget
 *
 * Rises from the bottom-left corner. Shows the top ~65% of the character
 * (head through waist) with dark gradient overlays blending the white PNG
 * background seamlessly into the site's dark theme. A speech bubble with
 * a typing indicator cycles through 25 persuasive sales messages.
 *
 * • White-background PNGs are blended via gradient overlays (no CSS blend
 *   modes needed — works on every browser/device).
 * • Dismissed state persists in sessionStorage so it respects the user's
 *   choice for the current tab session.
 * • Fully responsive: character + bubble scale fluidly via CSS clamp().
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Inline X icon — no external icon library required
function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

interface Scene {
  image: string;
  dialogue: string;
}

// ─── Scene catalogue ──────────────────────────────────────────────────────────
// Each scene pairs a character pose with a sales-driven one-liner.
// Ordered so the first few establish credibility before turning up urgency.
const SCENES: Scene[] = [
  {
    image: "/avatar/narration-neutral.png",
    dialogue: "Auto-execution on 25+ live pairs, 24/7. No charts to watch — Trinity handles everything.",
  },
  {
    image: "/avatar/authority-arm-raised.png",
    dialogue: "I've traded manually for years. Trinity made me more profitable in 3 days than 3 months alone.",
  },
  {
    image: "/avatar/thinking-chin-rest.png",
    dialogue: "80% win rate. $100/stake. 10 trades. That's $440 net profit — one session. Do the math.",
  },
  {
    image: "/avatar/energy-excited.png",
    dialogue: "The AI hit 9 out of 10 signals this morning. Before my coffee was even done. ☕",
  },
  {
    image: "/avatar/reaction-shocked.png",
    dialogue: "30-day money-back guarantee, zero questions asked. You're literally taking ZERO risk right now.",
  },
  {
    image: "/avatar/screen-pointing-chart.png",
    dialogue: "It spotted the reversal 3 candles early and executed the trade before I moved my mouse.",
  },
  {
    image: "/avatar/narration-presenting.png",
    dialogue: "Risk-free for 30 days. If Trinity doesn't deliver, full refund. No catch — that's the offer.",
  },
  {
    image: "/avatar/authority-arms-crossed.png",
    dialogue: "I use Trinity every day. $99/mo paid back in the first session alone. That's not hype — that's math.",
  },
  {
    image: "/avatar/energy-celebrating.png",
    dialogue: "Someone in our Discord just posted +310% ROI this week. This happens almost every single week.",
  },
  {
    image: "/avatar/thinking-explains.png",
    dialogue: "The compound engine auto-scales position size. Every winning trade funds the next even bigger one.",
  },
  {
    image: "/avatar/screen-reading.png",
    dialogue: "80%+ signal accuracy — verified across 3 months of live data. Consistent. Not cherry-picked.",
  },
  {
    image: "/avatar/narration-pointing-right.png",
    dialogue: "Pro users run 60+ pairs with OTC coverage and 1.8× faster execution. The edge is very real.",
  },
  {
    image: "/avatar/reaction-suspicious.png",
    dialogue: "Still looking for the catch? 30-day full refund, no questions asked. That IS the whole offer.",
  },
  {
    image: "/avatar/reaction-confused.png",
    dialogue: "Trading manually against millisecond AI execution... in 2025? Why are you still doing this?",
  },
  {
    image: "/avatar/energy-motivation.png",
    dialogue: "One plan. One click. Automated profit sessions. What are you actually waiting for?",
  },
  {
    image: "/avatar/narration-double-hand.png",
    dialogue: "25+ live pairs, OTC markets open, Smart Compounding active — all from a single dashboard.",
  },
  {
    image: "/avatar/thinking-looking-up.png",
    dialogue: "Think about what 6 more months without Trinity is actually costing you in missed profits.",
  },
  {
    image: "/avatar/reaction-facepalm.png",
    dialogue: "Setting SL/TP manually while Trinity executes in microseconds... I genuinely can't watch.",
  },
  {
    image: "/avatar/screen-looking.png",
    dialogue: "Every trade logged, timestamped, and tracked. The real-time dashboard never lies.",
  },
  {
    image: "/avatar/authority-serious.png",
    dialogue: "Every session someone else automates, the performance gap between you and them widens.",
  },
  {
    image: "/avatar/narration-one-hand.png",
    dialogue: "Compounding makes this self-funding fast. The first winning session covers the subscription.",
  },
  {
    image: "/avatar/narration-pointing-left.png",
    dialogue: "$99/mo Starter plan. Average session return well above that. It pays for itself in hours.",
  },
  {
    image: "/avatar/reaction-laughing.png",
    dialogue: "The algo called a reversal while I was making lunch. Came back to a banked profit. Love this.",
  },
  {
    image: "/avatar/screen-writing.png",
    dialogue: "Month 1 compound growth: 23%. Month 2: 31%. Month 3: 44%. The curve only goes one direction.",
  },
  {
    image: "/avatar/thinking.png",
    dialogue: "$99/mo. $440 typical session profit. ROI clears before day two. Starter plan. Go.",
  },
];

const SHOW_DELAY_MS    = 4000;  // initial appearance delay
const CYCLE_MS         = 9500;  // time between pose/dialogue cycles
const TYPING_MS        = 950;   // how long the typing dots show before dialogue

// Site background colour — used for the gradient overlays that blend
// the white PNG backgrounds into the dark site seamlessly.
const SITE_BG = "#080d1a";

// ─────────────────────────────────────────────────────────────────────────────

export default function AvatarCharacter() {
  const [dismissed, setDismissed] = useState(false);
  const [visible,   setVisible]   = useState(false);
  const [sceneIdx,  setSceneIdx]  = useState(0);
  const [bubbleKey, setBubbleKey] = useState(0);   // forces bubble AnimatePresence re-run
  const [isTyping,  setIsTyping]  = useState(false);
  const [showText,  setShowText]  = useState(false);

  // ── Read dismiss flag on mount ────────────────────────────────────────────
  useEffect(() => {
    try {
      if (sessionStorage.getItem("trinityAvatarDismissed") === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable (private mode etc.)
    }
  }, []);

  // ── Appear after delay ────────────────────────────────────────────────────
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [dismissed]);

  // ── Typing → dialogue transition on each scene change ────────────────────
  useEffect(() => {
    if (!visible) return;
    setIsTyping(true);
    setShowText(false);
    setBubbleKey(k => k + 1);

    const t = setTimeout(() => {
      setIsTyping(false);
      setShowText(true);
    }, TYPING_MS);
    return () => clearTimeout(t);
  }, [visible, sceneIdx]);

  // ── Cycle through scenes ──────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(
      () => setSceneIdx(i => (i + 1) % SCENES.length),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = useCallback(() => {
    try { sessionStorage.setItem("trinityAvatarDismissed", "1"); } catch { /* ignore */ }
    setDismissed(true);
  }, []);

  if (dismissed) return null;

  const scene = SCENES[sceneIdx];

  return (
    <AnimatePresence>
      {visible && (
        // ── Root wrapper slides up from the bottom ────────────────────────
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", damping: 26, stiffness: 170, mass: 1.1 }}
          className="fixed bottom-0 left-0 z-[9998] flex items-end"
          style={{ userSelect: "none" }}
          aria-hidden="true"
        >
          {/* ── Character image container ──────────────────────────────── */}
          {/*
            width  / height via CSS clamp() for smooth responsive scaling.
            overflow: hidden clips the bottom of the image so only the
            upper body (head → waist) is visible — the character appears
            to "stand" behind the bottom edge of the viewport.
          */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width:  "clamp(118px, 13.5vw, 188px)",
              height: "clamp(112px, 12.5vw, 178px)",
            }}
          >
            {/* Pose crossfade */}
            <AnimatePresence mode="wait">
              <motion.img
                key={scene.image}
                src={scene.image}
                alt=""
                draggable={false}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.38 }}
                className="w-full h-auto block"
                style={{ objectPosition: "top center" }}
                loading="eager"
              />
            </AnimatePresence>

            {/*
              Gradient overlays — blend the white PNG background into the
              site's dark colour so the character looks native to the page.

              Bottom overlay  → hides legs / creates "rising from ground" look.
              Left + right overlays → hide white margins on image sides.
            */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "50%",
                background: `linear-gradient(to top, ${SITE_BG} 0%, ${SITE_BG}cc 25%, transparent 100%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 pointer-events-none"
              style={{
                width: "16%",
                background: `linear-gradient(to right, ${SITE_BG} 0%, transparent 100%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 pointer-events-none"
              style={{
                width: "16%",
                background: `linear-gradient(to left, ${SITE_BG} 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* ── Speech bubble + close button ──────────────────────────────── */}
          <div
            className="relative flex-shrink-0"
            style={{
              alignSelf: "flex-start",
              marginTop: "clamp(10px, 2.2vw, 26px)",
              marginLeft: "2px",
            }}
          >
            {/* Dismiss button — always visible once character is shown */}
            <button
              onClick={dismiss}
              className="
                absolute -top-3 -right-3 z-10
                w-[22px] h-[22px] rounded-full
                bg-gray-700/95 hover:bg-gray-500
                text-white flex items-center justify-center
                transition-colors duration-150 shadow-lg
                cursor-pointer pointer-events-auto
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
              aria-label="Dismiss mascot"
            >
              <XIcon />
            </button>

            {/* Bubble AnimatePresence */}
            <AnimatePresence mode="wait">
              {(isTyping || showText) && (
                <motion.div
                  key={bubbleKey}
                  initial={{ scale: 0.55, opacity: 0, y: 12, originX: 0, originY: 1 }}
                  animate={{ scale: 1,    opacity: 1, y: 0  }}
                  exit={{    scale: 0.75, opacity: 0, y: -6 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 280,
                    mass: 0.85,
                  }}
                  className="relative"
                >
                  {/* Triangle tail — points LEFT toward the character's head */}
                  <div
                    aria-hidden="true"
                    className="absolute pointer-events-none"
                    style={{
                      left: "-9px",
                      top:  "14px",
                      width: 0,
                      height: 0,
                      borderTop:    "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderRight:  "10px solid white",
                      filter: "drop-shadow(-2px 0 3px rgba(0,0,0,0.08))",
                    }}
                  />

                  {/* Bubble card */}
                  <div
                    className="
                      bg-white rounded-2xl
                      shadow-[0_6px_28px_rgba(0,0,0,0.26)]
                      border border-gray-100
                    "
                    style={{
                      padding:  "clamp(8px, 1.1vw, 12px) clamp(10px, 1.4vw, 16px)",
                      maxWidth: "clamp(158px, 19vw, 220px)",
                      minWidth: "138px",
                    }}
                  >
                    {isTyping ? (
                      /* ── Typing indicator ────────────────────────────── */
                      <div className="flex items-center gap-[5px] py-[3px] px-[2px]">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="block rounded-full bg-gray-400"
                            style={{ width: 7, height: 7 }}
                            animate={{
                              y:       [0, -5, 0],
                              opacity: [0.45, 1, 0.45],
                            }}
                            transition={{
                              duration: 0.65,
                              delay: i * 0.17,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      /* ── Dialogue text ───────────────────────────────── */
                      <p
                        className="text-gray-800 font-semibold leading-snug"
                        style={{ fontSize: "clamp(11px, 1.15vw, 13px)" }}
                      >
                        {scene.dialogue}
                      </p>
                    )}
                  </div>

                  {/* Green accent glow pulse on each new dialogue */}
                  {showText && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0.45, scale: 1 }}
                      animate={{ opacity: 0,    scale: 1.12 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      style={{ boxShadow: "0 0 0 3px #22c55e55", borderRadius: 16 }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
