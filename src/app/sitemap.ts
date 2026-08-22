import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/catalogue";
import { COLLECTIONS } from "@/data/catalogue";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/editorial`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/sus-world`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const productPages = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
