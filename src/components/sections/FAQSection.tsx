import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { PlusIcon } from "@/components/ui/Icons";

const FAQS = [
  {
    q: "What exactly is Project Trinity?",
    a: "Project Trinity is an AI-powered trading platform that combines institutional-grade signal generation, automated trade execution, and advanced performance analytics into a single seamless dashboard. It supports Crypto, Forex, Stocks, and Commodities.",
  },
  {
    q: "How accurate are the signals?",
    a: "Our verified historical win rate sits at 89.7% across all asset classes and time periods from 2022 to present. Every signal is paired with a confidence score and specific entry, take-profit, and stop-loss levels. Past performance does not guarantee future results.",
  },
  {
    q: "Do I need trading experience to use Trinity?",
    a: "No. Trinity is designed to work for beginners and professionals alike. Beginners benefit from the guided signal feed and Discord community. Advanced traders benefit from the automation engine, backtesting suite, and institutional-level analytics.",
  },
  {
    q: "What markets and assets are supported?",
    a: "Trinity covers 50+ assets across Crypto (BTC, ETH, SOL, and more), Forex (all major pairs), Commodities (Gold, Silver, Oil), and a growing range of US equities. New assets are added regularly based on community demand.",
  },
  {
    q: "How does the automation work?",
    a: "You connect your TradingView account or broker API through our secure OAuth flow. From there, Trinity's rule engine translates any saved strategy or incoming signal into real-time orders, respecting your risk settings (max position size, daily loss limit, etc.).",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Yes — instantly. Log in, go to Account Settings, and change or cancel with a single click. No support ticket required, no questions asked. If you cancel within your first 30 days, you receive a full refund automatically.",
  },
  {
    q: "Is there a free trial?",
    a: "Every plan includes a 30-day risk-free trial backed by our money-back guarantee. We don't require a credit card to start — you pay only when you're confident Trinity delivers real value to your trading.",
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
          Frequent{" "}
          <span className="gradient-text">questions</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Can&apos;t find your answer? Ask us anything on Discord — we usually respond in under 10 minutes.
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
