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
    dialogue: "You're STILL watching charts manually? Sir, this is a Wendy's.",
  },
  {
    image: "/avatar/authority-arm-raised.png",
    dialogue: "Let me get this straight — you have a chance to automate profits and you're... scrolling Instagram?",
  },
  {
    image: "/avatar/thinking-chin-rest.png",
    dialogue: "Bro is calculating his losses manually while Trinity runs the numbers in milliseconds. Respect, I guess.",
  },
  {
    image: "/avatar/energy-excited.png",
    dialogue: "GUYS. 9/10 signals green this morning. I literally didn't touch a single button. NOT ONE. 🔥",
  },
  {
    image: "/avatar/reaction-shocked.png",
    dialogue: "WAIT. You haven't subscribed yet?! I genuinely thought that was a joke.",
  },
  {
    image: "/avatar/screen-pointing-chart.png",
    dialogue: "See this candle? Trinity called the reversal 3 candles early. You were still eating breakfast.",
  },
  {
    image: "/avatar/narration-presenting.png",
    dialogue: "30-day money-back guarantee. Zero questions. You're basically stress-testing us for free. Go ahead.",
  },
  {
    image: "/avatar/authority-arms-crossed.png",
    dialogue: "$99/mo. You spend more on coffee and Netflix. Neither of those compound.",
  },
  {
    image: "/avatar/energy-celebrating.png",
    dialogue: "+310% ROI in one week. Discord was on fire. This is just... a Tuesday for Pro users.",
  },
  {
    image: "/avatar/thinking-explains.png",
    dialogue: "The compound engine turns your wins into bigger wins. It's basic math. Painfully basic math.",
  },
  {
    image: "/avatar/screen-reading.png",
    dialogue: "80%+ accuracy. 3 months of live data. Not backtested. Not cherry-picked. L-I-V-E.",
  },
  {
    image: "/avatar/narration-pointing-right.png",
    dialogue: "Pro users get 60+ pairs and 1.8× faster execution. You're on the free plan of life rn.",
  },
  {
    image: "/avatar/reaction-suspicious.png",
    dialogue: "Still hunting for the catch? Bro. There isn't one. I checked. Twice. Looked under the couch too.",
  },
  {
    image: "/avatar/reaction-confused.png",
    dialogue: "Trading in 2026 without AI automation is like bringing a calculator to a NASA launch.",
  },
  {
    image: "/avatar/energy-motivation.png",
    dialogue: "One click. Zero manual work. Automated profit sessions every day. What are you DOING?",
  },
  {
    image: "/avatar/narration-double-hand.png",
    dialogue: "25 pairs. OTC markets. Smart compounding. All on... one... dashboard. Just. One.",
  },
  {
    image: "/avatar/thinking-looking-up.png",
    dialogue: "Imagine where you'd be right now if you'd started 3 months ago. Painful, isn't it.",
  },
  {
    image: "/avatar/reaction-facepalm.png",
    dialogue: "You're placing SL/TP manually while Trinity executes in microseconds? I physically cannot.",
  },
  {
    image: "/avatar/screen-looking.png",
    dialogue: "Every trade. Every timestamp. Every profit. Right there on the dash. No Excel sheet. No crying.",
  },
  {
    image: "/avatar/authority-serious.png",
    dialogue: "Every hour you wait is an hour someone else is running sessions. The gap is widening. Right now.",
  },
  {
    image: "/avatar/narration-one-hand.png",
    dialogue: "First winning session covers the subscription. Usually day one. I'm not doing math — that's just what happens.",
  },
  {
    image: "/avatar/narration-pointing-left.png",
    dialogue: "$99/mo. Same price as two DoorDash orders. One of those compounds. One of those doesn't.",
  },
  {
    image: "/avatar/reaction-laughing.png",
    dialogue: "Trinity called a move while I was on the phone with my mom. Came back to a banked trade. LMAO.",
  },
  {
    image: "/avatar/screen-writing.png",
    dialogue: "Month 1: +23%. Month 2: +31%. Month 3: +44%. Compound math is genuinely unfair.",
  },
  {
    image: "/avatar/thinking.png",
    dialogue: "You've been on this page for a while now. Just saying. The subscribe button is right there. 👆",
  },
];

const SHOW_DELAY_MS    = 4000;  // initial appearance delay
const CYCLE_MS         = 13000; // time between pose/dialogue cycles
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
          className="fixed bottom-0 left-0 z-[49] flex items-end"
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
              width:  "clamp(140px, 16vw, 215px)",
              height: "clamp(132px, 15vw, 202px)",
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
                      borderRight:  "10px solid #0d1b2e",
                      filter: "drop-shadow(-2px 0 3px rgba(0,0,0,0.4))",
                    }}
                  />

                  {/* Bubble card */}
                  <div
                    className="
                      rounded-2xl
                      shadow-[0_8px_32px_rgba(0,0,0,0.55)]
                      border
                    "
                    style={{
                      background: "#0d1b2e",
                      borderColor: "rgba(34,197,94,0.28)",
                      padding:  "clamp(7px, 0.9vw, 10px) clamp(9px, 1.2vw, 14px)",
                      maxWidth: "clamp(130px, 15vw, 185px)",
                      minWidth: "120px",
                    }}
                  >
                    {isTyping ? (
                      /* ── Typing indicator ────────────────────────────── */
                      <div className="flex items-center gap-[5px] py-[3px] px-[2px]">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="block rounded-full bg-green-400"
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
                        className="text-white font-semibold leading-snug"
                        style={{ fontSize: "clamp(10.5px, 1.05vw, 12.5px)" }}
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
