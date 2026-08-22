"use client";

import { cn } from "@/lib/cn";
import { Media } from "@/components/ui/Media";
import { DepthCard } from "@/components/ui/DepthCard";
import { ParallaxSection } from "@/components/ui/ParallaxSection";
import type { HeroMediaSource } from "@/types";

interface DepthImageProps {
  media: HeroMediaSource;
  sizes?: string;
  /** Aspect ratio + layout classes (aspect-[4/5], lg:col-span-7, …). */
  className?: string;
  /** Pointer tilt — the image behaves like a physical plane. Subtle (±1.5°). */
  tilt?: boolean;
  /** Scroll parallax — the plane drifts against the page. */
  parallax?: boolean;
  /** "deep" silences the shadow for dark fields; "default" is the ivory plane. */
  surface?: "default" | "deep";
  /** The plane settles toward the viewer on hover. */
  lift?: boolean;
  priority?: boolean;
}

/**
 * DepthImage — photography as a physical plane above the page.
 *
 * The photograph is never a bordered card; it is an object printed on the
 * ivory field with a single-source key shadow, an optional 1–2° pointer tilt
 * and an optional scroll drift. Every movement stays a few pixels so the
 * reader feels depth without noticing the effect.
 */
export function DepthImage({
  media,
  sizes = "100vw",
  className,
  tilt = false,
  parallax = false,
  surface = "default",
  lift = false,
  priority = false,
}: DepthImageProps) {
  const plane = (
    <div
      className={cn(
        "plane h-full w-full",
        surface === "deep" && "plane--deep",
        lift && "plane-lift",
      )}
    >
      <Media media={media} sizes={sizes} priority={priority} className="h-full w-full" />
    </div>
  );

  if (parallax && tilt) {
    return (
      <ParallaxSection speed={0.22} className={className}>
        <DepthCard intensity={0.5} className="h-full">
          {plane}
        </DepthCard>
      </ParallaxSection>
    );
  }

  if (parallax) {
    return (
      <ParallaxSection speed={0.22} className={className}>
        {plane}
      </ParallaxSection>
    );
  }

  if (tilt) {
    return (
      <DepthCard intensity={0.5} className={cn("h-full", className)}>
        {plane}
      </DepthCard>
    );
  }

  return <div className={className}>{plane}</div>;
}