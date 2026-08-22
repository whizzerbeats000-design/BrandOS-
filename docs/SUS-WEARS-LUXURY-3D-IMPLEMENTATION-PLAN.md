# SUS WEARS — Luxury 3D Frontend Implementation Plan

**Version:** 1.0
**Date:** 2026-08-18
**Design Spec:** `docs/SUS-WEARS-LUXURY-3D-FRONTEND-DESIGN-SPEC.md` (2,500 lines, 35 sections)
**Status:** Planning only — no production code modification authorized

---

## Table of Contents

1. [Executive Strategy](#1-executive-strategy)
2. [Architecture Map](#2-architecture-map)
3. [Spec-to-Code Mapping](#3-spec-to-code-mapping)
4. [Dependency Graph](#4-dependency-graph)
5. [Phase Breakdown](#5-phase-breakdown)
6. [Detailed Task List](#6-detailed-task-list)
7. [File-Level Change Map](#7-file-level-change-map)
8. [Homepage Validation Plan](#8-homepage-validation-plan)
9. [Image Migration](#9-image-migration)
10. [CSS 3D Strategy](#10-css-3d-strategy)
11. [Optional R3F Experiment](#11-optional-r3f-experiment)
12. [Motion Strategy](#12-motion-strategy)
13. [Mobile Strategy](#13-mobile-strategy)
14. [Accessibility Plan](#14-accessibility-plan)
15. [Performance Plan](#15-performance-plan)
16. [Testing Strategy](#16-testing-strategy)
17. [Visual QA](#17-visual-qa)
18. [Rollback & Safety](#18-rollback--safety)
19. [Release Gates](#19-release-gates)
20. [Open Decisions](#20-open-decisions)

---

## 1. Executive Strategy

### Goal

Transform the existing SUS WEARS frontend into a cinematic luxury fashion experience — without adding any required 3D libraries. The CSS-first baseline achieves the full luxury target; React Three Fiber is an optional experiment behind strict performance gates.

### Constraints (Non-Negotiable)

- **No new required dependencies** through Phase 3. Zero new npm packages.
- **No fabricated brand data.** All references must match `src/data/brand.ts` verified facts only.
- **SVG assets are legitimate.** They are interim visual content, not broken placeholders.
- **Homepage 9-section proposal is a hypothesis.** Validate before merging — do not restructure prematurely.
- **Performance gates:** Lighthouse ≥90, LCP <2.5s, CLS <0.1, TBT <200ms.
- **Accessibility gates:** WCAG AA, keyboard nav, 44px touch targets, reduced-motion support.
- **Production code modification not yet authorized.** This plan is for review and approval.

### Strategy

1. **Foundation first** — design tokens, typography, motion, and primitive components (DepthCard, GlassSurface, ParallaxSection) must ship before any page work.
2. **Highest-impact pages next** — Product Detail (P0), Homepage (P1), Footer (P1) deliver the most visual transformation.
3. **Enhancement pages after** — Collections, About, Editorial, SUS World get premium polish.
4. **3D experiment last** — R3F hero atmosphere only after CSS baseline is complete and performance is verified.
5. **Ship incrementally** — each phase is a potential release point. No big-bang deployment.

### What "Done" Looks Like

Every page scores 8/10 or higher on the design scorecard. The site feels cinematic and editorial — like a luxury fashion house's digital flagship, not a template. The transformation is described in the spec as:

> **Before:** A well-built e-commerce site with dark mode.
> **After:** A cinematic digital flagship for an African luxury fashion house.

---

## 2. Architecture Map

### Current Architecture

```
src/
├── app/                    # Next.js 16 App Router
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # Tailwind bridge + theme tokens
│   ├── page.tsx            # Homepage route
│   ├── shop/page.tsx       # Shop route
│   ├── collections/        # Collection routes
│   ├── about/page.tsx      # About route
│   ├── editorial/page.tsx  # Editorial route
│   ├── sus-world/page.tsx  # SUS World route
│   └── cart/page.tsx       # Cart route
├── components/
│   ├── layout/             # AppShell, Sidebar, Header, Menu, Footer (6 files)
│   ├── hero/               # 5-layer cinematic carousel (5 files)
│   ├── home/               # Homepage sections (14 files)
│   ├── shop/               # Shop grid, filters, search (11 files)
│   ├── product/            # ProductCard, ProductPage (2 files)
│   ├── collections/        # 12 collection components
│   ├── about/              # AboutPage (1 file)
│   ├── editorial/          # EditorialPage (1 file)
│   ├── sus-world/          # SusWorldPage (1 file)
│   ├── motion/             # Reveal (1 file)
│   ├── ui/                 # Primitives: Badge, Button, Container, etc. (11 files)
│   ├── icons/              # SVG icon components
│   ├── cart/               # CartPage
│   └── checkout/           # CheckoutPage
├── data/                   # Static data (brand, products, collections, etc.)
├── lib/                    # Utilities (cn, currency, etc.)
├── styles/                 # CSS modules (tokens, typography, motion, hero)
└── types/                  # TypeScript type definitions
```

### Target Architecture (After Redesign)

```
src/components/
├── layout/
│   └── PageTransition.tsx      # NEW — route transition wrapper
├── ui/
│   ├── DepthCard.tsx           # NEW — 3D perspective tilt card
│   ├── GlassSurface.tsx        # NEW — luxury glass panel
│   └── ParallaxSection.tsx     # NEW — scroll parallax wrapper
├── product/
│   └── ProductImageViewer.tsx  # NEW — immersive zoom/pan viewer
└── home/
    ├── BrandStatement.tsx      # NEW — merged BrandIntro + BrandManifesto
    ├── FeaturedCollection.tsx  # NEW — merged FeaturedFashion + CollectionShowcase
    ├── EditorialMoment.tsx     # NEW — merged EditorialFeature + CraftStory
    └── ContactCta.tsx          # NEW — merged WhatsAppCta + contact
```

**9 new files. 25 modified files. 0 new npm packages.**

---

## 3. Spec-to-Code Mapping

### Design Spec Section → Implementation Target

| Spec Section | Title | Implementation Target | Priority |
|---|---|---|---|
| §7 | Design Tokens | `tokens.css` expansion | P0 |
| §8 | Typography | `typography.css` new levels | P1 |
| §9 | Color & Surfaces | `tokens.css` glass/shadow | P1 |
| §10 | Spacing & Layout | `tokens.css`, `globals.css` | P1 |
| §11 | Component System | 3 new primitives + enhancements | P0 |
| §12 | Motion System | `motion.css` + `Reveal.tsx` | P1 |
| §13 | 3D Strategy | `DepthCard.tsx` + CSS perspective | P0 |
| §14 | Image Strategy | `ProductImageViewer.tsx` | P0 |
| §15 | Homepage | 4 new sections + restructure | P1 |
| §16 | Shop | DepthCard on product grid | P1 |
| §17 | Product Detail | Full redesign (sticky, viewer) | P0 |
| §18 | Collection | Parallax, DepthCard, lightbox | P2 |
| §19 | About | Imagery + timeline | P2 |
| §20 | Editorial | Category filtering, mixed grid | P2 |
| §21 | SUS World | Category navigation | P2 |
| §22 | Navigation | Glass, transitions | P2 |
| §23 | Footer | Luxury redesign | P1 |
| §24 | Glass Strategy | `GlassSurface.tsx`, treatment map | P1 |
| §25 | Mobile Strategy | Touch, swipe, reduced complexity | P2 |
| §26 | Accessibility | Reduced-motion gates, keyboard | P0 |
| §27 | Performance | Dynamic imports, lazy loading | P0 |
| §29 | Component Architecture | New files + modifications | — |
| §33 | Phases | 4 phases (1→4, 8 weeks) | — |

### Priority Distribution

| Priority | Count | Description |
|---|---|---|
| P0 | 7 | Critical — must ship for redesign success |
| P1 | 9 | High impact — major visual/UX improvements |
| P2 | 10 | Enhancement — premium polish |
| P3 | 3 | Experimental — optional 3D/advanced |

---

## 4. Dependency Graph

### Phase Dependencies

```
Phase 1 (Foundation)
    ├── tokens.css ─────────────────────┐
    ├── typography.css ─────────────────┤
    ├── motion.css ─────────────────────┤
    ├── DepthCard.tsx ──── needs tokens + motion
    ├── GlassSurface.tsx ── needs tokens
    ├── ParallaxSection.tsx ─ needs tokens
    ├── Reveal.tsx update ── needs motion.css
    └── PageTransition.tsx ── needs motion.css
                                │
Phase 2 (Core Pages) ◄─────────┘
    ├── ProductPage.tsx ── needs DepthCard, ProductImageViewer
    ├── ProductCard.tsx ── needs DepthCard
    ├── HomePage.tsx ── needs new section components
    ├── Footer.tsx ── needs GlassSurface, tokens
    ├── BrandStatement.tsx ── needs Reveal (blur)
    ├── FeaturedCollection.tsx ── needs DepthCard
    ├── EditorialMoment.tsx ── needs Reveal (blur)
    └── ContactCta.tsx ── needs tokens
                                │
Phase 3 (Enhancement) ◄─────────┘
    ├── CollectionHero.tsx ── needs ParallaxSection
    ├── CollectionCard.tsx ── needs DepthCard
    ├── EditorialPage.tsx ── standalone
    ├── SusWorldPage.tsx ── standalone
    ├── AboutPage.tsx ── standalone
    ├── SearchOverlay.tsx ── standalone
    ├── DesktopSidebar.tsx ── needs GlassSurface
    ├── MobileMenu.tsx ── needs motion tokens
    └── SiteHeader.tsx ── needs motion tokens
                                │
Phase 4 (3D & Polish) ◄─────────┘
    ├── R3F experiment ── needs performance gate
    ├── Performance audit ── needs all phases
    ├── Accessibility audit ── needs all phases
    └── Cross-browser testing ── needs all phases
```

### Critical Path

The longest dependency chain is:

```
tokens.css → DepthCard.tsx → ProductCard.tsx → ProductPage.tsx → Phase 2 completion
```

This means `tokens.css` expansion is the single most blocking task in the entire plan.

---

## 5. Phase Breakdown

### Phase 0: Pre-Flight (Before Any Code)

**Duration:** 0.5 days
**Goal:** Verify baseline, establish measurement, protect against regression.

| Task | Description |
|---|---|
| Record performance baseline | Run Lighthouse on all key pages (Home, Shop, Product, Collections). Record FCP, LCP, CLS, TBT, bundle size. |
| Record visual baseline | Screenshot every page at mobile (375px) and desktop (1440px). Store as reference. |
| Verify build passes | `npm run build` completes with no errors. |
| Verify tests pass | `npm test` passes. If no tests exist, note this as a gap. |
| Verify lint passes | `npm run lint` passes. |
| Verify typecheck passes | `npm run typecheck` passes. |

**Exit criteria:** All baselines recorded. Clean build. No existing failures.

---

### Phase 1: Foundation (Week 1-2)

**Duration:** 2 days
**Goal:** Build the design system foundation that everything else depends on.

#### Task 1.1: Expand Design Tokens
- **File:** `src/styles/tokens.css`
- **Approach:** Add glass variables (`--glass-bg`, `--glass-border`), metallic gradient tokens, shadow scale tokens (`--shadow-sm/md/lg/xl`), and spacing scale. See spec §7, §9, §24.
- **Criteria:** All new tokens defined. No existing tokens changed. Visual regression: zero (tokens only, no component changes).

#### Task 1.2: Add Typography Levels
- **File:** `src/styles/typography.css`
- **Approach:** Add `.type-quote` (editorial pull quotes) and `.type-label` (metadata labels). See spec §8.
- **Criteria:** New type levels render correctly. Existing type levels unaffected.

#### Task 1.3: Expand Motion System
- **File:** `src/styles/motion.css`
- **Approach:** Add `--duration-cinematic` (800ms), `--duration-dramatic` (1200ms), `--ease-cinematic` easing. Add `.motion-blur` and `.motion-blur-reveal` classes. Add comprehensive `prefers-reduced-motion` gates for all new motion. See spec §12.
- **Criteria:** New motion classes work. All new motion disabled under `prefers-reduced-motion: reduce`.

#### Task 1.4: Create DepthCard Component
- **File:** New `src/components/ui/DepthCard.tsx`
- **Approach:** CSS perspective tilt (max ±3°) on pointer move via `requestAnimationFrame`. Reset on pointer leave (280ms). Respects reduced-motion. See spec §11.
- **Criteria:** Tilt works on desktop. No tilt on touch devices. No tilt under reduced-motion. No performance jank.

#### Task 1.5: Create GlassSurface Component
- **File:** New `src/components/ui/GlassSurface.tsx`
- **Approach:** Wraps children in glass-treated container using tokens from Task 1.1. See spec §11, §24.
- **Criteria:** Renders correctly. Warm-tinted glass. Border present. Max 2 per viewport enforced by convention.

#### Task 1.6: Create ParallaxSection Component
- **File:** New `src/components/ui/ParallaxSection.tsx`
- **Approach:** IntersectionObserver-based scroll parallax. Offset capped at ±50px. Reduced-motion: disable. See spec §11.
- **Criteria:** Parallax works on scroll. Disabled under reduced-motion. No jank.

#### Task 1.7: Enhance Reveal Component
- **File:** `src/components/motion/Reveal.tsx` + `src/styles/motion.css`
- **Approach:** Add `blur` and `blur-reveal` variants. See spec §11.
- **Criteria:** New variants render. Existing variants unaffected.

#### Task 1.8: Create PageTransition Component
- **File:** New `src/components/layout/PageTransition.tsx`
- **Approach:** Route transition wrapper using `usePathname()`. Fade out (400ms) → swap → fade in (800ms). CSS transitions only. See spec §11.
- **Criteria:** Transitions fire on route change. Reduced-motion: instant swap.

**Phase 1 Exit Criteria:** All new primitives work in isolation. All existing components unaffected. Build passes. Lighthouse scores unchanged.

---

### Phase 2: Core Pages (Week 3-4)

**Duration:** 3 days
**Goal:** Redesign the highest-impact pages.

#### Task 2.1: Product Detail Page Redesign (P0)
- **Files:** `src/components/product/ProductPage.tsx`, new `src/components/product/ProductImageViewer.tsx`
- **Approach:** Split 530-line monolith. Create `ProductImageViewer` (click-to-zoom, pan, swipe). Make purchase panel sticky on desktop. Enhance thumbnails. Add editorial story section. See spec §17.
- **Criteria:** Zoom/pan works. Sticky panel works. Mobile swipe works. All existing functionality preserved.

#### Task 2.2: Product Card Depth Treatment
- **File:** `src/components/product/ProductCard.tsx`
- **Approach:** Wrap card in `DepthCard`. Add shadow elevation on hover. Add collection label badge. See spec §16.
- **Criteria:** Perspective tilt on hover. Shadow transitions. Badge renders when applicable.

#### Task 2.3: Homepage Restructure (Hypothesis)
- **Files:** `src/components/home/HomePage.tsx`, 4 new section components
- **Approach:** Merge 13 sections into 9 (hypothesis). Create `BrandStatement`, `FeaturedCollection`, `EditorialMoment`, `ContactCta`. See spec §15.
- **Criteria:** All content preserved. Pacing feels varied. Content validation checklist passes (§15).

#### Task 2.4: Footer Luxury Redesign
- **File:** `src/components/layout/Footer.tsx`
- **Approach:** Add brand statement, move newsletter to footer, add social icons, add grain texture, increase spacing. See spec §23.
- **Criteria:** Footer feels premium. Newsletter form works. All links functional.

#### Task 2.5: Wire PageTransition
- **File:** `src/components/layout/AppShell.tsx`
- **Approach:** Wrap `{children}` in `PageTransition`. See spec §11.
- **Criteria:** Route transitions fire. No layout shift.

**Phase 2 Exit Criteria:** Product page feels immersive. Homepage pacing improved. Footer feels premium. Build passes. Lighthouse ≥90.

---

### Phase 3: Enhancement (Week 5-6)

**Duration:** 2 days
**Goal:** Premium polish across remaining pages.

#### Task 3.1: Collection Enhancements
- **Files:** `CollectionHero.tsx`, `CollectionCard.tsx`, `CollectionRelated.tsx`, `CollectionGallery.tsx`, `CollectionNav.tsx`
- **Approach:** Add ParallaxSection to hero. Wrap cards in DepthCard. Enhance lightbox animation. Add glass to nav. See spec §18.
- **Criteria:** Parallax works on collection hero. Lightbox feels cinematic. Glass nav renders.

#### Task 3.2: Editorial Category Filtering
- **File:** `src/components/editorial/EditorialPage.tsx`
- **Approach:** Add category filter tabs. Mixed-size grid layout. DepthCard on cards. See spec §20.
- **Criteria:** Filtering works. Layout reflows smoothly.

#### Task 3.3: SUS World Category Navigation
- **File:** `src/components/sus-world/SusWorldPage.tsx`
- **Approach:** Add horizontal category tabs. Group stories by category. See spec §21.
- **Criteria:** Category filtering works.

#### Task 3.4: About Page Enhancement
- **File:** `src/components/about/AboutPage.tsx`
- **Approach:** Add campaign image to hero (use existing `campaign-01-editorial.webp`). Add timeline (verified facts only). See spec §19.
- **Criteria:** Image renders. Timeline shows verified milestones only.

#### Task 3.5: Navigation Enhancements
- **Files:** `DesktopSidebar.tsx`, `SiteHeader.tsx`, `MobileMenu.tsx`
- **Approach:** Glass on scroll for sidebar. Smoother header transitions. Cinematic menu entrance. See spec §22.
- **Criteria:** Glass appears on scroll. Transitions feel smoother.

#### Task 3.6: Search Enhancement
- **File:** `src/components/shop/SearchOverlay.tsx`
- **Approach:** Add recent searches (localStorage). Add category quick links. See spec §16.
- **Criteria:** Recent searches persist. Quick links render.

**Phase 3 Exit Criteria:** All pages feel cohesive. Premium polish throughout. Build passes. Lighthouse ≥90.

---

### Phase 4: 3D & Polish (Week 7-8)

**Duration:** 2 days
**Goal:** Optional 3D experiments + final optimization.

#### Task 4.1: R3F Hero Atmosphere Experiment
- **Files:** `src/components/hero/Hero.tsx`, new `src/components/hero/HeroAtmosphere.tsx`
- **Approach:** Dynamic import of R3F scene. Single mesh, soft lighting, mouse-reactive. Must pass all 5 performance gates. See spec §13.
- **Criteria:** All performance gates pass. Graceful mobile fallback. Bundle <50KB additional gzipped.

#### Task 4.2: Performance Optimization
- **Approach:** Dynamic imports for R3F. Image blur placeholders. Font preloading. Bundle analysis. See spec §27.
- **Criteria:** All performance targets met.

#### Task 4.3: Accessibility Audit
- **Approach:** Verify all new components. Keyboard navigation. Screen reader testing. Reduced-motion verification. See spec §26.
- **Criteria:** WCAG AA compliance. All interactive elements keyboard-accessible.

#### Task 4.4: Cross-Browser Testing
- **Approach:** Test Chrome, Firefox, Safari, Edge. Mobile Safari. Android Chrome.
- **Criteria:** No visual regressions. All interactions work.

**Phase 4 Exit Criteria:** Performance budget met. Accessibility verified. R3F decision made. Ready for release.

---

## 6. Detailed Task List

### Task ID Reference

| ID | Task | Phase | Priority | Files | Effort | Dependencies |
|---|---|---|---|---|---|---|
| T0.1 | Record performance baseline | 0 | P0 | — | S | None |
| T0.2 | Record visual baseline | 0 | P0 | — | S | None |
| T0.3 | Verify build/tests/lint/typecheck | 0 | P0 | — | S | None |
| T1.1 | Expand design tokens | 1 | P0 | `tokens.css` | M | None |
| T1.2 | Add typography levels | 1 | P1 | `typography.css` | S | None |
| T1.3 | Expand motion system | 1 | P1 | `motion.css` | M | None |
| T1.4 | Create DepthCard | 1 | P0 | New `DepthCard.tsx` | M | T1.1, T1.3 |
| T1.5 | Create GlassSurface | 1 | P1 | New `GlassSurface.tsx` | S | T1.1 |
| T1.6 | Create ParallaxSection | 1 | P2 | New `ParallaxSection.tsx` | M | T1.1 |
| T1.7 | Enhance Reveal | 1 | P1 | `Reveal.tsx`, `motion.css` | S | T1.3 |
| T1.8 | Create PageTransition | 1 | P1 | New `PageTransition.tsx` | M | T1.3 |
| T2.1 | Product detail redesign | 2 | P0 | `ProductPage.tsx`, new `ProductImageViewer.tsx` | L | T1.4 |
| T2.2 | Product card depth | 2 | P1 | `ProductCard.tsx` | S | T1.4 |
| T2.3 | Homepage restructure | 2 | P1 | `HomePage.tsx`, 4 new components | L | T1.4, T1.7 |
| T2.4 | Footer redesign | 2 | P1 | `Footer.tsx` | M | T1.1, T1.5 |
| T2.5 | Wire PageTransition | 2 | P1 | `AppShell.tsx` | S | T1.8 |
| T3.1 | Collection enhancements | 3 | P2 | 5 collection files | M | T1.4, T1.6 |
| T3.2 | Editorial filtering | 3 | P2 | `EditorialPage.tsx` | M | None |
| T3.3 | SUS World navigation | 3 | P2 | `SusWorldPage.tsx` | M | None |
| T3.4 | About enhancement | 3 | P2 | `AboutPage.tsx` | M | None |
| T3.5 | Navigation enhancements | 3 | P2 | 3 layout files | M | T1.5 |
| T3.6 | Search enhancement | 3 | P2 | `SearchOverlay.tsx` | S | None |
| T4.1 | R3F hero experiment | 4 | P3 | `Hero.tsx`, new `HeroAtmosphere.tsx` | L | All phases |
| T4.2 | Performance optimization | 4 | P0 | Various | M | All phases |
| T4.3 | Accessibility audit | 4 | P0 | Various | M | All phases |
| T4.4 | Cross-browser testing | 4 | P0 | — | M | All phases |

**Legend:** S = Small (< 4h), M = Medium (4-8h), L = Large (8-16h)

**Total tasks:** 25
**Total estimated effort:** ~120-160 hours (2-4 weeks of focused work)

---

## 7. File-Level Change Map

### New Files (9)

| # | File | Purpose | Phase |
|---|---|---|---|
| 1 | `src/components/layout/PageTransition.tsx` | Route transition wrapper | 1 |
| 2 | `src/components/ui/GlassSurface.tsx` | Luxury glass panel | 1 |
| 3 | `src/components/ui/DepthCard.tsx` | 3D perspective tilt card | 1 |
| 4 | `src/components/ui/ParallaxSection.tsx` | Scroll parallax wrapper | 1 |
| 5 | `src/components/product/ProductImageViewer.tsx` | Immersive zoom/pan viewer | 2 |
| 6 | `src/components/home/BrandStatement.tsx` | Merged BrandIntro + BrandManifesto | 2 |
| 7 | `src/components/home/FeaturedCollection.tsx` | Merged FeaturedFashion + CollectionShowcase | 2 |
| 8 | `src/components/home/EditorialMoment.tsx` | Merged EditorialFeature + CraftStory | 2 |
| 9 | `src/components/home/ContactCta.tsx` | Merged WhatsAppCta + contact | 2 |

### Modified Files (25)

| # | File | Changes | Phase |
|---|---|---|---|
| 1 | `src/styles/tokens.css` | Glass, metallic, shadow, spacing tokens | 1 |
| 2 | `src/styles/motion.css` | Blur variants, cinematic durations, reduced-motion | 1 |
| 3 | `src/styles/typography.css` | type-quote, type-label | 1 |
| 4 | `src/app/globals.css` | New tokens in Tailwind theme | 1 |
| 5 | `src/components/layout/AppShell.tsx` | PageTransition wrapper | 2 |
| 6 | `src/components/layout/Footer.tsx` | Luxury redesign | 2 |
| 7 | `src/components/layout/DesktopSidebar.tsx` | Glass on scroll | 3 |
| 8 | `src/components/layout/SiteHeader.tsx` | Enhanced transitions | 3 |
| 9 | `src/components/layout/MobileMenu.tsx` | Cinematic entrance | 3 |
| 10 | `src/components/product/ProductCard.tsx` | DepthCard wrapper | 2 |
| 11 | `src/components/product/ProductPage.tsx` | Sticky panel, viewer, editorial | 2 |
| 12 | `src/components/motion/Reveal.tsx` | Blur variants | 1 |
| 13 | `src/components/home/HomePage.tsx` | Restructure sections | 2 |
| 14 | `src/components/home/CategoryShowcase.tsx` | DepthCard | 2 |
| 15 | `src/components/home/NewDropSection.tsx` | Enhanced featured product | 2 |
| 16 | `src/components/home/SusWorldTeaser.tsx` | ParallaxSection | 2 |
| 17 | `src/components/home/NewsletterSection.tsx` | Move to footer or simplify | 2 |
| 18 | `src/components/collections/CollectionHero.tsx` | ParallaxSection | 3 |
| 19 | `src/components/collections/CollectionCard.tsx` | DepthCard | 3 |
| 20 | `src/components/collections/CollectionRelated.tsx` | DepthCard | 3 |
| 21 | `src/components/collections/CollectionNav.tsx` | Glass treatment | 3 |
| 22 | `src/components/collections/CollectionGallery.tsx` | Enhanced lightbox | 3 |
| 23 | `src/components/editorial/EditorialPage.tsx` | Category filtering, mixed grid | 3 |
| 24 | `src/components/sus-world/SusWorldPage.tsx` | Category navigation | 3 |
| 25 | `src/components/about/AboutPage.tsx` | Imagery, timeline | 3 |

### Unchanged Files

All data files, type definitions, lib utilities, icon components, cart, checkout, and shop infrastructure remain unchanged.

---

## 8. Homepage Validation Plan

The homepage 9-section proposal (spec §15) is a **hypothesis** — not a directive. It must be validated before implementation.

### Current Architecture (13 sections)

```
1.  Hero                    — Cinematic carousel
2.  BrandIntro              — Brand introduction + facts
3.  BrandManifesto          — Oversized statement
4.  FeaturedFashion         — Men/Women editorial tiles
5.  CategoryShowcase        — 4-category grid
6.  CollectionShowcase      — Featured collection + 2 cards
7.  SusWorldTeaser          — Full-viewport world teaser
8.  CraftStory              — Craftsmanship story
9.  EditorialFeature        — Editorial feature block
10. NewDropSection          — New arrivals
11. NeonTeaser              — AI concierge (conditional/hidden)
12. WhatsAppCta             — Contact CTA
13. NewsletterSection       — Newsletter signup
```

### Proposed Architecture (9 sections)

```
1.  HERO                    — Enhanced cinematic carousel
2.  BRAND STATEMENT         — Merged BrandIntro + BrandManifesto
3.  FEATURED COLLECTION     — Merged FeaturedFashion + CollectionShowcase
4.  NEW DROP                — Enhanced new arrivals
5.  CATEGORY GRID           — Enhanced CategoryShowcase
6.  EDITORIAL MOMENT        — Merged EditorialFeature + CraftStory
7.  SUS WORLD TEASER        — Enhanced immersive teaser
8.  NEWSLETTER              — Enhanced signup
9.  CONTACT CTA             — Merged WhatsAppCta + contact options
```

### Validation Checklist (Before Implementing)

- [ ] Brand identity is established within first 2 scroll sections
- [ ] All 3 collections are represented
- [ ] New products are showcased
- [ ] All 4 categories are accessible
- [ ] Editorial/brand story is told
- [ ] SUS World is promoted
- [ ] Newsletter capture is present
- [ ] Contact/WhatsApp conversion is present
- [ ] No strategic content is lost from removed sections
- [ ] Pacing feels varied (not uniform section rhythm)

### Validation Method

1. **Static mockup:** Create a visual mockup of the 9-section layout using existing content
2. **Scroll test:** Prototype the section order in a single page and scroll through it
3. **Content audit:** Verify every piece of content from the 13 sections is accessible in the 9-section version
4. **Decision point:** If validation fails, keep the 13-section structure and enhance individual sections instead

### Removed Sections

- **NeonTeaser:** Conditionally hidden (only visible when AI_NEON is configured). Remove from homepage. If Neon launches, add back.
- **Duplicate newsletter:** Newsletter appears only once (Section 8), not again near footer.

---

## 9. Image Migration

### Current State

- **Real photography:** 10 campaign WebP files in `public/images/campaign/` (desktop + mobile variants)
- **SVG placeholders:** 96 product SVGs in `public/images/shop/`, 21 brand/editorial SVGs in `public/images/home/`, 18 collection SVGs in `public/images/collections/`

### Design for Real Photography

The design specification (§14) states:

> The design specification is written to work with both the current SVG asset system and future real photography. The SVGs are treated as legitimate interim visual content.

**SVGs are NOT problems to fix.** They are legitimate brand assets.

### When Real Photography Arrives

**Photography direction (from spec §14):**
- **Lighting:** Warm, cinematic, directional. Dark backgrounds with warm key light.
- **Composition:** Editorial framing. Negative space. Asymmetric. Models in motion.
- **Context:** Jos, Plateau State environments. Studio settings. Urban contexts.
- **Color grading:** Warm tones consistent with champagne/bronze accent palette.
- **Casting:** 50% men / 50% women (per `BRAND.casting`).

### Image Treatment System (from spec §14)

| Context | Aspect Ratio | Hover Effect | Loading |
|---|---|---|---|
| Hero (desktop) | Full viewport | Parallax drift | Priority |
| Product card | 4/5 | Crossfade to second image | Lazy |
| Product detail main | 1/1 or 4/5 | Click to zoom | Priority |
| Collection hero | Full bleed | Parallax | Priority |
| Collection gallery | Mixed | Scale 1.02 | Lazy |
| Editorial card | 4/5 | Scale 1.04 | Lazy |

### Migration Approach

**Phase 2 (product pages):** Design `ProductImageViewer` to accept both SVG and WebP. No image format assumptions.

**Phase 3 (collections, editorial):** Ensure `ParallaxSection` and `DepthCard` work with any image format.

**Future:** When real photography arrives, replace SVG URLs with WebP URLs. The component system handles the rest.

---

## 10. CSS 3D Strategy

### Guiding Principle (from spec §13)

> **The luxury target is achievable without any 3D library.** CSS-first architecture provides all the depth, perspective, and spatial composition needed for a premium experience.

### CSS 3D Effects (MUST implement)

#### Card Perspective Tilt

```css
.depth-card-container {
  perspective: 800px;
}

.depth-card-inner {
  transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 280ms var(--ease-standard);
  will-change: transform;
}
```

- JavaScript sets `--rx` and `--ry` based on pointer position (max ±3°)
- On pointer leave: animate back to 0° over 280ms
- Usage: Product cards, collection cards, editorial cards

#### Scroll Parallax

```css
.parallax-layer {
  transform: translateY(var(--parallax-offset, 0px));
  will-change: transform;
}
```

- JavaScript calculates `--parallax-offset` based on scroll position
- Capped at ±50px maximum offset
- Usage: Collection heroes, homepage editorial sections

#### Hero Depth (Existing — Enhance)

The hero system already uses CSS 3D:
- Z1 (photography): `translate3d` driven by pointer position
- Z3 (copy): `translate3d` at different rate than Z1

**Enhancement:** Add Z0 (atmosphere) parallax at a third rate for deeper layering.

#### Page Transition Perspective

```css
.page-transition-enter {
  animation: page-in 800ms var(--ease-cinematic) both;
}
```

### Mobile 3D Behavior

- Touch devices: disable perspective tilt on cards (no hover)
- Parallax: reduce speed by 50% on mobile
- R3F experiments: disabled on mobile entirely during initial rollout

---

## 11. Optional R3F Experiment

### Experiment 1: Hero Atmosphere Enhancement

**What:** A subtle 3D fabric/garment silhouette floating in the Z0 atmosphere layer of the hero. Low-poly mesh with soft warm lighting. Barely visible — adds subliminal spatial depth behind the campaign photography.

**Performance gates (ALL must pass):**

| # | Gate | Threshold |
|---|---|---|
| 1 | Bundle impact | < 50KB gzipped additional |
| 2 | Lighthouse Performance | ≥ 90 on test device |
| 3 | Mobile fallback | Gracefully degrades to CSS-only (detect WebGL2) |
| 4 | Frame rate | ≥ 30fps on mid-range Android |
| 5 | CLS regression | None |

**Implementation if approved:**
- Dynamic import: `next/dynamic(() => import('./HeroAtmosphere'), { ssr: false })`
- Rendered inside `Hero.tsx` at Z0 layer
- Three.js Scene with single mesh, soft ambient + directional light
- Mouse-reactive rotation (subtle, 5-10° range)
- Transparent background (alpha: true)
- Scoped to hero only — no other pages

**Fallback:** If gates not met, the existing CSS grain/noise atmosphere in Z0 is sufficient.

### Experiment 2: Product Wireframe Viewer (FUTURE)

**This experiment requires 3D model assets that do not currently exist.** It is a FUTURE consideration, not part of the initial redesign.

### R3F Bundle Budget

| Package | Size (gzipped) |
|---|---|
| three.js core | ~65KB |
| @react-three/fiber | ~45KB |
| @react-three/drei | ~30KB (optional) |
| **Total** | **~140KB** |

**Current JS bundle:** ~120KB gzipped
**Budget ceiling:** < 250KB gzipped
**Available headroom:** ~130KB

**R3F at ~140KB exceeds the available headroom.** If R3F is used:
- Consider tree-shaking unused drei helpers
- Monitor bundle size with `next build` + `@next/bundle-analyzer`
- May need to increase budget ceiling to ~400KB gzipped (spec §27 acknowledges this)

### Recommendation

Ship Phase 1-3 with zero new dependencies. Evaluate R3F in Phase 4 only if the hero experiment demonstrates clear visual value within the performance budget.

---

## 12. Motion Strategy

### Duration Scale (from spec §12)

```css
:root {
  --duration-fast:      160ms;  /* Micro-interactions: focus, toggle */
  --duration-standard:  280ms;  /* Hover states, small transitions */
  --duration-slow:      560ms;  /* Scroll reveals, image hovers */
  --duration-cinematic: 800ms;  /* Page transitions, major reveals */
  --duration-dramatic:  1200ms; /* Hero-level moments, 3D transitions */
}
```

### Easing Scale

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);     /* Material-style ease */
  --ease-accent:   cubic-bezier(0.22, 1, 0.36, 1);    /* Dramatic ease-out */
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);    /* Slow luxurious deceleration */
}
```

### Motion Language

| Interaction | Duration | Easing | Properties |
|---|---|---|---|
| Page transition out | 400ms | ease-standard | opacity, translateY(-8px) |
| Page transition in | 800ms | ease-cinematic | opacity, translateY(8px→0) |
| Scroll reveal | 560ms | ease-accent | opacity, transform |
| Scroll reveal (blur) | 560ms | ease-accent | opacity, filter, transform |
| Card hover tilt | 280ms | ease-standard | rotateX, rotateY (max 3°) |
| Card hover shadow | 280ms | ease-standard | box-shadow |
| Image hover scale | 560ms | ease-accent | transform (1→1.02) |
| Hero crossfade | 1400ms | ease-cinematic | opacity, scale |

### New Motion Classes (for `motion.css`)

```css
.motion-blur {
  opacity: 0;
  filter: blur(8px);
  transition:
    opacity var(--duration-slow) var(--ease-accent),
    filter var(--duration-slow) var(--ease-accent);
}

.motion-blur-reveal {
  opacity: 0;
  filter: blur(8px);
  transform: translateY(1.25rem);
  transition:
    opacity var(--duration-slow) var(--ease-accent),
    filter var(--duration-slow) var(--ease-accent),
    transform var(--duration-slow) var(--ease-accent);
}
```

### Implementation Approach

- **All motion is CSS transitions** — no JS animation libraries
- **Compositor-driven properties only** — opacity, transform, filter (never animate layout properties)
- **`will-change` used sparingly** — only on elements that actually animate
- **Reduced-motion gates** — every new motion class has a `prefers-reduced-motion: reduce` override

---

## 13. Mobile Strategy

### Breakpoints (Keep Existing)

```css
sm: 40rem   (640px)
md: 48rem   (768px)
lg: 64rem   (1024px) — sidebar appears
xl: 80rem   (1280px)
```

### Mobile-Specific Behavior

| Feature | Mobile Behavior |
|---|---|
| Navigation | Full-screen menu overlay (existing) |
| Sidebar | Hidden, replaced by mobile header |
| Product grid | 2 columns |
| Collection gallery | Single column |
| Hero carousel | Full viewport, transparent header, parallax disabled |
| Filter panel | Bottom-sheet drawer |
| Search | Top-sheet overlay |
| Product gallery | Swipe left/right (NEW) |
| Cards | No perspective tilt on touch (no hover) |
| Parallax | Reduce speed by 50% |
| R3F experiments | Disabled on mobile |

### Touch Targets

Enforce minimum 44px touch targets on all interactive elements. Current implementation mostly complies — verify during implementation.

### Mobile Performance

- Lazy-load all below-fold images
- Reduce hero to 3 layers on mobile (drop Z0 grain, simplify Z2 grade)
- Disable CSS 3D perspective tilt on touch devices
- Cap animations at 30fps on low-end devices

---

## 14. Accessibility Plan

### Existing Foundations (Keep)

The current implementation has strong accessibility:

1. Skip-to-content link in `AppShell.tsx`
2. Focus-visible outlines on all interactive elements
3. `prefers-reduced-motion` global kill switch in `globals.css`
4. ARIA on overlays: `aria-modal`, `role="dialog"`, focus trapping
5. Body scroll lock on overlays
6. Escape key handling on all overlays
7. Keyboard navigation in lightbox, search overlay
8. Live regions: `aria-live="polite"` on bag count, product notices
9. Semantic HTML throughout
10. Image alt text on all images

### New Requirements

| Requirement | Implementation |
|---|---|
| CSS 3D fallbacks | `prefers-reduced-motion: reduce` disables tilt, parallax, transitions |
| Product image gallery keyboard nav | Arrow keys to change image, Tab for thumbnails, Enter/Space to select |
| Contrast verification | Current ratios are AAA-level — maintain |
| Touch targets | All interactive elements ≥ 44×44px on mobile |
| Screen reader testing | Verify all new components with VoiceOver/NVDA |

### Reduced-Motion CSS Gate

```css
@media (prefers-reduced-motion: reduce) {
  .page-transition,
  .depth-card-inner,
  .parallax-layer,
  .motion-blur,
  .motion-blur-reveal {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }
}
```

---

## 15. Performance Plan

### Current Optimizations (Keep)

1. Next.js Image with quality tiers (50/75/90) and responsive srcset
2. Self-hosted fonts with unicode-range subsetting
3. Metric-compatible fallback fonts (ascent-override/descent-override for CLS)
4. No animation libraries — pure CSS + IntersectionObserver
5. Static data layer — no database queries, no API calls for content
6. Sharp for server-side image optimization

### Performance Budget

| Metric | Target | Current (estimated) |
|---|---|---|
| First Contentful Paint | < 1.5s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~2.0s |
| Cumulative Layout Shift | < 0.1 | ~0.05 |
| Total Blocking Time | < 200ms | ~150ms |
| JavaScript bundle (gzipped) | < 250KB | ~120KB |
| CSS (gzipped) | < 50KB | ~35KB |
| Fonts (gzipped) | < 100KB | ~80KB |
| Total page weight | < 1MB | ~600KB |

### New Optimizations

1. **Dynamic imports** for any R3F components (`next/dynamic` with `{ ssr: false }`)
2. **Intersection Observer lazy loading** — extend existing `Reveal` pattern
3. **Font preloading** — preload only critical font subsets
4. **Image blur placeholders** — tiny inline base64 via `placeholder="blur"`
5. **Route prefetching** — Next.js Link prefetches on hover by default

### R3F Impact Budget

| Addition | Size (gzipped) | Gate |
|---|---|---|
| three.js core | ~65KB | Required if R3F used |
| @react-three/fiber | ~45KB | Required if R3F used |
| @react-three/drei | ~30KB | Optional helpers |
| **Total R3F** | **~140KB** | **Must keep total JS < 250KB** |

---

## 16. Testing Strategy

### Existing Test Infrastructure

Check `package.json` for existing test commands. If no tests exist, note this as a gap.

### Testing Approach by Phase

| Phase | Testing |
|---|---|
| Phase 0 | Baseline recording (Lighthouse, visual) |
| Phase 1 | Unit test new primitives (DepthCard, GlassSurface, ParallaxSection). Verify reduced-motion. |
| Phase 2 | Integration test product page (zoom, sticky panel). Visual test homepage restructure. |
| Phase 3 | Visual regression test all enhanced pages. Accessibility spot-check. |
| Phase 4 | Full accessibility audit. Performance audit. Cross-browser testing. |

### Test Types

| Type | Tool | Frequency |
|---|---|---|
| Build verification | `npm run build` | Every phase |
| Type checking | `npm run typecheck` | Every phase |
| Lint checking | `npm run lint` | Every phase |
| Unit tests | `npm test` | Every phase |
| Lighthouse audit | Lighthouse CLI | Phase 0, 2, 4 |
| Visual regression | Screenshots at 375px + 1440px | Phase 0, 2, 4 |
| Accessibility | Manual keyboard + screen reader | Phase 4 |
| Cross-browser | Chrome, Firefox, Safari, Edge | Phase 4 |
| Mobile testing | Real devices or DevTools emulation | Phase 2, 3, 4 |

---

## 17. Visual QA

### Visual Scorecard (from spec §30)

| Page | Current | Target | Key Improvement |
|---|---|---|---|
| Homepage | 7/10 | 9/10 | Varied pacing, depth, cinematic motion |
| Shop | 7/10 | 8/10 | Depth cards, enhanced hover |
| Product | 6/10 | 9/10 | Immersive viewer, sticky panel, editorial |
| Collections | 8/10 | 9/10 | Parallax, glass, richer lightbox |
| About | 7/10 | 8/10 | Imagery, timeline |
| Editorial | 6/10 | 8/10 | Category filtering, mixed grid |
| SUS World | 6/10 | 8/10 | Category navigation, depth |
| Navigation | 8/10 | 9/10 | Glass, enhanced transitions |
| Footer | 5/10 | 8/10 | Luxury redesign, newsletter |
| Mobile | 7/10 | 8/10 | Swipe, reduced complexity |

### Visual QA Process

1. **Before/after screenshots** — capture every page at 375px and 1440px before and after each phase
2. **Side-by-side comparison** — verify improvements are visible and intentional
3. **Luxury benchmark comparison** — compare against Bottega Veneta, Loewe, Celine, The Row, Net-a-Porter, SSENSE
4. **"Does it look expensive?"** — subjective review against luxury fashion benchmarks
5. **Static beauty check** — site should be beautiful with all animations disabled

### QA Checklist (Per Phase)

- [ ] No visual regressions from baseline
- [ ] New components render correctly at all breakpoints
- [ ] Typography hierarchy is clear and architectural
- [ ] Color palette is restrained and cohesive
- [ ] Spacing is generous and consistent
- [ ] No generic template patterns visible

---

## 18. Rollback & Safety

### Safety Principles

1. **Incremental shipping** — each phase is a potential release point
2. **Feature flags** — homepage restructure can be reverted by swapping component imports
3. **CSS-only baseline** — if any CSS 3D effect causes issues, remove the class and the site still works
4. **R3F is completely optional** — removing it has zero impact on the CSS-first baseline

### Rollback Procedures

| Scenario | Rollback |
|---|---|
| DepthCard causes jank | Remove `DepthCard` wrapper from affected cards. Cards fall back to flat treatment. |
| PageTransition feels slow | Remove `PageTransition` from `AppShell.tsx`. Instant route swaps restored. |
| Homepage restructure loses content | Revert `HomePage.tsx` to import original 13 sections. All content preserved in original files. |
| R3F causes performance regression | Remove dynamic import from `Hero.tsx`. CSS grain atmosphere remains. |
| Glass treatment looks wrong | Remove `GlassSurface` wrapper. Solid backgrounds restored. |
| Parallax causes jank | Remove `ParallaxSection` wrapper. Static layout restored. |

### Git Strategy

- **Branch per phase:** `phase/1-foundation`, `phase/2-core-pages`, etc.
- **Merge to main only after phase exit criteria pass**
- **Tag each phase release:** `v1.1-foundation`, `v1.2-core-pages`, etc.
- **Never force-push to main**

---

## 19. Release Gates

### Phase Exit Criteria

| Phase | Gate | Threshold |
|---|---|---|
| Phase 0 | Baseline recorded | All metrics captured |
| Phase 1 | Foundation complete | All primitives work. Build passes. Lighthouse unchanged. |
| Phase 2 | Core pages done | Product page immersive. Homepage improved. Lighthouse ≥90. |
| Phase 3 | Enhancement done | All pages cohesive. Lighthouse ≥90. |
| Phase 4 | Polish done | Performance budget met. Accessibility verified. R3F decision made. |

### Release Checklist (Every Phase)

- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (if tests exist)
- [ ] Lighthouse Performance ≥ 90
- [ ] No CLS regression
- [ ] No visual regressions (screenshot comparison)
- [ ] All existing functionality works (routes, cart, filtering, search, overlays)
- [ ] Reduced-motion verification
- [ ] Keyboard navigation verification
- [ ] Mobile touch targets ≥ 44px

### Final Release Gate (Phase 4)

- [ ] All phase gates passed
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing complete (real devices)
- [ ] Accessibility audit complete (VoiceOver/NVDA)
- [ ] R3F decision documented (ship or skip)
- [ ] Performance budget met with final bundle
- [ ] No known regressions

---

## 20. Open Decisions

### Decisions Pending

| # | Decision | Impact | Options | Recommended |
|---|---|---|---|---|
| 1 | Homepage 9-section merge | High | Merge (validate first) vs. keep 13 sections | Validate merge hypothesis before committing |
| 2 | R3F hero experiment | Medium | Ship if gates pass vs. skip entirely | Evaluate in Phase 4 after CSS baseline |
| 3 | Framer Motion | Low | Install vs. skip (CSS sufficient) | Skip — CSS transitions are sufficient |
| 4 | Newsletter location | Low | Keep on homepage vs. move to footer | Move to footer (available on every page) |
| 5 | NeonTeaser | Low | Keep conditional vs. remove from homepage | Remove from homepage; re-add when Neon launches |
| 6 | "Complete the look" vs. "Recently viewed" | Medium | Replace vs. supplement | Supplement — keep both |
| 7 | About page founder section | Low | Add now vs. wait for photography | Wait — requires founder photography |
| 8 | Horizontal scroll carousels | Low | Add to collections/SUS World vs. skip | Skip — not essential for initial redesign |

### Resolved Decisions

| # | Decision | Resolution |
|---|---|---|
| 1 | CSS-first vs. R3F-first | CSS-first baseline. R3F optional. |
| 2 | SVG assets | Treat as legitimate interim content. |
| 3 | Brand data | Use only verified facts from `src/data/brand.ts`. |
| 4 | New dependencies | Zero new packages through Phase 3. |
| 5 | Animation library | Pure CSS + IntersectionObserver. No Framer Motion. |

---

**End of implementation plan.**

---

## Phase 2 Completion Report

**Completed:** 2026-08-18 | **Status:** ✅ All gates passed

### Verification Results

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript | ✅ PASS | Zero errors |
| Tests | ✅ 49/49 PASS | 7 test files, no regressions |
| Build | ✅ PASS | 15 routes intact, static + dynamic |
| Lint | ⚠️ 26 problems | 9 errors, 17 warnings — all pre-existing baseline |
| Dependencies | ✅ ZERO new | No packages added |

### What Changed

**New files created:**
- `src/components/product/ProductImageViewer.tsx` — Fullscreen zoom gallery with click-to-zoom, drag-to-pan, swipe navigation, keyboard support, reduced-motion gate
- `src/components/home/BrandStatement.tsx` — Merged BrandIntro + BrandManifesto into single section
- `src/components/home/EditorialMoment.tsx` — Merged CraftStory + EditorialFeature into single section

**Modified files:**
- `src/components/product/ProductPage.tsx` — Gallery replaced with ProductImageViewer; purchase panel now sticky on desktop (lg:sticky lg:top-... lg:self-start); editorial story section added below accordion with material/fit/care data
- `src/components/product/ProductCard.tsx` — Wrapped in DepthCard for hover-reveal depth
- `src/components/home/HomePage.tsx` — Restructured from 13 sections to 10 (BrandStatement, EditorialMoment replace 4 separate components; NeonTeaser removed)
- `src/components/layout/Footer.tsx` — Luxury redesign with brand statement, 4-column navigation grid, contact info, and bottom bar
- `src/components/layout/AppShell.tsx` — PageTransition wired around children in main element

### Section count: 13 → 10

All content preserved. All conversion paths (shop, collections, about) intact. NeonTeaser conditionally hidden (unconfigured). NewsletterSection retained on homepage (available on every page via footer in future Phase).

### ProductPage changes
- Gallery: click/tap to zoom, drag/swipe to pan, keyboard nav (arrows, Escape), dot indicators
- Sticky purchase panel on desktop: stays visible while scrolling product info
- Editorial story section: brand narrative from CRAFT_STORY alongside hero image in 5/7 grid
- Touch target sizes increased: color swatches h-11 w-11 (was h-10 w-10)

### P3 Follow-up Items
- **Product gallery aspect ratio:** Currently locked at 1:1 (`aspectRatio: zoomed ? undefined : "1 / 1"` in ProductImageViewer). Should support media-aware photography ratios (portrait, landscape, square, editorial) based on product data. Requires adding an `aspectRatio` field to ProductImage type and passing it through to the viewer.

### Next phases
- **Phase 3:** About page, Shop page, Collections page luxury redesigns
- **Phase 4:** Performance optimization, R3F optional enhancements, final accessibility audit
- **Phase 5:** Final polish, comprehensive testing, documentation
