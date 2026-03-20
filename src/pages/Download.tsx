import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-long-white.png";

const DOWNLOAD_URL = "https://limewire.com/d/VidV7#Jljg4hxaeN";

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M2 19h20v2H2v-2zM2 8l5 7.5L12 8l5 7.5L22 8v10H2V8z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden="true">
      <path fill="#0078D4" d="M0 12.4L35.7 7.6V43H0z" />
      <path fill="#0078D4" d="M40.2 6.9L88 0V43H40.2z" />
      <path fill="#0078D4" d="M0 47H35.7v35.4L0 77.6z" />
      <path fill="#0078D4" d="M40.2 47H88V88L40.2 81.1z" />
    </svg>
  );
}

function GreenCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#16a34a" fillOpacity="0.25" />
      <path stroke="#22C55E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M6.5 10.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export default function Download() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="relative z-10 border-b border-white/[0.07]"
        style={{
          background: "rgba(5,5,8,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" aria-label="Go home">
            <img
              src={logoWhite}
              alt="Trinity AI"
              className="h-9 sm:h-10 w-auto object-contain"
              draggable={false}
            />
          </Link>
          <Link
            to="/#pricing"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            <span>View Plans</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h6M13 7l3 3-3 3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#22C55E] border border-[#22C55E]/25 bg-[#22C55E]/[0.06] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Windows 10 &amp; 11 · Latest Build
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4">
              Download{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg,#22c55e,#16a34a)" }}
              >
                Trinity AI
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed">
              Get the Trinity AI software and start automating your trades with
              AI-powered signals in minutes. Compatible with all major brokers.
            </p>
          </motion.div>

          {/* ── Download cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 — Standard Edition */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.09] bg-[#0c0c14] p-7 sm:p-8 flex flex-col gap-5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                    Standard Edition
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    Trinity AI
                  </h2>
                </div>
                <div className="w-10 h-10 flex-shrink-0 opacity-80">
                  <WindowsLogo className="w-full h-full" />
                </div>
              </div>

              <div className="h-px bg-white/[0.07]" />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {[
                  "Trinity AI signal auto-execution",
                  "Live TradingView charts — 25+ pairs",
                  "Smart Compounding profit strategy",
                  "Real-time session profit graph",
                  "Full trade history & analytics",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <GreenCheck />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Trust line */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheckIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Virus-free · Verified build · No installation required</span>
              </div>

              {/* CTA */}
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold bg-white/[0.08] border border-white/[0.14] text-white hover:bg-white/[0.14] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <ArrowDownIcon className="w-4 h-4" />
                Download Now
              </a>
              <p className="text-xs text-center text-gray-600">
                Available for all active Trinity plan holders
              </p>
            </motion.div>

            {/* Card 2 — Pro Edition */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl relative overflow-hidden flex flex-col gap-5 p-7 sm:p-8"
              style={{
                background: "linear-gradient(145deg, #091508 0%, #0c0c14 55%, #050508 100%)",
                border: "1px solid rgba(34,197,94,0.20)",
                boxShadow: "0 8px 64px rgba(34,197,94,0.09)",
              }}
            >
              {/* Inner glow accent */}
              <div
                className="absolute top-0 right-0 w-52 h-52 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(34,197,94,0.13) 0%, transparent 70%)",
                }}
              />

              {/* Exclusive badge */}
              <div className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#22C55E]/[0.08] border border-[#22C55E]/[0.18] w-fit">
                <CrownIcon className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
                  Exclusively for Pro Members
                </span>
              </div>

              {/* Header row */}
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E]/50 mb-2 block">
                    Pro Edition
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    Trinity AI Pro
                  </h2>
                </div>
                <div className="w-10 h-10 flex-shrink-0 opacity-80">
                  <WindowsLogo className="w-full h-full" />
                </div>
              </div>

              <div className="relative h-px bg-[#22C55E]/[0.12]" />

              {/* Features */}
              <ul className="relative flex flex-col gap-3">
                {[
                  "Everything in Standard Edition",
                  "Advanced AI compound scaling mode",
                  "Priority signal feed",
                  "Exclusive pro-only settings & config",
                  "1-on-1 onboarding & setup call",
                  "Early access to every new feature",
                ].map((f, i) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${i === 0 ? "text-gray-300 font-medium" : "text-gray-400"}`}>
                    <GreenCheck />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Trust line */}
              <div className="relative flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheckIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Virus-free · Verified build · No installation required</span>
              </div>

              {/* CTA */}
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  color: "#fff",
                  boxShadow: "0 4px 28px rgba(34,197,94,0.35)",
                }}
              >
                <ArrowDownIcon className="w-4 h-4" />
                Download Pro Edition
              </a>
              <p className="relative text-xs text-center text-[#22C55E]/40">
                Requires an active Pro subscription · License validated on launch
              </p>
            </motion.div>

          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-gray-600 mt-12"
          >
            Don&apos;t have a plan yet?{" "}
            <Link to="/#pricing" className="text-[#22C55E] hover:text-green-400 transition-colors">
              View pricing and get started →
            </Link>
          </motion.p>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 px-4 text-center">
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} Trinity Trading AI · All rights reserved
        </p>
      </footer>

    </div>
  );
}
