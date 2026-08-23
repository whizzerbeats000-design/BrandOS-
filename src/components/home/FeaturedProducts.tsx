import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialHeading } from "@/components/editorial/EditorialHeading";
import { MagneticLink } from "@/components/editorial/MagneticLink";
import { ProductCard } from "@/components/product/ProductCard";
import { CURATED_PRODUCTS } from "@/data/products";

/**
 * Featured products — the commercial focus of the page.
 *
 * An asymmetric editorial arrangement, not a product grid. One dominant
 * piece anchors the composition; supporting pieces are placed with
 * intention rather than uniform repetition.
 */
export function FeaturedProducts() {
  const [hero, ...rest] = CURATED_PRODUCTS;
  const [supportA, supportB, supportC] = rest;

  return (
    <Section
      aria-labelledby="featured-products-heading"
      padding="none"
      className="bg-background pt-24 pb-32 lg:pt-40 lg:pb-48"
    >
      <Container>
        <div className="grid grid-cols-12 gap-x-[var(--gutter)] border-t border-border pt-14 lg:pt-20">
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-7">
            <Reveal>
              <p className="type-metadata text-foreground-muted">The Wardrobe</p>
            </Reveal>
            <Reveal delay={80}>
              <EditorialHeading
                as="h2"
                id="featured-products-heading"
                size="display"
                lines={["Pieces worth", "keeping."]}
              />
            </Reveal>
          </div>
          <div className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:flex lg:items-end">
            <Reveal delay={160}>
              <p className="type-body max-w-md text-foreground-secondary lg:pb-2">
                Each piece is issued in small numbers. Cut from Nigerian cotton, silk, and woven cloth — built to move with the body, not the catalogue.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Asymmetric editorial composition: dominant piece + supporting trio */}
        <div className="mt-16 lg:mt-24">
          <Reveal variant="zoom" className="lg:col-span-12">
            <div className="relative">
              <ProductCard
                product={hero}
                variant="featured"
                sizes="(max-width: 1023px) 100vw, 70vw"
                aspectRatio="16/10"
              />
            </div>
          </Reveal>

          <div className="mt-[var(--gutter)] grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-3 lg:gap-y-12">
            {[supportA, supportB, supportC].map((product, index) => (
              <Reveal key={product.id} delay={120 * (index + 1)}>
                <ProductCard
                  product={product}
                  variant="featured"
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  aspectRatio="4/5"
                />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 lg:mt-24 border-t border-border pt-10 lg:pt-14">
          <Reveal>
            <MagneticLink href="/shop">View all pieces</MagneticLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
