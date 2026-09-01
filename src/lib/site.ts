/**
 * Resolve the canonical SITE_URL (no trailing slash) once across the app.
 * Prefers NEXT_PUBLIC_SITE_URL, falls back to the production Vercel URL.
 */
export const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sus-wears.vercel.app";
  try {
    return new URL(raw).href.replace(/\/+$/, "");
  } catch {
    return "https://sus-wears.vercel.app";
  }
})();

/** Resolve a root-relative path to an absolute URL, keeping it safe for empty/reserved values. */
export function absoluteUrl(path?: string): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
