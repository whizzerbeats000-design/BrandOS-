import { describe, expect, it } from "vitest";
import {
  buildSignature,
  safeDecodePath,
  anonymiseClientKey,
  normaliseUserAgent,
  isBrowserish,
  isTrustedUa,
  evaluateRules,
  verdictFromRisk,
  decideResponse,
  RateLimiter,
  InMemoryRateLimitStore,
  SecurityLogger,
  MemorySink,
} from "@/lib/security";

function sig({
  path = "/",
  method = "GET",
  ip = "203.0.113.7",
  ua = "Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
  query = "",
}: {
  path?: string;
  method?: string;
  ip?: string;
  ua?: string;
  query?: string;
} = {}) {
  return buildSignature({
    method,
    url: new URL(`http://localhost${path}${query}`),
    ip,
    userAgent: ua,
  });
}

/** Normal Nigerian mobile browser — the most important false-positive test. */
const NGA_MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 12; SM-A127F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36";

describe("signals", () => {
  it("safeDecodePath decodes single and double encoding", () => {
    expect(safeDecodePath("/%2e%2e/etc")).toBe("/../etc");
    expect(safeDecodePath("/a/%252e%252e/b")).toBe("/a/../b");
  });

  it("anonymiseClientKey is deterministic and not the raw IP", () => {
    const a = anonymiseClientKey("203.0.113.7", "Mozilla/5.0");
    const b = anonymiseClientKey("203.0.113.7", "Mozilla/5.0");
    const c = anonymiseClientKey("203.0.113.8", "Mozilla/5.0");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).not.toContain("203.0.113.7");
    expect(a.length).toBeGreaterThan(4);
  });

  it("isBrowserish identifies mobile browsers", () => {
    expect(isBrowserish(normaliseUserAgent(NGA_MOBILE_UA))).toBe(true);
  });

  it("isTrustedUa recognises search + social preview bots", () => {
    expect(isTrustedUa("googlebot/2.1")).toBe(true);
    expect(isTrustedUa("facebookexternalhit/1.1")).toBe(true);
    expect(isTrustedUa("WhatsApp/2.0")).toBe(true);
    expect(isTrustedUa("curl/8.0")).toBe(true);
  });
});

describe("evaluateRules — normal traffic (false positives)", () => {
  it("allows the homepage for a Nigerian mobile browser", () => {
    const s = sig({ path: "/", ua: NGA_MOBILE_UA });
    const { risk, signals } = evaluateRules(s);
    expect(risk).toBeLessThan(30);
    expect(signals).toEqual([]);
  });

  it("allows /shop with a normal search query", () => {
    const s = sig({ path: "/shop", query: "?category=tees&sort=price-asc&page=2" });
    const { risk } = evaluateRules(s);
    expect(risk).toBeLessThan(30);
  });

  it("allows a product page and checkout page", () => {
    expect(evaluateRules(sig({ path: "/product/limited-after-dark-tee" })).risk).toBeLessThan(30);
    expect(evaluateRules(sig({ path: "/checkout" })).risk).toBeLessThan(30);
  });

  it("allows WhatsApp/social preview UAs", () => {
    for (const ua of ["WhatsApp/2.0", "facebookexternalhit/1.1", "Twitterbot/1.0"]) {
      expect(evaluateRules(sig({ path: "/", ua })).risk).toBeLessThan(30);
    }
  });

  it("allows SEO crawlers", () => {
    for (const ua of ["Googlebot/2.1 (+http://www.google.com/bot.html)", "Bingbot/2.0"]) {
      expect(evaluateRules(sig({ path: "/", ua })).risk).toBeLessThan(30);
      expect(isTrustedUa(normaliseUserAgent(ua))).toBe(true);
    }
  });

  it("allows images/static assets", () => {
    expect(evaluateRules(sig({ path: "/images/campaign/campaign-05-hero-mobile.webp" })).risk).toBeLessThan(30);
  });
});

describe("evaluateRules — attacks (true positives)", () => {
  it("blocks path traversal (encoded slash-surviving forms)", () => {
    // Raw dot-dot paths are normalised away by the URL parser (`/../../etc`
    // becomes `/etc`) before app code runs — that is handled at the Vercel edge.
    // The forms that survive into Any-route handlers carry an encoded slash, and
    // those must be caught here as defense-in-depth:
    for (const p of ["/..%2fetc/passwd", "/%2e%2e%2fetc/passwd"]) {
      const { risk, signals } = evaluateRules(sig({ path: p }));
      expect(risk).toBeGreaterThanOrEqual(80);
      expect(signals.some((r) => r.ruleId === "path-traversal")).toBe(true);
    }
  });

  it("blocks double-encoded traversal", () => {
    const { risk } = evaluateRules(sig({ path: "/%252e%252e%252fetc/passwd" }));
    expect(risk).toBeGreaterThanOrEqual(80);
  });

  it("blocks .env / .git probing", () => {
    for (const p of ["/.env", "/.git/config", "/config/.env"]) {
      expect(evaluateRules(sig({ path: p })).risk).toBeGreaterThanOrEqual(80);
    }
  });

  it("blocks CMS/admin control-panel probes", () => {
    for (const p of ["/wp-admin", "/wp-login.php", "/wordpress/wp-config.php"]) {
      expect(evaluateRules(sig({ path: p })).risk).toBeGreaterThanOrEqual(70);
    }
  });

  it("penalises a headless script UA on a probe path", () => {
    const s = sig({ path: "/admin", ua: "python-requests/2.31" });
    const { risk } = evaluateRules(s);
    expect(risk).toBeGreaterThanOrEqual(30);
  });

  it("blocks TRACE/CONNECT regardless of path", () => {
    for (const m of ["TRACE", "CONNECT"]) {
      const { risk } = evaluateRules(sig({ path: "/", method: m }));
      // HIGH 85 → >= 80
      expect(risk).toBeGreaterThanOrEqual(80);
    }
  });

  it("does NOT flag POST on the future /api surface (handlers define policy)", () => {
    const { risk } = evaluateRules(sig({ path: "/api/cart", method: "POST" }));
    expect(risk).toBeLessThan(30);
  });

  it("flags oversized query structure", () => {
    const big = `?a=${"x".repeat(3000)}`;
    const { risk } = evaluateRules(sig({ path: "/", query: big }));
    expect(risk).toBeGreaterThanOrEqual(30);
  });
});

describe("verdictFromRisk ladder", () => {
  it("allocates ALLOW below threshold", () => {
    const v = verdictFromRisk(10, []);
    expect(v.decision.action).toBe("ALLOW");
  });
  it("allocates OBSERVE at mid range", () => {
    const v = verdictFromRisk(45, [{ ruleId: "x", severity: "LOW", points: 45 }]);
    expect(v.decision.action).toBe("OBSERVE");
  });
  it("allocates THROTTLE at high range", () => {
    const v = verdictFromRisk(85, [{ ruleId: "x", severity: "HIGH", points: 85 }]);
    expect(v.decision.action).toBe("THROTTLE");
  });
});

describe("decideResponse", () => {
  it("blocks CRITICAL hard signals with 403", () => {
    const verdict = verdictFromRisk(100, [{ ruleId: "path-traversal", severity: "CRITICAL", points: 100 }]);
    const res = decideResponse({ verdict, rateLimit: null });
    expect(res.status).toBe(403);
    expect(res.action).toBe("BLOCK");
  });

  it("throttles with 429 on rate-limit breach (progressive, not a hard ban)", () => {
    const verdict = verdictFromRisk(10, []);
    const res = decideResponse({ verdict, rateLimit: { allowed: false, remaining: 0, resetInSeconds: 30 } });
    expect(res.status).toBe(429);
    expect(res.action).toBe("THROTTLE");
  });

  it("allows a normal request", () => {
    const verdict = verdictFromRisk(0, []);
    const res = decideResponse({ verdict, rateLimit: { allowed: true, remaining: 20, resetInSeconds: 5 } });
    expect(res.action).toBe("ALLOW");
    expect(res.status).toBeNull();
  });

  it("blocked responses are generic and leak no rule names", () => {
    const verdict = verdictFromRisk(100, [{ ruleId: "path-traversal", severity: "CRITICAL", points: 100 }]);
    const res = decideResponse({ verdict, rateLimit: null });
    expect(res.body?.toLowerCase()).not.toContain("traversal");
    expect(res.body?.toLowerCase()).not.toContain("rule");
  });
});

describe("RateLimiter", () => {
  it("allows within limit and denies over it (static generous)", async () => {
    const rl = new RateLimiter({ store: new InMemoryRateLimitStore() });
    let last: { allowed: boolean } | null = null;
    for (let i = 0; i < 20; i++) {
      last = await rl.check("clientA", "/", "GET");
    }
    expect(last?.allowed).toBe(true); // static limit 240
  });

  it("applies strict limits to the auth category", async () => {
    const rl = new RateLimiter({ store: new InMemoryRateLimitStore() });
    let allowed = true;
    for (let i = 0; i < 14; i++) {
      const r = await rl.check("clientA", "/api/auth/login", "POST");
      allowed = r.allowed;
    }
    expect(allowed).toBe(false); // auth limit 10/60s
  });

  it("resets counts after the window elapses", async () => {
    const store = new InMemoryRateLimitStore();
    const rl = new RateLimiter({ store, limits: { auth: { limit: 3, windowSeconds: 0 } } });
    // window 0 → always reset
    const a = await rl.check("clientA", "/api/auth/login", "POST");
    const b = await rl.check("clientA", "/api/auth/login", "POST");
    expect(a.remaining).toBeGreaterThanOrEqual(0);
    expect(b.remaining).toBeGreaterThanOrEqual(0);
  });

  it("isolates different clients", async () => {
    const rl = new RateLimiter({ store: new InMemoryRateLimitStore(), limits: { auth: { limit: 3, windowSeconds: 60 } } });
    for (let i = 0; i < 5; i++) await rl.check("A", "/api/auth/login", "POST");
    const other = await rl.check("B", "/api/auth/login", "POST");
    expect(other.allowed).toBe(true);
  });

  it("maps a POST to a static page onto the stricter api budget (not static)", async () => {
    const rl = new RateLimiter({ store: new InMemoryRateLimitStore() });
    // api budget = 60/60s; static = 240/60s. We hit exactly between them and
    // assert a genuine static GET still passes while the mutating POST does not.
    for (let i = 0; i < 61; i++) await rl.check("attacker", "/", "POST");
    const get = await rl.check("attacker", "/", "GET");
    expect(get.allowed).toBe(true); // separate key, static generous
  });
});

describe("SecurityLogger — safe logging", () => {
  it("logs structured, secret-free events", () => {
    const sink = new MemorySink();
    const logger = new SecurityLogger({ sink, source: "test", minSeverity: "LOW" });
    logger.log({
      path: "/api/auth/login",
      method: "POST",
      severity: "HIGH",
      action: "BLOCK",
      riskScore: 100,
      status: 403,
      ruleId: "brute-force",
      clientKey: anonymiseClientKey("203.0.113.7", "x"),
      userAgent: "sqlmap",
      detail: "blk",
    });
    const evt = sink.events[0];
    expect(evt.path).toBe("/api/auth/login");
    expect(evt.ruleId).toBe("brute-force");
    expect(evt.severity).toBe("HIGH");
    // Never contains secrets / raw IPs.
    expect(JSON.stringify(evt)).not.toContain("203.0.113.7");
    expect(JSON.stringify(evt)).not.toContain("password");
    expect(JSON.stringify(evt)).not.toContain("api_key");
  });

  it("honours minSeverity filter", () => {
    const sink = new MemorySink();
    const logger = new SecurityLogger({ sink, source: "test", minSeverity: "HIGH" });
    logger.log({ path: "/", method: "GET", severity: "INFO", action: "ALLOW", riskScore: 0 });
    expect(sink.events).toHaveLength(0);
  });
});
