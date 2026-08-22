"use client";

import { useCallback, useRef, forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DepthCardProps {
  children: ReactNode;
  className?: string;
  /** Tilt intensity 0–1. Default 0.5. */
  intensity?: number;
}

const MAX_DEGREES = 1.5;

export const DepthCard = forwardRef<HTMLDivElement, DepthCardProps>(
  ({ children, className, intensity = 0.5 }, forwardedRef) => {
    const reduced = useReducedMotion();
    const frameRef = useRef<number>(0);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (reduced) return;
        const el = e.currentTarget;
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / el.offsetWidth - 0.5;
          const y = (e.clientY - rect.top) / el.offsetHeight - 0.5;
          el.style.setProperty("--rx", `${-y * MAX_DEGREES * intensity}deg`);
          el.style.setProperty("--ry", `${x * MAX_DEGREES * intensity}deg`);
        });
      },
      [reduced, intensity],
    );

    const handlePointerLeave = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        cancelAnimationFrame(frameRef.current);
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      },
      [],
    );

    return (
      <div className={cn("depth-card-container", className)} ref={forwardedRef}>
        <div
          className="depth-card-inner h-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {children}
        </div>
      </div>
    );
  },
);

DepthCard.displayName = "DepthCard";
