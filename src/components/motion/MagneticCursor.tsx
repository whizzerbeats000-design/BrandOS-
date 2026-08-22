"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MagneticCursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string>("");
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pos = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const labelPos = { x: 0, y: 0 };

  useEffect(() => {
    if (reduced) return;
    const isTouchDevice =
      "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const labelEl = labelRef.current;
    if (!cursor || !labelEl) return;

    const update = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      labelEl.style.transform = `translate3d(${labelPos.x}px, ${labelPos.y}px, 0)`;
      requestAnimationFrame(update);
    };
    update();

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setActive(true);
    };
    const onMouseLeave = () => setActive(false);
    const onLabelEnter = (l: string) => {
      setLabel(l);
      labelPos.x = target.x + 12;
      labelPos.y = target.y - 24;
    };
    const onLabelLeave = () => setLabel("");

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const handleOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (
        targetEl.matches("a, button, [role='button'], .product-card, .hero-cta, .nav-link, .btn") &&
        !targetEl.hasAttribute("disabled")
      ) {
        let l = "VIEW";
        if (targetEl.matches("button, [role='button']")) l = "OPEN";
        if (targetEl.matches(".product-card")) l = "VIEW";
        if (targetEl.matches(".hero-cta")) l = "EXPLORE";
        if (targetEl.matches(".nav-link")) l = "OPEN";
        if (targetEl.matches(".btn")) l = "OPEN";
        onLabelEnter(l);
      }
    };
    const handleOut = () => onLabelLeave();
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [reduced]);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full border border-foreground/30 bg-foreground/5 opacity-0 transition-opacity duration-200"
        aria-hidden="true"
      >
        <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-foreground/40" />
      </div>
      {label && (
        <div
          ref={labelRef}
          className="pointer-events-none fixed left-0 top-0 z-[9998] text-foreground text-xs font-medium opacity-0 transition-opacity duration-200"
          aria-hidden="true"
        >
          {label}
        </div>
      )}
    </>
  );
}
