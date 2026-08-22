import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionTransitionProps {
  children: ReactNode;
  /** How many rem the panel pulls up over the preceding section. */
  overlap?: number;
  className?: string;
  as?: ElementType;
}

/**
 * SectionTransition — a foreground layer against the section above.
 *
 * The panel physically overlaps its predecessor (negative top margin) so the
 * page reads as stacked layers, not a list of full-width strips. Typography
 * on this panel sits on a nearer plane than the imagery beneath it.
 */
export function SectionTransition({
  children,
  overlap = 3,
  className,
  as: Tag = "div",
}: SectionTransitionProps) {
  return (
    <Tag
      className={cn("section-transition", className)}
      style={{ "--overlap": `${overlap}rem` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}