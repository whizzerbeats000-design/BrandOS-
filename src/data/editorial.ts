import type { EditorialFeature, HeroMediaSource } from "@/types";

export const EDITORIAL_FEATURE: EditorialFeature | null = null;

export type EditorialCategory = "craft" | "culture" | "style" | "people" | "place";

export interface EditorialEntry {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  category: EditorialCategory;
  heroImage: HeroMediaSource;
  publishedAt: string;
}

export const EDITORIAL_ENTRIES: readonly EditorialEntry[] = [] as const;
