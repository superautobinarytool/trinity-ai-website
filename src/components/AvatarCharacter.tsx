/**
 * AvatarCharacter — animated mascot widget
 *
 * Design decisions:
 * • overflow:hidden + NO gradients on mobile → clean crop, zero artefacts.
 * • Image AND dialogue appear simultaneously on each scene change — no typing
 *   delay. Both use the same sceneIdx key so they animate in lockstep.
 * • All 40 images are preloaded eagerly on first mount so pose transitions
 *   are instant regardless of network conditions.
 * • z-[49]: always sits below SocialProofToast (z-50).
 * • pointerEvents:none on root so the widget never blocks page interaction.
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Scene {
  image: string;
  dialogue: string;
}

// ─── Scenes ──────────────────────────────────────────────────────────────────
const SCENES: Scene[] = [
  { image: "/avatar/narration-neutral.png",       dialogue: "You're STILL watching charts manually? Sir, this is a Wendy's." },
  { image: "/avatar/authority-arm-raised.png",    dialogue: "Let me get this straight — you could automate profits and you're... scrolling Instagram?" },
  { image: "/avatar/thinking-chin-rest.png",      dialogue: "Bro is calculating losses manually while Trinity runs numbers in milliseconds. Respect, I guess." },
  { image: "/avatar/energy-excited.png",          dialogue: "GUYS. 9/10 signals green this morning. I didn't touch a single button. NOT ONE. 🔥" },
  { image: "/avatar/reaction-shocked.png",        dialogue: "WAIT. You haven't subscribed yet?! I genuinely thought that was a joke." },
  { image: "/avatar/screen-pointing-chart.png",   dialogue: "See this candle? Trinity called the reversal 3 candles early. You were still eating breakfast." },
  { image: "/avatar/narration-presenting.png",    dialogue: "30-day money-back. Zero questions asked. You're stress-testing us for free. Go ahead." },
  { image: "/avatar/authority-arms-crossed.png",  dialogue: "$99/mo. You spend more on coffee and Netflix. Neither of those compound." },
  { image: "/avatar/energy-celebrating.png",      dialogue: "+310% ROI in one week. Discord was on fire. This is just... a Tuesday for Pro users." },
  { image: "/avatar/thinking-explains.png",       dialogue: "The compound engine turns your wins into bigger wins. It's basic math. Painfully basic math." },
  { image: "/avatar/screen-reading.png",          dialogue: "80%+ accuracy. 3 months of live data. Not backtested. Not cherry-picked. L-I-V-E." },
  { image: "/avatar/narration-pointing-right.png",dialogue: "Pro users get 60+ pairs and 1.8× faster execution. You're on the free plan of life rn." },
  { image: "/avatar/reaction-suspicious.png",     dialogue: "Still hunting for the catch? There isn't one. I checked. Twice. Looked under the couch too." },
  { image: "/avatar/reaction-confused.png",       dialogue: "Trading in 2026 without AI automation is like bringing a calculator to a NASA launch." },
  { image: "/avatar/energy-motivation.png",       dialogue: "One click. Zero manual work. Automated sessions every day. What are you actually DOING?" },
  { image: "/avatar/narration-double-hand.png",   dialogue: "25 pairs. OTC markets. Smart compounding. All on ONE dashboard. Just. One." },
  { image: "/avatar/thinking-looking-up.png",     dialogue: "Imagine where you'd be right now if you'd started 3 months ago. Painful thought, isn't it." },
  { image: "/avatar/reaction-facepalm.png",       dialogue: "You're placing SL/TP manually while Trinity executes in microseconds? I physically cannot." },
  { image: "/avatar/screen-looking.png",          dialogue: "Every trade. Every timestamp. Every profit. Right there on the dash. No Excel. No crying." },
  { image: "/avatar/authority-serious.png",       dialogue: "Every hour you wait, someone else banks a session. The gap widens. Right now." },
  { image: "/avatar/narration-one-hand.png",      dialogue: "First session usually covers the sub. Day one. I'm not doing math — that's just what happens." },
  { image: "/avatar/narration-pointing-left.png", dialogue: "$99/mo. Same price as two DoorDash orders. One of those compounds. Spoiler: not the noodles." },
  { image: "/avatar/reaction-laughing.png",       dialogue: "Trinity called a move while I was on the phone with my mom. Came back to profits. LMAO." },
  { image: "/avatar/screen-writing.png",          dialogue: "Month 1: +23%. Month 2: +31%. Month 3: +44%. Compound math is genuinely unfair." },
  { image: "/avatar/thinking.png",                dialogue: "You've been on this page a while. The subscribe button is right there. 👆 Just saying." },
  { image: "/avatar/narration-neutral.png",       dialogue: "Your account isn't going to fund itself. Unless you use Trinity. Then... it kind of does." },
  { image: "/avatar/energy-excited.png",          dialogue: "POV: you subscribed 3 months ago. You're not reading websites. You're counting profits." },
  { image: "/avatar/reaction-shocked.png",        dialogue: "Someone woke up to green trades this morning. That someone is a Trinity subscriber. Not you. Yet." },
  { image: "/avatar/authority-arms-crossed.png",  dialogue: "Manual trading is a hobby. Trinity is a business. You're here to make money, right?" },
  { image: "/avatar/thinking-explains.png",       dialogue: "The AI doesn't sleep, doesn't panic, doesn't revenge trade. Wish I could say the same about anyone." },
  { image: "/avatar/narration-presenting.png",    dialogue: "Skip one Uber Eats week. Subscription covered. Profit unlocked. Math checks out. Go." },
  { image: "/avatar/reaction-confused.png",       dialogue: "Bro typed 'best trading strategy' into Google instead of just clicking Subscribe. 💀" },
  { image: "/avatar/screen-pointing-chart.png",   dialogue: "Some traders stare at charts 8 hrs/day. Trinity users spend those 8 hrs doing literally anything else." },
  { image: "/avatar/energy-motivation.png",       dialogue: "You're one click from sessions running while you sleep. ONE CLICK. That's it." },
  { image: "/avatar/authority-serious.png",       dialogue: "The people actually winning this market right now? They automated months ago. Just facts." },
  { image: "/avatar/reaction-suspicious.png",     dialogue: "Tell me you don't need Trinity without telling me: 'I prefer manual trading.' Classic cope." },
  { image: "/avatar/thinking-looking-up.png",     dialogue: "6 months from now you'll either have started today or wish you had. Pick your future." },
  { image: "/avatar/narration-double-hand.png",   dialogue: "I'm not saying Trinity will change your life. I'm saying it'll change your balance. Which IS your life." },
  { image: "/avatar/screen-reading.png",          dialogue: "Plot twist: the 'too good to be true' thing IS true. The 30-day refund removes all your risk." },
  { image: "/avatar/reaction-laughing.png",       dialogue: "Real talk: if $99/mo is the thing stopping you, the FIRST SESSION solves that problem. Think about that." },
];

// Deduplicated image list for preloading
const ALL_IMAGES = [...new Set(SCENES.map(s => s.image))];

// All scene indices — used to build shuffled playback order
const ALL_INDICES = Array.from({ length: SCENES.length }, (_, i) => i);

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHOW_DELAY_MS = 4500;
const CYCLE_MS      = 13000;
const SITE_BG       = "#080d1a";

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handle);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", handle);
  }, []);
  return isMobile;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AvatarCharacter() {
  const [visible,  setVisible]  = useState(false);
  // Shuffled playback: orderRef holds the randomised scene index list;
  // orderPos advances through it, reshuffling when exhausted.
  const orderRef  = useRef<number[]>(shuffle(ALL_INDICES));
  const [orderPos, setOrderPos] = useState(0);
  const isMobile = useIsMobile();

  // ── Preload ALL images immediately on mount ───────────────────────────────
  // This ensures every pose is in the browser cache before it's needed,
  // so transitions are instant regardless of connection speed.
  useEffect(() => {
    ALL_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ── Appear after initial delay ────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // ── Cycle scenes (shuffled) ─────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setOrderPos(pos => {
        const next = pos + 1;
        if (next >= SCENES.length) {
          // Exhausted the current shuffle — reshuffle for next round
          orderRef.current = shuffle(ALL_INDICES);
          return 0;
        }
        return next;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [visible]);

  const sceneIdx = orderRef.current[orderPos];
  const scene    = SCENES[sceneIdx];

  // ── Sizing ────────────────────────────────────────────────────────────────
  // Both mobile and desktop use overflow:hidden — no gradients on mobile,
  // gradients on desktop for a polished blend into the dark background.
  // Heights are calibrated so the crop lands at roughly the waist/mid-torso.
  // These PNGs are portrait ~1:1.79 ratio with internal white space;
  // the character body occupies ~70% of the frame width centred.
  // At mobile 116px wide → natural height ~208px → 112px crop ≈ top 54% (chest)
  // At desktop 230px wide → natural height ~412px → 195px crop ≈ top 47% (waist)
  const avatarW        = isMobile ? 116 : 230;
  const avatarH        = isMobile ? 112 : 195;
  const bubbleMaxWidth = isMobile ? "144px" : "170px";
  const bubbleMinWidth = isMobile ? "112px" : "134px";
  const bubblePadding  = isMobile ? "5px 8px" : "8px 12px";
  const fontSize       = isMobile ? "9px"   : "12px";
  const bubbleTop      = isMobile ? "8px"   : "18px";   // alignSelf offset
  const bubbleLeft     = isMobile ? "-10px" : "-20px";  // pull into PNG whitespace

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", damping: 28, stiffness: 160, mass: 1.05 }}
          className="fixed bottom-0 left-0 z-[49] flex items-end"
          style={{ userSelect: "none", pointerEvents: "none" }}
          aria-hidden="true"
        >
          {/* ── Character ─────────────────────────────────────────────────
              overflow:hidden clips legs on BOTH viewports.
              No gradient overlay on mobile — clean hard crop with zero
              banding in any browser. Desktop keeps soft gradient blends.
          ─────────────────────────────────────────────────────────────── */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{ width: avatarW, height: avatarH }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={orderPos}
                src={scene.image}
                alt=""
                draggable={false}
                // Spring-transform swap: old exits UP, new enters from below
                initial={{ y: 22,  scale: 0.88, opacity: 0 }}
                animate={{ y: 0,   scale: 1,    opacity: 1 }}
                exit={{    y: -14, scale: 0.91, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.75 }}
                className="w-full h-auto block"
                // Images are preloaded; eager attr avoids any lazy-load delay
                loading="eager"
                decoding="sync"
              />
            </AnimatePresence>

            {/* Soft bottom gradient — desktop only, zero on mobile */}
            {!isMobile && (
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: "48%",
                  background: `linear-gradient(to top, ${SITE_BG} 0%, ${SITE_BG}d0 20%, ${SITE_BG}70 45%, transparent 100%)`,
                }}
              />
            )}

            {/* Side gradients — desktop only */}
            {!isMobile && (
              <>
                <div aria-hidden="true" className="absolute inset-y-0 left-0 pointer-events-none"
                  style={{ width: "10%", background: `linear-gradient(to right, ${SITE_BG} 0%, transparent 100%)` }} />
                <div aria-hidden="true" className="absolute inset-y-0 right-0 pointer-events-none"
                  style={{ width: "10%", background: `linear-gradient(to left,  ${SITE_BG} 0%, transparent 100%)` }} />
              </>
            )}
          </div>

          {/* ── Speech bubble ─────────────────────────────────────────────
              sceneIdx is the key for BOTH image and bubble so they animate
              in together — no typing delay, no separate phase.
          ─────────────────────────────────────────────────────────────── */}
          <div
            className="relative flex-shrink-0"
            style={{
              alignSelf: "flex-start",
              marginTop:  bubbleTop,
              marginLeft: bubbleLeft,
              pointerEvents: "auto",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={orderPos}
                initial={{ scale: 0.6, opacity: 0, y: 8 }}
                animate={{ scale: 1,   opacity: 1, y: 0 }}
                exit={{    scale: 0.8, opacity: 0, y: -5 }}
                transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.8 }}
                className="relative"
                style={{ transformOrigin: "left bottom" }}
              >
                {/* Tail arrow */}
                <div
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{
                    left: "-9px", top: "11px",
                    width: 0, height: 0,
                    borderTop:    "7px solid transparent",
                    borderBottom: "7px solid transparent",
                    borderRight:  "10px solid #0d1b2e",
                    filter: "drop-shadow(-2px 0 4px rgba(0,0,0,0.5))",
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-2xl shadow-[0_8px_36px_rgba(0,0,0,0.64)]"
                  style={{
                    background:  "#0d1b2e",
                    border:      "1px solid rgba(34,197,94,0.28)",
                    padding:     bubblePadding,
                    maxWidth:    bubbleMaxWidth,
                    minWidth:    bubbleMinWidth,
                  }}
                >
                  <p className="text-white font-semibold leading-snug" style={{ fontSize }}>
                    {scene.dialogue}
                  </p>
                </div>

                {/* Entrance glow ring */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0,   scale: 1.14 }}
                  transition={{ duration: 0.72, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 0 3px rgba(34,197,94,0.45)", borderRadius: 16 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
