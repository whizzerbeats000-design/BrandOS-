import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/data/catalogue";
import { BRAND } from "@/data/brand";

/** Editorial shop header — house identity up front.
 *  Count reflects the real catalogue only; nothing is fabricated. */
export function ShopHeader() {
  const count = PRODUCTS.length;

  return (
    <Container className="pt-20 lg:pt-28">
      <div className="flex flex-col gap-6 border-b border-border pb-10 lg:pb-14">
        <Reveal variant="blur-reveal" delay={50}>
          <p className="type-metadata text-foreground-muted">
            Shop
            {" · "}
            {BRAND.legalName}
          </p>
        </Reveal>

        <Reveal variant="blur-reveal" delay={120}>
          <h1 className="type-display text-foreground">The collection.</h1>
        </Reveal>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <Reveal variant="blur-reveal" delay={180}>
            <p className="max-w-xl text-lg leading-relaxed text-foreground-secondary">
              {BRAND.legalName} — cut unisex in {BRAND.location.city}
              {", "}
              {BRAND.location.state}, {BRAND.location.country}. Considered pieces for every expression.
            </p>
          </Reveal>
          
          <Reveal variant="blur-reveal" delay={240} className="lg:shrink-0">
            <p className="type-price text-foreground-secondary" aria-label={`${count} pieces in the catalogue`}>
              {String(count).padStart(2, "0")} PIECES
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}