import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Media } from "@/components/ui/Media";
import { ParallaxSection } from "@/components/ui/ParallaxSection";
import { BRAND, BRAND_STORY } from "@/data/brand";

const DETAILS = [
  { label: "Founded", value: String(BRAND.foundedYear) },
  { label: "Based in", value: BRAND.location.flat },
  { label: "Founder", value: BRAND.founder },
  { label: "Legal name", value: BRAND.legalName },
] as const;

const VALUES = [
  {
    num: "01",
    title: "Practical craft",
    body: "Every piece is cut and assembled with attention to how it fits, moves, and ages. No decoration for its own sake.",
  },
  {
    num: "02",
    title: "Unisex by design",
    body: "Clothing should fit the body, not the catalogue. Every silhouette is made for men and women alike.",
  },
  {
    num: "03",
    title: "Modern Nigerian fashion",
    body: "Built in Lagos, informed by the precision of tailoring and the energy of the city. The clothes reflect where they were made.",
  },
] as const;

const HERO_IMAGE = {
  desktop: "/images/about-hero.webp",
  mobile: "/images/about-hero-mobile.webp",
  alt: "A lone figure beneath a vast night sky — the world beyond the SUS WEARS cloth",
  focalPoint: { x: 50, y: 40 },
} as const;

const STUDIO_IMAGE = {
  desktop: "/images/about-studio.webp",
  alt: "Inside the SUS WEARS studio — cloth, needle and working light on the cutting table",
  focalPoint: { x: 55, y: 40 },
} as const;

export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section aria-labelledby="about-heading" className="bg-background">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-[var(--gutter)]">
          <div className="flex flex-col gap-6 lg:col-span-7 lg:gap-8">
            <Reveal variant="blur-reveal">
              <p className="type-metadata text-accent">
                {BRAND_STORY.eyebrow}
              </p>
            </Reveal>

            <Reveal variant="blur-reveal" delay={100}>
              <h1 id="about-heading" className="type-h1 text-foreground">
                {BRAND_STORY.title}
              </h1>
            </Reveal>

            <div className="flex flex-col gap-4">
              {BRAND_STORY.paragraphs.map((paragraph) => (
                <Reveal key={paragraph} variant="blur-reveal" delay={180}>
                  <p className="type-body text-foreground-secondary">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Reveal variant="blur-reveal" delay={260}>
              <div className="flex flex-col gap-px border-t border-border pt-8">
                {DETAILS.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1 border-b border-border py-5">
                    <span className="type-metadata text-foreground-muted">{label}</span>
                    <span className="type-body text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </aside>
        </Container>
      </Section>

      {/* Editorial image band — the house language in one frame */}
      <Section padding="none" aria-hidden="true">
        <ParallaxSection speed={0.25} className="relative h-[55vh] min-h-[24rem] overflow-hidden lg:h-[70vh]">
          <Media media={HERO_IMAGE} sizes="100vw" className="absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/60"
          />
        </ParallaxSection>
      </Section>

      {/* Origin */}
      <Section>
        <Container className="max-w-[var(--max-width-text)]">
          <Reveal>
            <p className="type-metadata mb-6 text-accent">The origin</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="type-h2 mb-8 text-foreground">
              From Jos to Lagos, built by hand.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-col gap-6">
              <p className="type-body text-foreground-secondary">
                Mr. Shedrack was already working as a fashion designer in Jos, Plateau State, before moving to Lagos in 2019. The move marked the start of SUS WEARS as a brand — built from practical tailoring experience and a clear sense of how people in Lagos dress.
              </p>
              <p className="type-body text-foreground-secondary">
                The brand name, Shedrack Unisex Stitches, reflects both the founder's name and the house's approach: unisex clothing cut with intention, stitched with care, and designed to be worn rather than admired from a distance.
              </p>
              <p className="type-body text-foreground-secondary">
                The silhouette is the logo. No prints, no badges. Identity lives in proportion — the fall of a trench, the fold of a hood, the weight of a fabric that hangs instead of hovering.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Studio image breather */}
      <Section padding="none" aria-hidden="true">
        <div className="relative h-[50vh] min-h-[28rem] overflow-hidden lg:h-[60vh]">
          <Reveal className="absolute inset-0">
            <Media
              media={STUDIO_IMAGE}
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/20"
          />
        </div>
      </Section>

      {/* Values — editorial typography, not cards */}
      <Section>
        <Container className="max-w-[var(--max-width-text)]">
          <Reveal>
            <p className="type-metadata mb-6 text-accent">What we stand on</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="type-h2 mb-12 text-foreground">Our values</h2>
          </Reveal>
          <div className="flex flex-col gap-12">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={120 + index * 80}>
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-[var(--gutter)]">
                  <div className="lg:col-span-1">
                    <span className="type-metadata text-accent">{value.num}</span>
                  </div>
                  <div className="lg:col-span-8">
                    <h3 className="type-h3 mb-3 text-foreground">{value.title}</h3>
                    <p className="type-body text-foreground-secondary">{value.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Creative influence — editorial text + imagery */}
      <Section>
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-[var(--gutter)]">
          <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
            <Reveal>
              <p className="type-metadata text-accent">
                Creative influence
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="type-h2 text-foreground">
                70% African. 30% Western. 100% SUS.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div className="flex flex-col gap-6">
                <p className="type-body text-foreground-secondary">
                  The house draws from two traditions without apologising for either. African textile
                  traditions inform the weight and feel of the fabric — how it drapes, how it breathes,
                  how it ages. Western garment construction gives the pieces their precision — the clean
                  shoulder, the straight hem, the finished seam.
                </p>
                <p className="type-body text-foreground-secondary">
                  This is not fusion. It is specificity. Each piece is designed for a body, a climate,
                  and a city — and then released into the world to find the rest.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal variant="zoom">
              <Media media={STUDIO_IMAGE} sizes="(min-width: 64rem) 55vw, 100vw" className="aspect-[16/10]" />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}