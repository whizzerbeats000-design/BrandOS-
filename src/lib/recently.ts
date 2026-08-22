"use client";

/**
 * Recently viewed tracking — client-side, capped, LRU-ish.
 *
 * Stores up to `MAX` slugs in localStorage (most recent first) and exposes the
 * compact catalogue entries for render. Revisiting a product moves it back to
 * the front.
 */

import { PRODUCT_SUMMARIES } from "@/data/catalogue";
import type { ProductSummary } from "@/data/catalogue";

const STORAGE_KEY = "sus:recently-viewed";
const MAX = 6;

export function readRecentSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

export function recordRecent(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const slugs = readRecentSlugs().filter((s) => s !== slug);
    slugs.unshift(slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}

export function readRecentProducts(): ProductSummary[] {
  return readRecentSlugs()
    .map((slug) => PRODUCT_SUMMARIES[slug])
    .filter((p): p is ProductSummary => Boolean(p));
}
