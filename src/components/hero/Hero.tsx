"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { HERO_AUTOPLAY_MS, HERO_SLIDES } from "@/data/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroControls } from "./HeroControls";
import { HeroCopy } from "./HeroCopy";
import { HeroMedia } from "./HeroMedia";
import { HeroScrollIndicator } from "./HeroScrollIndicator";
import { MagneticCursor } from "@/components/motion/MagneticCursor";

export const HERO_TRANSITION_MS = 1400;

/**
 * Full-viewport cinematic hero — the photograph IS the environment.
 *
 * Layers, from the camera back to the viewer (each isolated):
 *
 *   Z0  environment      atmosphere + film grain, behind the photograph
 *   Z1  photography      full-bleed campaign image (active z-2, incoming z-1)
 *   Z2  cinematic grade  tonal scrim shaped to the copy position + vignette
 *   Z3  editorial type   campaign typography set IN the photograph
 *   Z4  navigation       quiet controls + scroll cue
 *
 * Depth is spatial, not boxed: the media drifts at scale under a fine-pointer,
 * the copy floats on a nearer plane, and the controls barely move. Copy lands
 * in each photograph's own negative space via `copyPosition`.
 */
export function Hero() {
  const count = HERO_SLIDES.length;
  const reduced = useReducedMotion();

  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const sceneRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const incomingRef = useRef<number | null>(null);
  const reducedRef = useRef(reduced);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const intervalRef = useRef<number>(0);
  const advanceRef = useRef<() => void>(() => {});
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  /* ---- Layered pointer parallax (media / copy / controls) ----
     Sets --px / --py on the scene root. Each layer moves at a different rate
     so the photograph reads as the deeper plane. Movement is a few pixels,
     governed by rAF, and never shown under reduced motion or coarse pointers. */
  useEffect(() => {
    const node = sceneRef.current;
    if (!node || reduced) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        node.style.setProperty("--px", nx.toFixed(4));
        node.style.setProperty("--py", ny.toFixed(4));
      });
    };
    node.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!touchRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    };
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => node.removeEventListener("touchmove", onTouchMove);
  }, []);

  /* ---- Scroll parallax ----
     The photograph keeps breathing as the page moves: it drifts a fraction
     of the scroll so it always reads as the deeper plane. Tiny, rAF-throttled,
     clamped, and silent under reduced motion. */
  useEffect(() => {
    const node = sceneRef.current;
    if (!node || reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--hero-scroll", String(Math.min(window.scrollY, 260)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  const resetAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    if (reducedRef.current) {
      intervalRef.current = 0;
      return;
    }
    intervalRef.current = window.setInterval(
      () => advanceRef.current(),
      HERO_AUTOPLAY_MS,
    );
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      if (incomingRef.current !== null || next === activeRef.current) return;
      resetAutoplay();
      if (reducedRef.current) {
        activeRef.current = next;
        setActive(next);
        return;
      }
      incomingRef.current = next;
      setIncoming(next);
    },
    [count, resetAutoplay],
  );

  const advance = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  /* ---- Touch swipe ----
     Detects horizontal swipes on the hero to advance/retreat slides.
     Prevents default scroll when the gesture is clearly horizontal so the
     user can navigate without fighting page scroll. */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      touchRef.current = null;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) {
          goTo(activeRef.current + 1);
        } else {
          goTo(activeRef.current - 1);
        }
        resetAutoplay();
      }
    },
    [goTo, resetAutoplay],
  );

  useEffect(() => {
    if (incoming === null) return;
    const timeout = setTimeout(() => {
      activeRef.current = incoming;
      incomingRef.current = null;
      setActive(incoming);
      setIncoming(null);
    }, HERO_TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [incoming]);

  useEffect(() => {
    if (reduced || paused) {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      return;
    }
    intervalRef.current = window.setInterval(
      () => advanceRef.current(),
      HERO_AUTOPLAY_MS,
    );
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
    };
  }, [reduced, paused]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const isAutoplaying = !paused && !reduced;
  const slide = HERO_SLIDES[active];
  const incomingSlide = incoming !== null ? HERO_SLIDES[incoming] : null;
  const sizes = "100vw";
  const copyPosition = slide.copyPosition ?? "bottom-left";

  return (
    <section
      ref={sceneRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={-1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-copy-position={copyPosition}
      style={
        {
          "--hero-transition-ms": `${HERO_TRANSITION_MS}`,
          "--hero-autoplay-ms": `${HERO_AUTOPLAY_MS}`,
        } as CSSProperties
      }
      className="hero-root relative isolate overflow-hidden bg-background"
    >
      {/* ===== Z0 — atmospheric environment ===== */}
      <div aria-hidden="true" className="hero-environment" />

      {/* ===== Z1 — full-bleed photography ===== */}
      <div className="hero-scene">
        <div className="hero-media hero-media--active">
          <HeroMedia media={slide.media} priority={active === 0 && incoming === null} sizes={sizes} />
        </div>
        {incomingSlide ? (
          <div className="hero-media hero-media--incoming">
            <HeroMedia media={incomingSlide.media} sizes={sizes} />
          </div>
        ) : null}
      </div>

      {/* ===== Z2 — cinematic grade (scrim shaped to copy + vignette) ===== */}
      <div aria-hidden="true" className="hero-grade" />

      {/* ===== Z3 — campaign typography in the photograph ===== */}
      <div className="hero-copy-zone">
        <div
          key={slide.id}
          aria-live={isAutoplaying ? "off" : "polite"}
          className="hero-copy-stack"
        >
          <HeroCopy slide={slide} />
        </div>
      </div>

      {/* ===== Z4 — quiet navigation ===== */}
      <HeroControls
        count={count}
        active={active}
        paused={paused}
        autoplayMs={HERO_AUTOPLAY_MS}
        onSelect={goTo}
        onTogglePause={() => setPaused((current) => !current)}
      />

      <HeroScrollIndicator />
      <MagneticCursor />
    </section>
  );
}