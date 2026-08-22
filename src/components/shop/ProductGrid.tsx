import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductGridProps {
  products: readonly Product[];
}

/** Catalogue grids normalise to 4/5 so rows stay aligned and garments read consistently. */
const GRID_ASPECT = "4/5";
const GRID_SIZES = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw";

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[var(--gutter)] md:grid-cols-3 lg:gap-y-12 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} sizes={GRID_SIZES} aspectRatio={GRID_ASPECT} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <ul
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[var(--gutter)] md:grid-cols-3 lg:gap-y-12 xl:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <li key={index}>
          <div className="bg-surface">
            <div className="aspect-[4/5] animate-pulse bg-background-secondary motion-reduce:animate-none" />
          </div>
          <div className="mt-[var(--space-3)] flex items-start justify-between gap-[var(--space-3)]">
            <div className="flex flex-col gap-[var(--space-2)]">
              <div className="h-3 w-20 animate-pulse bg-background-secondary motion-reduce:animate-none" />
              <div className="h-4 w-32 animate-pulse bg-background-secondary motion-reduce:animate-none" />
            </div>
            <div className="h-4 w-12 animate-pulse bg-background-secondary motion-reduce:animate-none" />
          </div>
        </li>
      ))}
    </ul>
  );
}