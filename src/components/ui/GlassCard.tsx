"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "thin" | "default" | "strong";
  hover?: boolean;
  as?: "div" | "section" | "article";
}

const INTENSITY_CLASSES = {
  thin: "bg-[var(--glass-bg-thin)] border-[var(--glass-border-thin)] backdrop-blur-[var(--glass-blur-thin)]",
  default: "bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-[var(--glass-blur)]",
  strong: "bg-[var(--glass-bg-strong)] border-[var(--glass-border-strong)] backdrop-blur-[var(--glass-blur-strong)]",
};

export function GlassCard({
  children,
  className,
  intensity = "default",
  hover = false,
  as = "div",
}: GlassCardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-lg)] border shadow-[var(--shadow-md)]",
        INTENSITY_CLASSES[intensity],
        hover && "transition-all duration-standard ease-standard hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
