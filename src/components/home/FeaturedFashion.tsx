import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FEATURED_FASHION } from "@/data/homepage";
import { ArrowRightIcon } from "@/components/icons";

export function FeaturedFashion() {
  const [men, women] = FEATURED_FASHION.items;

    return (
    <Section aria-labelledby="featured-fashion-heading" className="bg-background-secondary">
      <Container className="flex flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div className="flex flex-col gap-5 lg:gap-6">
              <p className="type-metadata text-accent">
                {FEATURED_FASHION.eyebrow}
              </p>
              <h2
                id="featured-fashion-heading"
                className="type-display max-w-xl text-foreground"
              >
                {FEATURED_FASHION.title}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="type-body max-w-md text-foreground-secondary lg:pb-2">
              {FEATURED_FASHION.description}
            </p>
          </Reveal>
        </div>

        {/* Asymmetric editorial rhythm: dominant (65%) + supporting (35%). */}
        <div className="grid gap-[var(--gutter)] lg:items-start lg:gap-8 lg:grid-cols-12">
          <Reveal variant="zoom" className="lg:col-span-7">
            <FeaturedFashionTile item={men} emphasis="dominant" />
          </Reveal>
          <Reveal delay={140} variant="zoom" className="lg:col-span-5 lg:translate-y-12">
            <FeaturedFashionTile item={women} emphasis="supporting" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function FeaturedFashionTile({
  item,
  emphasis = "supporting",
}: {
  item: (typeof FEATURED_FASHION.items)[number];
  emphasis?: "dominant" | "supporting";
}) {
  const dominant = emphasis === "dominant";
  return (
    <article className="group relative block overflow-hidden bg-surface">
      <Media
        media={item.media}
        sizes="(max-width: 1023px) 100vw, 46vw"
        className={dominant ? "aspect-[4/5]" : "aspect-[3/4]"}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent"
      />

      {/* Floating glass annotation — only on the dominant editorial piece */}
      {dominant ? (
        <GlassSurface intensity="thin" className="absolute left-6 top-6 max-w-sm">
          <p className="type-metadata text-accent">{item.label}</p>
          <p className="type-h3 text-foreground">{item.description}</p>
          <div className="mt-2">
            <Button href={item.cta.href} variant="text" size="sm">
              {item.cta.label}
              <ArrowRightIcon className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </GlassSurface>
      ) : (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:p-8">
          <p className="type-metadata text-accent">{item.label}</p>
          <p className="type-h3 text-foreground">{item.description}</p>
          <div className="mt-1">
            <Button href={item.cta.href} variant="outline" size="md">
              {item.cta.label}
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}