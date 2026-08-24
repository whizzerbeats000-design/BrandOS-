import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { EmptyState } from "@/components/shop/EmptyState";
import { CollectionCatalogueControls } from "@/components/collections/CollectionCatalogueControls";
import { applyFilters, getActiveFilters, paginate, sortProducts, type CatalogueSearchParams } from "@/lib/catalogue";
import { getCollectionFilterOptions, getCollectionProducts } from "@/lib/collections";
import type { Collection } from "@/types";

interface CollectionCatalogueProps {
  collection: Collection;
  /** Resolved catalogue state (collection locked to this collection). */
  params: CatalogueSearchParams;
}

export function CollectionCatalogue({ collection, params }: CollectionCatalogueProps) {
  const base = `/collections/${collection.slug}`;
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  const products = getCollectionProducts(collection);
  const options = getCollectionFilterOptions(collection);
  const filtered = applyFilters(params, products);
  const sorted = sortProducts(filtered, params.sort);
  const { items, total, totalPages, page } = paginate(sorted, params.page);
  const active = getActiveFilters(params);

  if (products.length === 0) {
    return (
      <section id={`${collection.slug}-catalogue`} aria-label="Shop the collection" className="scroll-mt-28 lg:scroll-mt-32">
        <Container className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="type-display uppercase text-foreground">This story is gathering.</p>
          <p className="max-w-md text-foreground-secondary">
            The {collection.name} pieces are still being made. Start fresh from the full catalogue.
          </p>
          <Link
            href="/shop"
            className="type-nav border border-foreground/25 bg-foreground px-6 py-3.5 text-background transition-colors duration-standard ease-standard hover:bg-foreground-muted"
          >
            Full catalogue
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section
      id={`${collection.slug}-catalogue`}
      aria-labelledby={`${collection.slug}-catalogue-title`}
      style={style}
      className="scroll-mt-28 lg:scroll-mt-32"
    >
      <Container className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
        <div className="mb-10 border-b border-border pb-8 lg:mb-12">
          <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
            Shop the collection
          </p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <h2 id={`${collection.slug}-catalogue-title`} className="type-h2 text-foreground">
              {collection.name}
            </h2>
            <p className="type-metadata text-foreground-muted">
              {total} piece{total === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <aside className="hidden lg:block" aria-label="Filter and sort the collection">
            <CollectionCatalogueControls
              collection={collection}
              params={params}
              options={options}
              base={base}
              layout="desktop"
            />
          </aside>

          <div className="flex min-w-0 flex-col gap-8">
            <CollectionCatalogueControls
              collection={collection}
              params={params}
              options={options}
              base={base}
              layout="mobile"
            />

            {active.length > 0 ? <ActiveFilterChips params={params} base={base} /> : null}

            {total === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid products={items} />
                <Pagination page={page} totalPages={totalPages} params={params} base={base} />
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
