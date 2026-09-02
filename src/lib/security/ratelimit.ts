/**
 * Pluggable rate limiter.
 *
 * Rate limiting that must hold across serverless instances cannot use memory
 * alone. This module defines a storage-agnostic `RateLimitStore` and ships a
 * bounded in-memory fixed-window implementation as the default (good for a
 * single edge/Node process or as a test/cold-start fallback).
 *
 * For production *distributed* limiting, implement `RateLimitStore` with
 * Vercel KV / Redis (see `docs/SECURITY-DEPLOYMENT.md`) and pass it to
 * `createRateLimiter`. The public API is identical either way.
 *
 * IMPORTANT (Phase 4 honesty): an in-memory store does NOT persist across
 * serverless warm instances/regions. The authoritative distributed limiter for
 * Vercel is a Firewall **rate-limit custom rule** (dashboard) or a KV-backed
 * store. Do not claim in-memory rate limiting is distributed.
 */

import { RATE_LIMITS } from "./config";
import type { RouteCategory } from "./config";

export interface RateLimitResult {
  allowed: boolean;
  /** Requests remaining in the current window (>= 0). */
  remaining: number;
  /** Seconds until the window resets. */
  resetInSeconds: number;
  /** Total limit for the window. */
  limit: number;
}

/** Minimal durable store contract. Implement with KV/Redis for distribution. */
export interface RateLimitStore {
  /** Atomically increment a counter; return the new value and window info. */
  increment(key: string, windowSeconds: number): Promise<{
    count: number;
    resetAt: number;
  }>;
  /** Optional teardown / disconnect. */
  close?(): void | Promise<void>;
}

/** Fixed-window increments in an in-memory Map. Bounded by size to avoid leaks. */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();
  private readonly maxBuckets: number;

  constructor(maxBuckets = 10_000) {
    this.maxBuckets = maxBuckets;
  }

  async increment(key: string, windowSeconds: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const existing = this.buckets.get(key);
    if (existing && existing.resetAt > now) {
      existing.count += 1;
      return { count: existing.count, resetAt: existing.resetAt };
    }
    const resetAt = now + windowSeconds * 1000;
    this.buckets.set(key, { count: 1, resetAt });
    this.evict(now);
    return { count: 1, resetAt };
  }

  private evict(now: number): void {
    // Drop expired buckets; if still over budget, drop the oldest aggressively.
    for (const [k, v] of this.buckets) {
      if (v.resetAt <= now) this.buckets.delete(k);
    }
    if (this.buckets.size > this.maxBuckets) {
      let removed = 0;
      for (const k of this.buckets.keys()) {
        this.buckets.delete(k);
        if (++removed > this.maxBuckets * 0.2) break;
      }
    }
  }
}

/** Route → policy lookup. Overridable for tests/custom paths. */
export type PolicyResolver = (path: string, method: string) => RouteCategory;

const DEFAULT_RESOLVER: PolicyResolver = (path, method) => {
  const p = path.toLowerCase();
  if (p.startsWith("/api/auth")) return "auth";
  if (p.startsWith("/api/checkout")) return "checkout";
  if (p.startsWith("/api/webhook")) return "webhook";
  if (p.startsWith("/api")) return "api";
  if (method.toUpperCase() === "POST") return "api";
  // Probe paths get their own stricter budget (only pricked on real probes).
  if (!pathAllowed(p)) return "probe";
  return "static";
};

/** Is this path one we consider a normal page (vs an unknown/probe path)? */
function pathAllowed(p: string): boolean {
  if (p === "/" || p === "") return true;
  const known = [
    "/about", "/cart", "/checkout", "/collections", "/product", "/shop",
    "/favicon", "/icons", "/manifest", "/images", "/_next",
    "/robots.txt", "/sitemap.xml", "/llms.txt",
  ];
  return known.some((k) => p === k || p.startsWith(`${k}/`)) || (p.startsWith("/") && !p.includes("."));
}

export interface RateLimiterOptions {
  store?: RateLimitStore;
  resolver?: PolicyResolver;
  limits?: Partial<Record<RouteCategory, { limit: number; windowSeconds: number }>>;
}

export class RateLimiter {
  private readonly store: RateLimitStore;
  private readonly resolver: PolicyResolver;
  private readonly limits: Record<RouteCategory, { limit: number; windowSeconds: number }>;

  constructor(options: RateLimiterOptions = {}) {
    this.store = options.store ?? new InMemoryRateLimitStore();
    this.resolver = options.resolver ?? DEFAULT_RESOLVER;
    this.limits = { ...RATE_LIMITS, ...(options.limits as Record<RouteCategory, { limit: number; windowSeconds: number }>) };
  }

  async check(key: string, path: string, method: string): Promise<RateLimitResult> {
    const category = this.resolver(path, method);
    const policy = this.limits[category] ?? RATE_LIMITS.static;
    const { count, resetAt } = await this.store.increment(
      `${category}:${key}`,
      policy.windowSeconds,
    );
    const remaining = Math.max(0, policy.limit - count);
    const resetInSeconds = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));
    return {
      allowed: count <= policy.limit,
      remaining,
      resetInSeconds,
      limit: policy.limit,
    };
  }
}
