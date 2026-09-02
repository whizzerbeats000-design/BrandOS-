# SUS WEARS — Security Deployment Runbook (Vercel Firewall)

This is the **operational** companion to `docs/SECURITY-ARCHITECTURE.md`. It describes
the Vercel Firewall configuration that CANNOT live in `vercel.json` (rate limiting,
Attack Challenge Mode, managed rulesets, IP blocks) and should be applied in the Vercel
dashboard. It also documents the distributed rate-limit limitation and the KV upgrade
path.

> These steps are **recommended production configuration**, not fabricated in-repo
> code. The in-repo `vercel.json` already carries the edge `deny`/`challenge` rules that
> ARE expressible in source control.

---

## 1. Why the dashboard matters

- `vercel.json` supports only `deny` and `challenge` WAF actions.
- **Rate limiting, persistent deny, IP blocks, Attack Challenge Mode, and managed
  rulesets are dashboard-only.** They are the *distributed* or *managed* controls that
  in-memory code cannot replace on serverless.

---

## 2. Required dashboard configuration

### 2.1 Rate-limit rules (distributed)
| Rule | Condition | Action | Rationale |
| --- | --- | --- | --- |
| Static browsing | path = any, key by IP | Fixed window e.g. 600/60s, 429 | Generous for shoppers/search/preview over shared IPs |
| Future `/api` general | path starts `/api`, key by IP | Fixed window 120/60s, 429 | Non-payment API surface |
| **Future auth** | path `/api/auth/**` | **10/60s**, deny-for-15m on repeated | Brute-force protection |
| **Future checkout** | path `/api/checkout/**` | **20/60s**, deny for repeated | Abuse / inventory-scan protection |
| **Payment webhook** | path `/api/webhook/**` | **do NOT IP-limit** (signature-verify instead) | Provider IPs vary; verify HMAC/signature at handler |

Persistent actions (block same source for N minutes) should be enabled on **auth** and
**checkout** only — never on static/browsing rules, to protect shared mobile carrier IPs.

### 2.2 Attack Challenge Mode
- Enable during a targeted DDoS/flood. Vercel auto-allows Googlebot, social preview
  bots, verified bots, cron, and internal requests.

### 2.3 Managed rulesets (plan-dependent)
- **OWASP Core Ruleset** — block OWASP Top-10 patterns (SQLi/XSS/traversal) at edge.
- **Bot Protection / AI Bots** — challenge non-browser traffic.
- These are **Enterprise-only** on Vercel. On Hobby/Pro, enable is unavailable; the
  in-repo Proxy + vercel.json rules provide the closest in-code alternative.

### 2.4 IP blocks / allow
- Add explicit blocks only after confirming from Firewall → Monitoring that a source is
  persistently abusive. Never block a whole ISP/CIDR pre-emptively (Nigerian mobile
  carriers share ranges).

---

## 3. Distributed rate-limit limitation (honest)

The in-repo Proxy ships an **in-memory** `RateLimitStore` (bounded, single-process/edge
fallback). On Vercel serverless this is **not** globally consistent across warm
instances/regions. Two supported options when it matters:

1. **Preferred:** Vercel Firewall **rate-limit custom rule** (Section 2.1) — distributed,
   dashboard-managed, zero app code.
2. **Adopt a KV-backed store:** implement `RateLimitStore` with Vercel KV / Redis and
   pass it to `RateLimiter` in `src/proxy.ts`:
   ```ts
   const rateLimiter = new RateLimiter({ store: new KvRateLimitStore(...) });
   ```
   The `RateLimiter` API is unchanged regardless of store.

---

## 4. Headers & caching

- Security headers (CSP, HSTS, frame/MIME, referrer, permissions, CORP/COOP) are set in
  `next.config.ts` — versioned and applied by Next on every response.
- Static assets (images, fonts) are CDN-cached by Vercel by default; no private data is
  ever cached. `robots.txt` disallows `/api/` and `/checkout`.

---

## 5. Post-change checklist

- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` all pass.
- [ ] Deploy from git (`git push origin main`) — Vercel auto-deploys.
- [ ] In dashboard Firewall: add Section 2.1 rate-limit rules (esp. auth/checkout 10/20
      per minute), enable Attack Mode only during incidents.
- [ ] Confirm `/` , `/shop?q=...`, `/checkout`, and social-preview URLs still load (no
      false blocks).
- [ ] Confirm `mailto:` and `wa.me` links still navigate (CSP caveat).
