import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "accent";
  className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "type-metadata inline-flex items-center border px-3 py-1.5 uppercase",
        variant === "neutral" && "border-border bg-background-secondary text-foreground-secondary",
        variant === "accent" && "border-foreground/30 bg-foreground/5 text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
