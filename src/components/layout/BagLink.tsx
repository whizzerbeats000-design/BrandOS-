"use client";

import Link from "next/link";
import { BagIcon } from "@/components/icons";
import { useBagCount } from "@/hooks/useBagCount";
import { cn } from "@/lib/cn";

interface BagLinkProps {
  className?: string;
  /** "light" renders the icon in ivory for use over dark photography. */
  tone?: "default" | "light";
}

/**
 * Navigation entry point for the Bag. The count reflects the real
 * client-side bag — no badge is shown when the bag is empty.
 */
export function BagLink({ className, tone = "default" }: BagLinkProps) {
  const count = useBagCount();
  const toneClasses =
    tone === "light"
      ? "text-ivory-secondary hover:text-ivory"
      : "text-foreground-muted hover:text-foreground";

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Bag, ${count} items` : "Bag"}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center transition-colors duration-standard ease-standard",
        toneClasses,
        className,
      )}
    >
      <BagIcon className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[0.625rem] font-semibold leading-none text-accent-contrast">
          {count}
        </span>
      ) : null}
    </Link>
  );
}