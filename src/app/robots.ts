import type { MetadataRoute } from "next";

const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try { return new URL(raw).href; } catch { return "http://localhost:3000"; }
})();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
