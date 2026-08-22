"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { HeroMediaSource } from "@/types";

interface HeroMediaProps {
  media: HeroMediaSource;
  /** Eagerly loads + marks high priority for the first painted slide. */
  priority?: boolean;
  /** Responsive `sizes` hint; must match the rendered scene width. */
  sizes?: string;
  /** 50 | 75 | 90. Hero media defaults to 90 for edge sharpness. */
  quality?: 50 | 75 | 90;
  className?: string;
}

/**
 * Full-bleed hero media.
 *
 * The photograph IS the hero environment — it fills the scene edge to edge and
 * is never treated as a bordered card. Focal points are art-directed per
 * breakpoint (the mobile crop is a separate 9:16 composition).
 *
 * Loading strategy (robust across SSR / hydration / cached / slow networks):
 *  - The image renders VISIBLE from the first paint — it never depends on a
 *    client event to appear. A fast decode or already-cached image can never
 *    strand it at opacity 0.
 *  - A skeleton overlay sits ON TOP of the image (pointer-transparent) and
 *    simply fades out once the image is known to be loaded.
 *  - `ready` is initialised optimistically at hydration if either image has
 *    already finished decoding.
 *  - onError swaps to the fallback treatment.
 */
export function HeroMedia({ media, priority = false, sizes, quality = 90, className }: HeroMediaProps) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const mobileRef = useRef<HTMLImageElement>(null);
  const desktopRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mobileDone = mobileRef.current ? mobileRef.current.complete && mobileRef.current.naturalWidth > 0 : false;
    const desktopDone = desktopRef.current ? desktopRef.current.complete && desktopRef.current.naturalWidth > 0 : false;
    if (mobileDone || desktopDone) setReady(true);
  }, []);

  const desktopPosition = media.focalPoint
    ? ({ objectPosition: `${media.focalPoint.x}% ${media.focalPoint.y}%` } as const)
    : undefined;
  const mobilePosition = media.mobileFocalPoint ?? media.focalPoint;
  const mobileObjectPosition = mobilePosition
    ? ({ objectPosition: `${mobilePosition.x}% ${mobilePosition.y}%` } as const)
    : undefined;

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden bg-surface", className)}>
      {/* Skeleton shimmer — above the image, fades out once loaded. */}
      <div
        className={cn(
          "hero-skeleton pointer-events-none absolute inset-0 transition-opacity duration-standard ease-standard",
          ready && "opacity-0",
        )}
      />

      {failed ? (
        <div className="hero-fallback absolute inset-0" />
      ) : (
        <>
          {media.mobile ? (
            <NextImage
              ref={mobileRef}
              src={media.mobile}
              alt={media.alt}
              fill
              sizes={sizes}
              quality={quality}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              style={mobileObjectPosition}
              className="hero-media__img object-cover lg:hidden"
              onLoad={() => setReady(true)}
              onError={() => setFailed(true)}
            />
          ) : null}
          <NextImage
            ref={desktopRef}
            src={media.desktop}
            alt={media.alt}
            fill
            sizes={sizes}
            quality={quality}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            style={desktopPosition}
            className="hero-media__img hidden object-cover lg:block"
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        </>
      )}
    </div>
  );
}
