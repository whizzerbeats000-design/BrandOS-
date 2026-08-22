import NextImage from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { HeroMediaSource } from "@/types";

interface MediaProps {
  media: HeroMediaSource;
  /** Responsive sizes hint for `next/image`. Defaults to full viewport width. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/** Art-directed image pair (mobile/desktop), server-rendered. */
export function Media({ media, sizes = "100vw", priority = false, className }: MediaProps) {
  const objectPosition = media.focalPoint
    ? ({ objectPosition: `${media.focalPoint.x}% ${media.focalPoint.y}%` } as CSSProperties)
    : undefined;
  const hasMobile = Boolean(media.mobile);
  const positions = ["absolute", "fixed", "static", "sticky", "relative"];
  const hasPosition = positions.some((p) => className?.split(/\s+/).includes(p));
  const base = hasPosition ? "overflow-hidden bg-surface" : "relative overflow-hidden bg-surface";

  return (
    <div className={cn(base, className)}>
      <div className="absolute inset-0 h-full w-full">
        {media.mobile ? (
          <NextImage
            src={media.mobile}
            alt={media.alt}
            fill
            sizes={sizes}
            quality={90}
            preload={priority}
            style={objectPosition}
            className="object-cover lg:hidden"
          />
        ) : null}
        <NextImage
          src={media.desktop}
          alt={media.alt}
          fill
          sizes={sizes}
          quality={90}
          preload={priority}
          style={objectPosition}
          className={cn("object-cover", hasMobile && "hidden lg:block")}
        />
      </div>
    </div>
  );
}
