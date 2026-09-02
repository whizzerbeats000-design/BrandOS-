/**
 * ORIGIN-PROTECTION REGRESSION CHECKER
 * =====================================
 *
 * Permanent security invariant (see docs/SECURITY-VERIFICATION-REPORT.md):
 *
 *   "All production application traffic must pass through the intended edge
 *    security layer; private origin infrastructure must never be directly
 *    internet-reachable, and nothing in shipped source or the client bundle
 *    may disclose private infrastructure (IPs, hostnames, paths, secrets)."
 *
 * This module is used by:
 *   - scripts/check-origin-protection.mjs  (CI / developer CLI)
 *   - tests/security/origin-protection.test.ts  (npm test)
 *
 * It scans the SHIPPED SOURCE and the BUILT CLIENT BUNDLE for infrastructure
 * leaks and rejects any regression. Known benign values are explicitly
 * allow-listed (public contact info, vendor/CSP domains, dev-only tooling).
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, sep } from "node:path";

/* ------------------------------------------------------------------ *
 * Allow-lists — intentional, non-infrastructure values that are fine.
 * ------------------------------------------------------------------ */

/** NEXT_PUBLIC_* vars we deliberately expose to the browser. */
const ALLOWED_NEXT_PUBLIC = new Set(["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_WHATSAPP_NUMBER"]);

/** Public vendor/CSP domains that legitimately appear in the client. */
const ALLOWED_PUBLIC_HOSTS = new Set([
  "vercel.app",
  "vercel.com",
  "vercel-static.com",
  "vercel-scripts.com",
  "wa.me",
  "whatsapp.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "gmail.com",
  "google.com",
  "googleusercontent.com",
  "schema.org",
  "nextjs.org",
  "reactjs.org",
  "playwright.dev",
  "w3.org",
]);

/** Paths that are local tooling, never shipped to the browser. */
const TOOLING_ALWAYS_EXEMPT = ["playwright.config.ts", "vitest.config.ts", "test", "tests", "e2e", "scripts"];

/* ------------------------------------------------------------------ *
 * Detection regexes.
 * ------------------------------------------------------------------ */

// Private / non-routable IPv4 ranges (incl. loopback, link-local, CGNAT, docs).
const PRIVATE_IPV4 =
  /(?:^|[^0-9])(?:(?:10|127)\.|192\.168\.|172\.(?:1[6-9]|2[0-9]|3[01])\.|0\.0\.0\.0|169\.254\.|100\.(?:6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\.)\d{1,3}\.\d{1,3}(?![0-9])/;

// A real private / reserved IPv6 address, anchored to a known special prefix
// so minified source-map/ternary fragments like `:8:2` or `:5:26` cannot match:
//   - unique-local `fcXX:`/`fdXX:`  (fc00::/7)
//   - link-local `fe80:`..`febf:`   (fe80::/10)
//   - documentation `2001:db8:`
//   - loopback / unspecified `::1`, `::`
const PRIVATE_IPV6 =
  /(?:^|[^0-9a-f:.])(?:(?:fc|fd)[0-9a-f]{2}:|fe(?:8[0-9a-f]|9[0-9a-f]|a[0-9a-f]|b[0-9a-f]):|2001:db8:|::1(?:$|[^0-9a-f]))/i;

// Internal DNS hostnames: label terminating in a reserved TLD or suffix
// (`foo.local`, `host.internal`, `srv.corp`, `app.lan`, `db.intranet`).
// A leading boundary (start, whitespace, punctuation, or quote/bracket) is
// required so bare English "local"/"corp" and web asset paths like
// `/images/home/...` do not match.
const INTERNAL_HOST =
  /(?:^|[^\w/])([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)(?:local|internal|corp|lan|intranet|localdomain|home\.internal)(?:[^a-z0-9]|$)/i;

// Hardcoded origin-flavoured API base URLs: scheme:// that points at a private
// IP, localhost (non-dev), or an internal/reserved hostname.
const ORIGIN_API_URL =
  /https?:\/\/(?:(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|localhost|(?:[a-z0-9-]+\.)+(?:local|internal|corp|lan|intranet)(?![a-z0-9]))(?::\d+)?/i;

// Secret-looking env var names (non-public). These must never be inlined.
const SECRET_ENV = /^[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|API_?KEY|PRIVATE_?KEY|ACCESS[_-]?KEY|CREDENTIAL|DATABASE_URL|JWT|SIGNING[_-]?KEY)[A-Z0-9_]*$/i;

// Unambiguous filesystem-path leakage (drive letters or absolute Unix dirs).
// `/home/<user>/` requires a trailing slash to avoid `/images/home/...` where
// "home" is a final leaf segment of a web asset.
const FS_PATH =
  /(?:C:\\)|\/root\/|\/var\/|\/opt\/|\/usr\/|\/etc\/|\/home\/[a-zA-Z0-9_.-]+\//;

/* ------------------------------------------------------------------ *
 * Scanners.
 * ------------------------------------------------------------------ */

function listFiles(dir, out = [], base = dir) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) listFiles(p, out, base);
    else out.push(p);
  }
  return out;
}

function isTooling(rel, force = false) {
  if (force) return true;
  return TOOLING_ALWAYS_EXEMPT.some((t) => rel.split(sep).includes(t)) || rel.endsWith(".config.ts");
}

/** Scan shipped source (not test/tooling) for leaks. Returns list of violations. */
export function scanSource(dir, { forceAllowTooling = false } = {}) {
  const violations = [];
  for (const file of listFiles(dir)) {
    const rel = file.slice(dir.length).replace(/^[\\/]+/, "");
    const ext = extname(file).toLowerCase();
    if (!/\.(ts|tsx|js|jsx|mjs|json|html)$/.test(ext)) continue;
    if (isTooling(rel, forceAllowTooling)) continue;
    if (rel.includes("node_modules") || rel.split(sep).includes(".next")) continue;
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (PRIVATE_IPV4.test(line)) violations.push(`${rel}:${i + 1} private IPv4: ${line.trim().slice(0, 80)}`);
      if (PRIVATE_IPV6.test(line)) violations.push(`${rel}:${i + 1} private IPv6: ${line.trim().slice(0, 80)}`);
      if (INTERNAL_HOST.test(line)) violations.push(`${rel}:${i + 1} internal hostname: ${line.trim().slice(0, 80)}`);
      if (ORIGIN_API_URL.test(line)) violations.push(`${rel}:${i + 1} origin-flavoured URL: ${line.trim().slice(0, 80)}`);
      if (FS_PATH.test(line)) violations.push(`${rel}:${i + 1} filesystem path: ${line.trim().slice(0, 80)}`);
      // Any NEXT_PUBLIC_* not on the intentional allow-list is a potential leak.
      for (const m of line.matchAll(/NEXT_PUBLIC_[A-Z0-9_]+/g)) {
        if (!ALLOWED_NEXT_PUBLIC.has(m[0])) {
          violations.push(`${rel}:${i + 1} unexpected NEXT_PUBLIC_ leak: ${m[0]}`);
        }
      }
      // Secret-looking env names referenced in shipped code.
      for (const m of line.matchAll(/\bprocess\.env\.([A-Z0-9_]+)\b/g)) {
        if (SECRET_ENV.test(m[1])) {
          violations.push(`${rel}:${i + 1} secret env referenced in shipped code: ${m[1]}`);
        }
      }
      if (line.includes("sourceMappingURL")) violations.push(`${rel}:${i + 1} sourceMappingURL present during scan`);
    }
  }
  return violations;
}

/**
 * Scan the BUILT client bundle (.next/static) for leaks.
 * The compiled WHATWG URL-parser runtime legitimately contains the token
 * `localhost` as a spec sentinel, so bare `localhost` is allowed there; any
 * private IP / internal hostname / filesystem path / source map is not.
 */
export function scanBundle(staticDir) {
  const violations = [];
  const files = listFiles(staticDir);
  for (const file of files) {
    if (!file.endsWith(".js") && !file.endsWith(".map") && !file.endsWith(".json")) continue;
    // A shipped source map is itself a leak of internal source/paths.
    if (file.endsWith(".map")) {
      violations.push(`bundled source map present: ${file}`);
      continue;
    }
    const text = readFileSync(file, "utf8");
    // A served sourceMappingURL means we ship debuggable internal source refs.
    if (text.includes("sourceMappingURL")) violations.push(`sourceMappingURL in bundle: ${file}`);
    if (PRIVATE_IPV4.test(text)) violations.push(`private IPv4 in bundle: ${file}`);
    if (PRIVATE_IPV6.test(text)) violations.push(`private IPv6 in bundle: ${file}`);
    if (FS_PATH.test(text)) violations.push(`filesystem path in bundle: ${file}`);
    if (/\.internal\b|\.local\b|\bcorp\.network\b|\bintranet\b/.test(text)) {
      violations.push(`internal hostname in bundle: ${file}`);
    }
    for (const m of text.matchAll(/NEXT_PUBLIC_[A-Z0-9_]+/g)) {
      if (!ALLOWED_NEXT_PUBLIC.has(m[0])) {
        violations.push(`unexpected NEXT_PUBLIC_ in bundle ${file}: ${m[0]}`);
      }
    }
  }
  return violations;
}

export { ALLOWED_NEXT_PUBLIC, ALLOWED_PUBLIC_HOSTS };
