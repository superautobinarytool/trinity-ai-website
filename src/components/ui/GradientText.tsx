import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  /** "brand" = cyan→purple | "reverse" = purple→cyan | "shimmer" = animated */
  variant?: "brand" | "reverse" | "shimmer" | "white";
  as?: keyof JSX.IntrinsicElements;
}

export default function GradientText({
  children,
  className,
  variant = "brand",
  as: Tag = "span",
}: GradientTextProps) {
  const classes = {
    brand:   "gradient-text",
    reverse: "gradient-text-reverse",
    shimmer: "text-shimmer",
    white:   "text-white",
  };

  return (
    <Tag className={cn(classes[variant], className)}>
      {children}
    </Tag>
  );
}
