import { PRODUCTS, getCategoryLabel, getCollectionLabel } from "@/data/catalogue";
import type { AspectRatio } from "@/types";

/** Lean, client-safe product search index.
 *  Derived from the authoritative PRODUCTS list — no duplicated source of truth. */
export interface SearchEntry {
  slug: string;
  name: string;
  category: string;
  collection: string;
  keywords: string[];
  price: number;
  imageSrc: string;
  imageAlt: string;
  aspectRatio?: AspectRatio;
}

export const SEARCH_INDEX: readonly SearchEntry[] = PRODUCTS.map((product) => ({
  slug: product.slug,
  name: product.name,
  category: getCategoryLabel(product.category),
  collection: getCollectionLabel(product.collection),
  keywords: product.keywords,
  price: product.price,
  imageSrc: product.images[0].src,
  imageAlt: product.images[0].alt,
  aspectRatio: product.aspectRatio,
}));

/** Case-insensitive haystack match across name, category, collection and keywords. */
export function searchCatalogue(query: string, entries: readonly SearchEntry[] = SEARCH_INDEX, limit = 8): SearchEntry[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return entries
    .filter((entry) => {
      const haystack = [entry.name, entry.category, entry.collection, ...entry.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    })
    .slice(0, limit);
}