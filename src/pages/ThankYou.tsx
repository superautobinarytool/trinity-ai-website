import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoWhite from "@/assets/logo-long-white.png";
import { CheckCircleFilledIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function ThankYou() {
  const [params] = useSearchParams();
  const orderId  = params.get("order") ?? "";
  const plan     = params.get("plan") === "pro" ? "Pro" : "Starter";

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(34,197,94,0.09) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Minimal header ── */}
      <header className="relative z-10 border-b border-white/[0.07]"
        style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center">
          <Link to="/" aria-label="Go home">
            <img src={logoWhite} alt="Project Trinity" className="h-9 sm:h-10 w-auto object-contain" draggable={false} />
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 100%)",
                border: "1.5px solid rgba(34,197,94,0.3)",
                boxShadow: "0 0 48px rgba(34,197,94,0.25)",
              }}
            >
              <CheckCircleFilledIcon className="w-10 h-10 text-[#22C55E]" />
            </div>
          </motion.div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
            Payment submitted
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Your <span className="text-white font-semibold">Trinity {plan}</span> order is being confirmed on-chain. Once the network verifies your transaction, your licence key will be sent to your email.
          </p>

          {/* Order reference */}
          {orderId && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Order</span>
              <span className="text-[13px] font-mono text-gray-300">{orderId}</span>
            </div>
          )}

          {/* What happens next */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-left mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600 mb-4">What happens next</p>
            <ol className="flex flex-col gap-3.5">
              {[
                { step: "1", text: "NOWPayments confirms your crypto transaction — this usually takes 1–3 minutes." },
                { step: "2", text: "We receive confirmation and automatically send your Trinity licence key to the email you provided." },
                { step: "3", text: "Follow the setup instructions in that email to activate software on your Windows machine." },
                { step: "4", text: "Join our Discord — our team will walk you through your first session." },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-px"
                    style={{ background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E" }}
                  >
                    {step}
                  </span>
                  <span className="text-sm text-gray-400 leading-relaxed">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://discord.gg/titansalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#22C55E] to-[#16A34A] shadow-[0_0_24px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.99]"
            >
              Join our Discord
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.10] hover:border-white/[0.20] hover:text-white transition-all duration-200"
            >
              Back to home
            </Link>
          </div>

          {/* Support note */}
          <p className="mt-8 text-xs text-gray-700 leading-relaxed">
            Didn't receive an email within 10 minutes?{" "}
            <a
              href="https://discord.gg/titansalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Message us on Discord
            </a>{" "}
            with your order reference and we'll sort it out immediately.
          </p>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-gray-700">© 2026 Project Trinity · All rights reserved</p>
        </div>
      </footer>

    </div>
  );
}
