# SUS WEARS — Backend Cleanup & Production Hardening Plan

**Approved audit:** `docs/superpowers/specs/2026-08-23-backend-audit.md`
**Scope:** Cleanup + hardening only. No new backend infrastructure.

---

## Phase 1: Production URL (P0)

**Goal:** Every URL in the app resolves to `https://sus-wears.vercel.app`, never localhost.

### 1a. Set env var in Vercel
- Run `cd /root/sus-wears && npx env add NEXT_PUBLIC_SITE_URL production https://sus-wears.vercel.app`
- This is a Vercel-side change — the code already reads `process.env.NEXT_PUBLIC_SITE_URL`

### 1b. Fix `sus-wears.example` in product OG metadata
- **File:** `src/app/product/[slug]/page.tsx:34`
- **Current:** `url: \`https://sus-wears.example/product/${product.slug}\``
- **Fix:** Use `SITE_URL` constant (add import of env, same pattern as layout.tsx)

### 1c. Verify no other localhost/example references
- `src/app/layout.tsx:8` — already reads env with localhost fallback (acceptable for dev)
- `src/app/sitemap.ts:3` — same pattern (acceptable)
- `src/app/robots.ts:3` — same pattern (acceptable)
- `src/playwright.config.ts:15` — test config, localhost correct

**Files modified:** `src/app/product/[slug]/page.tsx`
**Vercel action:** Set `NEXT_PUBLIC_SITE_URL` env var

---

## Phase 2: Remove Dead Neon/Concierge Code (P1)

**Goal:** Remove all references to the non-existent `/api/ai/neon` endpoint and unused flags.

### 2a. Clean `src/lib/integrations.ts`
- **Remove:** `AI_NEON` constant (lines 57-61)
- **Remove:** `getNeonAdminToken()` function (lines 64-69)
- **Remove:** `neonEnabled()` function (lines 71-73)
- **Remove:** `neonVisible()` function (lines 79-81)
- **Remove:** `NEXT_PUBLIC_AI_NEON` env var references
- **Remove:** `AI_ADMIN_TOKEN` references in this file (only used by Neon section)
- **Keep:** All WhatsApp and email integration code (lines 1-52)
- **Keep:** `AI_NEON` is NOT imported anywhere else (verified via grep)

### 2b. Clean `src/data/site.ts`
- **Remove:** `ACCOUNT_STATUS` export (line 19-22) — unreferenced anywhere
- **Keep:** `MARKET` (used by `src/lib/format.ts`)
- **Keep:** `SHIPPING_MESSAGE` (used by UI)

### 2c. Verify no consumers
- grep confirmed: `AI_NEON`, `neonEnabled`, `neonVisible`, `getNeonAdminToken` — zero imports outside integrations.ts
- grep confirmed: `ACCOUNT_STATUS` — zero imports outside site.ts

**Files modified:** `src/lib/integrations.ts`, `src/data/site.ts`

---

## Phase 3: Remove AI Image Generation Pipeline (P1)

**Goal:** Remove the only API route and its supporting infrastructure. It's a development tool with no production purpose.

### 3a. Delete the API route
- **Delete:** `src/app/api/ai/generate/route.ts`
- **Delete:** `src/app/api/` directory (will be empty)

### 3b. Delete AI library modules (7 files)
- **Delete:** `src/lib/ai/config.ts`
- **Delete:** `src/lib/ai/types.ts`
- **Delete:** `src/lib/ai/prompts.ts`
- **Delete:** `src/lib/ai/presets.ts`
- **Delete:** `src/lib/ai/imageGenerator.ts`
- **Delete:** `src/lib/ai/nvidia.ts`
- **Delete:** `src/lib/ai/assets.ts`
- **Delete:** `src/lib/ai/manifest.ts`
- **Delete:** `src/lib/ai/` directory

### 3c. Delete AI asset manifest
- **Delete:** `src/data/ai-assets.json` (flat-file registry, not used by any frontend)

### 3d. Delete AI CLI scripts
- **Delete:** `scripts/ai/` directory (generate.mjs, status.mjs, approve.mjs, assign.mjs, lib.mjs, specs/)

### 3e. Remove AI npm scripts from package.json
- **Remove:** `"ai:generate"`, `"ai:status"`, `"ai:approve"` scripts

### 3f. Verify no remaining imports
- grep confirmed: `from "@/lib/ai/` — only in route.ts (being deleted)
- grep confirmed: `from "server-only"` — only in AI lib files (being deleted)
- grep confirmed: `@google/genai` — only in imageGenerator.ts (being deleted)
- grep confirmed: `sharp` — only in AI assets.ts and imageGenerator.ts (being deleted)

### 3g. Preserve generated images
- **KEEP:** `public/images/ai/**` — these are the photos already in use on the site
- **KEEP:** `docs/ai-image-generation.md` — reference documentation

**Files deleted:** 1 API route, 8 lib files, 5 CLI scripts, 1 JSON manifest, 3 npm scripts
**Files preserved:** Generated images in public/images/ai/

---

## Phase 4: Security Headers (P1)

**Goal:** Add production security headers via `next.config.ts`.

### 4a. Add headers to next.config.ts
```ts
headers: async () => [
  {
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://*.vercel-static.com https://vercel.com",
          "font-src 'self'",
          "connect-src 'self' https://va.vercel-scripts.com",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ],
  },
],
```

### 4b. Skip HSTS
- Not adding Strict-Transport-Security — Vercel handles this at the edge for HTTPS domains
- Adding it manually can cause issues with preview deployments

### 4c. Verify headers don't break
- Build passes
- Images load (img-src allows vercel CDN)
- Fonts load (font-src self)
- WhatsApp links work (they open external app, not iframe)
- No inline scripts broken (unsafe-inline for dev compatibility)

**Files modified:** `next.config.ts`

---

## Phase 5: Dependency Cleanup (P2)

**Goal:** Remove unused dependencies after AI pipeline removal.

### 5a. Move @playwright/test to devDependencies
- Currently in `dependencies` — should be in `devDependencies`

### 5b. Remove unused dependencies
After AI pipeline removal, these are no longer imported anywhere:
- `@google/genai` — only imported by `src/lib/ai/imageGenerator.ts` (deleted)
- `sharp` — only imported by `src/lib/ai/assets.ts` and `imageGenerator.ts` (deleted)
- `server-only` — only imported by AI lib files (deleted)

### 5c. Verify no remaining imports
- After Phase 3 deletion, grep for each package in `src/` confirms zero imports
- Build must pass without these packages

### 5d. Run npm install to update lockfile

**Files modified:** `package.json`, `package-lock.json`

---

## Phase 6: Environment Variable Cleanup

**Goal:** Clean up env var references in code and configuration.

### 6a. Update `.env.local.example`
- Remove all AI-specific variables (GEMINI_API_KEY, NVIDIA_API_KEY, AI_ADMIN_TOKEN, AI_MODEL, AI_IMAGE_SIZE, AI_IMAGE_PROVIDER, NVIDIA_IMAGE_MODEL)
- Add production-required variables:
  - `NEXT_PUBLIC_SITE_URL=https://sus-wears.vercel.app`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER=2349070970886` (optional, has hardcoded fallback)
- Result: minimal example file showing only what production needs

### 6b. Clean env var references in code
- Remove `AI_ADMIN_TOKEN` references from `src/lib/integrations.ts` (part of Neon cleanup in Phase 2)
- `NEXT_PUBLIC_AI_NEON` — no longer referenced after Phase 2

### 6c. Vercel env var action (manual)
After code changes, these Vercel env vars should be reviewed/removed:
- `GEMINI_API_KEY` — no longer used by any code
- `NVIDIA_API_KEY` — no longer used by any code
- `AI_ADMIN_TOKEN` — no longer used by any code
- `AI_MODEL` — no longer used by any code
- `AI_IMAGE_SIZE` — no longer used by any code
- `AI_IMAGE_PROVIDER` — no longer used by any code
- `NVIDIA_IMAGE_MODEL` — no longer used by any code
- `NEXT_PUBLIC_AI_NEON` — no longer used by any code
- `NEXT_PUBLIC_SITE_URL` — **SET THIS** to `https://sus-wears.vercel.app`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — optional, keep or remove (hardcoded fallback exists)

**This is a manual Vercel dashboard action — code changes alone don't delete env vars.**

---

## Phase 7: Final Verification

**Goal:** Confirm everything works after cleanup.

### 7a. TypeScript
```bash
npx tsc --noEmit
```
Must pass clean.

### 7b. Tests
```bash
npx vitest run
```
Must pass (40/40 or more).

### 7c. Build
```bash
npx next build
```
Must produce clean build with expected routes.

### 7d. Security audit
- Grep for: API keys in source, secrets in client bundles, debug endpoints, localhost in production code
- Verify: no `@google/genai`, `sharp`, or `server-only` imports remain
- Verify: no `AI_NEON`, `neonEnabled`, `ACCOUNT_STATUS` references remain
- Verify: no `/api/ai/` route exists
- Verify: security headers in next.config.ts

### 7e. Route verification
After cleanup, expected routes:
```
○ /
○ /_not-found
○ /about
○ /cart
○ /checkout
○ /collections
● /collections/[slug]
ƒ /product/[slug]
○ /robots.txt
ƒ /shop
○ /sitemap.xml
```
**Zero API routes.** This is correct.

### 7f. Image verification
- All image references still resolve
- `public/images/ai/**` preserved
- No broken imports

---

## Commit Strategy

1. **Commit 1:** Phase 1 — Production URL fix
2. **Commit 2:** Phase 2 — Remove dead Neon/concierge code
3. **Commit 3:** Phase 3 — Remove AI image generation pipeline
4. **Commit 4:** Phase 4 — Security headers
5. **Commit 5:** Phase 5 — Dependency cleanup
6. **Commit 6:** Phase 6 — Environment variable cleanup
7. **Commit 7:** Phase 7 — Final verification (if any fixes needed)

Each commit is atomic and independently verifiable.

---

## What This Plan Does NOT Do

- Does NOT add a database
- Does NOT add authentication
- Does NOT add payment processing
- Does NOT add email sending
- Does NOT add admin dashboard
- Does NOT add CMS
- Does NOT add webhooks
- Does NOT add server actions
- Does NOT add middleware
- Does NOT change the cart/checkout architecture
- Does NOT change the WhatsApp integration
- Does NOT change the product data architecture
- Does NOT build new features

**This is cleanup and hardening only.**
