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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10"
        />
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-gutter mb-12 max-w-2xl lg:mb-20">
            <Reveal delay={100}>
              <p className="type-editorial text-foreground">
                "The needle pulls thread through cloth with quiet insistence."
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
