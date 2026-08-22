import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Collection, MediaTreatment } from "@/types";

const TREATMENT_CLASSES: Record<MediaTreatment, string> = {
  warm: "from-background via-background/40 to-background/10",
  cool: "from-background/95 via-background/30 to-background/10",
  exclusive: "from-background via-background/50 to-background/20",
};

interface CollectionHeroProps {
  collection: Collection;
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  return (
    <section
      aria-labelledby={`${collection.slug}-hero-title`}
      style={style}
      className="relative h-[70vh] min-h-[34rem] w-full overflow-hidden lg:h-[84vh]"
    >
      <Media
        media={collection.heroImage}
        sizes="100vw"
        priority
        className="absolute inset-0"
      />

      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          TREATMENT_CLASSES[collection.theme.mediaTreatment],
        )}
      />

      <Container className="relative z-10 flex h-full items-end pb-16 lg:pb-24">
        <div className="flex max-w-2xl flex-col items-start gap-5 lg:gap-6">
          <Reveal>
            <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
              {collection.eyebrow} · {collection.year}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1
              id={`${collection.slug}-hero-title`}
              className="type-display text-foreground"
            >
              {collection.name}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="type-body max-w-xl text-foreground-secondary">{collection.tagline}</p>
          </Reveal>
          <Reveal delay={240}>
            <Button
              href={`#${collection.slug}-catalogue`}
              variant="outline"
              size="lg"
              className="bg-background/20 backdrop-blur-sm"
            >
              Shop the collection
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
