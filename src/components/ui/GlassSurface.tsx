"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A restrained glass action — a button or inline control that floats as an
 * information layer over photography. Pairs well with directional text + arrow.
 */
export const GlassAction = ({
  children,
  className,
  as: Tag = "button",
  intensity = "thin",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  intensity?: "thin" | "default" | "strong";
} & Record<string, unknown>) => {
  const intensityVars = {
    thin: { bg: "var(--glass-bg-thin)", border: "var(--glass-border-thin)" },
    default: { bg: "var(--glass-bg)", border: "var(--glass-border)" },
    strong: { bg: "var(--glass-bg-strong)", border: "var(--glass-border-strong)" },
  }[intensity];

  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-4 py-2",
        "border transition-[background-color,border-color,box-shadow] duration-standard ease-standard",
        className,
      )}
      style={{ backgroundColor: intensityVars.bg, borderColor: intensityVars.border }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Visual weight of the glass panel. "thin" reads as a whisper, "strong" as a smoked island. */
  intensity?: "thin" | "default" | "strong";
}

const INTENSITY_TOKENS: Record<NonNullable<GlassSurfaceProps["intensity"]>, { bg: string; border: string; blur: string }> = {
  thin: {
    bg: "var(--glass-bg-thin)",
    border: "var(--glass-border-thin)",
    blur: "var(--glass-blur-thin)",
  },
  default: {
    bg: "var(--glass-bg)",
    border: "var(--glass-border)",
    blur: "var(--glass-blur)",
  },
  strong: {
    bg: "var(--glass-bg-strong)",
    border: "var(--glass-border-strong)",
    blur: "var(--glass-blur-strong)",
  },
};

export function GlassSurface({
  children,
  className,
  as: Tag = "div",
  intensity = "default",
}: GlassSurfaceProps) {
  const t = INTENSITY_TOKENS[intensity];
  return (
    <Tag
      className={cn(
        "border bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        "[-webkit-backdrop-filter:blur(var(--glass-blur))]",
        "shadow-[var(--shadow-md)]",
        className,
      )}
      style={{
        backgroundColor: t.bg,
        borderColor: t.border,
        backdropFilter: `blur(${t.blur})`,
        WebkitBackdropFilter: `blur(${t.blur})`,
      }}
    >
      {children}
    </Tag>
  );
}
