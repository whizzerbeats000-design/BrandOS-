import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/components/icons";

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  /** Light variant for use over dark photography. */
  tone?: "default" | "light";
  className?: string;
  onClick?: () => void;
}

/**
 * MagneticLink — the quiet editorial CTA.
 *
 * A nav-sized underline link whose rule draws in on hover and whose arrow
 * glides forward a hair. No pill, no fill, no gold — the motion is the
 * affordance.
 */
export function MagneticLink({
  href,
  children,
  tone = "default",
  className,
  onClick,
}: MagneticLinkProps) {
  const light = tone === "light";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2.5 self-start border-b pb-1 transition-colors duration-standard ease-standard",
        light
          ? "border-ivory/40 text-ivory hover:border-ivory"
          : "border-border-strong text-foreground hover:border-foreground",
        className,
      )}
    >
      <span className="type-nav">{children}</span>
      <ArrowRightIcon
        aria-hidden="true"
        className={cn(
          "h-3.5 w-3.5 transition-transform duration-standard ease-accent group-hover:translate-x-1",
        )}
      />
    </Link>
  );
}