/**
 * Security engine configuration and policy.
 *
 * Central, reviewable policy knobs. Keep false-positive risk low: this is a real
 * Nigerian fashion business reached over shared mobile carrier IPs, WhatsApp and
 * social preview crawlers. Tune by lowering points, not by adding fragile rules.
 */

/** Risk score → action ladder. Lower thresholds are more aggressive. */
export const RISK_OBSERVE = 30;
export const RISK_BLOCK = 80;

/** Rate-limit budgets per route category (fixed window, per clientKey). */
export interface RateLimitPolicy {
  limit: number;
  windowSeconds: number;
}

/** Route categories. Static browsing is generous; future APIs are strict. */
export type RouteCategory = "static" | "probe" | "api" | "auth" | "checkout" | "webhook";

export const RATE_LIMITS: Record<RouteCategory, RateLimitPolicy> = {
  // Generous: real shoppers + SEO crawlers + social previews over shared IPs.
  static: { limit: 240, windowSeconds: 60 },
  // High-signal probe paths — aggressive, but these are never legitimate fetches.
  probe: { limit: 20, windowSeconds: 60 },
  // Future general API.
  api: { limit: 60, windowSeconds: 60 },
  // Future authentication (brute-force protection) — very strict.
  auth: { limit: 10, windowSeconds: 60 },
  // Future checkout intent — strict; payment authority is server-side only.
  checkout: { limit: 20, windowSeconds: 60 },
  // Future payment provider webhooks — must be signature-verified, not IP-limited.
  webhook: { limit: 120, windowSeconds: 60 },
};

/**
 * True-positive path/method signatures considered safe to BLOCK outright.
 * Each of these is effectively never a legitimate browser's behaviour on this
 * site, so the false-positive risk is negligible. All are path/method based —
 * nothing here stops a real shopper, crawler, or preview bot.
 */
export const HARD_BLOCK_PATTERNS: ReadonlyArray<{ path: RegExp; reason: string }> = [
  {
    // Source-control / build artefact probing.
    path: /(?:^|\/)(?:\.env|\.git(?:\/.*)?|\.svn|\.hg|\.bzr|\.DS_Store|composer\.json|package-lock\.json|yarn\.lock)(?:$|\/)/i,
    reason: "sensitive-file-probe",
  },
  {
    // CMS/backup/archive file probing.
    path: /\.(?:bak|old|orig|swp|sql|dump|log|sh|py|env)(?:$|\?)/i,
    reason: "backup-artefact-probe",
  },
  {
    // Path-traversal attempts (encoded or raw dot-dot-slash).
    path: /(?:\.\.(?:\\|\/)|%2e%2e|%2e\.|\.%2e)/i,
    reason: "path-traversal",
  },
  // Null-byte and common encoding abuse:
  {
    path: /(?:%00|%2500|\x00)/i,
    reason: "null-byte-encoding",
  },
  // Admin / framework / automation control panels that do not exist here.
  // Segment-prefix anchored (not strict-boundary) so `wp-admin`, `wp-login.php`
  // and `/wordpress/wp-config.php` are all caught while normal pages are not.
  {
    path: /(?:^|\/)(?:wp-(?:admin|login|content|includes|config)|wordpress|administrator|phpmyadmin|\.well-known\/acme-challenge)/i,
    reason: "cms-control-panel-probe",
  },
  // Server-side template / framework route probing we never expose.
  {
    path: /(?:^|\/)(?:actuator|consul|vendor|\.aws|\.azure|server-status|server-info|\.gitignore)(?:\/|$)/i,
    reason: "framework-probe",
  },
];

/**
 * Paths that map onto management / future-authenticated surfaces. Probing these
 * is high-signal (we have no such public surface), but we never hard-block based
 * on path alone — these contribute points and are rate-limited instead, so a
 * stray reference never loses a real customer.
 */
export const SENSITIVE_PATHS: ReadonlyArray<{ path: RegExp; reason: string }> = [
  { path: /(?:^|\/)(?:admin|dashboard|manage|panel)(?:\/|$)/i, reason: "admin-surface-probe" },
  { path: /(?:^|\/)\.(?:well-known|env|config)(?:\/|$)/i, reason: "reserved-dot-probe" },
];

/** HTTP methods we will accept *anywhere* on this static site. */
export const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** HTTP methods that are nonsensical against a read-only static site today. */
export const DISALLOWED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE", "TRACE", "CONNECT"]);

/* ------------------------------------------------------------------ *
 * False-positive allow-lists (Phase 10) — keep legitimate traffic free.
 * ------------------------------------------------------------------ */

/** Known-good static page prefixes. Not flagged as probes, not rate-limited hard. */
export const LEGIT_PAGE_PREFIXES: ReadonlyArray<string> = [
  "/",
  "/about",
  "/cart",
  "/checkout",
  "/collections",
  "/product",
  "/shop",
  "/favicon",
  "/icons",
  "/manifest",
  "/images",
  "/_next",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
];

/**
 * User-agent substrings that must never be penalised — search engines, social
 * link-preview crawlers, and legitimate automation (GTmetrix, monitoring).
 * Nigerian mobile / WhatsApp traffic typically presents a browser UA, which the
 * `isBrowserish` heuristic already treats as benign.
 */
export const TRUSTED_UA_HINTS: ReadonlyArray<string> = [
  "googlebot",
  "bingbot",
  "duckduckbot",
  "baiduspider",
  "yandex",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "pinterest",
  "telegrambot",
  "whatsapp",
  "slackbot",
  "discordbot",
  "skypeuripreview",
  "snapchat",
  "tumblr",
  "instapaper",
  "gtmetrix",
  "uptimerobot",
  "pingdom",
  "curl",
  "wget",
  "python-requests",
  "go-http-client",
  "axios",
  "vercel-cron",
];

/** Aggressive scanners that we *specifically* treat as high-risk (if not crawlers). */
export const AGGRESSIVE_SCANNER_HINTS: ReadonlyArray<string> = [
  "sqlmap",
  "nmap",
  "nikto",
  "nessus",
  "acunetix",
  "masscan",
  "zgrab",
  "awscanner",
];
