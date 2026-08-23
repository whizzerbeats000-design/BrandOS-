import type { MetadataRoute } from "next";

const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sus-wears.vercel.app";
  try { return new URL(raw).href.replace(/\/+$/, ""); } catch { return "https://sus-wears.vercel.app"; }
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
