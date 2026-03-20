import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { PlusIcon } from "@/components/ui/Icons";

const FAQS = [
  {
    q: "What exactly is Trinity Trading AI?",
    a: "Trinity is a Windows desktop application powered by a proprietary AI signal engine that automatically executes trades on your binary options broker the instant a high-probability signal is generated. You open the app, press START, and Trinity's AI handles everything else — scanning 25+ assets, identifying premium setups, and firing trades at machine speed, 24 hours a day.",
  },
  {
    q: "How does Trinity achieve an 80%+ win rate?",
    a: "Trinity's AI engine runs a continuous multi-layer analysis across all supported assets simultaneously — reading price action, momentum, and market structure in real time. When conditions align with a verified high-probability setup, Trinity fires the trade in under 50 milliseconds. That speed and precision — not luck, not guesswork — is what drives the 80%+ accuracy you can verify live on your dashboard every single session.",
  },
  {
    q: "Which brokers does Trinity support?",
    a: "Trinity works with all major binary options brokers including IQ Option, Quotex, Pocket Option, Olymp Trade, Deriv, Binomo, ExpertOption, and more. If your broker is accessible on Windows, Trinity can automate it.",
  },
  {
    q: "Do I need trading experience to use Trinity?",
    a: "None at all. Trinity was built to remove the need for trading knowledge entirely. Open the app, connect your broker, choose your strategy mode, set your stake, and press START. Trinity's AI reads the charts, identifies the setups, and executes every trade automatically. Most users are generating profitable sessions within hours of setup.",
  },
  {
    q: "How does the Compounding strategy work?",
    a: "Trinity's Compounding mode automatically reinvests a portion of each winning trade into the next — growing your active stake with every victory. Instead of flat profits session after session, your account grows exponentially: small wins stack into larger wins, which compound into even larger ones. At Trinity's 80%+ accuracy level, the compounding math is extremely powerful. Traders using this mode consistently turn modest starting balances into multiples within weeks.",
  },
  {
    q: "Can Trinity run unattended while I work or sleep?",
    a: "Yes — and this is one of the most powerful things about Trinity. The AI never sleeps, never loses focus, and never gets emotional. Set your parameters once, press START, and Trinity monitors every supported asset and fires every qualifying signal — whether you're working, sleeping, or living your life. Check back whenever you want to see your profit graph rising.",
  },
  {
    q: "What if Trinity doesn't perform for me?",
    a: "Every subscription is protected by a 30-day money-back guarantee — no questions asked, no hoops to jump through. If Trinity doesn't deliver results you're genuinely satisfied with in your first 30 days, you receive a full refund. There is zero financial risk in trying it. The only risk is waiting too long to start.",
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
        className="text-center mb-10 sm:mb-14 max-w-xl mx-auto"
      >
        <Badge variant="neutral" className="mb-4">FAQ</Badge>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-4 sm:mb-5">
          Got doubts?{" "}
          <span className="gradient-text">Good. Read these.</span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          We answer every question honestly — including the ones other tools bury in fine print.
          Still unsure? Find us on Telegram — we reply in under 10 minutes.
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
