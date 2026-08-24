import type { MetadataRoute } from "next";

const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sus-wears.vercel.app";
  try { return new URL(raw).href.replace(/\/+$/, ""); } catch { return "https://sus-wears.vercel.app"; }
})();

const homeImages = Array.from(new Set([
  "/images/campaign/campaign-01-editorial.webp",
  "/images/campaign/campaign-01-hero-mobile.webp",
  "/images/campaign/campaign-02-desktop-1600.webp",
  "/images/campaign/campaign-02-hero-mobile.webp",
  "/images/campaign/campaign-04-desktop-1600.webp",
  "/images/campaign/campaign-04-hero-mobile.webp",
  "/images/campaign/campaign-05-desktop-1600.webp",
  "/images/campaign/campaign-05-hero-mobile.webp",
  "/images/home/brand-statement.webp",
  "/images/home/craft-atelier-01.webp",
  "/images/home/editorial-world-desktop.webp",
  "/images/home/editorial-world-mobile.webp",
  "/images/home/featured-men-01.webp",
  "/images/home/featured-women-01.webp",
  "/images/home/quiet-moment.webp",
  "/images/home/studio-section.webp",
]));

const aboutImages = Array.from(new Set([
  "/images/about-hero.webp",
  "/images/about-hero-mobile.webp",
  "/images/about-studio.webp",
]));

const shopImages = Array.from(new Set([
  "/images/home/featured-men-01.webp",
  "/images/home/featured-women-01.webp",
]));

const collectionsImages = Array.from(new Set([
  "/images/campaign/campaign-02-editorial.webp",
]));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: homeImages,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: shopImages,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: collectionsImages,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      images: aboutImages,
    },
  ];
}
