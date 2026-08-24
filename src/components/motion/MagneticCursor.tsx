"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * MagneticCursor — custom editorial cursor for fine-pointer (desktop) devices.
 *
 * Design decisions:
 * - Visibility is toggled via state, not permanent opacity-0
 * - The rAF loop only runs while the cursor is moving (event-driven, not
 *   unconditional — stops when the pointer is idle to save CPU/GPU)
 * - Skipped entirely on touch devices and when prefers-reduced-motion is set
 * - The label follows the dot with a slight lag for a physically plausible feel
 */
export function MagneticCursor() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string>("");
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  // Current lerped position
  const pos = useRef({ x: 0, y: 0 });
  // Raw mouse position (target)
  const target = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const isTouchDevice =
      "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const labelEl = labelRef.current;
    if (!cursor || !labelEl) return;

    /**
     * Animation loop — only scheduled while the pointer is moving.
     * Cancels itself when lerp converges (delta < 0.1px).
     */
    const tick = () => {
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;

      pos.current.x += dx * 0.15;
      pos.current.y += dy * 0.15;

      cursor.style.transform = `translate3d(${pos.current.x - 8}px, ${pos.current.y - 8}px, 0)`;
      labelEl.style.transform = `translate3d(${pos.current.x + 14}px, ${pos.current.y - 22}px, 0)`;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        isMoving.current = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      if (!isMoving.current) {
        isMoving.current = true;
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;

      if (
        el.matches("a, button, [role='button']") &&
        !el.hasAttribute("disabled") &&
        !el.getAttribute("aria-disabled")
      ) {
        let l = "VIEW";
        if (el.matches("button, [role='button']")) l = "OPEN";
        if (el.matches(".product-card, .product-plane")) l = "VIEW";
        if (el.matches(".hero-cta")) l = "EXPLORE";
        setLabel(l);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el?.matches("a, button, [role='button'], .product-card, .hero-cta")) {
        setLabel("");
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [reduced]);

  // Don't render anything for touch devices or reduced motion preference
  if (reduced) return null;

  return (
    <>
      {/* Cursor dot — position is set via transform, not left/top to avoid layout */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full border border-foreground/30 bg-foreground/5 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/50" />
      </div>

      {/* Contextual label — only renders when over an interactive element */}
      {label ? (
        <div
          ref={labelRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[9998] text-[0.625rem] font-medium tracking-[0.18em] text-foreground transition-opacity duration-150"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {label}
        </div>
      ) : (
        /* Keep the ref mounted even when no label so it doesn't remount */
        <div ref={labelRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9998]" />
      )}
    </>
  );
}
