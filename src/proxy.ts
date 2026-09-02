/**
 * SUS WEARS — Next.js 16 Proxy (defense-in-depth security layer).
 *
 * This is NOT the primary WAF. See docs/SECURITY-ARCHITECTURE.md.
 * The authoritative edge protection is Vercel's Firewall (auto DDoS + WAF
 * custom rules in vercel.json + dashboard Attack Challenge Mode / rate-limit
 * rules). This Proxy adds a second, code-driven layer: detection + risk
 * scoring + adaptive throttle + structured logging for the few surfaces that
 * merit per-request inspection — and it is a reusable seam for future auth,
 * API, checkout and payment-webhook handlers.
 *
 * To preserve the premium frontend's performance and SEO, the matcher is kept
 * deliberately NARROW: known static pages, assets and SEO files are NOT matched,
 * so they stay fully CDN-cached and bypass this layer entirely.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  RateLimiter,
  MemorySink,
  SecurityLogger,
  buildSignature,
  evaluateRules,
  verdictFromRisk,
  decideResponse,
  isTrustedUa,
} from "@/lib/security";
import type { SecurityAction, Severity } from "@/lib/security";

/** Memory sink for local/edge events (bounded, not durable). */
const sink = new MemorySink(2000);
const logger = new SecurityLogger({ sink, source: "proxy", minSeverity: "LOW" });

/**
 * Distributed rate limiting requires a KV/Redis-backed store. Today this site is
 * fully static with no APIs; the in-memory store is used as a bounded local
 * fallback. Swap `store` for a `RateLimitStore` backed by Vercel KV / Redis when
 * APIs, auth or checkout are introduced — see docs/SECURITY-DEPLOYMENT.md.
 */
const rateLimiter = new RateLimiter({
  // store: kvRateLimitStore,   // ← plug in a distributed store later
});

/** Path clues that indicate a pixel/asset/dynamic route vs a probe. */
function looksLikeAsset(path: string): boolean {
  if (path.startsWith("/_next/")) return true;
  return /\.[a-z0-9]{2,5}$/i.test(path) && !path.startsWith("/api/");
}

/**
 * Run detection + rate-limit for the matched (non-static, future-dynamic)
 * request surface. Cheap ALLOW for normal/unknown paths; blocks only on
 * high-confidence signatures; throttles on rate-limit breach.
 */
async function inspect(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
  const ua = request.headers.get("user-agent");

  const sig = buildSignature({ method: request.method, url: request.nextUrl, ip, userAgent: ua });
  const { signals, risk } = evaluateRules(sig);
  const verdict = verdictFromRisk(risk, signals);

  // Trusted crawlers/preview bots & real assets are never rate-limited.
  const applyRateLimit = !looksLikeAsset(sig.path) && !isTrustedUa(sig.userAgent);
  const rl = applyRateLimit
    ? await rateLimiter.check(sig.clientKey, sig.path, request.method)
    : null;
  const response = decideResponse({ verdict, rateLimit: rl });

  if (response.action !== "ALLOW") {
    logger.log({
      path: sig.path,
      method: request.method,
      severity: response.severity as Severity,
      action: response.action as SecurityAction,
      riskScore: risk,
      status: response.status ?? undefined,
      ruleId: signals[0]?.ruleId,
      clientKey: sig.clientKey,
      userAgent: sig.userAgent,
      detail: signals[0]?.detail,
    });
  }

  if (response.status !== null && response.body !== null) {
    return new NextResponse(response.body, { status: response.status });
  }
  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  return inspect(request);
}

/**
 * Narrow matcher — the only paths that run this layer.
 *
 * - `/api/:path*`                    → future auth/checkout/webhook surface
 * - High-signal probe path families  → explicit
 * - Negative-match catch-all         → any non-static, non-known-page path
 *   (captures novel probes; 404/unknown paths get a cheap ALLOW/observe)
 *
 * Excluded (by negative lookahead) so they stay cached & untouched:
 * `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, `sitemap.xml`,
 * `llms.txt`, `/images/*` (public assets), and the known page prefixes.
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/.php/:path*",
    "/admin/:path*",
    "/.well-known/:path*",
    "/wp-:path*",
    "/wordpress/:path*",
    "/cgi-bin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|images|product|collections|shop|about|cart|checkout|manifest).*)",
  ],
};
