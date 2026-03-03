import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "purple" | "green" | "neutral";
  className?: string;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "cyan",
  className,
  dot = true,
}: BadgeProps) {
  const variants = {
    cyan:    "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    purple:  "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
    green:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    neutral: "bg-white/5 text-gray-300 border-white/10",
  };

  const dotColors = {
    cyan:    "bg-[#22C55E]",
    purple:  "bg-[#16A34A]",
    green:   "bg-emerald-400",
    neutral: "bg-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            dotColors[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
