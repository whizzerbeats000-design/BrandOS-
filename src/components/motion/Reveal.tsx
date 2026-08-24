"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  variant?: "fade" | "reveal" | "zoom" | "slide" | "blur" | "blur-reveal" | "wipe";
  /** Stagger delay in ms — only applied when motion is permitted. */
  delay?: number;
  className?: string;
}

/**
 * Reveal — scroll-driven entrance wrapper.
 *
 * Uses IntersectionObserver to add `.is-visible` when the element enters the
 * viewport. Each variant maps to a CSS class in motion.css:
 *
 *   "fade"         opacity only
 *   "reveal"       opacity + translateY (default)
 *   "zoom"         opacity + scale(0.96) — images entering from behind
 *   "slide"        opacity + translateX
 *   "blur"         opacity + blur
 *   "blur-reveal"  opacity + blur + translateY
 *   "wipe"         clip-path curtain left→right (for image reveals)
 */
export function Reveal({
  children,
  variant = "reveal",
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={
        !reduced && delay > 0
          ? ({ transitionDelay: `${delay}ms` } as CSSProperties)
          : undefined
      }
      className={cn(`motion-${variant}`, className)}
    >
      {children}
    </div>
  );
}
