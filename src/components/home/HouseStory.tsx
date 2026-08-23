"use client";
import { useRef, useState } from "react";
import Link from "next/link";
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
    alt: "Rolls of Nigerian cotton and silk awaiting the tailor’s shears",
  },
  {
    num: "03",
    title: "NEEDLE",
    statement: "The needle pulls thread through cloth with quiet insistence.",
    img: "/images/campaign/campaign-02-desktop.webp",
    alt: "Close‑up of a tailoring needle piercing fabric under warm studio light",
  },
  {
    num: "04",
    title: "FINAL STITCH",
    statement: "The last stitch seals the garment — ready to move with the body.",
    img: "/images/campaign/campaign-01-desktop-1600.webp",
    alt: "A finished garment lying flat, ready to be worn",
  },
];

export function HouseStory() {
  const [isTouch] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  if (isTouch) {
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
                  <img
                    src={ch.img}
                    alt={ch.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </Container>
      </Section>
    );
  }

  // Desktop: horizontal scroll‑driven storytelling.
  const offset = 0;

  return (
    <Section aria-label="House Story" className="bg-background-secondary">
      <Container className="overflow-hidden">
        <div
          ref={containerRef}
          className="relative flex h-[620px] w-[calc(400%_-_3rem)] snap-x snap-mandatory scroll-p-0 overflow-x-auto scroll-smooth"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {chapters.map((ch, idx) => (
            <article
              key={ch.num}
              className="relative flex h-full w-1/2 shrink-0 snap-start flex-col justify-end px-4"
            >
              <img
                src={ch.img}
                alt="" /* aria-hidden decorative */
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden="true"
              />
              <div className="relative z-10 mb-12 flex flex-col gap-2">
                <Reveal variant="reveal" delay={idx * 60}>
                  <div className="flex items-baseline gap-2">
                    <span className="type-metadata text-ivory" aria-hidden="true">
                      {ch.num}
                    </span>
                    <h3 className="type-h2 text-ivory">{ch.title}</h3>
                  </div>
                </Reveal>
                <Reveal variant="reveal" delay={(idx + 1) * 60}>
                  <p className="type-body max-w-sm text-ivory/80">
                    {ch.statement}
                  </p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export const HouseStoryLink = Link;
