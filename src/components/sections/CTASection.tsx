import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      aria-label="Final call to action"
      className="relative py-16 sm:py-24 lg:py-36 overflow-hidden bg-[#050508]"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[800px] h-[400px] rounded-full bg-gradient-to-r from-[#22C55E]/[0.07] via-[#16A34A]/[0.1] to-[#15803D]/[0.07] blur-[100px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:36px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" aria-hidden="true" />

      {/* Top + bottom edge lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/30 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#16A34A]/30 to-transparent" aria-hidden="true" />

      <div className="container-xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-[2.4rem] sm:text-5xl lg:text-6xl xl:text-[5.25rem] font-extrabold tracking-tightest text-white leading-[1.04] mb-5 sm:mb-7">
            While you&apos;re reading this,{" "}
            <br className="hidden lg:block" />
            <span className="gradient-text">Trinity just fired another trade.</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
            Every second you trade manually is a second a faster, more disciplined AI beats you
            to the window. Trinity runs 24/7 at machine speed — 80%+ accuracy, zero hesitation,
            zero emotion. 11,000+ traders already made the switch. Don&apos;t be last.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <Button variant="primary" size="lg" href="#pricing">
              Start 30-Day Risk-Free Trial
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg" href="https://discord.gg/6WrP7CXnHd">
              Join the Community
            </Button>
          </div>

          {/* Micro-trust */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            {[
              "No credit card required",
              "30-day money-back guarantee",
              "Cancel anytime",
            ].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4 text-[#22C55E]" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
