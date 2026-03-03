import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Show grid pattern overlay */
  grid?: boolean;
  /** Center content horizontally */
  wide?: boolean;
}

/**
 * Consistent section wrapper with optional grid overlay and max-width container.
 */
export default function Section({ children, id, className, grid = false, wide = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden section-padding",
        className
      )}
    >
      {/* Optional dot-grid overlay */}
      {grid && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]"
        />
      )}
      <div className={cn("container-xl relative z-10", wide && "max-w-[1400px]")}>
        {children}
      </div>
    </section>
  );
}
