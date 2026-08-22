import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/collections";
import type { Collection } from "@/types";

interface CollectionEditorialSelectionProps {
  collection: Collection;
}

export function CollectionEditorialSelection({ collection }: CollectionEditorialSelectionProps) {
  const pieces = getFeaturedProducts(collection, 6);
  if (pieces.length === 0) return null;

  return (
    <section aria-labelledby="editorial-selection-title" className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-4">
            <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
              Editorials
            </p>
            <h2 id="editorial-selection-title" className="type-h2 text-foreground">
              Selected pieces
            </h2>
          </div>
          <Link
            href={`#${collection.slug}-catalogue`}
            className="type-nav inline-flex shrink-0 items-center gap-2 text-foreground-secondary transition-colors duration-standard ease-standard hover:text-[var(--collection-accent)]"
          >
            Shop all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-12">
          {pieces.map((product, idx) => {
            const colSpan = idx % 3 === 0 ? 12 : 6;
            return (
              <li key={product.id} className={cn(
                `col-span-${colSpan}`,
                `lg:col-span-${colSpan}`
              )}>
                <ProductCard product={product} sizes="(min-width: 1024px) 48vw, 100vw" />
              </li>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
