import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FEATURED_COLLECTION } from "@/data/collections";

export function FeaturedCollectionSection() {
  const collection = FEATURED_COLLECTION;
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  return (
    <Section aria-labelledby="signature-heading" padding="none">
      <div
        style={style}
        className="relative h-[68vh] min-h-[30rem] overflow-hidden lg:h-[82vh] lg:max-h-[56rem]"
      >
        <Media media={collection.heroImage} sizes="100vw" className="absolute inset-0" />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/30"
        />

        <Container className="relative z-10 flex h-full items-end pb-16 lg:pb-24">
          <div className="flex max-w-2xl flex-col items-start gap-5 lg:gap-6">
            <Reveal>
              <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                {collection.eyebrow} · {collection.year}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 id="signature-heading" className="type-display text-foreground">
                {collection.name}
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="type-body max-w-xl text-foreground-secondary">{collection.shortDescription}</p>
            </Reveal>
            <Reveal delay={300}>
              <Button href={`/collections/${collection.slug}`} variant="outline" size="lg">
                Explore the collection
              </Button>
            </Reveal>
          </div>
        </Container>
      </div>
    </Section>
  );
}
