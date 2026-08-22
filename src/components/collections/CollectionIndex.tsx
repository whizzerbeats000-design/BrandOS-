import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { ArrowRightIcon } from "@/components/icons";
import { getAllCollections, getCollectionProducts } from "@/lib/collections";

export function CollectionIndex() {
  const collections = getAllCollections();
  const [flagship, ...rest] = collections;

  return (
    <div>
      <section aria-labelledby="collections-index-title" className="pt-[var(--section-spacing-mobile)] md:pt-[var(--section-spacing-desktop)]">
        <Container width="text">
          <Reveal variant="blur-reveal">
            <p className="type-metadata flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
              Curated stories
            </p>
          </Reveal>
          <Reveal variant="blur-reveal" delay={80}>
            <h1 id="collections-index-title" className="type-display mt-6 text-foreground">
              Collections.
            </h1>
          </Reveal>
          <Reveal variant="blur-reveal" delay={160}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground-secondary">
              Every SUS WEARS collection is a full story — designed as one gesture, not a pile of separate pieces.
              Start with the flagship, then wander.
            </p>
          </Reveal>
        </Container>
      </section>

      {flagship ? (
        <section aria-label="Flagship collection" className="mt-[var(--section-spacing-mobile)] md:mt-[var(--section-spacing-desktop)]">
          <Container>
            <CollectionCard
              collection={flagship}
              variant="featured"
              pieceCount={getCollectionProducts(flagship).length}
              priority
              sizes="(min-width: 1024px) 88rem, 100vw"
            />
          </Container>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section aria-label="More collections" className="mt-[var(--section-spacing-mobile)] md:mt-[var(--section-spacing-desktop)]">
          <Container>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-14">
              {rest.map((collection, index) => (
                <CollectionCard
                  key={collection.slug}
                  collection={collection}
                  pieceCount={getCollectionProducts(collection).length}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  className={index % 2 === 1 ? "lg:mt-24" : undefined}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section aria-label="Full catalogue" className="mt-[var(--section-spacing-mobile)] md:mt-[var(--section-spacing-desktop)]">
        <Container>
          <div className="border-t border-border pt-[var(--section-spacing-mobile)] text-center md:pt-[var(--section-spacing-desktop)]">
            <Reveal>
              <p className="mx-auto max-w-xl text-foreground-secondary">
                Looking for a single piece — or want the whole picture at once?
              </p>
            </Reveal>
            <Reveal delay={80}>
              <Link
                href="/shop"
                className="type-nav mt-6 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
              >
                Browse the full catalogue
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
