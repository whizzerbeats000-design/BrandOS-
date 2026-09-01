import type { CSSProperties } from "react";
import type { HeroSlide } from "@/types";

const LINE_STAGGER_MS = 45;

interface HeroCopyProps {
  slide: HeroSlide;
}

/**
 * Campaign typography set directly into the photograph.
 *
 * Editorial rather than component-like: an eyebrow with a ruled line, an
 * oversized display headline, a short description, and a quiet underline CTA
 * with refined tracking. Each line arrives with a staggered delay so the type
 * feels layered into the scene instead of pasted on.
 */
export function HeroCopy({ slide }: HeroCopyProps) {
  const lines: Array<{ key: string; children: React.ReactNode }> = [
    {
      key: "eyebrow",
      children: (
        <p className="hero-eyebrow type-metadata flex items-center gap-3">
          <span aria-hidden="true" className="hero-eyebrow__rule h-px w-10" />
          {slide.eyebrow}
        </p>
      ),
    },
    {
      key: "title",
      children: (
        <h2 className="hero-title text-pretty text-foreground">{slide.title}</h2>
      ),
    },
  ];

  if (slide.description) {
    lines.push({
      key: "description",
      children: (
        <p className="hero-desc max-w-md text-foreground-secondary">
          {slide.description}
        </p>
      ),
    });
  }

  lines.push({
    key: "cta",
    children: (
      <a href={slide.cta.href} className="hero-cta group">
        <span className="hero-cta__label">{slide.cta.label}</span>
        <span aria-hidden="true" className="hero-cta__rule" />
        <span aria-hidden="true" className="hero-cta__arrow" />
      </a>
    ),
  });

  return (
    <div className="hero-copy flex flex-col items-start gap-6">
      {lines.map((line, index) => (
        <div
          key={line.key}
          className="hero-copy-line"
          style={{ "--line-delay": `${index * LINE_STAGGER_MS}ms` } as CSSProperties}
        >
          {line.children}
        </div>
      ))}
    </div>
  );
}