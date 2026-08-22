import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { CURATED_PRODUCTS } from "@/data/products";

const CURATED_EDIT_COPY = {
  eyebrow: "Curated",
  title: "The SUS edit.",
  description:
    "A short list of signatures we return to — quiet, versatile, built to last.",
  action: { label: "View the edit", href: "/shop" },
} as const;

export function CuratedProductsSection() {
  return (
    <Section aria-labelledby="edit-heading">
      <Container className="flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          id="edit-heading"
          eyebrow={CURATED_EDIT_COPY.eyebrow}
          title={CURATED_EDIT_COPY.title}
          description={CURATED_EDIT_COPY.description}
          action={CURATED_EDIT_COPY.action}
        />

        <div className="grid grid-cols-2 gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-4 lg:gap-[var(--gutter)]">
          {CURATED_PRODUCTS.map((product, index) => (
            <Reveal key={product.id} variant="reveal" delay={index * 100}>
              <ProductCard
                product={product}
                sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
