import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Inter"',          'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter:  '-0.025em',
        tight:    '-0.015em',
        normal:   '0em',
        wide:     '0.04em',
        wider:    '0.08em',
        widest:   '0.16em',
      },
      colors: {
        /* ── Design-token palette ── */
        brand: {
          green:   "#22C55E",
          green2:  "#16A34A",
          dark:    "#050508",
          card:    "#0C0C14",
          border:  "rgba(255,255,255,0.07)",
          muted:   "#64748B",
        },
      },
      backgroundImage: {
        "gradient-brand":    "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
        "gradient-brand-r":  "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
        "gradient-hero":     "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(22,163,74,0.10) 0%, transparent 60%)",
        "gradient-dark":     "linear-gradient(180deg, #050508 0%, #07070F 100%)",
        "card-shine":        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)",
      },
      boxShadow: {
        "glow-green":  "0 0 40px rgba(34,197,94,0.25)",
        "glow-green2": "0 0 40px rgba(22,163,74,0.25)",
        "glow-sm":     "0 0 20px rgba(34,197,94,0.15)",
        "card":        "0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%":       { opacity: "1" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "border-spin": {
          "0%":   { "--angle": "0deg" } as Record<string, string>,
          "100%": { "--angle": "360deg" } as Record<string, string>,
        },
        "scale-in": {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.6s ease forwards",
        "fade-in":    "fade-in 0.5s ease forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        ticker:       "ticker 28s linear infinite",
        float:        "float 6s ease-in-out infinite",
        shimmer:      "shimmer 4s linear infinite",
        "scale-in":   "scale-in 0.4s ease forwards",
      },
    },
  },
  plugins: [animate],
};

export default config;
