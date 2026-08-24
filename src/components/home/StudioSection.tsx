import { Media } from "@/components/ui/Media";
import { ParallaxSection } from "@/components/ui/ParallaxSection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialHeading } from "@/components/editorial/EditorialHeading";
import { MagneticLink } from "@/components/editorial/MagneticLink";
import { BRAND } from "@/data/brand";

/**
 * The Studio — an asymmetric editorial plate on a deep canvas.
 *
 * Visual rhythm note: CraftStory above uses text-left / photo-right.
 * This section inverts to photo-left / text-right to create editorial
 * zigzag pacing as the user scrolls down the homepage.
 *
 * Photography is the dominant plane; type occupies its own negative space.
 * No card, no chrome, no white frame. The image reads as architecture,
 * not as content inside a container.
 */
export function StudioSection() {
  return (
    <Section
      aria-labelledby="studio-heading"
      padding="none"
      className="bg-background"
    >
      <Container className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10 lg:items-center lg:py-24 xl:py-32">
        {/* Photo — LEFT column on desktop (inverted from CraftStory's right-photo layout) */}
        <Reveal variant="zoom" className="col-span-12 lg:col-span-6 lg:col-start-1">
          <ParallaxSection speed={0.22}>
            <div className="plane plane--deep overflow-hidden">
              <Media
                media={{
                  desktop: "/images/home/studio-section.webp",
                  mobile: "/images/campaign/campaign-01-hero-mobile.webp",
                  alt: "Inside the SUS WEARS studio — cloth, needle and working light on the cutting table",
                  focalPoint: { x: 55, y: 40 },
                }}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="aspect-[3/4]"
              />
            </div>
          </ParallaxSection>
        </Reveal>

        {/* Text — RIGHT column on desktop */}
        <Reveal delay={100} className="col-span-12 lg:col-span-4 lg:col-start-8">
          <div className="flex flex-col gap-6">
            <p className="type-metadata text-foreground-muted">The Studio</p>
            <EditorialHeading
              as="h2"
              id="studio-heading"
              size="h1"
              lines={["Crafted in", "Lagos."]}
              italicLine={1}
            />
            <p className="type-body max-w-md text-foreground-secondary">
              Every piece begins with a single needle — precision, patience,
              purpose.
            </p>
            <MagneticLink href="/about" className="mt-2">
              Discover the atelier
            </MagneticLink>
          </div>
        </Reveal>
      </Container>

      <p className="mx-gutter mt-10 hidden type-metadata text-foreground-muted lg:block">
        {BRAND.location.city} · {BRAND.location.country.toUpperCase()} · Est.{" "}
        {BRAND.foundedYear}
      </p>
    </Section>
  );
}
