import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/components/icons";
import { getFeaturedProducts } from "@/lib/collections";
import type { Collection } from "@/types";

interface CollectionFeaturedProps {
  collection: Collection;
}

export function CollectionFeatured({ collection }: CollectionFeaturedProps) {
  const pieces = getFeaturedProducts(collection);
  if (pieces.length === 0) return null;

  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  return (
    <section aria-labelledby={`${collection.slug}-featured-title`} style={style} className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                Selected pieces
              </p>
              <h2 id={`${collection.slug}-featured-title`} className="type-h2 text-foreground">
                The essentials
              </h2>
            </div>
            <Link
              href={`#${collection.slug}-catalogue`}
              className="type-nav inline-flex shrink-0 items-center gap-2 text-foreground-secondary transition-colors duration-standard ease-standard hover:text-[var(--collection-accent)]"
            >
              Shop all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <ul className={cn("mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:gap-x-6", pieces.length > 4 && "lg:grid-cols-4")}>
          {pieces.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
