# SUS WEARS — Future Commerce Security Boundary (Phase 9)

This documents the **security controls that MUST exist before** auth, product/cart
APIs, checkout, payment webhooks, admin routes, provider integrations, or customer
accounts go live. It is a boundary definition + reusable utilities — **no fake
payment/auth infrastructure is built here.**

Build-time safety is already enforced (see `docs/COMMERCE-CHECKOUT-BOUNDARY.md`): prices
and availability are server-authoritative. The pre-launch checkout hand-off
(`startCheckout`) only produces a contact-to-order message and never pretends a sale
occurred; `/checkout` redirects to the cart's honest ordering path.

---

## 1. Principles

1. **Server-authoritative economics.** The client names *who* + *what* (product/variant/
   quantity); the server never trusts client prices/totals/inventory/order-status.
2. **Payment webhooks are the only authority** for marking an order paid. The client
   redirect is never trusted.
3. **Every future surface** (auth, cart, checkout, webhook, admin) passes through the
   `src/lib/security` engine (rate limit + risk + logging) and strict per-surface
   validation.
4. **Never log secrets** (tokens, payment data, cookies, raw IPs, bodies).

---

## 2. Surface-by-surface controls

| Surface | Auth | Validation | Rate limit | Notes |
| --- | --- | --- | --- | --- |
| `GET /api/products` | none (public) | server catalogue | api (120/60s) | never expose internal SKU slack |
| `POST /api/cart` | none | shape-sanity, quantity `[1,MAX_QTY]` | api | no prices from client |
| `POST /api/auth/register`, `/api/auth/login` | — | strong, email verification | **auth 10/60s + persistent deny** | brute-force; CSRF token |
| `POST /api/checkout` | session/account | server-side totals + inventory | **checkout 20/60s** | idempotency key per order |
| `POST /api/webhook/payment` | **signature/HMAC only** | replay check | not IP-limited | provider-signed |
| `/admin/**` | **server-side RBAC session** | every handler re-auths | strict | never blocked by UA alone |
| `/api/account/**` | session | — | api | — |

---

## 3. Payment-webhook integrity (required before live)

1. **Signature verification** — validate the provider-signed payload (PayStack HMAC /
   Flutterwave sig) with a server-side secret **before any business logic**.
2. **Replay protection** — reject duplicate `event.id`/`reference` outside a short
   idempotency window (KV-backed seen-set).
3. **No IP-based denial** — providers call from changing IPs; rely on signature, not IP.
4. **Idempotency** — every create-order/charge carries a client-generated idempotency
   key so retries do not double-charge.
5. **Totals recomputation** — recompute order totals from the server's own product table
   at charge time; ignore client-reported totals.

---

## 4. Reusable, safe utilities (provided now, wired later)

- `src/lib/security/ratelimit.ts` — `RateLimiter` + `RateLimitStore` (plug a KV store
  for distribution).
- `src/lib/security/logger.ts` — secret-free structured `SecurityLogger`.
- `src/lib/security/rules.ts` + `signals.ts` — detection + risk scoring + safe client-id.
- `src/lib/security/respond.ts` — generic, opaque block/throttle responses.

Add (not yet present): a signed-webhook verifier and a session RBAC helper, **only when
the corresponding backend exists**.

---

## 5. Environment-secret hygiene (current)

- `.env.local` is gitignored; only `NEXT_PUBLIC_*` values are build-time public.
- No runtime secrets are used today. When a provider secret is added, it must be a
  **server-only** env var (`PAYSTACK_SECRET_KEY`), never `NEXT_PUBLIC_`, and referenced
  only from server modules / Route Handlers — never from the client bundle.
