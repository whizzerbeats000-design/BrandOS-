import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

const MOMENT = {
  desktop: "/images/home/editorial-world-desktop.webp",
  mobile: "/images/home/editorial-world-mobile.webp",
  alt: "SUS WEARS editorial — a moment of quiet intention",
  focalPoint: { x: 50, y: 40 },
} as const;

export function ImageMoment() {
  return (
    <Section padding="none" className="bg-background">
      <div className="relative h-[70vh] min-h-[40rem] overflow-hidden lg:h-[85vh]">
        <Reveal className="absolute inset-0">
          <Media
            media={MOMENT}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Reveal>
        {/* Bottom edge fade — gentle, keeps max 20% of the frame dark so the
            transition into QuietMoment reads as a cinematic cut rather than
            a heavy blackout band. Top edge remains completely open so the
            photograph bleeds out of the section above it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--color-background) 0%, transparent 22%)" }}
        />
      </div>
    </Section>
  );
}
