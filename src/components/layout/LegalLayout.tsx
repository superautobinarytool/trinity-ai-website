import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-long-white.png";
import { ChevronLeftIcon } from "@/components/ui/Icons";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-base sm:text-[17px] font-bold text-white mb-3 mt-8 first:mt-0">
        {title}
      </h2>
      <div className="space-y-2.5 text-gray-400">{children}</div>
    </section>
  );
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 30% at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 border-b border-white/[0.07]"
        style={{
          background: "rgba(5,5,8,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Project Trinity home">
            <img
              src={logoWhite}
              alt="Project Trinity"
              className="h-9 sm:h-10 w-auto object-contain"
              draggable={false}
            />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        {/* Title block */}
        <div className="mb-10 pb-8 border-b border-white/[0.07]">
          <h1 className="font-display text-3xl sm:text-[2.25rem] font-extrabold text-white tracking-tight leading-snug mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Body */}
        <article className="text-[15px] leading-relaxed space-y-8">
          {children}
        </article>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.07] py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
          <p>© 2026 Project Trinity · All rights reserved · Trading involves risk</p>
          <Link to="/" className="hover:text-gray-400 transition-colors duration-150">
            ← Return to home
          </Link>
        </div>
      </footer>

    </div>
  );
}
