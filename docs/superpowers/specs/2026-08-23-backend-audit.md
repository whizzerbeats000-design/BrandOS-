# SUS WEARS — Backend Production Readiness Audit

**Date:** 2026-08-23
**Status:** Investigation only — no changes made

---

## 1. BACKEND INVENTORY

| SYSTEM | LOCATION | STATE | PRODUCTION VALUE | RECOMMENDATION |
|---|---|---|---|---|
| AI Image Generation API | `src/app/api/ai/generate/route.ts` | WORKING (quota exhausted) | LOW | DISABLE |
| AI lib (7 modules) | `src/lib/ai/*.ts` | WORKING | LOW | DISABLE with API route |
| Admin CLI | `scripts/ai/*.mjs` | WORKING | LOW | KEEP (tooling) |
| Cart (localStorage) | `src/lib/bag.ts` | WORKING | MEDIUM | KEEP |
| Cart Hydration | `src/lib/bagMeta.ts` | WORKING | MEDIUM | KEEP |
| Cart Hook | `src/hooks/useBagCount.ts` | WORKING | MEDIUM | KEEP |
| Checkout Stub | `src/lib/checkout.ts` | STUB (always false) | LOW | KEEP |
| Price Formatter | `src/lib/format.ts` | WORKING | MEDIUM | KEEP |
| WhatsApp Builder | `src/lib/integrations.ts` | WORKING | HIGH | KEEP |
| Neon AI Concierge | `src/lib/integrations.ts` | DEAD (route doesn't exist) | NONE | REMOVE |
| Catalogue Query | `src/lib/catalogue.ts` | WORKING (empty data) | HIGH | KEEP |
| Collection Utils | `src/lib/collections.ts` | WORKING (empty data) | HIGH | KEEP |
| Variant Utils | `src/lib/variant.ts` | WORKING | HIGH | KEEP |
| Recently Viewed | `src/lib/recently.ts` | WORKING | LOW | KEEP |
| Search | `src/data/search.ts` | WORKING (empty index) | MEDIUM | KEEP |
| Motion/CN utils | `src/lib/motion.ts`, `cn.ts` | WORKING | LOW | KEEP |
| **Database** | NONE | ABSENT | — | See §18 |
| **Auth** | NONE | ABSENT | — | See §8 |
| **Payments** | NONE | ABSENT | — | See §7 |
| **Email Sending** | NONE | ABSENT | — | See §12 |
| **Middleware** | NONE | ABSENT | — | Not needed |
| **Server Actions** | NONE | ABSENT | — | Not needed |
| **Webhooks** | NONE | ABSENT | — | Not needed |
| **Cron Jobs** | NONE | ABSENT | — | Not needed |

---

## 2. BACKEND SYSTEM MAP

- **1 API route** (AI image generation, admin-only)
- **0 databases**
- **0 auth systems**
- **0 payment integrations**
- **0 email systems**
- **0 server actions**
- **0 middleware**
- **0 webhooks**
- **0 cron jobs**

The entire "backend" is a static Next.js site with one admin tool endpoint.

---

## 3. API AUDIT

### `/api/ai/generate` — POST (the ONLY endpoint)

| Attribute | Detail |
|---|---|
| Authentication | Shared-secret header `x-ai-admin-token` |
| Request validation | Manual enum validation (categories, presets, genders, etc.) |
| Response format | `{ ok: boolean, results: Array<{url?, error?}> }` |
| Frontend consumer | **NONE** — only called by admin CLI |
| External deps | Google GenAI SDK OR NVIDIA NIM REST API |
| Error handling | Good — structured JSON for every failure path |
| Rate limiting | In-memory per-IP: 10 req/min (flawed — unbounded Map, spoofable, ineffective serverless) |
| Production usefulness | LOW — internal image pipeline tool |

**Issues:** Non-constant-time token comparison, unbounded rate-limit Map, spoofable x-forwarded-for, error.message leakage in 500s, filesystem writes (won't work serverless), no health-check endpoint.

### Dead Endpoints

| Endpoint | Status |
|---|---|
| `/api/ai/neon` | REFERENCED in `integrations.ts` but DOES NOT EXIST |

---

## 4. DATABASE AUDIT

**No database exists.** Zero database packages. No Prisma, Drizzle, Supabase, Firebase, SQLite, MySQL, MongoDB.

**Current data persistence:**

| Data | Storage |
|---|---|
| Products/Collections/Content | TypeScript constants in `src/data/*.ts` (compiled to bundle) |
| Cart | Browser localStorage `sus:bag` |
| Recently Viewed | Browser localStorage `sus:recently-viewed` |
| AI Asset Registry | Flat JSON file `src/data/ai-assets.json` |
| AI Images | Files in `public/images/ai/**` |

---

## 5. PRODUCT/CATALOG BACKEND

Products are **TypeScript constants** compiled into the JS bundle. No CMS, no API, no database.

**Current state:** All product arrays are empty (post-Production Truth Audit).

**What happens with no products:** Shop renders empty state, search returns nothing, cart resolves nothing, collections are empty. **The site functions correctly** — it honestly shows empty states.

**Recommendation:** Do not introduce a database for products yet. No real products exist. The existing TS architecture handles dozens of products. A database becomes justified when: products need non-developer updates, multiple people manage inventory, or orders need server-side tracking.

---

## 6. CART / CHECKOUT

### Cart
- **Storage:** `localStorage` key `sus:bag`
- **Shape:** `Array<{ productId, variantId, quantity }>`
- **Persists:** Yes (refresh yes, device no)
- **Inventory checked:** No
- **Client-manipulable:** Yes (expected for localStorage)

### Checkout
- **Backend:** No — `startCheckout()` always returns `ok: false, "Checkout opens in a later phase"`
- **Orders created:** No
- **Payment gateway:** None
- **Current UX:** "Coming soon" with WhatsApp/email fallback

**Verdict:** Functionally honest. The bag works as a wishlist/order-form for WhatsApp/email ordering.

---

## 7. PAYMENT AUDIT

**Payments: ABSENT.** No Paystack, Flutterwave, Stripe, bank transfer, webhooks, transactions, or payment SDKs.

Appropriate — checkout honestly says "Coming soon." Do not build until real products and fulfillment process exist.

---

## 8. AUTHENTICATION / CUSTOMER ACCOUNTS

**Authentication: ABSENT.** No login, registration, passwords, OAuth, sessions, cookies, JWT, or auth libraries.

**Do we need accounts on day one?** No. The brand takes orders via WhatsApp/email. Accounts add friction and liability with no current benefit.

---

## 9. ADMIN / CMS

**Admin: ABSENT.** No dashboard, CMS, product/order/customer management, or auth-protected admin routes.

The only "admin" is the `AI_ADMIN_TOKEN` shared-secret on the image generation endpoint — a developer CLI tool, not a business admin interface.

**Minimum admin for launch:** Zero. No products to manage, orders taken manually, no inventory to track.

---

## 10. AI INFRASTRUCTURE

| Component | Status |
|---|---|
| Image generation pipeline | Built, functional, quota-exhausted on Gemini |
| Image approval workflow | Functional (CLI approve/reject) |
| Asset manifest | Functional (flat JSON) |
| AI concierge "Neon" | DEAD — no route, no consumer |
| Rate limiting | Present but flawed |

**Recommendation:** DISABLE. The pipeline generated the site's photography during development. Images are already in use. The pipeline served its purpose.

---

## 11. IMAGE STORAGE / MEDIA

Static files in `public/images/` via Next.js Image optimization + Vercel CDN. ~300+ files.

**Sufficient for launch.** No uploads needed until real product photography arrives. When that happens: Vercel Blob Storage or Cloudinary free tier.

---

## 12. EMAIL / NEWSLETTER

**Email sending: ABSENT.** No email provider, no subscription endpoint, no API keys. Only `mailto:` links to `suswears469@gmail.com`.

**Recommendation:** Do not build email infrastructure. WhatsApp-based ordering doesn't need it.

---

## 13. WHATSAPP

**WORKING via `wa.me` deep links.** Number: `2349070970886` (E.164). Zero cost, zero infrastructure, zero maintenance. Centralized in `buildWhatsAppUrl()`. Perfect for personal-order fashion brand.

**Recommendation:** KEEP as-is.

---

## 14. SECURITY AUDIT

| Issue | Severity |
|---|---|
| Non-constant-time token comparison | LOW |
| Spoofable rate-limit key (x-forwarded-for) | LOW |
| Unbounded rate-limit Map | LOW |
| Error message leakage in 500s | LOW |
| Filesystem writes at runtime | MEDIUM |
| No security headers in next.config | LOW |

**No secrets in source code.** All sensitive values in `.env.local` (gitignored).

**Overall posture:** Acceptable. The only API endpoint is admin-only. The site is mostly static.

---

## 15. ENVIRONMENT VARIABLES

| Variable | Purpose | Required | Status |
|---|---|---|---|
| `GEMINI_API_KEY` | Gemini API auth | No | Quota exhausted |
| `NVIDIA_API_KEY` | NVIDIA NIM auth | No | Available |
| `AI_ADMIN_TOKEN` | Admin token for AI route | No (503 without) | Set |
| `AI_MODEL` | Gemini model override | No (has default) | Set |
| `AI_IMAGE_SIZE` | Image size override | No (has default) | Set |
| `AI_IMAGE_PROVIDER` | Provider selection | No (has default) | Set |
| `NVIDIA_IMAGE_MODEL` | NVIDIA model override | No (has default) | Set |
| `VERCEL_OIDC_TOKEN` | Vercel deployment | No | Set |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO/sitemap | No (localhost fallback) | **NOT SET** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp override | No (hardcoded fallback) | **NOT SET** |
| `NEXT_PUBLIC_AI_NEON` | Neon concierge toggle | No (dead feature) | **NOT SET** |

**Issues:** `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` in production — should be set to `https://sus-wears.vercel.app`. All AI vars are unnecessary if AI pipeline is disabled.

---

## 16. DEPENDENCY AUDIT

### Runtime Dependencies
| Package | Used | Purpose |
|---|---|---|
| `next` 16.3.0 | Yes | Framework |
| `react` 19.2.8 | Yes | UI |
| `react-dom` 19.2.8 | Yes | UI |
| `@google/genai` 2.17.1 | Only by AI route | Gemini SDK |
| `sharp` 0.35.3 | Only by AI route | Image optimization |
| `server-only` 0.0.1 | Only by AI lib | Build-time guard |
| `@playwright/test` 1.62.1 | **Misplaced** | Should be devDependency |

### Recommendation
- Move `@playwright/test` to devDependencies
- `@google/genai`, `sharp`, `server-only` can be removed if AI pipeline is disabled
- No duplicate or unnecessary backend dependencies

---

## 17. PERFORMANCE / SCALABILITY

| Aspect | Assessment |
|---|---|
| API response patterns | Single synchronous endpoint, generates images inline |
| Caching | None needed — site is static |
| Database queries | None — no database |
| Image delivery | Vercel CDN + Next.js Image optimization — excellent |
| Serverless limitations | AI route writes to filesystem (won't work serverless) |
| Cold starts | Minimal — mostly static site |
| AI generation cost | Quota-based, token-gated, rate-limited |

**Architecture is appropriate for current scale.** No optimization needed.

---

## 18. PRODUCTION ARCHITECTURE RECOMMENDATION

### A. MINIMUM VIABLE PRODUCTION (Current State)

**Components:**
- Static Next.js site on Vercel
- TypeScript data modules (empty arrays for now)
- localStorage cart
- WhatsApp/email ordering
- Vercel CDN for images

**Cost:** $0 (Vercel free tier)
**Complexity:** Minimal
**Enables:** Honest storefront, brand presence, customer contact
**Does NOT include:** Products, payments, accounts, admin

### B. RECOMMENDED PRODUCTION (When Real Products Arrive)

**Add:**
- Real product data in `src/data/catalogue.ts` (static TS — sufficient for dozens of products)
- `NEXT_PUBLIC_SITE_URL` env var set
- Security headers in `next.config.ts`
- Remove dead AI pipeline code

**Cost:** $0 additional
**Complexity:** Low
**Enables:** Full product browsing, bag-to-WhatsApp ordering, SEO

### C. FUTURE SCALE (When Business Demands)

**Add when justified:**
- Payment gateway (Paystack — best for Nigeria)
- Database (only if products need non-developer updates or order tracking)
- Admin dashboard (only if multiple people manage content)
- Email service (only if order confirmations needed)
- Customer accounts (only if order tracking needed)

**Cost:** Variable
**Complexity:** Moderate
**Enables:** Self-service checkout, order management, inventory tracking

---

## 19. WHAT SHOULD BE REMOVED / KEPT / FIXED

### SAFE TO REMOVE
| Item | Why | Dependencies | Impact |
|---|---|---|---|
| Neon AI concierge refs | Route doesn't exist, nothing imports it | `AI_NEON`, `neonEnabled`, `neonVisible`, `getNeonAdminToken` in integrations.ts | Zero |
| `ACCOUNT_STATUS` in site.ts | Unreferenced dead flag | Nothing imports it | Zero |
| `src/data/images.ts` | Placeholder SVG references, already deleted | Foundation page (deleted) | Zero |
| AI env vars (if pipeline disabled) | Not needed | API route, AI lib | Zero if route removed |

### KEEP
| Item | Why |
|---|---|
| Cart (localStorage) | Honest wishlist/order-form for WhatsApp ordering |
| Checkout stub | Honestly tells users checkout isn't ready |
| WhatsApp deep links | Primary contact channel, zero cost |
| Catalogue/collection/variant utils | Ready for real products |
| Search infrastructure | Ready for real products |
| Price formatter | Ready for real products |
| All AI generated images | Already in use, already generated |

### FIX
| Item | Issue | Fix |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Defaults to localhost in production | Set to `https://sus-wears.vercel.app` |
| Security headers | None configured | Add to next.config.ts |
| `@playwright/test` | In dependencies, not devDependencies | Move to devDependencies |

### DISABLE
| Item | Why |
|---|---|
| `/api/ai/generate` route | Internal tool, quota exhausted, filesystem writes fail serverless |
| AI lib modules (7 files) | Only used by disabled route |
| AI CLI scripts | Only used with disabled route |

### FUTURE
| Item | When |
|---|---|
| Payment gateway | When real products + checkout ready |
| Database | When products need non-developer updates |
| Admin dashboard | When multiple people manage content |
| Email service | When order confirmations needed |
| Customer accounts | When order tracking needed |

### NEEDS HUMAN DECISION
| Item | Question |
|---|---|
| AI pipeline deletion vs disable | Should the code be deleted or just disabled? |
| `NEXT_PUBLIC_SITE_URL` | Confirm `https://sus-wears.vercel.app` is correct |
| WhatsApp number | Confirm `2349070970886` is correct and active |

---

## 20. FINAL BACKEND VERDICT

### CURRENT BACKEND MATURITY:
**Prototype / Marketing Site** — not a production e-commerce backend. This is a static site with one admin tool endpoint.

### WHAT ACTUALLY WORKS:
- Static page rendering on Vercel (excellent)
- Image optimization pipeline (Next.js + Vercel CDN)
- localStorage cart with cross-tab sync
- WhatsApp/email deep links
- Client-side search and filtering (ready for data)
- AI image generation pipeline (functional but quota-exhausted)

### WHAT IS BROKEN:
- `NEXT_PUBLIC_SITE_URL` defaults to localhost in production
- No security headers
- AI rate limiter is flawed (in-memory, unbounded, spoofable)
- AI route writes to filesystem (fails serverless)
- `@playwright/test` misplaced in dependencies

### WHAT IS FAKE/DEMO:
- **Nothing** — the Production Truth Audit already removed all fake data

### WHAT IS UNUSED:
- AI image generation API route (not called by any frontend)
- AI lib modules (only called by unused route)
- Neon AI concierge references (dead code)
- `ACCOUNT_STATUS` flag (unreferenced)

### WHAT IS MISSING:
- Real product data (arrays are intentionally empty)
- Security headers
- `NEXT_PUBLIC_SITE_URL` production value

### WHAT SUS WEARS NEEDS FOR LAUNCH:
1. Set `NEXT_PUBLIC_SITE_URL=https://sus-wears.vercel.app`
2. Remove dead Neon/concierge references
3. Remove or disable AI pipeline (optional but recommended)
4. Add basic security headers
5. That's it.

### WHAT SHOULD NOT BE BUILT YET:
- Payment infrastructure
- Database
- Authentication
- Admin dashboard
- Newsletter/email system
- Order management
- Customer accounts
- WhatsApp Business API

### TOP 5 PRIORITIES:
1. Set `NEXT_PUBLIC_SITE_URL` env var in Vercel
2. Clean dead code (Neon refs, ACCOUNT_STATUS)
3. Disable or remove AI pipeline
4. Add security headers to next.config.ts
5. Move `@playwright/test` to devDependencies

### RECOMMENDED ARCHITECTURE:
**Static Next.js on Vercel + localStorage cart + WhatsApp ordering.** This is the simplest architecture that allows SUS WEARS to operate honestly in production. It costs $0, requires no maintenance, and accurately represents a pre-launch fashion brand that takes personal orders.

The backend should grow only when the business demands it — not because "e-commerce sites normally have databases."
