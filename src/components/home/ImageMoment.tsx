import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

const MOMENT = {
  desktop: "/images/home/editorial-world-desktop.webp",
  mobile: "/images/home/editorial-world-mobile.webp",
  alt: "SUS WEARS editorial — a moment of quiet intention in the studio",
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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"
        />
        <div className="relative z-10 flex h-full items-end">
          <Container className="pb-12 lg:pb-20">
            <Reveal delay={100}>
              <p className="type-editorial max-w-2xl text-foreground">
                "The silhouette is the logo. No prints, no badges. Identity lives in proportion — the fall of a trench, the fold of a hood, the weight of a fabric that hangs instead of hovering."
              </p>
            </Reveal>
          </Container>
        </div>
      </div>
    </Section>
  );
}
