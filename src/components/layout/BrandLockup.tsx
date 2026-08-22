import Link from "next/link";
import { cn } from "@/lib/cn";

interface BrandLockupProps {
  className?: string;
  /** "light" renders the mark in ivory for use over dark photography. */
  tone?: "default" | "light";
}

/**
 * SUS WEARS brand mark.
 * No dedicated logo asset exists in the platform yet, so this is the
 * clean two-line text lockup — the production fallback until an asset
 * is supplied. Deliberately not recreated as a monogram.
 */
export function BrandLockup({ className, tone = "default" }: BrandLockupProps) {
  const primary = tone === "light" ? "text-ivory" : "text-foreground";
  const secondary = tone === "light" ? "text-ivory-secondary" : "text-foreground-muted";
  return (
    <Link
      href="/"
      aria-label="SUS WEARS — home"
      className={cn("inline-flex items-baseline gap-2.5", className)}
    >
      <span className={cn("font-display text-xl font-medium uppercase tracking-[0.18em]", primary)}>
        SUS
      </span>
      <span className={cn("font-display text-xl font-light uppercase tracking-[0.18em]", secondary)}>
        WEARS
      </span>
    </Link>
  );
}