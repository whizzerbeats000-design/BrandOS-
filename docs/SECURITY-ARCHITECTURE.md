# SUS WEARS — Security Architecture Decision (Phase 1)

Status: **Implemented** — defense-in-depth for a static Next.js deployment on Vercel.

This document records *what* the attack surface is, *where* each protection lives, and
*why*. It is the reference for everything in `src/lib/security/`, `src/proxy.ts`,
`vercel.json`, and `next.config.ts`.

---

## 1. Deployed reality (authoritative)

SUS WEARS is **100% static** as deployed today:

- Next.js **16.3.0**, App Router, built via `next build` and served by **Vercel**.
- **No API routes** (`route.ts`), **no middleware/proxy previously**, **no database**,
  **no server functions**, **no authentication**, **no payment integration**.
- All catalogue/editorial data is compiled in at build time.
- The **only** dynamic input is the `/shop` query string, already defensively parsed by
  `src/lib/catalogue.ts::parseSearchParams` (whitelisted categories/collections/sorts,
  clamped page, trimmed search).
- The bag, recent-viewed, and checkout are **client-only localStorage** with no financial
  authority (see `docs/COMMERCE-CHECKOUT-BOUNDARY.md`).

### Resulting real attack surface (today)

| Surface | Risk | Notes |
| --- | --- | --- |
| DDoS / L7 flood / request storm | Medium | Mitigated natively by Vercel Firewall |
| Automated scanner probing (`.env`, `.git`, `/wp-*`, `/admin`, path traversal) | Medium | High signal, near-zero FP — safe to deny at edge |
| Abuse of future `/api`, auth, checkout, **payment webhooks** | **High (future)** | The main reason this layer exists now |
| XSS / CSRF / injection | Low today | No user-generated content, no runtime secrets |
| Newsletter/search abuse | Low | Search param parsing is already validated |

This is a **defensive**, future-ready layer. It does not pretend there is a payment API
that does not exist, and it does not slow down static page delivery.

---

## 2. Chosen architecture — defense in depth, platform-first

```
 Internet
   │
   ▼
 [1] Vercel Firewall  ── CDN edge (platform-native, distributed, free)
       • DDoS mitigation (always on)
       • WAF custom rules: deny sensitive probes, restrict methods  (vercel.json)
       • Attack Challenge Mode (dashboard) — allows Googlebot etc.
       • Rate-limit custom rule + persistent deny (dashboard)      [distributed]
   │  passes
   ▼
 [2] Next.js Proxy (src/proxy.ts)  ── narrow matcher (edge/Node)
       • Defense-in-depth detection + risk scoring + throttle
       • Pluggable rate-limiter (in-memory edge bucket today;
         KV/Redis adapter documented for distributed persistence)
       • Structured security logging (no secrets)
   │  passes
   ▼
 [3] Next.js application / serverless function
       • Hardened security headers (CSP, HSTS, etc.)  (next.config.ts)
       • Defensive input parsing
       • Future: server-authoritative commerce utilities
```

### Why this order

- **Vercel Firewall is the authoritative WAF.** It operates at the true CDN edge, is
  distributed across regions, persists blocks/IP actions platform-wide, and costs zero
  request fee. Reimplementing "real" rate limiting in-app would be *worse* — an
  in-memory-only limiter would not hold across serverless instances.
- **Proxy is defense-in-depth, not the primary WAF.** Next.js 16 documents Proxy as a
  "last resort" layer. It is used here only because it lets us (a) react to signals with
  code, (b) emit structured logs, and (c) unit-test the detection engine — none of which
  the static vercel.json rules can do.
- **Headers/parsing live in the app layer** where they are testable and versioned.

---

## 3. Protection ownership map

| Concern | Owner |
| --- | --- |
| DDoS / volumetric L7 | Vercel Firewall (always on) |
| Distributed IP rate limiting (esp. future /api/auth/checkout) | Vercel WAF rate-limit rule (dashboard) — **not** in-memory |
| Block probe paths (`.env`, `..%2f`, `wp-admin`, etc.) | vercel.json `mitigate.deny` + Proxy |
| Method restriction on future APIs | vercel.json / dashboard + Proxy |
| Bot / scraper challenge | Attack Challenge Mode + Bot Protection managed ruleset (dashboard; Enterprise for rulesets) |
| Detection, risk scoring, adaptive throttle | src/lib/security + src/proxy.ts |
| Structured security logging | src/lib/security/logger |
| CSP / HSTS / referrer / frame / MIME / permissions | next.config.ts |
| Future payment-webhook integrity (signature, replay) | documented: src/lib/security/server doc (Phase 9) |

---

## 4. Deliberate non-goals / honesty

- **No fabricated "enterprise WAF" claim.** Managed rulesets (OWASP/Bot/AI) are
  **Enterprise-plan-only** on Vercel; on this project's plan they are documented, not
  faked in code.
- **No in-memory-only distributed rate limit.** The abstraction is provided; persistence
  requires Vercel KV/Redis (documented) or a native Vercel rate-limit rule.
- **No fake payment/auth infrastructure.** Phase 9 only defines the boundary and reusable
  utilities.
- **No blocking of legitimate traffic**: Nigerian mobile networks, shared carrier IPs,
  WhatsApp-driven visits, search engines, and social link-preview crawlers are explicitly
  allow-listed (Phase 10).

---

## 5. Layered signals / response ladder

Detection uses a **risk score** (not one rule). A single weak signal only *observes*;
repeated high-confidence behavior *throttles* or *blocks*.

```
risk 0–29   ALLOW      normal
risk 30–64  OBSERVE    log only
risk 65–79  THROTTLE   429 on rate-limit breach / short window
risk 80+    BLOCK      403 generic (probe signatures, high-confidence)
```

When a distributed store is unavailable, long-lived *IP bans* are **not** issued from the
app (a single signal on a shared Nigerian carrier IP must never ban a real customer).
High-confidence blocks are limited to path/method *signatures* that cannot be a real
browser's normal behaviour.
