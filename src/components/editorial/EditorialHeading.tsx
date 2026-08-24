"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface EditorialHeadingProps {
  as?: "h1" | "h2" | "h3" | "p";
  /** Hand-composed lines — each is rendered on its own line so breaks are
   *  deliberate, never left to automatic wrapping. */
  lines: readonly string[];
  /** One line to set in italic serif — the editorial voice in the sentence. */
  italicLine?: number;
  size?: "display" | "hero" | "h1" | "h2";
  tone?: "foreground" | "ivory";
  id?: string;
  className?: string;
  /**
   * When true each line slides up from behind a clip container as the heading
   * enters the viewport. This is the canonical luxury editorial text entrance.
   * Uses IntersectionObserver internally so it composes correctly in any
   * layout — no wrapper Reveal needed when animate={true}.
   * Default: false (plain render for use inside an outer Reveal).
   */
  animate?: boolean;
  /** Base delay in ms before the first line starts. Useful for staggering
   *  against other elements in the same section. Default: 0. */
  baseDelay?: number;
}

const SIZE_CLASSES = {
  display: "type-display",
  hero: "type-hero",
  h1: "type-h1",
  h2: "type-h2",
} as const;

const TONE_CLASSES = {
  foreground: "text-foreground",
  ivory: "text-ivory",
} as const;

/**
 * EditorialHeading — display type composed by hand.
 *
 * Display headings are not allowed to wrap themselves. The art direction
 * supplies the breaks (`lines`), one line per block, so the reader receives
 * exactly the phrasing the layout intended. An optional italic line gives
 * the sentence its editorial voice without decoration.
 *
 * When animate={true} each line emerges from behind an overflow:hidden clip
 * via a translateY reveal — the canonical luxury fashion editorial entrance.
 * The IntersectionObserver fires once: the heading never re-animates on
 * re-entry (unobserve after trigger).
 */
export function EditorialHeading({
  as: Tag = "h2",
  lines,
  italicLine = -1,
  size = "h1",
  tone = "foreground",
  id,
  className,
  animate = false,
  baseDelay = 0,
}: EditorialHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!animate || reduced) return;
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
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animate, reduced]);

  if (!animate || reduced) {
    // Static render — compose inside an outer Reveal if you want entrance
    return (
      <Tag id={id} className={cn(SIZE_CLASSES[size], TONE_CLASSES[tone], className)}>
        {lines.map((line, index) => (
          <span
            key={`${line}-${index}`}
            className={cn("block", index === italicLine && "italic")}
          >
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  // Animated render — each line clipped and revealed individually
  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      className={cn(
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        "motion-line-reveal",
        className,
      )}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={cn("block", index === italicLine && "italic")}
          style={
            {
              "--line-index": index,
              transitionDelay: `${baseDelay + index * 80}ms`,
            } as CSSProperties
          }
        >
          {line}
        </span>
      ))}
    </Tag>
  );
}
