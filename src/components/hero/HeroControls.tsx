"use client";

import { PauseIcon, PlayIcon } from "@/components/icons";
import { HERO_SLIDES } from "@/data/hero";
import { cn } from "@/lib/cn";

interface HeroControlsProps {
  count: number;
  active: number;
  paused: boolean;
  autoplayMs: number;
  onSelect: (index: number) => void;
  onTogglePause: () => void;
}

/**
 * Quiet carousel navigation. Thin progress lines, a small pause/play control
 * and a tiny index readout — never boxes, borders or dashboard-like chrome.
 * The whole cluster fades up slightly on hover so it never competes with the
 * model; it stays keyboard-focusable and aria-complete regardless.
 */
export function HeroControls({
  count,
  active,
  paused,
  autoplayMs,
  onSelect,
  onTogglePause,
}: HeroControlsProps) {
  return (
    <div className="hero-controls group flex items-center gap-6">
      <p aria-hidden="true" className="hero-controls__index type-metadata">
        <span className="text-ivory">0{active + 1}</span>
        <span className="text-ivory-secondary"> / 0{count}</span>
      </p>

      <ul aria-label="Choose slide" className="hero-controls__dots flex items-center gap-2.5">
        {Array.from({ length: count }, (_, index) => {
          const isActive = index === active;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Go to slide ${index + 1}: ${HERO_SLIDES[index].title}`}
                aria-current={isActive ? "true" : undefined}
                className="hero-dot"
              >
                <span className="hero-dot__track">
                  <span
                    className={cn(
                      "hero-dot__fill",
                      isActive && "hero-dot__fill--active",
                      isActive && paused && "hero-dot__fill--paused",
                    )}
                    style={isActive ? { animationDuration: `${autoplayMs}ms` } : undefined}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onTogglePause}
        aria-label={paused ? "Play slideshow" : "Pause slideshow"}
        aria-pressed={paused}
        className="hero-play"
      >
        {paused ? (
          <PlayIcon className="h-3.5 w-3.5" />
        ) : (
          <PauseIcon className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}