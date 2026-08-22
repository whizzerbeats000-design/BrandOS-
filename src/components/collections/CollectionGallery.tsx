"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/icons";
import type { CollectionGalleryImage, AspectRatio } from "@/types";

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
};

interface LightboxProps {
  images: readonly CollectionGalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const image = images[index];
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      onNavigate((index + delta + count) % count);
    },
    [index, count, onNavigate],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    dialog.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      restoreRef.current?.focus();
    };
  }, [onClose, go]);

  if (!image) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Campaign image ${index + 1} of ${count}`}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex flex-col bg-background outline-none"
    >
      <button
        type="button"
        aria-label="Close gallery"
        onClick={onClose}
        className="lightbox-backdrop absolute inset-0 z-0 block cursor-default bg-background/95"
        tabIndex={-1}
      />

      <div className="lightbox-panel relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <p className="type-metadata text-foreground-muted" aria-live="polite">
            {index + 1} / {count}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-standard hover:bg-background-secondary hover:text-accent"
            aria-label="Close gallery"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div
          className="flex flex-1 items-center justify-center px-4 pb-6 md:px-12"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 48) return;
            go(delta < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-3 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
            aria-label="Previous image"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <div className="relative h-[70vh] w-full md:h-[75vh]">
            <NextImage
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-3 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
            aria-label="Next image"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

        {image.caption ? (
          <p className="type-metadata px-6 pb-6 text-center text-foreground-muted">{image.caption}</p>
        ) : null}
      </div>
    </div>
  );
}

interface CollectionGalleryProps {
  images: readonly CollectionGalleryImage[];
  /** Section anchor id, e.g. `signature-gallery`. */
  id?: string;
  accent?: string;
}

export function CollectionGallery({ images, id, accent }: CollectionGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const first = images[0];
  const second = images[1];
  const third = images[2];
  const rest = images.slice(3);

  if (images.length === 0) return null;

  const style = { "--collection-accent": accent ?? "var(--color-accent)" } as CSSProperties;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      style={style}
      className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]"
    >
      <Container>
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
              Campaign
            </p>
            <h2 id={`${id}-title`} className="type-h2 text-foreground">
              In frames
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {first ? (
            <figure className="lg:col-span-12">
              <button
                type="button"
                onClick={() => setIndex(0)}
                className="group relative block w-full overflow-hidden bg-surface"
                aria-label={`Open image: ${first.alt}`}
              >
                <div className={cn("relative w-full", ASPECT_CLASSES[first.aspectRatio])}>
                  <NextImage
                    src={first.src}
                    alt={first.alt}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-slow ease-accent group-hover:scale-[1.02]"
                  />
                </div>
              </button>
              {first.caption ? (
                <figcaption className="type-metadata mt-3 text-foreground-muted">{first.caption}</figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="lg:col-span-7">
            {second ? (
              <figure>
                <button
                  type="button"
                  onClick={() => setIndex(1)}
                  className="group relative block w-full overflow-hidden bg-surface"
                  aria-label={`Open image: ${second.alt}`}
                >
                  <div className={cn("relative w-full", ASPECT_CLASSES[second.aspectRatio])}>
                    <NextImage
                      src={second.src}
                      alt={second.alt}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover transition-transform duration-slow ease-accent group-hover:scale-[1.02]"
                    />
                  </div>
                </button>
                {second.caption ? (
                  <figcaption className="type-metadata mt-3 text-foreground-muted">{second.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          <div className="lg:col-span-5 lg:mt-24">
            {third ? (
              <figure>
                <button
                  type="button"
                  onClick={() => setIndex(2)}
                  className="group relative block w-full overflow-hidden bg-surface"
                  aria-label={`Open image: ${third.alt}`}
                >
                  <div className={cn("relative w-full", ASPECT_CLASSES[third.aspectRatio])}>
                    <NextImage
                      src={third.src}
                      alt={third.alt}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover transition-transform duration-slow ease-accent group-hover:scale-[1.02]"
                    />
                  </div>
                </button>
                {third.caption ? (
                  <figcaption className="type-metadata mt-3 text-foreground-muted">{third.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          {rest.map((image, i) => {
            const absoluteIndex = i + 3;
            const wide = image.aspectRatio === "16/9" || image.aspectRatio === "21/9";
            return (
              <figure key={image.src} className={cn(wide ? "lg:col-span-12" : "lg:col-span-6")}>
                <button
                  type="button"
                  onClick={() => setIndex(absoluteIndex)}
                  className="group relative block w-full overflow-hidden bg-surface"
                  aria-label={`Open image: ${image.alt}`}
                >
                  <div className={cn("relative w-full", ASPECT_CLASSES[image.aspectRatio])}>
                    <NextImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-slow ease-accent group-hover:scale-[1.02]"
                    />
                  </div>
                </button>
                {image.caption ? (
                  <figcaption className="type-metadata mt-3 text-foreground-muted">{image.caption}</figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </Container>

      {index !== null ? (
        <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
      ) : null}
    </section>
  );
}
