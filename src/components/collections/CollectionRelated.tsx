import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { ArrowRightIcon } from "@/components/icons";
import { getCollectionProducts, getRelatedCollection } from "@/lib/collections";
import type { Collection } from "@/types";

interface CollectionRelatedProps {
  collection: Collection;
}

export function CollectionRelated({ collection }: CollectionRelatedProps) {
  const related = getRelatedCollection(collection);
  if (!related) return null;

  const pieceCount = getCollectionProducts(related).length;
  const style = { "--collection-accent": related.theme.accent } as CSSProperties;

  return (
    <section
      aria-labelledby={`${related.slug}-related-title`}
      style={style}
      className="pb-[var(--section-spacing-mobile)] md:pb-[var(--section-spacing-desktop)]"
    >
      <Container>
        <div className="group relative overflow-hidden bg-surface">
          <div className="relative aspect-[4/5] sm:aspect-[16/9]">
            <Media
              media={related.heroImage}
              sizes="100vw"
              className="absolute inset-0 transition-transform duration-slow ease-accent group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
              <div className="flex flex-col gap-3">
                <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                  <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                  Next story
                </p>
                <h2 id={`${related.slug}-related-title`} className="type-h2 text-foreground">
                  {related.name}
                </h2>
                <p className="type-body-small max-w-lg text-foreground-secondary">{related.tagline}</p>
                <p className="type-metadata text-foreground-muted">{pieceCount} pieces</p>
              </div>
              <Link
                href={`/collections/${related.slug}`}
                aria-label={`Explore the ${related.name} collection`}
                className={cn(
                  "type-nav inline-flex shrink-0 items-center gap-2 border-b border-foreground/30 pb-1 text-foreground",
                  "transition-colors duration-standard ease-standard group-hover:border-[var(--collection-accent)] group-hover:text-[var(--collection-accent)]",
                )}
              >
                Explore
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
