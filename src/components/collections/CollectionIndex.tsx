import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { ArrowRightIcon } from "@/components/icons";
import { getAllCollections, getCollectionProducts } from "@/lib/collections";
import { BRAND } from "@/data/brand";

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
              {collections.length === 0 && (
                <> The first collection is being prepared. In the meantime, explore the house story.</>
              )}
            </p>
          </Reveal>
        </Container>
      </section>

      {collections.length === 0 ? (
        <section aria-label="House introduction" className="mt-[var(--section-spacing-mobile)] md:mt-[var(--section-spacing-desktop)]">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-[var(--gutter)]">
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <img
                    src="/images/campaign/campaign-02-editorial.webp"
                    alt="Inside the SUS WEARS studio — cloth, needle and working light"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="flex flex-col gap-6">
                  <p className="type-metadata text-accent">The house</p>
                  <h2 className="type-h2 text-foreground">
                    {BRAND.legalName}
                  </h2>
                  <p className="type-body text-foreground-secondary">
                    Founded in {BRAND.foundedYear} in {BRAND.location.city}, {BRAND.location.state}, {BRAND.location.country}.
                    {BRAND.descriptor} built on tailoring craft, contemporary style, and attention to detail.
                  </p>
                  <Link
                    href="/about"
                    className="link-underline type-nav text-foreground lg:pb-1"
                  >
                    Read the full story
                    <ArrowRightIcon className="ml-2 inline-block h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : (
        <>
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
        </>
      )}

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
