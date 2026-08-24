import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Quiet moment — a full-bleed image with a single editorial statement.
 * No heading, no eyebrow, no chrome. The photograph speaks.
 */
export function QuietMoment() {
  return (
    <Section padding="none" className="bg-background">
      <div className="relative h-[60vh] min-h-[32rem] overflow-hidden lg:h-[75vh]">
        <Reveal className="absolute inset-0">
          <Media
            media={{
              desktop: "/images/home/quiet-moment.webp",
              mobile: "/images/campaign/campaign-01-hero-mobile.webp",
              alt: "SUS WEARS studio — cloth, needle and working light",
              focalPoint: { x: 55, y: 40 },
            }}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Reveal>
        {/* Top edge — a tighter fade-in from background (max 18% of frame)
            so the photograph emerges quickly without the previous heavy
            dark-band overlap. Bottom edge gets a very light exit fade. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "linear-gradient(to bottom, var(--color-background) 0%, transparent 20%)",
              "linear-gradient(to top, var(--color-background) 0%, transparent 15%)",
            ].join(", "),
          }}
        />
      </div>
    </Section>
  );
}
