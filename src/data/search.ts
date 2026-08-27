import { PRODUCTS, getCategoryLabel, getCollectionLabel } from "@/data/catalogue";
import type { AspectRatio } from "@/types";

/**
 * Lean, client-safe product search index.
 * Derived from the authoritative PRODUCTS list — no duplicated source of truth.
 */
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

/** Normalise a string for search: lowercase + strip diacritics. */
function normalize(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Score one entry against a single normalised term. Returns null when the
 * entry does not meaningfully match. Higher = stronger. Deterministic and
 * prefix-first so near-misses like "boen" → "bone" still hit a name-prefix.
 */
export function scoreEntry(entry: SearchEntry, term: string): number | null {
  if (!term) return null;
  const name = normalize(entry.name);
  const cat = normalize(entry.category);
  const col = normalize(entry.collection);
  const key = entry.keywords.map(normalize);

  if (name === term) return 100;
  if (name.startsWith(term)) return 80;
  if (name.includes(term)) return 60;
  if (key.includes(term)) return 55;
  if (key.some((k) => k.startsWith(term))) return 50;
  if (key.some((k) => k.includes(term))) return 45;
  if (cat.includes(term) || col.includes(term)) return 40;

  const nameWords = name.split(/\s+/).filter(Boolean);
  if (nameWords.some((w) => w.startsWith(term))) return 35;
  if (nameWords.some((w) => w.includes(term))) return 30;

  return null;
}

/**
 * Ranked catalogue search.
 *
 * - Ranks matches: exact name > name prefix > name substring > keywords >
 *   category/collection > word-prefix/substring.
 * - Multi-word queries must match every token somewhere in the entry.
 * - Returns [] for an empty index or an empty query.
 * - Deliberately prefix/substring based (not full edit-distance): deterministic,
 *   dependency-free, and reliable for a small catalogue where users type a
 *   partial or near-exact name.
 */
export function searchCatalogue(
  query: string,
  entries: readonly SearchEntry[] = SEARCH_INDEX,
  limit = 8,
): SearchEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const tokens = trimmed.split(/\s+/).map(normalize).filter(Boolean);

  const scored: Array<{ entry: SearchEntry; score: number }> = [];
  for (const entry of entries) {
    const perToken = tokens.map((token) => scoreEntry(entry, token));
    if (perToken.some((s) => s === null)) continue; // every token must match
    const score = perToken.reduce<number>((sum, s) => sum + (s ?? 0), 0);
    scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const lenDiff = normalize(a.entry.name).length - normalize(b.entry.name).length;
    if (lenDiff !== 0) return lenDiff;
    return a.entry.slug.localeCompare(b.entry.slug);
  });

  return scored.slice(0, limit).map((s) => s.entry);
}
