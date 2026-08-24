"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FloatingCtaProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
}

export function FloatingCta({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  className,
}: FloatingCtaProps) {
  return (
    <div className={cn("glass-card p-8 lg:p-12", className)}>
      <div className="flex flex-col gap-6">
        {eyebrow && (
          <p className="type-metadata text-accent">{eyebrow}</p>
        )}
        <h2 className="type-display text-foreground">{title}</h2>
        {description && (
          <p className="type-body max-w-xl text-foreground-secondary">{description}</p>
        )}
        {children}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {primaryAction && (
              <a
                href={primaryAction.href}
                className="type-button inline-flex h-12 items-center justify-center bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
              >
                {primaryAction.label}
              </a>
            )}
            {secondaryAction && (
              <a
                href={secondaryAction.href}
                className="type-nav border-b border-foreground/30 pb-1 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
              >
                {secondaryAction.label}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
