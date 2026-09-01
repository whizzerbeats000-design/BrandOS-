import type { MetadataRoute } from "next";
import { COLLECTIONS } from "@/data/collections";
import { SITE_URL } from "@/lib/site";

const absolute = (path: string) => `${SITE_URL}${path}`;

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
])).map(absolute);

const aboutImages = Array.from(new Set([
  "/images/about-hero.webp",
  "/images/about-hero-mobile.webp",
  "/images/about-studio.webp",
])).map(absolute);

const shopImages = Array.from(new Set([
  "/images/home/featured-men-01.webp",
  "/images/home/featured-women-01.webp",
])).map(absolute);

const collectionsImages = Array.from(new Set([
  "/images/campaign/campaign-02-editorial.webp",
])).map(absolute);

export default function sitemap(): MetadataRoute.Sitemap {
  const collectionPages = COLLECTIONS.map((collection) => ({
    url: `${SITE_URL}/collections/${collection.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: collection.gallery.map((img) => absolute(img.src)),
  }));

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
    ...collectionPages,
  ];
}
