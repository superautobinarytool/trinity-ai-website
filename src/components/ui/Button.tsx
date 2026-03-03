import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap";

    const variants = {
      primary: [
        "text-white",
        "bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
        "shadow-[0_0_24px_rgba(34,197,94,0.30)]",
        "hover:shadow-[0_0_36px_rgba(34,197,94,0.50)]",
        "hover:scale-[1.02] active:scale-[0.98]",
      ].join(" "),
      secondary: [
        "text-white",
        "bg-white/5 border border-white/10",
        "hover:bg-white/10 hover:border-white/20",
        "active:scale-[0.98]",
      ].join(" "),
      ghost: "text-gray-300 hover:text-white hover:bg-white/5 active:scale-[0.97]",
      outline: [
        "text-[#22C55E] border border-[#22C55E]/40",
        "hover:border-[#22C55E]/70 hover:bg-[#22C55E]/5",
        "active:scale-[0.98]",
      ].join(" "),
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
