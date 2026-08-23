import type { MetadataRoute } from "next";

const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sus-wears.vercel.app";
  try { return new URL(raw).href.replace(/\/+$/, ""); } catch { return "https://sus-wears.vercel.app"; }
})();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
