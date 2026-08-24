"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { AspectRatio, ProductImage } from "@/types";

interface ProductImageViewerProps {
  images: ProductImage[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  sizes?: string;
  className?: string;
  aspectRatio?: AspectRatio;
}

export function ProductImageViewer({
  images,
  activeIndex,
  onIndexChange,
  sizes = "(min-width: 64rem) 58vw, 100vw",
  className,
  aspectRatio,
}: ProductImageViewerProps) {
  const reduced = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; time: number } | null>(null);

  const image = images[activeIndex] ?? images[0];
  const viewerAspect = aspectRatio ?? image.aspectRatio;

  const toggleZoom = useCallback(() => {
    if (zoomed) {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
    } else {
      setZoomed(true);
    }
  }, [zoomed]);

  const exitZoom = useCallback(() => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!zoomed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitZoom();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomed, exitZoom]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!zoomed) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    },
    [zoomed, pan],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPan({
        x: Math.max(-200, Math.min(200, dragRef.current.panX + dx)),
        y: Math.max(-200, Math.min(200, dragRef.current.panY + dy)),
      });
    },
    [],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (zoomed) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, time: Date.now() };
    },
    [zoomed],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (zoomed || !touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dt = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;
      if (Math.abs(dx) > 50 && dt < 300) {
        if (dx < 0 && activeIndex < images.length - 1) {
          onIndexChange(activeIndex + 1);
        } else if (dx > 0 && activeIndex > 0) {
          onIndexChange(activeIndex - 1);
        }
      }
    },
    [zoomed, activeIndex, images.length, onIndexChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        onIndexChange(activeIndex - 1);
      } else if (e.key === "ArrowRight" && activeIndex < images.length - 1) {
        onIndexChange(activeIndex + 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleZoom();
      }
    },
    [activeIndex, images.length, onIndexChange, toggleZoom],
  );

  return (
    <div         className={cn("relative", className)}
        style={{
          aspectRatio: viewerAspect ?? undefined,
        }}>
      <div
        ref={containerRef}
        role="group"
        aria-label={`Product image ${activeIndex + 1} of ${images.length}`}
        aria-roledescription="Product image viewer"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative w-full overflow-hidden bg-surface",
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
        onClick={toggleZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          aspectRatio: zoomed ? undefined : "1 / 1",
        }}
      >
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-cinematic)]",
            zoomed && "scale-[2]",
          )}
          style={
            zoomed
              ? { transform: `scale(2) translate(${pan.x / 2}px, ${pan.y / 2}px)` }
              : undefined
          }
        >
          <NextImage
            src={image.src}
            alt={image.alt}
            fill
            preload={activeIndex === 0}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={(e) => {
                e.stopPropagation();
                if (zoomed) exitZoom();
                onIndexChange(index);
              }}
              className={cn(
                "h-2 w-2 rounded-full transition-[background-color,transform] duration-standard ease-standard",
                index === activeIndex
                  ? "bg-accent scale-125"
                  : "bg-foreground-muted/40 hover:bg-foreground-muted",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
