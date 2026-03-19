import { motion } from "framer-motion";

// ── Custom SVG brand icons for each broker ──────────────────────────────────

function IQOptionIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#FF3547"/>
      <text x="16" y="21" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="11" fill="white">IQ</text>
    </svg>
  );
}

function QuotexIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#0EA5E9"/>
      <path d="M16 7 C10.5 7 6 11.5 6 17 C6 22.5 10.5 27 16 27 C20 27 23.4 24.7 25.1 21.3 L21.5 19.5 C20.4 21.6 18.3 23 16 23 C12.7 23 10 20.3 10 17 C10 13.7 12.7 11 16 11 C18.3 11 20.4 12.4 21.5 14.5 L25.1 12.7 C23.4 9.3 20 7 16 7 Z" fill="white"/>
      <rect x="22" y="20" width="4" height="6" rx="1" fill="white"/>
    </svg>
  );
}

function PocketOptionIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#1E3A8A"/>
      <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M16 10 L16 16 L21 16" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function OlympTradeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#FF6B00"/>
      <circle cx="16" cy="16" r="7.5" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M12 19 L15 13 L16.5 16 L18.5 12 L22 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function DerivIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#FF444F"/>
      <path d="M8 22 L8 10 L15 10 C19.4 10 23 13.1 23 16 C23 18.9 19.4 22 15 22 Z" fill="white"/>
      <path d="M8 16 L16 16" stroke="#FF444F" strokeWidth="2"/>
    </svg>
  );
}

function BinomoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#2563EB"/>
      <rect x="9" y="9" width="6" height="14" rx="3" fill="white"/>
      <rect x="17" y="9" width="6" height="8" rx="3" fill="white" opacity="0.7"/>
      <rect x="17" y="19" width="6" height="4" rx="2" fill="white"/>
    </svg>
  );
}

function ExpertOptionIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#7C3AED"/>
      <path d="M9 16 L23 16 M16 9 L23 16 L16 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NadexIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#0F172A"/>
      <path d="M8 22 L8 10 L14 10 L20 18 L20 10 L24 10 L24 22 L18 22 L12 14 L12 22 Z" fill="#22C55E"/>
    </svg>
  );
}

function RaceOptionIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#0C4A6E"/>
      <path d="M7 20 C7 20 10 12 16 12 C20 12 22 15 22 15 L25 12" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="22" cy="20" r="4" fill="#F59E0B"/>
      <path d="M20 20 L22 18 L24 20 L22 22 Z" fill="white"/>
    </svg>
  );
}

function BinaryComIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="32" height="32" rx="7" fill="#C8102E"/>
      <text x="9" y="15" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="9" fill="white">01</text>
      <text x="9" y="25" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="9" fill="white" opacity="0.7">10</text>
    </svg>
  );
}

const BROKERS = [
  { name: "IQ Option",      Icon: IQOptionIcon      },
  { name: "Quotex",         Icon: QuotexIcon         },
  { name: "Pocket Option",  Icon: PocketOptionIcon   },
  { name: "Olymp Trade",    Icon: OlympTradeIcon     },
  { name: "Deriv",          Icon: DerivIcon          },
  { name: "Binomo",         Icon: BinomoIcon         },
  { name: "ExpertOption",   Icon: ExpertOptionIcon   },
  { name: "Nadex",          Icon: NadexIcon          },
  { name: "RaceOption",     Icon: RaceOptionIcon     },
  { name: "Binary.com",     Icon: BinaryComIcon      },
];

const DOUBLED = [...BROKERS, ...BROKERS];

export default function LogoBar() {
  return (
    <section
      aria-label="Compatible binary options brokers"
      className="relative py-10 bg-[#050508] overflow-hidden border-y border-white/[0.05]"
    >
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-[#050508] to-transparent z-10" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-[#050508] to-transparent z-10" aria-hidden="true" />

      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-7">
        Works seamlessly with top brokers
      </p>

      <div className="flex overflow-hidden select-none" aria-hidden="true">
        <motion.div
          className="flex gap-12 sm:gap-20 items-center pr-12 sm:pr-20"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {DOUBLED.map(({ name, Icon }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-300"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-lg overflow-hidden">
                <Icon />
              </span>
              <span className="text-sm sm:text-base text-gray-300 font-semibold whitespace-nowrap tracking-tight">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
