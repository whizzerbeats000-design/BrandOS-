"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollProgress — editorial champagne line, not a SaaS loading bar.
 *
 * Design decisions vs. the previous version:
 * - Color: champagne accent (--color-accent) rather than foreground/25.
 *   The champagne reads as deliberate brand signal, not a generic progress bar.
 * - Hero hiding: on the homepage, the bar is invisible while the user is inside
 *   the hero viewport. It appears only once they scroll past the fold,
 *   so it never competes with the campaign photography.
 * - On non-home pages, it's always visible (no hero to compete with).
 * - Height: 1px — thinner than before, more editorial.
 * - Transform-origin: left — scales from left as expected.
 * - Smooth entrance: fades in with opacity transition when crossing the hero.
 */
export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(!isHome);
  const [prevIsHome, setPrevIsHome] = useState(isHome);

  // Reset visibility when navigating between pages. Adjusting state during
  // render (rather than an effect) keeps the reset in step with the new route.
  if (isHome !== prevIsHome) {
    setPrevIsHome(isHome);
    setPastHero(!isHome);
  }

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;

        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${height > 0 ? winScroll / height : 0})`;
        }

        // On homepage: show bar only after hero (approx 1 viewport height)
        if (isHome) {
          const heroHeight = window.innerHeight;
          setPastHero(winScroll > heroHeight * 0.8);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isHome]);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[80] h-px w-full overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={progressRef}
        className="h-full w-full origin-left bg-accent transition-opacity duration-cinematic ease-cinematic"
        style={{ opacity: pastHero ? 1 : 0, transform: "scaleX(0)" }}
      />
    </div>
  );
}
