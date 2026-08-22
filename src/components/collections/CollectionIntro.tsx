import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Collection } from "@/types";

interface CollectionIntroProps {
  collection: Collection;
}

export function CollectionIntro({ collection }: CollectionIntroProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;
  const hasQuote = Boolean(collection.editorialQuote);

  return (
    <section aria-label={`About ${collection.name}`} style={style} className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
      <Container width="text">
        <Reveal>
          <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
            {collection.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id={`${collection.slug}-intro-title`} className="type-h1 mt-6 text-foreground">
            {collection.name}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 text-lg leading-relaxed text-foreground-secondary">
            {collection.description}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6">
            <div>
              <dt className="type-metadata text-foreground-muted">Season</dt>
              <dd className="type-nav mt-1 text-foreground">{collection.season} {collection.year}</dd>
            </div>
            <div>
              <dt className="type-metadata text-foreground-muted">Status</dt>
              <dd className="type-nav mt-1 text-foreground">
                {collection.status === "current" ? "Available now" : "Archived"}
              </dd>
            </div>
          </dl>
        </Reveal>
      </Container>

      {hasQuote ? (
        <Container width="text" className="mt-16 md:mt-24">
          <blockquote
            className={cn(
              "border-l-2 border-[var(--collection-accent)] pl-8 md:pl-12",
              "type-editorial text-foreground",
            )}
          >
            <span className="sr-only">Editorial note: </span>
            &ldquo;{collection.editorialQuote}&rdquo;
          </blockquote>
        </Container>
      ) : null}
    </section>
  );
}
