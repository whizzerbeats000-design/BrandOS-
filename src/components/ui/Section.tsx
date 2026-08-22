import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  /** Vertical rhythm. Defaults to the editorial section spacing scale. */
  padding?: "none" | "small" | "section";
}

export function Section({
  children,
  as: Tag = "section",
  className,
  id,
  "aria-labelledby": ariaLabelledby,
  padding = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        padding === "section" &&
          "py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]",
        padding === "small" && "py-[var(--section-spacing-mobile)] md:py-24",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
