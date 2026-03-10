import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { PlusIcon } from "@/components/ui/Icons";

const FAQS = [
  {
    q: "What exactly is Trinity Trading Tool?",
    a: "Trinity is a Windows desktop application powered by Trinity AI signals that automatically executes trades on your binary options broker the instant a signal appears. You open the app, press START, and it does everything else at machine speed.",
  },
  {
    q: "How does the 80%+ win rate work?",
    a: "Trinity reads live signals from its built-in Trinity AI engine and executes them with zero delay — eliminating the main reason traders lose: missed windows and hesitation. The 80%+ win rate is the result of fast, accurate, emotionless execution across all supported assets and market conditions.",
  },
  {
    q: "Which brokers does Trinity support?",
    a: "Trinity works with all major binary options brokers including IQ Option, Quotex, Pocket Option, Olymp Trade, Deriv, Binomo, ExpertOption, and more. If your broker is accessible on Windows, Trinity can automate it.",
  },
  {
    q: "Do I need trading experience to use Trinity?",
    a: "No experience required. You don't need to know how to read charts or place trades manually. Open the app, connect your broker, select your strategy (Linear is recommended for beginners), set your stake amount, and press START. Trinity handles everything.",
  },
  {
    q: "What is the difference between the three strategies?",
    a: "Linear places the same flat stake every trade — safe, predictable, and ideal for beginners. Compounding automatically reinvests a portion of each winning trade, growing your stake exponentially over a session. Martingale intelligently increases the next trade after a loss to recover and profit from the recovery — designed to turn losing streaks into winning outcomes.",
  },
  {
    q: "Is Martingale risky?",
    a: "Martingale carries higher risk than Linear or Compounding because stake sizes increase after losses. Trinity's Martingale is engineered with intelligent caps to prevent account wipeout. It is recommended for funded accounts and experienced users. Beginners should start with Linear.",
  },
  {
    q: "What if Trinity doesn't perform for me?",
    a: "Every plan is backed by a 30-day money-back guarantee — no questions asked. If Trinity doesn't deliver results you're satisfied with in your first 30 days, you get a full refund. There is zero risk to trying it.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.1 });

  return (
    <Section id="faq" className="bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14 max-w-xl mx-auto"
      >
        <Badge variant="neutral" className="mb-4">FAQ</Badge>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5">
          Questions{" "}
          <span className="gradient-text">answered.</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Can&apos;t find what you&apos;re looking for? Ask us on Discord — we respond in under 10 minutes.
        </p>
      </motion.div>

      <div ref={ref} className="max-w-3xl mx-auto space-y-3">
        {FAQS.map(({ q, a }, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: isOpen
                  ? "linear-gradient(135deg, rgba(0,200,255,0.05), rgba(139,92,246,0.05))"
                  : "rgba(255,255,255,0.02)",
                border: isOpen ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Question */}
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus-ring rounded-2xl"
              >
                <span className="text-sm sm:text-base font-semibold text-white pr-4">{q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400"
                  style={{
                    background: isOpen ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.06)",
                    color: isOpen ? "white" : undefined,
                  }}
                  aria-hidden="true"
                >
                  <PlusIcon className="w-4 h-4" />
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/[0.05] pt-4">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
