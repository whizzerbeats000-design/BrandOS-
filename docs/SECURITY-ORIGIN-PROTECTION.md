# SUS WEARS — Origin-IP Protection

Status: **Implemented & verified** — `sus-wears.vercel.app` is a fully static
Next.js site served exclusively behind Vercel's edge/CDN/WAF. There is **no**
separate origin server, VPS, database, API server, or third-party backend to
expose.

This document is the permanent architectural invariant plus the mandatory design
any future backend must follow so a public origin can never bypass the edge.

---

## 1. The invariant

> **All production application traffic must pass through the intended edge
> security layer; private origin infrastructure must never be directly
> internet-reachable, and nothing in shipped source or the client bundle may
> disclose private infrastructure (IPs, hostnames, paths, secrets).**

This is enforced by automated regression checks (see §5).

---

## 2. Current architecture (verified)

```
Internet ──▶ sus-wears.vercel.app ──▶ Vercel edge/CDN/WAF ──▶ static pages (edge)
```

- **Host:** `sus-wears.vercel.app` (Vercel-managed subdomain). No custom domain
  is configured, so no A/AAAA/CNAME/MX/TXT records are managed by this project —
  everything is Vercel's Anycast edge infrastructure (the intended edge, not a
  private origin). DNS misconfiguration is therefore impossible at the repo level.
- **Build:** `next build` → fully static output (16 routes). Only `/shop`,
  `/collections/[slug]`, `/product/[slug]` are dynamic (server-rendered on Vercel
  edge, no external origin); the security Proxy intercepts probe paths.
- **No backend surface:** zero API routes, no `fetch` to any backend in client
  code, no database URLs, no payment SDKs, no webhook endpoints. The only
  `NEXT_PUBLIC_*` values are `NEXT_PUBLIC_SITE_URL` (public URL) and
  `NEXT_PUBLIC_WHATSAPP_NUMBER` (public WhatsApp contact).
- **Client bundle:** verified to contain no private/public origin IPs, no
  internal hostnames, no filesystem paths, no source maps, and no secret env
  values. The single `localhost` token is the standard WHATWG URL-parser runtime
  sentinel (identical in any React app) and resolves to nothing.

> The platform's own public edge IP ranges are **not** a private origin and are
> intentionally not "hidden". The objective is that no *application/private*
> origin is reachable and no private infrastructure is disclosed.

---

## 3. DNS audit (conceptual — for the managed subdomain)

| Record | Status | Notes |
| --- | --- | --- |
| `A` / `AAAA` (`sus-wears.vercel.app`) | Safe/necessary | Vercel Anycast edge (intended), not a private origin |
| `CNAME` (if a custom domain is added later) | Safe/necessary | Must point to `cname.vercel-dns.com` / Vercel alias — never to an origin IP |
| `MX` | None | No email server at this domain; contact is a consumer Gmail inbox (not infra) |
| `TXT` (`_vercel`) | Safe/necessary | Domain verification, no origin info |
| Staging/dev subdomains | None configured | Vercel preview deployments use isolated random `.vercel.app` URLs, not production-named hosts |

If a custom domain is ever added: **never** create an `A` record pointing at a
private/origin IP on the public DNS. Use only the Vercel alias/CNAME and keep all
DNS at the Vercel apex so every request transits the edge.

---

## 4. Future-backend mandatory design (if a backend is introduced)

Required topology — the backend must sit **behind** the edge, never beside it:

```
Internet
   │
   ▼
CDN / WAF / Edge  (Vercel Firewall + Proxy)
   │   (only edge IPs are allowed to reach the origin)
   ▼
Private origin / API infrastructure
```

**Mandatory controls (non-negotiable):**
1. **Edge-only ingress:** the origin must accept traffic **only** from Vercel's
   edge (IP allow-list / private link / Vercel Functions). Reject all direct
   public traffic at the network layer.
2. **No public DNS records** for the backend. No `A`/`AAAA`/`CNAME` naming it.
3. **Private networking** where supported (private regions, VPC peering or
   `proxy` deployment that keeps function IPs private).
4. **Validate trusted edge forwarding:** trust `x-forwarded-for` / `x-vercel-*`
   only from the recognized edge; never from arbitrary clients.
5. **Never return internal hostnames/IPs** in responses, errors, or redirects.
6. **Runtime secrets are server-only env vars** (never `NEXT_PUBLIC_`, never
   inlined into the client bundle). Referenced only from Route Handlers / server
   modules.
7. **No API-base URL into the client bundle.** Clients go through the same edge
   origin (`/api/*` via the Proxy); any base URL is relative, so no absolute
   origin address ships.

The existing `src/lib/security` engine + `src/proxy.ts` are the pre-built seam
for a future `/api/*`: rate limiting, risk scoring, and secret-free logging all
apply at the edge before any backend call.

---

## 5. Automated regression checks (permanent invariant)

New tooling guards against a developer accidentally introducing a leak:

- **`scripts/check-origin-protection.mjs`** (CI / CLI)
  `npm run security:origin` — scans **shipped source** and the **built client
  bundle** (`.next/static`) for:
  - private IPv4 / IPv6 (loopback, link-local, RFC1918, ULA, doc ranges)
  - internal hostnames (`*.local`, `*.internal`, `*.corp`, `*.lan`)
  - hardcoded origin-flavoured API base URLs
  - filesystem paths (`C:\`, `/root/`, `/var/`, `/opt/`, `/home/<user>/`)
  - `sourceMappingURL` / shipped `.map` files
  - unexpected `NEXT_PUBLIC_*` vars (only `NEXT_PUBLIC_SITE_URL` and
    `NEXT_PUBLIC_WHATSAPP_NUMBER` are allowed)
  - secret-shaped env refs (`process.env.*_KEY`, `SECRET`, `TOKEN`, …)
- **`tests/security/origin-protection.test.ts`** (gated by `npm test`) — the same
  checks plus a detector **self-test** that proves the checker actually flags real
  leaks (private IP, internal hostname, secret env, filesystem path), so a
  "silently always-passing" detector cannot creep in.

**Expected failure mode:** if a developer adds `http://10.0.0.5/api`, `db.internal`,
`process.env.API_KEY`, a source map, or an unlisted `NEXT_PUBLIC_*`, `npm test` /
`npm run security:origin` fails with the exact `file:line`.
