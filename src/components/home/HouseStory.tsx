"use client";
import { useSyncExternalStore } from "react";
import NextImage from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const chapters = [
  {
    num: "01",
    title: "ATELIER",
    statement:
      "Every piece begins with a single needle — precision, patience, purpose.",
    img: "/images/campaign/campaign-02-editorial.webp",
    alt: "Inside the SUS WEARS studio — cloth, needle and working light on the cutting table",
  },
  {
    num: "02",
    title: "CLOTH",
    statement: "Fabric is measured, cut and stitched by hand, one piece at a time.",
    img: "/images/campaign/campaign-01-editorial.webp",
    alt: "Rolls of Nigerian cotton and silk awaiting the tailor's shears",
  },
  {
    num: "03",
    title: "NEEDLE",
    statement: "The needle pulls thread through cloth with quiet insistence.",
    img: "/images/campaign/campaign-02-desktop.webp",
    alt: "Close-up of a tailoring needle piercing fabric under warm studio light",
  },
  {
    num: "04",
    title: "FINAL STITCH",
    statement: "The last stitch seals the garment — ready to move with the body.",
    img: "/images/campaign/campaign-01-desktop-1600.webp",
    alt: "A finished garment lying flat, ready to be worn",
  },
] as const;

/** Mobile / touch fallback: clean vertical editorial stack */
function HouseStoryMobile() {
  return (
    <Section aria-label="House Story" className="bg-background-secondary">
      <Container className="flex flex-col gap-[var(--gutter)]">
        {chapters.map((ch) => (
          <Reveal key={ch.num} variant="reveal">
            <article className="flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="type-metadata text-accent" aria-hidden="true">
                  {ch.num}
                </span>
                <h3 className="type-h2 text-foreground">{ch.title}</h3>
              </div>
              <p className="type-body text-foreground-secondary">{ch.statement}</p>
              <div className="relative aspect-[16/9] overflow-hidden">
                <NextImage
                  src={ch.img}
                  alt={ch.alt}
                  fill
                  sizes="100vw"
                  quality={75}
                  className="object-cover"
                />
              </div>
            </article>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}

/**
 * Desktop: horizontal snap-scroll storytelling.
 *
 * Layout maths:
 *   - The scroll track is `w-full` inside an `overflow-hidden` container.
 *   - Each of the 4 articles is `w-[80vw] max-w-[640px]` so they bleed
 *     slightly off-screen to telegraph "there is more".
 *   - Total track width is driven by CSS: each flex child has a fixed width,
 *     so the flex row will naturally overflow and become scrollable.
 *   - `scrollbar-none` hides the OS scrollbar; keyboard/touch still works.
 */
function HouseStoryDesktop() {
  return (
    <Section aria-label="House Story" className="bg-background-secondary">
      <Container className="overflow-hidden">
        <div
          className="scrollbar-none flex h-[620px] snap-x snap-mandatory overflow-x-auto"
          role="region"
          aria-label="House story — scroll to explore"
        >
          {chapters.map((ch, idx) => (
            <article
              key={ch.num}
              className="relative h-full w-[80vw] max-w-[640px] shrink-0 snap-start"
            >
              {/* Full-bleed background image via Next/Image */}
              <NextImage
                src={ch.img}
                alt={ch.alt}
                fill
                sizes="(min-width: 64rem) 640px, 80vw"
                quality={80}
                className="object-cover"
                aria-hidden="true"
              />
              {/* Gradient scrim for legibility — bottom third only */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(12,10,9,0.75) 0%, transparent 45%)",
                }}
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
                <Reveal variant="reveal" delay={idx * 60}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="type-metadata text-ivory/60"
                      aria-hidden="true"
                    >
                      {ch.num}
                    </span>
                    <h3 className="type-h2 text-ivory">{ch.title}</h3>
                  </div>
                </Reveal>
                <Reveal variant="reveal" delay={(idx + 1) * 60}>
                  <p className="type-body max-w-xs text-ivory/80">
                    {ch.statement}
                  </p>
                </Reveal>
              </div>
            </article>
          ))}

          {/* Trailing spacer so the last card doesn't sit hard against the edge */}
          <div className="w-[var(--gutter)] shrink-0" aria-hidden="true" />
        </div>
      </Container>
    </Section>
  );
}

// Pointer type is a browser-only probe. useSyncExternalStore reads it at
// hydration time (client snapshot) while the server snapshot stays false, so
// the correct layout renders without a flash and without a setState effect.
const subscribe = () => () => {};

function getTouchSnapshot(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches
  );
}

export function HouseStory() {
  const isTouch = useSyncExternalStore(subscribe, getTouchSnapshot, () => false);

  return isTouch ? <HouseStoryMobile /> : <HouseStoryDesktop />;
}
