"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  variant?: "fade" | "reveal" | "zoom" | "slide" | "blur" | "blur-reveal";
  /** Stagger delay in ms — only applied when motion is permitted. */
  delay?: number;
  className?: string;
}

export function Reveal({ children, variant = "reveal", delay = 0, className }: RevealProps) {
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
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={!reduced && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(`motion-${variant}`, className)}
    >
      {children}
    </div>
  );
}
