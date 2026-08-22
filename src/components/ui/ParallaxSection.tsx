"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxSectionProps {
  children: ReactNode;
  /** How much parallax 0–1. Default 0.3. */
  speed?: number;
  className?: string;
}

const MAX_OFFSET = 50;

export function ParallaxSection({ children, speed = 0.3, className }: ParallaxSectionProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const rawOffset = (viewportCenter - elementCenter) * speed * -1;
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, rawOffset));
      el.style.setProperty("--parallax-offset", `${offset}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, speed]);

  return (
    <div ref={ref} className={cn("parallax-layer", className)}>
      {children}
    </div>
  );
}
