"use client";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = requestAnimationFrame(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${scrolled / 100})`;
        }
        animationFrameRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={progressRef}
      className="pointer-events-none fixed left-0 top-0 h-0.5 w-full bg-foreground/25"
    />
  );
}
