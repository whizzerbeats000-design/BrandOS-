import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { NEW_DROP_PRODUCTS } from "@/data/products";

/**
 * New drop — editorial lookbook, not a product grid.
 *
 * A dominant piece anchors the left; supporting pieces are placed
 * with intention to the right. No glass, no chrome, no gold.
 */
export function NewDropSection() {
  const [featured, ...support] = NEW_DROP_PRODUCTS;

  return (
    <Section aria-labelledby="new-drop-heading" className="bg-background">
      <Container className="flex flex-col gap-10 lg:gap-16">
        <Reveal>
          <p className="type-metadata text-foreground-muted">New Drop — 001</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="new-drop-heading" className="type-h1 max-w-2xl text-foreground">
            The latest from SUS.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="type-body max-w-xl text-foreground-secondary">
            A first act in wool, cotton and hand-finished hardware — cut for the everyday, composed for the extraordinary.
          </p>
        </Reveal>

        {/* Editorial lookbook: dominant piece + supporting pieces */}
        <div className="grid gap-[var(--gutter)] lg:items-start lg:gap-8 lg:grid-cols-12">
          <Reveal variant="zoom" className="lg:col-span-7">
            <div className="group relative block">
              <ProductCard
                product={featured}
                variant="featured"
                sizes="(max-width: 1023px) 100vw, 62vw"
                aspectRatio="16/10"
              />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-[var(--gutter)] lg:col-span-5 lg:translate-y-8 lg:grid-cols-1">
            {support.map((product, index) => (
              <Reveal key={product.id} variant="zoom" delay={120 * (index + 1)}>
                <ProductCard
                  product={product}
                  variant="featured"
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 45vw, 30vw"
                  aspectRatio="4/5"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
