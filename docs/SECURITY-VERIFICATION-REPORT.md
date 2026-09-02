# SUS WEARS — Security Verification Report

Date: 2026-09-02
Target: `https://sus-wears.vercel.app` (Next.js 16.3.0, App Router, fully static)
Scope: Hardening of the deployed surface with the strongest practical defensive
layer for the platform (Vercel), without damaging performance, SEO, accessibility,
or legitimate customers (esp. Nigerian mobile / WhatsApp / social preview bots).

---

## 1. Findings from the audit (what was at risk)

The site is **100% static**: no API routes, no middleware, no DB, no server auth,
no payment authority. The only dynamic input is the `/shop` query string (already
whitelist-validated by `parseSearchParams`); the bag/checkout are client-only
localStorage with no financial authority.

| Gap | Severity | Status |
| --- | --- | --- |
| No WAF / edge protection (only Vercel default DDoS) | High | Fixed (Firewall custom rules) |
| No request hardening headers (no CSP, HSTS, COOP, CORP) | Medium | Fixed (next.config.ts) |
| Path-probe / traversal / dot-file requests unhandled | Medium | Fixed (edge deny + Proxy) |
| No rate limiting seam for future auth/checkout/webhooks | Medium | Ready (engine + runbook) |
| No structured, secret-free security logging | Low | Fixed (SecurityLogger) |
| Secrets hygiene (`.env.local` leaks) | High | Verified clean (untracked) |

---

## 2. Architecture

- **Primary WAF: Vercel Firewall** (platform-native, distributed). Auto DDoS always
  on; custom edge rules in `vercel.json` (`deny` only — rate limiting is
  dashboard-only); Attack Challenge Mode free (auto-allows Googlebot/previews);
  managed OWASP/Bot/AI rulesets on Enterprise.
- **Defense-in-depth: Next.js 16 Proxy** (`src/proxy.ts`). Narrow matcher
  (unknown/probe/`/api` paths only) so static pages & assets stay CDN-cached
  (performance + SEO preserved). Consumes a framework-agnostic engine.
- **Reusable security engine** (`src/lib/security/`): risk scoring, adaptive
  throttle, safe (secret-free) logging, pluggable rate-limit store — the seam any
  future auth/API/checkout/webhook handler will use.

---

## 3. Protections applied

- `vercel.json` — 6 edge `deny` routes: dot-files (`.env`, `.git`, …), path
  traversal (encoded `%2e%2e%2f`, `..%2f`), null-byte (`%00`), CMS/control-panel
  probes (`wp-*`, `wordpress`, `administrator`, `phpmyadmin`, `actuator`, …),
  `/.well-known/acme-challenge`. **Schema-validated** against Vercel's published `vercel.json` schema; only `src` + `mitigate.action ∈ {deny}` used (all valid).
- `next.config.ts` headers — CSP (`object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `frame-src 'none'`), HSTS (`63072000; includeSubDomains;
  preload`), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy:
  same-origin`. Verified safe: site has no `<form>` and only `mailto:` / `wa.me`
  anchor navigation (unaffected).
- `src/proxy.ts` — blocks high-confidence probe signatures (403), throttles on
  rate-limit breach (429), observes + logs elevated risk (allow), and lets normal
  traffic pass. Trusted crawlers/preview bots and real assets are never rate-limited.

---

## 4. Detection signals (engine)

Rule sets in `config.ts`: **hard-block** (CRITICAL, short-circuits): sensitive-file
probe, backup/archive probe, path-traversal, null-byte, CMS/control-panel probe,
framework probe. **Point-based** (accumulate to risk): sensitive-surface probe,
disallowed method (TRACE/CONNECT hard; mutating methods allowed only under future
`/api/*`), aggressive-scanner UA, headless non-browser UA, oversized query.
**Trusted allow-list** (never penalised): search engines, WhatsApp, and social
preview bots, plus `isBrowserish` (real mobile browsers).

---

## 5. Throttle vs block (policy)

| Decision | Trigger | HTTP | Effect |
| --- | --- | --- | --- |
| ALLOW | risk < 30 | — | pass-through |
| OBSERVE | risk 30–79 | 200 | pass-through + log |
| THROTTLE | rate-limit breach | 429 | temporary, progressive — **never a hard ban** |
| BLOCK | risk ≥ 80 (or CRITICAL) | 403 | deny |

Critical: throttling is **time-windowed**, never a permanent IP ban, protecting
shared Nigerian mobile carrier IPs. Persistent deny is only recommended for auth/
checkout (future) in the dashboard runbook.

---

## 6. Logged vs not-logged

- **Logged** (structured, minimal trim): anonymised client key (hash of IP+UA —
  never raw IP), normalised UA, path, method, severity, action, risk score, status,
  first rule id. Rate-limited to `minSeverity` filters.
- **Never logged**: raw IPs, cookies, auth tokens, payment data, request bodies,
  query values, secrets. `.env.local` untracked; commits contain no secrets.

---

## 7. Honest limitations

- **Distributed rate limiting** requires a KV/Redis-backed `RateLimitStore`. The
  shipped in-memory store is a bounded single-process fallback, not globally
  consistent across regions. The recommended distributed limits live in the Vercel
  Firewall dashboard (runbook §2.1). This is stated, not silently claimed.
- **Managed rulesets** (OWASP / Bot Protection / AI-Bots) are **Enterprise-only** on
  Vercel; on Pro/Hobby the closest in-code equivalent is the Proxy + vercel.json
  rules delivered here.
- **Raw dot-dot traversal** (`/../etc`) is normalised away by the URL parser before
  app code runs — it is handled at the Vercel edge (raw-URL deny) and covered by
  the Firewall, which the Proxy cannot see pre-normalisation. Encoded
  slash-surviving forms (`..%2f`, `%2e%2e%2f`) *are* caught in-code (tested).

---

## 8. Dashboard configuration still required (can't live in repo)

Per `docs/SECURITY-DEPLOYMENT.md`: rate-limit custom rules (`auth` 10/60s,
`checkout` 20/60s, api 120/60s, static 600/60s), Attack Challenge Mode on demand,
IP blocks only after confirmed abuse, and KV-backed store wiring for distribution.

---

## 9. Future commerce boundary

`docs/SECURITY-FUTURE-COMMERCE.md` defines mandatory controls before auth/cart/
checkout/payment-webhook/admin go live: server-authoritative economics, signature-
verified + replay-protected payment webhooks (never IP-limited), idempotency,
RBAC for admin, `NEXT_PUBLIC_*` hygiene. The engine and rate-limiter seam are the
reusable foundation.

---

## 10. Files changed / added

**Added (security task):**
- `src/lib/security/index.ts`, `types.ts`, `config.ts`, `signals.ts`, `rules.ts`,
  `ratelimit.ts`, `logger.ts`, `respond.ts`
- `src/proxy.ts` (Next 16 Proxy)
- `vercel.json` (edge WAF deny routes)
- `tests/security/engine.test.ts` (32 tests)
- `docs/SECURITY-ARCHITECTURE.md`, `SECURITY-DEPLOYMENT.md`, `SECURITY-FUTURE-COMMERCE.md`

**Added (origin-protection task):**
- `scripts/check-origin-protection.mjs` (CLI check), `scripts/lib/origin-check.mjs`
  (shared scanner)
- `tests/security/origin-protection.test.ts` (14 tests, incl. detector self-check)
- `docs/SECURITY-ORIGIN-PROTECTION.md`
- `package.json` — `security:origin` script

**Modified (security task):**
- `next.config.ts` (hardened headers)

**Modified (origin-protection task):**
- `next.config.ts` — `poweredByHeader: false` (removes `X-Powered-By` framework
  disclosure)
- `docs/SECURITY-VERIFICATION-REPORT.md` — this report

**Unchanged (already secure):** `src/app/shop/page.tsx` + `src/lib/catalogue.ts`
(`parseSearchParams` whitelist), `.gitignore` (`.env.local` & `.vercel` untracked).

---

## 11. Verification (all passing)

- `npx tsc --noEmit` — **0 errors**
- `npx eslint src tests scripts next.config.ts` — **0 errors**
- `npx vitest run` — **138 passed** (92 existing + 32 security-engine + 14 origin-protection)
- `npm run build` — **success**, 16 routes, `ƒ Proxy (Middleware)` registered
- `npm run security:origin` — **origin-protection scan clean**
- **Live runtime check** (Playwright against `next start`):
  - Home `/` → **200** with HSTS, CSP, COOP, CORP present
  - `/shop?category=tees&sort=price-asc` → **200**
  - `robots.txt` → **200**
  - Probes `/.env`, `/.git/config`, `..%2f` traversal, `%00`, `/wp-login.php`
    → **all 403 (blocked)**
  - `X-Powered-By` header **removed** (see Origin Protection Verification §13)

Negative-control tests confirm the false-positive allow-list works: Nigerian mobile
browser UA, `/shop` with real query params, product/checkout pages, WhatsApp, and
Googlebot all score **risk < 30 (ALLOW)**, and the origin-protection detector's
self-tests prove it catches real leaks (private IP, internal hostname, secret env,
filesystem path).

---

## 12. Permanent security invariant

> **All production application traffic must pass through the intended edge
> security layer; private origin infrastructure must never be directly
> internet-reachable, and nothing in shipped source or the client bundle may
> disclose private infrastructure (IPs, hostnames, paths, secrets).**

Enforced by `npm run security:origin` (`scripts/check-origin-protection.mjs`) and by
`tests/security/origin-protection.test.ts` (gated on `npm test`). See
`docs/SECURITY-ORIGIN-PROTECTION.md` for the full architecture and the mandatory
future-backend design.

---

## 13. Origin Protection Verification

### Architecture (verified from the repository + live deployment)

- **No private origin exists.** `sus-wears.vercel.app` (Vercel-managed subdomain) is
  fully static, served entirely behind Vercel's edge/CDN/WAF. There is **no**
  origin server, VPS, database, API server, proxy, or third-party backend to expose.
- **No custom domain / no DNS records owned by this project** → no A/AAAA/CNAME/MX/TXT
  records that a misconfiguration could point at a private origin. DNS is Vercel's
  Anycast edge (the intended edge).
- **No API routes, no `fetch` to any backend** in client code; bag/checkout are
  client-only localStorage with no financial authority.

### What was verified (green)

| Check | Result |
| --- | --- |
| Response headers disclose framework/version | **Fixed** — `X-Powered-By: Next.js` removed via `poweredByHeader: false`; live-verified **absent** |
| Response headers disclose server/edge/internal info | **Clean** — no `Server`, `x-vercel-*`, `via`, `cf-*`, `x-forwarded-*`, or debug headers in app responses |
| Client bundle contains private/public origin IPs | **Clean** — no IPv4/IPv6 addresses |
| Client bundle contains internal hostnames (`*.internal`, `*.local`, `*.corp`, `*.lan`) | **Clean** (only standard WHATWG URL-parser `localhost` runtime sentinel, resolves to nothing) |
| Client bundle contains filesystem paths (`C:\`, `/root/`, `/var/`, `/home/<user>/`) | **Clean** |
| Client bundle contains source maps / `sourceMappingURL` | **Clean** — 0 maps in served `.next/static` |
| Client bundle leaks env vars | **Clean** — only intentional `NEXT_PUBLIC_SITE_URL` (public URL) and `NEXT_PUBLIC_WHATSAPP_NUMBER` (public WhatsApp); no secret-shaped vars, no `process.env.*_KEY` |
| Error responses disclose stack/paths/hostnames | **Clean** — 404/error/block pages render generic user-facing text; `/.env` → generic `403 Request blocked.` |
| `.vercel` internal identifiers (projectId/orgId) | **Not exposed** — `.vercel/` is gitignored, never committed, never served |
| Absolute internal URLs in client JS | **Clean** — client uses only relative paths / public contact links |
| Direct-origin-fetch path from client | **None exists** — zero backend fetches |

### What could NOT be verified from the repository alone

> **Repository verification cannot establish complete origin-IP secrecy.**

The following depend on the live Vercel project / DNS provider and must be checked
on `sus-wears.vercel.app` (or after linking a custom domain):

1. **Live DNS resolution** — confirm the apex/subdomain resolves **only** to Vercel
   Anycast edge IPs/CDN, and there are no `A`/`AAAA` records pointing at a private
   or origin IP. (No custom domain is configured, so nothing user-managed exists.
   Re-run if a custom domain is added.)
2. **Live TLS/hosting provider headers** — the `server`/edge headers emitted by
   Vercel's real edge (vs the local `next start`) should be inspected on the
   deployed URL to confirm no origin headers are appended by a misconfigured
   proxy/CDN wrapper.
3. **Custom-domain misconfiguration** — only relevant if a custom domain is added;
   then confirm it uses the Vercel `alias`/CNAME and no direct `A`-record to an
   origin, and verify via `dig`/`nslookup`.
4. **Future backend ingress that bypasses the WAF** — no backend exists today; if one
   is introduced, apply §4 of `docs/SECURITY-ORIGIN-PROTECTION.md` (edge-only
   ingress, private networking, trusted-edge validation) and re-verify externally.
5. **Vercel deployment security scan (optional)** — run Vercel's "Security"
   overview / any CSP/header scanner against the production URL to independently
   confirm header state at the edge.

### External configuration checks required

- Review the Vercel project → Domains; confirm only `sus-wears.vercel.app` (or a
  Vercel-linked custom domain) with no stray records.
- If a custom domain is added: set it to a Vercel alias/CNAME (never an `A` record
  to a private/origin IP) and re-run the live DNS + header verification above.
- If any future API/backend is added, ensure it is reachable **only** via the edge
  (private networking or edge IP allow-list), has no public DNS, and never returns
  internal hostnames/IPs.
