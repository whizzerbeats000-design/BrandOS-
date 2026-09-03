# SUS WEARS — Checkout & Payment Boundary

Status: **Design intent** — client-side commerce is live; online payment is not yet wired.
This document defines the seam a future payment provider plugs into, and the rules that
keep the client honest. No backend, database, or payment infrastructure is built here.

---

## 1. Where checkout currently stands

The bag is a **client-side, localStorage-only** ledger:

- `src/lib/bagCore.ts` — pure bag domain logic (composite line identity, merge, normalise).
- `src/lib/bag.ts` — localStorage persistence + cross-tab live-update event.
- `src/lib/checkout.ts` — `startCheckout(bag)` is the **honest pre-launch order
  hand-off**: it renders the bag into a customer message and opens the brand's real
  ordering path (WhatsApp by default, email fallback). It does **not** perform or
  imply a payment.
- `src/app/checkout/page.tsx` — pre-launch checkout placeholder: redirects to the
  cart's "Contact to order" flow so there is a single, honest path. The route is
  preserved for a future real checkout.

There is intentionally **no payment provider call today**. `startCheckout` never
pretends a sale occurred; the WhatsApp/email message is a *selection summary* the
atelier re-confirms for price and availability before any sale is final.

---

## 2. What the checkout layer expects

A checkout order is derived entirely from the bag, never from free-form client input:

| Field | Source | Notes |
| --- | --- | --- |
| `productId` | bag line | resolved against `PRODUCTS` |
| `variantId` | bag line | must resolve to a real variant |
| `quantity` | bag line | integer in `[1, MAX_QTY]` (normalised) |
| unit price | **server data** | resolved from the variant, **never** the client |
| line total / grand total | **computed on the server** | never trusted from the client |
| currency | server product data | ISO 4217, e.g. `NGN` |

The client only contributes **WHO** they are buying **WHAT** (product+variant+quantity).
It never contributes **how much it costs** or **whether it is available**.

---

## 3. Where validation belongs

- **Shape/sanity** (identity, quantity range, no dupes): client-side via `bagCore`
  (already implemented). This is UX hardening, not security.
- **Integrity** (variant exists, is purchasable, catalogue is consistent): the catalogue
  validator (`src/lib/catalogueSchema.ts`) — enforced at build/test time.
- **Authority** (price is correct, inventory exists, payment authorised): **server-side**,
  at the moment a real order is placed. This is the security boundary.

Rule of thumb: the client may validate **ergonomics**; the server must validate
**economics and entitlement**.

---

## 4. What must never be trusted from the client

The client contributes only **WHO** is buying **WHAT** (product + variant + quantity
as a *selection signal*). Everything else is recomputed server-side:

- **Prices and totals are never trusted from the client.** A malicious or stale client
  can report any subtotal. The server recomputes totals from its own product/variant table.
- **Quantities are never trusted as authoritative.** The client-supplied quantity is a
  request, validated and capped server-side (`[1, MAX_QTY]`) at order time — not an
  assertion of what will be sold.
- **Availability / inventory** — the client displaying "in stock" is a sales aid, not a
  guarantee. Stock is reserved/verified server-side at order time.
- **Variant identity is safe to trust for *selection*, but not for *pricing*.** The client
  names a sku/variant; the server prices it.
- **Order status / confirmation** — only the server (via the provider webhook) may mark
  an order paid.

Hard rule: **no payment gateway integration may accept a client-supplied amount or
total.** The amount charged must come from the server's own recomputed total — never
from `bag`, `localStorage`, a request body field, or any client-owned state.

---

## 5. How prices will be verified

1. Server looks up each `variantId` in its own `PRODUCTS` data.
2. Server multiplies unit price × quantity (capped at `MAX_QTY`).
3. Server applies shipping/duties and any discounts it owns.
4. The client-rendered total is ignored; the authoritative total is the server's.

---

## 6. How inventory will be verified

1. At order time the server re-reads current inventory for each resolved variant
   (not the client's last-seen number).
2. If any line is over-available or sold-out, the order is rejected or that line dropped
   — before any payment is taken.
3. Stock is **reserved** on successful payment intent and **released** on failure/timeout,
   so a hung checkout cannot double-sell.

---

## 7. Where the payment provider integration enters

Provider integration sits **behind** `startCheckout`. The seam is that function (or a
route it calls). The provider never renders in the client bundle as a payment authority;
it is a server-side dependency.

Recommended wiring when a provider is chosen:

```
CartPage → startCheckout(bag)           (existing call site)
                  │
        ┌─────────▼─────────┐
        │  SERVER endpoint  │  recomputes totals & inventory,
        │  "create order"   │  returns an opaque order reference
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  Provider (PayStack│  charge, return redirect URL / reference
        │  / Flutterwave / …)
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  Provider webhook  │  only party that marks order paid;
        │  → order confirmed │  client redirect is never trusted
        └────────────────────┘
```

A Nigeria-based provider (PayStack / Flutterwave) fits the `NGN` market data already in
place (`src/data/site`, `src/lib/format.ts`).

---

## 8. What stays client-only (acceptable for current scope)

- Bag persistence and live count.
- Recently-viewed.
- Bag review + WhatsApp/email order hand-off.

None of these represent a financial commitment. If a WhatsApp order is used, the client
sends the **selection**, and the store still confirms price + availability manually — the
same server-authority rule, just human.

---

## 9. Non-goals

- No credit-card data is ever handled by the client.
- No prices are finalised client-side.
- No order is marked paid except by a server-verified webhook.
