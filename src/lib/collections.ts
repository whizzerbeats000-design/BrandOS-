import { COLLECTIONS } from "@/data/collections";
import { PRICE_RANGES, PRODUCTS } from "@/data/catalogue";
import type { Product, ProductCategory, Collection } from "@/types";

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getAllCollections(): readonly Collection[] {
  return COLLECTIONS;
}

/** Products belonging to a collection, derived from the central model. */
export function getCollectionProducts(collection: Collection): Product[] {
  const byId = new Map(PRODUCTS.map((p) => [p.slug, p]));

  if (collection.productIds && collection.productIds.length > 0) {
    return collection.productIds
      .map((slug) => byId.get(slug))
      .filter((p): p is Product => Boolean(p));
  }

  return PRODUCTS.filter((p) => p.collection === collection.id).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
}

/** Curated highlight pieces, honouring `featuredProductIds` order. */
export function getFeaturedProducts(collection: Collection, limit = 4): Product[] {
  const byId = new Map(PRODUCTS.map((p) => [p.slug, p]));
  const ranked = collection.featuredProductIds
    .map((slug) => byId.get(slug))
    .filter((p): p is Product => Boolean(p));

  if (ranked.length > 0) return ranked.slice(0, limit);

  return getCollectionProducts(collection)
    .filter((p) => p.featured)
    .slice(0, limit);
}

/** Deterministic next story — explicit link, else the next collection in order. */
export function getRelatedCollection(collection: Collection): Collection | undefined {
  if (collection.relatedCollectionId) {
    return getCollection(collection.relatedCollectionId);
  }
  const index = COLLECTIONS.findIndex((c) => c.slug === collection.slug);
  if (index === -1) return COLLECTIONS[0];
  return COLLECTIONS[(index + 1) % COLLECTIONS.length];
}

export interface CollectionFilterOptions {
  sizes: string[];
  colors: string[];
  categories: ProductCategory[];
  priceRanges: ReadonlyArray<{ id: string; label: string; min: number | null; max: number | null }>;
}

/**
 * Contextual filter options — only dimensions that matter to this collection.
 * If every piece is one size or one colour, that filter is simply omitted.
 */
export function getCollectionFilterOptions(collection: Collection): CollectionFilterOptions {
  const products = getCollectionProducts(collection);
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const categories = new Set<ProductCategory>();

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const product of products) {
    product.sizes.forEach((s) => sizes.add(s));
    product.colors.forEach((c) => colors.add(c));
    categories.add(product.category);
    min = Math.min(min, product.price);
    max = Math.max(max, product.price);
  }

  const priceRanges = PRICE_RANGES.filter((range) => {
    const rangeMin = range.min ?? Number.NEGATIVE_INFINITY;
    const rangeMax = range.max ?? Number.POSITIVE_INFINITY;
    return rangeMin < max && rangeMax > min;
  });

  return {
    sizes: [...sizes],
    colors: [...colors],
    categories: [...categories],
    priceRanges,
  };
}

/** All collections for the in-page collection navigation. */
export function getCollectionNavItems(): readonly Collection[] {
  return COLLECTIONS;
}
