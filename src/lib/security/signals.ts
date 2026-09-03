/**
 * Request signal extraction.
 *
 * Turns raw HTTP request inputs into the safer, abstracted `RequestSignature`
 * used by the detection rules. All attribute extraction here is lossy on purpose:
 * it keeps client data minimal (no full IPs, no cookies, no query values).
 */

import { TRUSTED_UA_HINTS, AGGRESSIVE_SCANNER_HINTS } from "./config";
import type { RequestSignature } from "./types";

/** Browser-core UA tokens; presence strongly implies a real browser. */
const BROWSER_TOKENS = [
  "mozilla",
  "chrome",
  "safari",
  "firefox",
  "edg",
  "opera",
  "android",
  "iphone",
  "ipad",
  "crios",
  "fxios",
  "mobile",
  "like gecko",
];

/**
 * Derive a stable, low-entropy client fingerprint for rate-limit bucketing.
 *
 * Truth in labeling: this is a **non-cryptographic**, deterministic 64-bit hash
 * (FNV/Jenkins-style double `Math.imul`) of (IP + UA). It is deliberately fast
 * and synchronous so it can run on the hot middleware path for every request.
 *
 * It is NOT anonymity, and it MUST NOT be relied on as such:
 * - It is NOT SHA-256 and provides no cryptographic one-way guarantee. The input
 *   space (a range-limited IP + common UA) is small enough to enumerate or
 *   brute-force, so it does not protect a raw IP from a determined party.
 * - It IS sufficient for its actual purpose: mapping a returning client to a
 *   stable bucket for rate limiting, so we never store/log the raw IP itself.
 * - Treat this as a coarse bucket key, never as PII protection or a secret.
 */
export function anonymiseClientKey(ip?: string | null, userAgent?: string | null): string {
  const raw = `${ip ?? ""}|${userAgent ?? ""}|sus-wears-v1`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

/** Decode a URL path safely (handles %2f, %2e, null bytes) into a lower-cased form. */
export function safeDecodePath(rawPath: string): string {
  let decoded = rawPath;
  // Repeated decode to catch double-encoded traversal, bounded to avoid abuse.
  for (let i = 0; i < 3 && decoded.includes("%"); i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded.toLowerCase();
}

/** Normalise a user-agent: trim, collapse whitespace, lower-case. */
export function normaliseUserAgent(ua?: string | null): string {
  return (ua ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

/** Heuristic: does the UA look like a real browser? */
export function isBrowserish(userAgent: string): boolean {
  if (!userAgent) return false;
  return BROWSER_TOKENS.some((t) => userAgent.includes(t));
}

export function isTrustedUa(userAgent: string): boolean {
  return TRUSTED_UA_HINTS.some((h) => userAgent.toLowerCase().includes(h));
}

export function isAggressiveScanner(userAgent: string): boolean {
  return AGGRESSIVE_SCANNER_HINTS.some((h) => userAgent.toLowerCase().includes(h));
}

/** Package the safe request signature. Keeps no query values or secrets. */
export function buildSignature(input: {
  method: string;
  url: URL;
  ip?: string | null;
  userAgent?: string | null;
}): RequestSignature {
  const rawPath = input.url.pathname;
  const ua = normaliseUserAgent(input.userAgent);
  return {
    method: input.method.toUpperCase(),
    path: safeDecodePath(rawPath),
    rawPath,
    clientKey: anonymiseClientKey(input.ip, ua),
    userAgent: ua,
    isBrowserish: isBrowserish(ua),
    queryCount: input.url.searchParams.size,
    queryLength: input.url.search.length,
  };
}
