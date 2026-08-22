import type { EditorialFeature, HeroMediaSource } from "@/types";

export const EDITORIAL_FEATURE: EditorialFeature = {
  id: "the-world-of-sus",
  eyebrow: "Editorial — 001",
  title: "The world of SUS.",
  intro:
    "From the atelier in Lagos to the streets of the world — how a house builds a language of cloth, light and movement, one garment at a time.",
  pullQuote: "Clothing is a second language.",
  cta: { label: "Read the story", href: "/editorial" },
  media: {
    desktop: "/images/home/editorial-world-desktop.webp",
    mobile: "/images/home/editorial-world-mobile.webp",
    alt: "Inside the SUS WEARS atelier — garments on a rail beneath warm working light",
    focalPoint: { x: 58, y: 40 },
  },
};

/* ---- Editorial entries for the landing page grid ---- */

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

export const EDITORIAL_ENTRIES: readonly EditorialEntry[] = [
  {
    id: "editorial-001",
    slug: "the-world-of-sus",
    eyebrow: "Editorial — 001",
    title: "The world of SUS.",
    excerpt:
      "From the atelier in Lagos to the streets of the world — how a house builds a language of cloth, light and movement, one garment at a time.",
    category: "craft",
    heroImage: {
      desktop: "/images/home/editorial-world-desktop.webp",
      mobile: "/images/home/editorial-world-mobile.webp",
      alt: "Inside the SUS WEARS atelier — garments on a rail beneath warm working light",
      focalPoint: { x: 58, y: 40 },
    },
    publishedAt: "2026-03-15",
  },
  {
    id: "editorial-002",
    slug: "cut-from-jos",
    eyebrow: "Editorial — 002",
    title: "Cut from Lagos.",
    excerpt:
      "In the city where the plateau meets the sky, Mr. Shedrack learned that every fabric has a temper — and every cut is a conversation.",
    category: "place",
    heroImage: {
      desktop: "/images/campaign/campaign-02-desktop.webp",
      mobile: "/images/campaign/campaign-02-mobile.webp",
      alt: "A figure in structured tailoring against the Lagos skyline at dusk",
      focalPoint: { x: 62, y: 38 },
    },
    publishedAt: "2026-02-20",
  },
  {
    id: "editorial-003",
    slug: "the-unisex-conversation",
    eyebrow: "Editorial — 003",
    title: "The unisex conversation.",
    excerpt:
      "Why SUS WEARS cuts every piece for men and women alike — and what that means for how clothes should fit.",
    category: "culture",
    heroImage: {
      desktop: "/images/campaign/campaign-01-desktop-1600.webp",
      mobile: "/images/campaign/campaign-01-hero-mobile.webp",
      alt: "Two figures in matching silhouettes, standing back to back in warm light",
      focalPoint: { x: 50, y: 45 },
    },
    publishedAt: "2026-01-10",
  },
] as const;
