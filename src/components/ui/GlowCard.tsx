import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "none";
}

/**
 * Card with an interactive mouse-track glow gradient.
 * Inspired by the LuxAlgo dark glass card aesthetic.
 */
export default function GlowCard({
  children,
  className,
  glowColor = "cyan",
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glow =
    glowColor === "cyan"
      ? "rgba(34, 197, 94, 0.12)"
      : glowColor === "purple"
      ? "rgba(22, 163, 74, 0.12)"
      : "transparent";

  const radialGradient = useMotionTemplate`
    radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${glow}, transparent 80%)
  `;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-[#0C0C14] border border-white/[0.07]",
        "transition-all duration-300",
        "hover:border-white/[0.12] hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {/* Mouse glow overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: radialGradient }}
        aria-hidden="true"
      />
      {/* Top edge shine */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
