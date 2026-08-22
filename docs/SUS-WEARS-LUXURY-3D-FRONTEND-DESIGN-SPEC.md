# SUS WEARS — Luxury 3D Frontend Design Specification

**Version:** 1.0
**Date:** 2026-08-18
**Status:** Design specification — not yet implemented
**Scope:** Frontend visual redesign, motion system, 3D strategy, component architecture

---

## Table of Contents

1. [Executive Design Vision](#1-executive-design-vision)
2. [Current Frontend Audit](#2-current-frontend-audit)
3. [Image Asset Inventory & Classification](#3-image-asset-inventory--classification)
4. [Design Problems](#4-design-problems)
5. [Luxury Design Principles](#5-luxury-design-principles)
6. [Proposed Visual System](#6-proposed-visual-system)
7. [Typography System](#7-typography-system)
8. [Color System](#8-color-system)
9. [Spacing System](#9-spacing-system)
10. [Radius & Shadow System](#10-radius--shadow-system)
11. [Component System](#11-component-system)
12. [Motion System](#12-motion-system)
13. [3D Strategy](#13-3d-strategy)
14. [Image Strategy](#14-image-strategy)
15. [Homepage Redesign](#15-homepage-redesign)
16. [Shop Redesign](#16-shop-redesign)
17. [Product Detail Redesign](#17-product-detail-redesign)
18. [Collection Redesign](#18-collection-redesign)
19. [About Redesign](#19-about-redesign)
20. [Editorial Redesign](#20-editorial-redesign)
21. [SUS World Redesign](#21-sus-world-redesign)
22. [Navigation Redesign](#22-navigation-redesign)
23. [Footer Redesign](#23-footer-redesign)
24. [Glass Strategy](#24-glass-strategy)
25. [Mobile Strategy](#25-mobile-strategy)
26. [Accessibility Strategy](#26-accessibility-strategy)
27. [Performance Strategy](#27-performance-strategy)
28. [Proposed Dependencies](#28-proposed-dependencies)
29. [Component Architecture](#29-component-architecture)
30. [Page-by-Page Scores](#30-page-by-page-scores)
31. [Before / After Design Direction](#31-before--after-design-direction)
32. [Priorities](#32-priorities)
33. [Implementation Phases](#33-implementation-phases)
34. [Acceptance Criteria](#34-acceptance-criteria)
35. [Risks and Mitigations](#35-risks-and-mitigations)

---

## 1. Executive Design Vision

### The Brand

SUS WEARS means Shedrack Unisex Stitches. Founded 2019 by Mr. Shedrack in Jos, Plateau State, Nigeria. A unisex fashion house cutting for men and women, drawing from approximately 70% African and 30% Western creative influence. The tagline: "The silhouette is the logo."

### The Digital Flagship

The SUS WEARS website should feel as if a premium fashion agency was paid a very large budget to design a cinematic digital flagship store for an African luxury fashion house.

The target emotional response is: **"This looks expensive."**

Not: "This looks like an AI-generated website."

### Design Philosophy

Luxury emerges from restraint, not excess. The following elements create the perception of expense:

- **Spacing** — generous negative space that breathes
- **Typography** — oversized display type, quiet metadata, architectural hierarchy
- **Composition** — editorial framing, asymmetric layouts, visual tension
- **Photography** — cinematic lighting, warm tones, real garments on real bodies
- **Materiality** — surfaces that feel tactile: subtle grain, soft shadows, glass depth
- **Motion** — slow, deliberate, cinematic. Never decorative, never bouncy
- **Lighting** — directional light in imagery, subtle gradients in UI
- **Hierarchy** — clear visual weight that guides the eye
- **Interaction quality** — every click, hover, and scroll feels considered
- **Exceptional details** — the small things that separate good from great

### Non-Goals

The redesign must NOT:

- Add random 3D objects or WebGL effects everywhere
- Use neon colors, excessive gradients, or glowing buttons
- Rely on glassmorphism as a primary design language
- Float cards with unnecessary shadow/perspective
- Animate everything constantly
- Use generic AI-generated fashion imagery
- Sacrifice usability for visual effects
- Break existing accessibility

### The Mental Model

> SUS WEARS — an African luxury fashion house presented through a cinematic digital flagship store.

The site should feel expensive even when all animations are disabled. The design must still look beautiful as a static composition.

---

## 2. Current Frontend Audit

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.3.0 |
| UI Library | React | 19.2.8 |
| Styling | Tailwind CSS | v4 (via @tailwindcss/postcss) |
| Language | TypeScript | ^5 |
| Image Optimization | Next.js Image + Sharp | Built-in + ^0.35.3 |
| Animation | CSS + IntersectionObserver | Hand-rolled, zero libraries |
| 3D | None | No Three.js, no R3F, no WebGL |
| Testing | Vitest + Playwright | ^4.1.10 + ^1.62.1 |

### Route Map (11 routes)

| Route | File | Component |
|-------|------|-----------|
| `/` | `src/app/page.tsx` | `<HomePage />` |
| `/shop` | `src/app/shop/page.tsx` | Shop with filters, search, pagination |
| `/collections` | `src/app/collections/page.tsx` | `<CollectionIndex />` |
| `/collections/[slug]` | `src/app/collections/[slug]/page.tsx` | `<CollectionPage />` |
| `/product/[slug]` | `src/app/product/[slug]/page.tsx` | `<ProductPage />` |
| `/about` | `src/app/about/page.tsx` | `<AboutPage />` |
| `/editorial` | `src/app/editorial/page.tsx` | `<EditorialPage />` |
| `/sus-world` | `src/app/sus-world/page.tsx` | `<SusWorldPage />` |
| `/cart` | `src/app/cart/page.tsx` | `<CartPage />` |
| `/checkout` | `src/app/checkout/page.tsx` | `<CheckoutPage />` |
| `/foundation` | `src/app/foundation/page.tsx` | Design system documentation |

### Component Inventory (~80 components)

**Layout (9):** `AppShell`, `DesktopSidebar`, `DesktopUtilityBar`, `SiteHeader`, `MobileMenu`, `Footer`, `BrandLockup`, `NavLink`, `BagLink`

**Hero (5):** `Hero`, `HeroMedia`, `HeroCopy`, `HeroControls`, `HeroScrollIndicator`

**Home (14):** `HomePage`, `BrandIntro`, `BrandManifesto`, `FeaturedFashion`, `CategoryShowcase`, `CollectionShowcase`, `CraftStory`, `CuratedProductsSection`, `NewDropSection`, `FeaturedCollectionSection`, `EditorialFeature`, `NeonTeaser`, `SusWorldTeaser`, `NewsletterSection`, `WhatsAppCta`

**Shop (11):** `ProductGrid`, `ShopToolbar`, `ShopHeader`, `ShopEditorial`, `CategoryNav`, `FilterPanel`, `FilterFields`, `ActiveFilterChips`, `SearchOverlay`, `Pagination`, `EmptyState`

**Product (2):** `ProductPage`, `ProductCard`

**Collections (12):** `CollectionIndex`, `CollectionPage`, `CollectionHero`, `CollectionGallery`, `CollectionStory`, `CollectionIntro`, `CollectionFeatured`, `CollectionCatalogue`, `CollectionCatalogueControls`, `CollectionRelated`, `CollectionCard`, `CollectionNav`

**About (1):** `AboutPage`

**Editorial (1):** `EditorialPage`

**SUS World (1):** `SusWorldPage`

**Cart (1):** `CartPage`

**Checkout (1):** `CheckoutPage`

**UI (11):** `Badge`, `Button`, `Container`, `Divider`, `IconButton`, `Image`, `Input`, `Media`, `Section`, `SectionHeader`, `Typography`

**Motion (1):** `Reveal`

**Icons (14):** `SearchIcon`, `BagIcon`, `UserIcon`, `MenuIcon`, `CloseIcon`, `ArrowUpRightIcon`, `ArrowRightIcon`, `ArrowLeftIcon`, `PauseIcon`, `PlayIcon`, `InstagramIcon`, `XSocialIcon`, `ChevronDownIcon`, `SlidersIcon`

### CSS Architecture (6 files)

| File | Lines | Purpose |
|------|-------|---------|
| `src/styles/tokens.css` | 55 | Design tokens: colors, fonts, motion, layout |
| `src/styles/typography.css` | 118 | 13-level fluid typography scale |
| `src/styles/motion.css` | 214 | Animation classes, keyframes, reduced-motion |
| `src/styles/hero.css` | 494 | 5-layer cinematic hero system |
| `src/styles/fonts.css` | 185 | Self-hosted @font-face declarations |
| `src/app/globals.css` | 109 | Tailwind bridge, base styles, theme mapping |

### Animation System

Entirely hand-rolled. Zero external animation libraries.

**Architecture:**
1. CSS keyframes defined in `motion.css` and `hero.css`
2. `IntersectionObserver` in `Reveal.tsx` triggers `.is-visible` class
3. CSS transitions on interactive elements (hover, focus)
4. Hero uses `requestAnimationFrame` for pointer parallax

**Motion constants** (`src/lib/motion.ts`):
```
duration.fast = 160ms
duration.standard = 280ms
duration.slow = 560ms
easing.standard = cubic-bezier(0.4, 0, 0.2, 1)
easing.accent = cubic-bezier(0.22, 1, 0.36, 1)
```

### Existing Design Strengths

1. **Hero system** — sophisticated 5-layer cinematic carousel with parallax, crossfade, art-directed copy placement, progress indicators
2. **Typography** — 13-level fluid scale with excellent hierarchy (Cormorant Garamond + Manrope)
3. **Color palette** — warm near-black (#0b0a09), cream (#f2ede4), champagne accent (#c2a878). Restrained and premium
4. **Desktop sidebar** — architectural left rail, unique and memorable
5. **Brand voice** — genuinely premium copywriting throughout
6. **Accessibility foundations** — skip-to-content, focus-visible, reduced-motion, ARIA on overlays
7. **Collection system** — per-collection theming, gallery with lightbox, editorial storytelling
8. **Font loading** — self-hosted with unicode-range subsetting, metric-compatible fallbacks for CLS
9. **Image handling** — art-directed mobile/desktop crops via `Media` component
10. **Data architecture** — clean TypeScript types, static data layer

### Existing Design Weaknesses

1. No 3D or spatial depth anywhere in the interface
2. No page transitions (instant hard cuts between routes)
3. Motion limited to scroll reveals and hero parallax
4. Product detail page is functional but generic
5. Product cards lack hover depth
6. Footer is minimal
7. Homepage has 13 sections with uniform rhythm
8. Collection gallery lightbox is functional but not premium
9. No visual variety in card treatments across the site

---

## 3. Image Asset Inventory & Classification

### Asset Categories

The SUS WEARS image system contains three distinct categories of assets. Each serves a different purpose and has a different replacement strategy.

#### Category A: Product Photography Placeholders

**Location:** `public/images/shop/`
**Count:** 96 SVG files (24 products × 4 color variants each)
**Pattern:** `{category}-{number}-{variant}.svg` (e.g., `tees-01-a.svg` through `tees-01-d.svg`)

**Classification:** These are **structured product image placeholders**. Each SVG represents a product in a specific color variant. They are functional assets that serve as visual stand-ins until real photography is available.

**Replacement strategy:** When real product photography is acquired, replace each SVG with a WebP at the same path (or update the data references in `src/data/catalogue.ts`). The SVG system is a legitimate interim strategy — the design specification should work with both SVG and real photography.

**Products defined in:** `src/data/catalogue.ts` → references `src/data/products.ts` → re-exports from `src/data/catalogue.ts`

#### Category B: Brand & Editorial SVG Assets

**Location:** `public/images/home/` (21 files), `public/images/collections/*/` (18 files), `public/images/hero/` (10 files)
**Count:** ~49 SVG files

**Classification:** These are **intentional brand graphic assets**. Many are illustrative editorial compositions that function as visual treatments — category tiles, collection gallery images, hero fallbacks, editorial features.

**Specific breakdown:**

- `public/images/home/category-*.svg` (4 files) — Category showcase tiles. Intentional graphical treatments representing Tees, Hoodies, Outerwear, Accessories. **Keep unless replaced with real photography.**
- `public/images/home/collection-*.svg` (2 files) — Collection showcase tiles. **Keep.**
- `public/images/home/craft-*.svg` (1 file) — Craft story editorial image. **Keep unless replaced.**
- `public/images/home/curated-*.svg` (5 files) — Curated product editorial images. **Keep unless replaced.**
- `public/images/home/editorial-*.svg` (2 files) — Editorial feature images. **Keep unless replaced.**
- `public/images/home/featured-*.svg` (2 files) — Featured fashion editorial images. **Keep unless replaced.**
- `public/images/home/new-drop-*.svg` (3 files) — New drop product images. **Keep unless replaced.**
- `public/images/home/susworld-teaser.svg` (1 file) — SUS World teaser background. **Keep unless replaced.**
- `public/images/collections/*/gallery-*.svg` (12 files) — Collection campaign gallery images. **Keep unless replaced with real campaign photography.**
- `public/images/collections/*/hero-*.svg` (6 files) — Collection hero images. **Keep unless replaced.**
- `public/images/hero/hero-*.svg` (10 files) — Hero carousel fallbacks and variants. **Keep as fallback assets.**

#### Category C: Real Photography

**Location:** `public/images/campaign/` (10 WebP files), `public/images/ai/` (source + processed files)
**Count:** 10 campaign WebPs + AI generation source/processed files

**Classification:** **Real campaign photography.** These are the production-quality fashion photographs that define the visual standard for the brand.

**Campaign WebPs:**
- `campaign-01-desktop.webp` — Full-width desktop hero
- `campaign-01-desktop-1600.webp` — Mid-width desktop variant
- `campaign-01-editorial.webp` — Editorial crop
- `campaign-01-mobile.webp` — Mobile art-directed crop
- `campaign-01-hero-mobile.webp` — Mobile hero variant
- `campaign-02-desktop.webp` — Second campaign desktop
- `campaign-02-desktop-1600.webp` — Second campaign mid-width
- `campaign-02-editorial.webp` — Second campaign editorial
- `campaign-02-mobile.webp` — Second campaign mobile
- `campaign-02-hero-mobile.webp` — Second campaign mobile hero

**Referenced by:** `src/data/hero.ts`, `src/data/collections.ts`, `src/data/homepage.ts`, `src/data/editorial.ts`, `src/data/world.ts`

#### Category D: Fallback Placeholders

**Location:** `public/images/placeholders/`
**Count:** 3 SVG files
**Classification:** **Intentional fallback assets** for missing images. Used by the `Media` component and image error states.

### Design Implication

The design specification is written to work with the current asset system. SVG assets are treated as legitimate visual content, not problems to solve. When real photography becomes available, it enhances the design but does not gate it.

---

## 4. Design Problems

Problems ranked by impact on the luxury perception.

### P0 — Critical

| # | Problem | Impact | Current State |
|---|---------|--------|---------------|
| 1 | Product detail page lacks immersion | Highest-conversion page feels generic | `ProductPage.tsx` — functional gallery, no sticky panel, no zoom, no editorial framing |
| 2 | No spatial depth or 3D anywhere | Site feels flat compared to luxury competitors | Zero CSS 3D transforms, zero perspective, zero depth effects |

### P1 — High Impact

| # | Problem | Impact | Current State |
|---|---------|--------|---------------|
| 3 | No page transitions | Hard cuts between routes feel jarring | Next.js default instant navigation |
| 4 | Homepage section rhythm is uniform | 13 sections with same pacing feels long | `HomePage.tsx` — all sections use same `Section` wrapper with identical spacing |
| 5 | Product cards lack hover depth | Cards feel static and unresponsive | `ProductCard.tsx` — only opacity/scale on hover |
| 6 | Footer is minimal | Last impression is forgettable | `Footer.tsx` — basic 4-column grid, no brand expression |
| 7 | Motion vocabulary is limited | Only scroll reveals + hero parallax | `Reveal.tsx` — 4 variants (fade/reveal/zoom/slide), no blur, no cinematic timing |

### P2 — Enhancement

| # | Problem | Impact | Current State |
|---|---------|--------|---------------|
| 8 | Collection gallery lightbox is functional but basic | Doesn't feel premium | `CollectionGallery.tsx` — functional with prev/next, but basic transitions |
| 9 | No visual variety in card treatments | All cards follow identical pattern | ProductCard, CollectionCard, EditorialCard all same structure |
| 10 | Search overlay could be richer | Functional but not delightful | `SearchOverlay.tsx` — working search, no recent/trending |
| 11 | About page has no imagery | Text-only brand story | `AboutPage.tsx` — no photos of founder, studio, Jos |
| 12 | Editorial lacks category filtering | All stories in flat grid | `EditorialPage.tsx` — no filter by craft/culture/style |

### P3 — Future / Content Dependent

| # | Problem | Impact | Current State |
|---|---------|--------|---------------|
| 13 | Most product images are SVG | Visual richness limited by placeholder content | 96 SVGs in `/shop/`, ~49 in `/home/` and `/collections/` |
| 14 | Only 2 hero campaign photo sets | Hero variety limited | 2 campaigns × 5 crops = 10 WebPs |
| 15 | No video content | Missing motion storytelling medium | Zero video files in `/public/` |

---

## 5. Luxury Design Principles

### Principle 1: Restraint Over Excess

Fewer elements, more impact. Every element on the page must earn its place. If removing something doesn't hurt the experience, remove it.

**Implementation:**
- Maximum 3 typography levels visible in any single viewport
- Maximum 2 accent color applications per section
- White space is a design element, not empty space to fill
- Borders and dividers used sparingly — prefer spatial separation

### Principle 2: Photography IS the Design

Images carry the brand. UI elements frame and support imagery, never compete with it.

**Implementation:**
- Hero images fill 100% of viewport width
- Product images use full available column width
- Collection galleries use asymmetric editorial layouts
- Image hover effects are subtle (scale 1.02 max, not 1.1+)
- Text overlays on images use gradient scrims, not solid backgrounds

### Principle 3: Spatial Composition

Depth comes from layering, not boxes. Elements exist on planes — some near, some far.

**Implementation:**
- Hero uses 5-layer z-stacking (existing system — enhance)
- Cards gain subtle perspective tilt on hover (2-3°)
- Navigation floats on a nearer plane than content
- Scroll parallax creates depth between foreground/background
- Shadows indicate elevation, not decoration

### Principle 4: Typographic Hierarchy as Architecture

Oversized display type creates visual anchors. Quiet metadata provides context. The contrast between large and small creates rhythm.

**Implementation:**
- Display type: Cormorant Garamond, 3rem–8.5rem, uppercase, tight leading
- Body type: Manrope, 1rem, light weight, generous leading
- Metadata: Manrope, 0.6875rem, uppercase, wide tracking
- Navigation: Manrope, 0.75rem, uppercase, 0.22em tracking
- Never use more than 2 font families (keep existing: Cormorant + Manrope)

### Principle 5: Materiality

Surfaces feel tactile. The dark background is not a void — it's a material.

**Implementation:**
- Subtle film grain on hero environment (existing `hero.css` SVG noise — extend to select sections)
- Soft shadows on elevated surfaces (not hard drop shadows)
- Glass surfaces use warm-tinted blur, not cold/blue
- Border colors are warm (#2a2620), not cool gray
- Selection color uses accent (existing — keep)

### Principle 6: Deliberate Motion

Slow, cinematic, purposeful. Motion guides attention, never decorates.

**Implementation:**
- Page transitions: 800ms fade + subtle translateY
- Scroll reveals: 560ms with accent easing (existing — keep)
- Hover effects: 280ms standard easing
- Hero crossfade: 1400ms (existing — keep)
- Never use bounce/spring for primary interactions
- Never animate more than 2 properties simultaneously
- All motion gated behind `prefers-reduced-motion`

### Principle 7: Dark Luxury as Asset

The dark palette (#0b0a09 base) is a deliberate luxury choice, not a limitation. It creates contrast that makes imagery and accent colors pop.

**Implementation:**
- Never switch to light mode
- Use warm near-black for all backgrounds
- Cream text (#f2ede4) on dark creates 14.8:1 contrast ratio (WCAG AAA)
- Champagne accent (#c2a878) reads as gold on dark
- Elevated surfaces use slightly lighter darks (#171513, #1e1b18)

---

## 6. Proposed Visual System

### Foundation (Keep Existing)

The existing visual foundation is strong. The following are retained without modification:

- **Background:** #0b0a09 (warm near-black)
- **Surface:** #171513
- **Surface elevated:** #1e1b18
- **Foreground:** #f2ede4 (warm cream)
- **Accent:** #c2a878 (champagne/bronze)
- **Display font:** Cormorant Garamond (variable 300-700)
- **Body font:** Manrope (variable 200-800)
- **Sidebar layout:** 15.5rem fixed left rail on desktop

### Additions

**New surfaces:**
- Glass surface: `rgba(23, 21, 19, 0.72)` with `backdrop-filter: blur(16px)` (see Section 24)
- Subtle grain overlay: extend hero film grain to select sections

**New accent treatment:**
- Metallic gradient: `linear-gradient(135deg, #c2a878, #d4bd91, #c2a878)` — use ONLY for premium accent moments (e.g., "Est. 2019" badge, collection status labels). Maximum 1-2 applications per page.

**New elevation system:**
- Level 0: Background (#0b0a09) — flat content
- Level 1: Surface (#171513) — cards, panels
- Level 2: Surface elevated (#1e1b18) — floating elements
- Level 3: Glass surface — overlays, navigation

---

## 7. Typography System

### Current System (Keep)

The existing 13-level typography scale in `src/styles/typography.css` is excellent. All levels are retained:

| Level | Font | Size | Weight | Line Height | Tracking | Transform |
|-------|------|------|--------|-------------|----------|-----------|
| `.type-display` | Cormorant | clamp(3rem, 8vw, 7.5rem) | 400 | 0.95 | -0.01em | uppercase |
| `.type-hero` | Cormorant | clamp(2.5rem, 5.5vw, 4.75rem) | 400 | 1.02 | -0.005em | uppercase |
| `.type-manifesto` | Cormorant | clamp(2.5rem, 8vw, 8.5rem) | 400 | 0.98 | -0.01em | uppercase |
| `.type-h1` | Cormorant | clamp(2rem, 4vw, 3.5rem) | 400 | 1.05 | — | uppercase |
| `.type-h2` | Cormorant | clamp(1.5rem, 3vw, 2.5rem) | 400 | 1.1 | — | uppercase |
| `.type-h3` | Cormorant | clamp(1.125rem, 2vw, 1.625rem) | 500 | 1.2 | — | — |
| `.type-editorial` | Cormorant | clamp(1.25rem, 2.25vw, 1.75rem) | 300 | 1.45 | — | — |
| `.type-body` | Manrope | 1rem | 300 | 1.7 | 0.01em | — |
| `.type-body-small` | Manrope | 0.875rem | 300 | 1.6 | — | — |
| `.type-nav` | Manrope | 0.75rem | 500 | 1.2 | 0.22em | uppercase |
| `.type-metadata` | Manrope | 0.6875rem | 500 | 1.3 | 0.18em | uppercase |
| `.type-price` | Manrope | 0.9375rem | 400 | — | 0.02em | — |
| `.type-button` | Manrope | 0.75rem | 600 | 1 | 0.2em | uppercase |

### Additions

**MUST implement — `.type-quote`:**

Oversized pull quotes for editorial moments. Used on About, Editorial, Collection story sections.

```css
.type-quote {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 4rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.15;
  letter-spacing: -0.005em;
}
```

**MUST implement — `.type-label`:**

Micro-labels for ultra-fine categorization. Used for image captions, timestamp metadata, fine print.

```css
.type-label {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

### Font Loading (Keep Existing)

The self-hosted font system in `src/styles/fonts.css` is production-quality. No changes needed:
- Cormorant Garamond variable (300-700) with 6 unicode-range subsets + metric-compatible fallback
- Manrope variable (200-800) with 6 unicode-range subsets + metric-compatible fallback
- `font-display: swap` on all faces
- CSS custom properties: `--font-sus-display`, `--font-sus-sans`

---

## 8. Color System

### Complete Token Map

```css
:root {
  /* === Backgrounds === */
  --color-background:           #0b0a09;  /* Primary background — warm near-black */
  --color-background-secondary: #121010;  /* Secondary background */
  --color-surface:              #171513;  /* Cards, panels */
  --color-surface-elevated:     #1e1b18;  /* Floating elements */

  /* === Text === */
  --color-foreground:           #f2ede4;  /* Primary text — warm cream */
  --color-foreground-secondary: #c7c0b3;  /* Secondary text */
  --color-foreground-muted:     #8a8375;  /* Muted text — metadata, labels */

  /* === Structure === */
  --color-border:               #2a2620;  /* Default borders — warm dark */
  --color-border-strong:        #3a342b;  /* Emphasized borders */

  /* === Accent === */
  --color-accent:               #c2a878;  /* Champagne/bronze */
  --color-accent-hover:         #d4bd91;  /* Accent hover state */
  --color-accent-muted:         #8c7c58;  /* Muted accent */
  --color-accent-contrast:      #100d09;  /* Text on accent background */

  /* === Status === */
  --color-success:              #7ba05b;
  --color-warning:              #c9a227;
  --color-error:                #c1554b;
}
```

### New Tokens (Add)

```css
:root {
  /* === Glass === */
  --glass-bg:                   rgba(23, 21, 19, 0.72);
  --glass-blur:                 16px;
  --glass-border:               rgba(42, 38, 32, 0.5);

  /* === Metallic (use sparingly — max 1-2 per page) === */
  --gradient-metallic:          linear-gradient(135deg, #c2a878, #d4bd91, #c2a878);
}
```

### Color Usage Rules

1. **Backgrounds** — always warm near-black. Never pure black (#000).
2. **Text** — always warm cream (#f2ede4). Never pure white (#fff).
3. **Accent** — champagne (#c2a878) for interactive elements, links, active states, CTAs.
4. **Borders** — warm dark (#2a2620). Never cool gray or blue-gray.
5. **Status colors** — use sparingly. Success for bag confirmation, error for validation, warning for low stock.
6. **Metallic gradient** — ONLY for premium accent moments: "Est. 2019" badge, "Limited" collection status, exclusive labels. Maximum 1-2 per page.
7. **Glass** — see Section 24 for specific usage rules.

---

## 9. Spacing System

### Current System (Keep)

```css
:root {
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --max-width-content: 88rem;
  --max-width-text: 68rem;
  --section-spacing-mobile: 5rem;
  --section-spacing-desktop: 8rem;
  --sidebar-width: 15.5rem;
  --header-height-mobile: 4rem;
  --utility-bar-height: 2.5rem;
}
```

### Modifications

**MUST implement — Increase section spacing:**

The current section spacing (5rem mobile / 8rem desktop) is slightly tight for a luxury feel. Increase to create more breathing room:

```css
:root {
  --section-spacing-mobile: 6rem;    /* was 5rem */
  --section-spacing-desktop: 10rem;  /* was 8rem */
}
```

**SHOULD implement — Add spacing scale:**

For consistent internal spacing within sections:

```css
:root {
  --space-xs:  0.5rem;   /* 8px */
  --space-sm:  1rem;     /* 16px */
  --space-md:  1.5rem;   /* 24px */
  --space-lg:  2.5rem;   /* 40px */
  --space-xl:  4rem;     /* 64px */
  --space-2xl: 6rem;     /* 96px */
  --space-3xl: 10rem;    /* 160px */
}
```

### Spacing Rules

1. **Section spacing** — use `--section-spacing-mobile` / `--section-spacing-desktop` via the `Section` component
2. **Container padding** — use `--gutter` via the `Container` component
3. **Card internal spacing** — use `--space-sm` to `--space-lg`
4. **Between related elements** — use `--space-xs` to `--space-sm`
5. **Between unrelated sections** — use `--space-xl` to `--space-2xl`
6. **Never use arbitrary Tailwind values** for spacing — always use tokens

---

## 10. Radius & Shadow System

### Radius

Luxury fashion avoids excessive rounded UI. The existing approach (mostly sharp corners) is correct.

**Rules:**
- **Product cards:** No border-radius (sharp corners). Current: no radius — keep.
- **Buttons:** No border-radius. Current: no radius on `Button.tsx` — keep.
- **Color swatches:** `rounded-full` (circular). Current: keep.
- **Lightbox close button:** `rounded-full`. Current: keep.
- **Badges:** No border-radius. Current: no radius — keep.
- **Glass surfaces:** Subtle radius only when overlapping content: `border-radius: 2px`. Do not use rounded glass cards.
- **Modals/overlays:** No border-radius. Full-bleed or sharp corners.

### Shadow

**Current state:** No explicit shadow system. Shadows are implied through background color layering.

**MUST implement — Shadow tokens:**

```css
:root {
  --shadow-sm:  0 1px 2px rgba(11, 10, 9, 0.3);
  --shadow-md:  0 4px 12px rgba(11, 10, 9, 0.4);
  --shadow-lg:  0 8px 32px rgba(11, 10, 9, 0.5);
  --shadow-xl:  0 16px 64px rgba(11, 10, 9, 0.6);
}
```

**Usage:**
- `--shadow-sm` — subtle lift on hover for cards
- `--shadow-md` — floating elements (dropdowns, popovers)
- `--shadow-lg` — modals, lightbox
- `--shadow-xl` — hero-level immersion (used very sparingly)

Shadows are always warm-toned (matching the #0b0a09 base), never cool/blue.

---

## 11. Component System

### New Primitives (MUST implement)

#### `GlassSurface`

Luxury glass panel component. Wraps children in a glass-treated container.

**Props:**
```ts
interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
  as?: ElementType; // default: 'div'
}
```

**Implementation:**
```tsx
<div className={cn(
  "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-border)] border border-[var(--glass-border)]",
  className
)}>
  {children}
</div>
```

**Usage:** Mobile header background, floating product controls, modal surfaces. See Section 24 for full glass strategy.

#### `DepthCard`

Card with CSS 3D perspective tilt on pointer hover.

**Props:**
```ts
interface DepthCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // 0-1, default 0.5
}
```

**Implementation:**
- Container: `perspective: 800px`
- Inner: `transform: perspective(800px) rotateX(var(--rx, 0)) rotateY(var(--ry, 0))`
- Pointer move sets `--rx` and `--ry` via `requestAnimationFrame`
- Max rotation: 2-3° (never more)
- On pointer leave: animate back to 0,0 over 280ms
- Respects `prefers-reduced-motion`: disable tilt, keep static

**Usage:** Product cards, collection cards, editorial cards.

#### `ParallaxSection`

Scroll-driven parallax wrapper. Children shift at a different rate than the scroll.

**Props:**
```ts
interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // 0-1, default 0.3 (how much parallax)
  className?: string;
}
```

**Implementation:**
- Uses `IntersectionObserver` to detect viewport position
- Applies `transform: translateY(offset)` based on scroll position
- Offset = (viewportCenter - elementCenter) × speed × -1
- Capped at ±50px maximum offset
- Respects `prefers-reduced-motion`: disable parallax

**Usage:** Collection heroes, homepage editorial sections, SUS World teaser.

### Enhanced Existing Components (MUST implement)

#### `ProductCard` enhancements

Current: `src/components/product/ProductCard.tsx` — 128 lines, hover opacity swap, metadata, color swatches, price.

**Changes:**
1. Wrap card link in `DepthCard` for perspective tilt on hover
2. Add shadow elevation on hover: `box-shadow: var(--shadow-sm)` → `var(--shadow-md)`
3. Increase hover image scale from implicit to explicit: `scale(1.02)` (currently uses group-hover from parent)
4. Add collection label badge when product is in a collection

**File:** `src/components/product/ProductCard.tsx`
**Lines affected:** ~20 lines of wrapper changes

#### `Reveal` enhancements

Current: `src/components/motion/Reveal.tsx` — 50 lines, 4 variants (fade/reveal/zoom/slide).

**Changes:**
1. Add `blur` variant: starts with `filter: blur(8px); opacity: 0`, transitions to `blur(0); opacity: 1`
2. Add `blur-reveal` variant: combines translateY + blur for richer entrance

**New CSS in `motion.css`:**
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

**File:** `src/styles/motion.css` (add ~20 lines), `src/components/motion/Reveal.tsx` (update variant mapping)

### New Page-Level Components (MUST implement)

#### `PageTransition`

Route transition wrapper that fades content on navigation.

**Implementation approach:**
- Wrap `{children}` in `src/app/layout.tsx` (inside `AppShell`)
- Use Next.js `usePathname()` to detect route changes
- On path change: animate opacity 1→0 + translateY(0→-8px), then swap content, then animate 0→1 + translateY(-8px→0)
- Total duration: 800ms (cinematic)
- Use CSS transitions, not JS animation library

**File:** New file `src/components/layout/PageTransition.tsx`

#### `ProductImageViewer`

Immersive product image component with click-to-zoom and pan.

**Props:**
```ts
interface ProductImageViewerProps {
  src: string;
  alt: string;
  priority?: boolean;
}
```

**Behavior:**
- Default state: full-width product image with art-directed framing
- Click: zoom to 2× with smooth transition (300ms)
- While zoomed: drag to pan (touch + mouse)
- Click again or Escape: zoom out
- Mobile: pinch-to-zoom support
- Lazy loading for below-fold images

**File:** New file `src/components/product/ProductImageViewer.tsx`

---

## 12. Motion System

### Duration Scale

```css
:root {
  --duration-fast:      160ms;  /* Micro-interactions: focus, toggle */
  --duration-standard:  280ms;  /* Hover states, small transitions */
  --duration-slow:      560ms;  /* Scroll reveals, image hovers */
  --duration-cinematic: 800ms;  /* NEW: Page transitions, major reveals */
  --duration-dramatic:  1200ms; /* NEW: Hero-level moments, 3D transitions */
}
```

### Easing Scale

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);     /* Keep: Material-style ease */
  --ease-accent:   cubic-bezier(0.22, 1, 0.36, 1);    /* Keep: Dramatic ease-out */
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);    /* NEW: Slow luxurious deceleration */
}
```

### Motion Language

| Interaction | Duration | Easing | Properties | Notes |
|------------|----------|--------|------------|-------|
| **Page transition out** | 400ms | ease-standard | opacity, translateY(-8px) | Content fades and lifts |
| **Page transition in** | 800ms | ease-cinematic | opacity, translateY(8px→0) | Content settles in |
| **Scroll reveal** | 560ms | ease-accent | opacity, transform | Existing — keep |
| **Scroll reveal (blur)** | 560ms | ease-accent | opacity, filter, transform | New variant |
| **Card hover tilt** | 280ms | ease-standard | rotateX, rotateY | Max 2-3° |
| **Card hover shadow** | 280ms | ease-standard | box-shadow | sm→md |
| **Image hover scale** | 560ms | ease-accent | transform | 1→1.02 max |
| **Link underline** | 280ms | ease-standard | width (via ::after) | Existing — keep |
| **Button hover** | 280ms | ease-standard | background-color, color | Existing — keep |
| **Modal entrance** | 280ms | ease-accent | opacity, scale(0.98→1) | Existing lightbox pattern |
| **Modal backdrop** | 280ms | ease-standard | opacity | Existing — keep |
| **Hero crossfade** | 1400ms | ease-cinematic | opacity, scale | Existing — keep |
| **Hero parallax** | continuous | — | translate3d | Existing — keep |
| **Navigation slide** | 280ms | ease-accent | transform | Menu/filter drawer |
| **Accordion expand** | 280ms | ease-standard | hidden attribute + rotate | Existing — keep |

### Rules

1. **Maximum 2 simultaneous property animations** per element
2. **Never bounce** — no spring physics on primary interactions
3. **Never animate color** — use opacity transitions instead
4. **Stagger reveals** — 80-100ms delay between sibling elements (existing pattern)
5. **Hero has its own timing** — hero transitions are deliberately slower (1400ms)
6. **prefers-reduced-motion** — ALL motion gated. See Section 26.

---

## 13. 3D Strategy

### Guiding Principle

**The luxury target is achievable without any 3D library.** CSS-first architecture provides all the depth, perspective, and spatial composition needed for a premium experience. React Three Fiber is an optional enhancement, not a requirement.

### CSS 3D (MUST implement)

All spatial depth effects use pure CSS transforms. No JavaScript animation libraries required.

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

JavaScript sets `--rx` and `--ry` based on pointer position (max ±3°). On pointer leave, reset to 0°.

**Usage:** Product cards, collection cards, editorial cards.

#### Scroll Parallax

```css
.parallax-layer {
  transform: translateY(var(--parallax-offset, 0px));
  will-change: transform;
}
```

JavaScript calculates `--parallax-offset` based on scroll position. Capped at ±50px.

**Usage:** Collection heroes, homepage editorial sections.

#### Hero Depth (Existing)

The hero system in `src/styles/hero.css` already uses CSS 3D:
- Z1 (photography): `translate3d` driven by pointer position
- Z3 (copy): `translate3d` at different rate than Z1
- Creates spatial depth between planes

**Enhancement:** Add Z0 (atmosphere) parallax at a third rate for deeper layering.

#### Page Transition Perspective

```css
.page-transition-enter {
  animation: page-in 800ms var(--ease-cinematic) both;
}

@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

### Optional R3F Experiment (OPTIONAL — behind performance gate)

React Three Fiber may be evaluated for two specific use cases. Both are strictly optional and must pass performance gates before shipping.

#### Experiment 1: Hero Atmosphere Enhancement

**What:** A subtle 3D fabric/garment silhouette floating in the Z0 atmosphere layer of the hero. Low-poly mesh with soft warm lighting. Barely visible — adds subliminal spatial depth behind the campaign photography.

**Performance gates (ALL must pass):**
1. Bundle impact < 50KB gzipped additional
2. Lighthouse Performance score ≥ 90 on test device
3. Mobile gracefully degrades to CSS-only (detect WebGL2, fall back)
4. Frame rate ≥ 30fps on mid-range Android device
5. No CLS regression

**Implementation if approved:**
- Dynamic import: `next/dynamic(() => import('./HeroAtmosphere'), { ssr: false })`
- Rendered inside `Hero.tsx` at Z0 layer
- Three.js Scene with single mesh, soft ambient + directional light
- Mouse-reactive rotation (subtle, 5-10° range)
- Transparent background (alpha: true)
- Scoped to hero only — no other pages

**Fallback:** If gates not met, the existing CSS grain/noise atmosphere in Z0 is sufficient.

#### Experiment 2: Product Wireframe Viewer

**What:** For select hero products, an interactive 3D wireframe that can be rotated to show garment construction.

**Performance gates (ALL must pass):**
1. Bundle impact < 30KB gzipped additional (beyond Experiment 1)
2. Only loads on product detail pages with 3D model data
3. Mobile: show static image instead
4. Lazy-load: only initialize when user scrolls to product section

**Implementation if approved:**
- Dynamic import with `{ ssr: false }`
- Pre-made .glb wireframe models (requires 3D asset creation — FUTURE dependency)
- OrbitControls for user interaction
- Wireframe material with accent color

**This experiment requires 3D model assets that do not currently exist.** It is a FUTURE consideration, not part of the initial redesign.

### Mobile 3D Behavior

- On devices without WebGL2 support: all 3D effects disabled, CSS-only fallback
- On coarse pointer devices (touch): disable perspective tilt on cards (no hover on touch)
- Parallax: reduce speed by 50% on mobile for smoother performance
- R3F experiments: disabled on mobile entirely during initial rollout

---

## 14. Image Strategy

### Design for Real Photography

The design specification is written to work with both the current SVG asset system and future real photography. The SVGs are treated as legitimate interim visual content.

### Photography Direction (FUTURE dependency)

When real fashion photography is acquired, it should follow this creative direction:

**Lighting:** Warm, cinematic, directional. Matches the existing 10 campaign WebPs. Dark backgrounds with warm key light. Never flat catalog lighting.

**Composition:** Editorial framing. Negative space. Asymmetric. Models in motion or at ease — never stiff catalog poses. Fabric detail shots showing texture, drape, weight.

**Context:** Jos, Plateau State environments. Studio settings. Urban contexts. The brand's origin is a visual asset.

**Color grading:** Warm tones consistent with the champagne/bronze accent palette. Skin tones natural and warm.

**Casting:** 50% men / 50% women (per `BRAND.casting`). Diverse representation.

### Image Treatment System

| Context | Aspect Ratio | Hover Effect | Loading | Component |
|---------|-------------|-------------|---------|-----------|
| Hero (desktop) | Full viewport | Parallax drift | Priority | `HeroMedia` |
| Hero (mobile) | Full viewport | Parallax drift | Priority | `HeroMedia` |
| Product card | 4/5 | Crossfade to second image | Lazy | `ProductCard` |
| Product detail main | 1/1 or 4/5 | Click to zoom | Priority | `ProductImageViewer` (NEW) |
| Product detail thumb | 1/1 | Border accent on active | Lazy | `ProductPage` |
| Collection hero | Full bleed | Parallax | Priority | `CollectionHero` |
| Collection gallery | Mixed (16:9, 3:4, 21:9) | Scale 1.02 | Lazy | `CollectionGallery` |
| Editorial card | 4/5 | Scale 1.04 | Lazy | `EditorialPage` |
| SUS World card | 4/5 | Scale 1.04 | Lazy | `SusWorldPage` |
| Homepage feature | 16:10 or 4:5 | Scale 1.02 | Lazy | Various home components |

### Next.js Image Configuration (Keep Existing)

```ts
// next.config.ts
images: {
  qualities: [50, 75, 90],
  deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 2560],
  imageSizes: [32, 64, 96, 128, 256, 384],
}
```

Quality tiers: 50 (thumbnails), 75 (default), 90 (hero/full-bleed).

### Image Placeholder Strategy

For images that haven't loaded yet, use the existing skeleton/shimmer pattern from `hero.css`:

```css
.hero-skeleton {
  background: var(--color-background);
  animation: hero-skeleton-pulse 1.8s ease-in-out infinite;
}
```

Extend this pattern to product cards and other image containers.

---

## 15. Homepage Redesign

### Status: HYPOTHESIS — Requires Validation

The proposed restructuring is based on content audit and pacing analysis. It must be validated against actual content flow before implementation.

### Current Architecture (13 sections)

```
1.  Hero                    — Cinematic carousel (KEEP — enhance)
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

### Proposed Architecture (9 sections — hypothesis)

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

### Section-by-Section Specification

#### Section 1: HERO (KEEP — enhance)

**File:** `src/components/hero/Hero.tsx`
**Purpose:** First impression. Cinematic campaign imagery.
**Layout:** Full viewport (100svh on mobile, 100svh - utility bar on desktop)
**Imagery:** Campaign WebPs from `src/data/hero.ts` (currently 2 slides)
**Typography:** Campaign headline (display type), description (body), CTA (underline link)
**Motion:** 5-layer parallax, 1400ms crossfade, staggered text reveals (existing — keep)
**3D opportunity:** OPTIONAL R3F atmosphere experiment (see Section 13)
**Mobile:** Full viewport, transparent header floats over, parallax disabled on coarse pointers

**Changes from current:**
- Add Z0 parallax at different rate than Z1 for deeper layering
- Enhance scroll indicator with accent color animation
- No structural changes — the hero system is production-quality

#### Section 2: BRAND STATEMENT (Merge BrandIntro + BrandManifesto)

**Current files:** `BrandIntro.tsx`, `BrandManifesto.tsx`
**Proposed file:** New `BrandStatement.tsx` (or rename existing)
**Purpose:** Establish brand identity in 3 seconds after hero scroll
**Layout:** Full-width, centered text, generous vertical spacing

**Content (from existing `src/data/homepage.ts`):**
- Manifesto lines: "Rooted in Nigerian craft." / "Designed for every expression." (from `MANIFESTO`)
- Supporting text from `BRAND_INTRO.supporting`
- Facts grid: Founded 2019 / Origin Jos / Craft unisex (from `BRAND_INTRO.facts`)

**Typography:**
- Manifesto: `.type-manifesto` (existing oversized display)
- Supporting: `.type-editorial`
- Facts: `.type-metadata` labels + `.type-body` values

**Motion:** Staggered Reveal with blur variant for manifesto lines

**Validation needed:** Does merging lose the brand introduction flow? Test with users.

#### Section 3: FEATURED COLLECTION (Merge FeaturedFashion + CollectionShowcase)

**Current files:** `FeaturedFashion.tsx`, `CollectionShowcase.tsx`
**Proposed file:** New `FeaturedCollection.tsx`
**Purpose:** Drive to shop with strongest visual content
**Layout:** 2-column hero (men/women tiles) + 3 collection cards below

**Content (from `src/data/homepage.ts`):**
- 2 featured fashion items from `FEATURED_FASHION.items`
- 3 collection cards from `COLLECTIONS` array

**Imagery:** Campaign editorial WebPs (desktop only — no mobile variants for these)

**Motion:**
- 2 large tiles: `DepthCard` with perspective tilt on hover
- 3 collection cards: `DepthCard` with glass overlay on hover
- Staggered Reveal on scroll

**Validation needed:** Does merging create a section that's too tall? Should these remain separate for pacing?

#### Section 4: NEW DROP (Enhance NewDropSection)

**File:** `src/components/home/NewDropSection.tsx`
**Purpose:** Commerce conversion — latest products
**Layout:** 1 featured product (large) + 2 supporting products (smaller)

**Content (from `src/data/homepage.ts`):**
- Eyebrow, title, description from `NEW_DROP_COPY`
- Products from `NEW_DROP_PRODUCTS`

**Motion:** Reveal animations (existing)

**Changes:**
- Featured product: larger image, add `DepthCard` treatment
- Supporting products: standard `ProductCard` with depth

#### Section 5: CATEGORY GRID (Enhance CategoryShowcase)

**File:** `src/components/home/CategoryShowcase.tsx`
**Purpose:** Browse by product category
**Layout:** Asymmetric grid — 1 large + 3 small

**Content (from `src/data/homepage.ts`):**
- Categories from `CATEGORY_SHOWCASE.items` (Tees, Hoodies, Outerwear, Accessories)

**Changes:**
- Wrap category tiles in `DepthCard` for perspective tilt on hover
- Add subtle shadow elevation on hover
- Image hover: scale 1.02 (existing)

#### Section 6: EDITORIAL MOMENT (Merge EditorialFeature + CraftStory)

**Current files:** `EditorialFeature.tsx`, `CraftStory.tsx`
**Proposed file:** New `EditorialMoment.tsx`
**Purpose:** Brand depth — editorial + craftsmanship in one beat
**Layout:** 2-column — editorial text left, large image right

**Content:**
- Editorial heading + pull quote from `EDITORIAL_FEATURE` (from `src/data/editorial.ts`)
- Craft story paragraphs from `CRAFT_STORY` (from `src/data/homepage.ts`)
- CTA to About page

**Typography:**
- Heading: `.type-h2`
- Pull quote: `.type-quote` (new — see Section 7)
- Body: `.type-body`

**Motion:** Staggered Reveal with blur variant

**Validation needed:** Does merging lose the distinct editorial and craft narratives? Should they remain separate for storytelling depth?

#### Section 7: SUS WORLD TEASER (Enhance SusWorldTeaser)

**File:** `src/components/home/SusWorldTeaser.tsx`
**Purpose:** World-building — invite into the brand universe
**Layout:** Full-viewport immersive section (80-90vh)

**Content (from `src/data/homepage.ts`):**
- From `SUS_WORLD_TEASER`: eyebrow, title, statement, CTA, media

**Changes:**
- Add `ParallaxSection` wrapper for background image depth
- Background image parallax at 0.3 speed
- Typography remains centered with dark overlay

#### Section 8: NEWSLETTER (Enhance NewsletterSection)

**File:** `src/components/home/NewsletterSection.tsx`
**Purpose:** Email capture
**Layout:** 2-column — heading/description left, form right

**Content (from `src/data/homepage.ts`):**
- From `NEWSLETTER_COPY`: eyebrow, title, description

**Changes:**
- Form input: add glass background treatment
- Button: accent filled style (existing — keep)
- Add success state with check animation

#### Section 9: CONTACT CTA (Merge WhatsAppCta + contact options)

**Current file:** `WhatsAppCta.tsx`
**Proposed file:** New `ContactCta.tsx`
**Purpose:** Direct conversion — WhatsApp, email, custom requests
**Layout:** Centered text + dual CTAs

**Content (from `src/data/homepage.ts`):**
- From `CONTACT_CTA`: title, description, primary (WhatsApp), secondary (custom request)

**Changes:**
- Both CTAs in single section
- WhatsApp when configured, email fallback (existing logic — keep)
- Add subtle background differentiation from newsletter section

### Removed Sections

- **NeonTeaser:** Conditionally hidden (only visible when AI_NEON is configured). Remove from homepage. If Neon launches, add back.
- **Duplicate newsletter:** Newsletter appears only once (Section 8), not again near footer.

### Content Validation Checklist

Before implementing the homepage restructure, verify:

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

---

## 16. Shop Redesign

### Current Architecture

**File:** `src/app/shop/page.tsx` + `src/components/shop/*`
**Components:** ShopHeader, CategoryNav, ShopToolbar, FilterPanel, ActiveFilterChips, ProductGrid, Pagination, ShopEditorial, SearchOverlay, EmptyState

### Changes

#### Product Grid (MUST implement)

**File:** `src/components/shop/ProductGrid.tsx` + `src/components/product/ProductCard.tsx`

**Enhancements:**
1. Wrap each `ProductCard` in `DepthCard` for perspective tilt on hover
2. Add shadow elevation: `var(--shadow-sm)` resting → `var(--shadow-md)` on hover
3. Image hover: crossfade to second image (existing — keep), add scale(1.02)
4. Tighten grid gap slightly: from `gap-x-6 gap-y-12` to `gap-x-5 gap-y-10`
5. Add collection label badge on cards (if product belongs to a collection)

**Grid columns (keep existing):**
- Mobile: 2 columns
- Tablet: 2-3 columns
- Desktop: 3-4 columns

#### Shop Header (SHOULD implement)

**File:** `src/components/shop/ShopHeader.tsx`

**Enhancement:**
- Oversized editorial heading "The collection." (existing — keep)
- Add subtle background: slightly lighter than page background for visual separation
- Typography: keep `.type-hero` for heading

#### Category Navigation (Keep Existing)

**File:** `src/components/shop/CategoryNav.tsx`

No changes needed. The horizontal scrollable tabs with accent underline are well-designed.

#### Filter System (Keep Existing)

**Files:** `FilterPanel.tsx`, `FilterFields.tsx`, `ActiveFilterChips.tsx`

No structural changes. The filter system is well-built with:
- Desktop sidebar panel
- Mobile bottom-sheet drawer
- URL search params for state
- Focus trapping and Escape handling

**Minor enhancement:** Add glass treatment to filter drawer header (see Section 24).

#### Search Overlay (SHOULD implement)

**File:** `src/components/shop/SearchOverlay.tsx`

**Enhancements:**
1. Add "Recent searches" section (store last 5 in localStorage)
2. Add "Browse by category" quick links below search input
3. Results: add subtle hover depth on result items

#### Shop Editorial (Keep Existing)

**File:** `src/components/shop/ShopEditorial.tsx`

No changes needed. The "Cut for him. Cut for her. Cut the same." editorial interlude with 2-column imagery and creative influence stats is well-designed.

---

## 17. Product Detail Redesign

### Priority: P0 — Highest Impact

This is the highest-conversion page and the most impactful redesign target.

### Current Architecture

**File:** `src/components/product/ProductPage.tsx` (530 lines)
**Layout:** 7/5 column grid — gallery left, purchase panel right
**Sections:** Gallery → Purchase panel → Accordion (Details, Size guide, Shipping) → Recently viewed

### Proposed Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb nav                                          │
├────────────────────────┬────────────────────────────────┤
│                        │                                │
│   PRODUCT IMAGE        │   CATEGORY · COLLECTION        │
│   VIEWER               │   Product Name                 │
│   (click to zoom)      │   Price                        │
│                        │   In stock / Low stock         │
│                        │                                │
│                        │   Colour — {name}              │
│                        │   [●] [●] [●] [●]             │
│                        │                                │
│   [thumb] [thumb]      │   Size — {size}               │
│   [thumb] [thumb]      │   [S] [M] [L] [XL]           │
│                        │   Size guide                   │
│                        │                                │
│                        │   Quantity                     │
│                        │   [−] 1 [+]                   │
│                        │                                │
│                        │   [ Add to bag ]               │
│                        │   [ Buy now ]                  │
│                        │                                │
├────────────────────────┴────────────────────────────────┤
│                                                         │
│   Details | Size guide | Shipping & returns             │
│   ─────────────────────────────────────────             │
│   [Accordion content]                                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Editorial product story                               │
│   "Every piece begins with craft..."                    │
│   Material · Fit · Care                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Complete the look                                     │
│   [ProductCard] [ProductCard] [ProductCard]             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Recently viewed                                       │
│   [ProductCard] [ProductCard] [ProductCard] [ProductCard]│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Changes

#### Gallery (MUST implement)

**Current:** `ProductPage.tsx` lines 221-257 — square aspect ratio image with 4-column thumbnail grid below.

**New: `ProductImageViewer` component**

Replace the static gallery with an immersive image viewer:

1. **Main image:** Full-width within column, click to zoom to 2×
2. **Zoom mode:** Drag to pan (touch + mouse), Escape/click to exit
3. **Thumbnails:** Keep existing 4-column grid, enhance active indicator with accent border + slight scale
4. **Image transitions:** Cinematic crossfade between gallery images (560ms)
5. **Mobile:** Swipe left/right to change image (add touch handler)

**File:** New `src/components/product/ProductImageViewer.tsx` + changes to `ProductPage.tsx`

#### Purchase Panel (MUST implement)

**Current:** `ProductPage.tsx` lines 260-388 — standard form layout.

**Enhancements:**
1. **Sticky on desktop:** Purchase panel sticks to top when scrolling past gallery (use `position: sticky; top: var(--utility-bar-height)`)
2. **Product name:** Use `.type-h2` instead of current `.type-h2` (already correct — keep)
3. **Color swatches:** Increase size from `h-10 w-10` to `h-11 w-11` for better touch targets
4. **Size buttons:** Add hover state with accent border (existing — keep)
5. **Add to bag button:** Keep accent filled style, add loading animation (existing — keep)
6. **Buy now button:** Keep outline style (existing — keep)
7. **Stock indicator:** Add subtle pulse animation for "Low stock" state

#### Accordion (Keep Existing)

**Current:** `ProductPage.tsx` lines 392-495 — working accordion with Details, Size guide, Shipping.

No structural changes. The accordion is well-built with proper ARIA attributes.

**Minor enhancement:** Add glass treatment to accordion headers on scroll (optional — see Section 24).

#### Editorial Story (SHOULD implement)

**New section below accordion**

Add a brief editorial block that tells the product's story:

- Material information (from `PRODUCT_DETAILS[category].material`)
- Fit notes (from `PRODUCT_DETAILS[category].fit`)
- Care instructions (from `PRODUCT_DETAILS[category].care`)
- Presented as editorial text, not just data fields

**Typography:** `.type-editorial` for heading, `.type-body` for details

#### Complete the Look (SHOULD implement)

Replace or supplement "Recently viewed" with curated complementary products:

- Products from the same collection
- Products that pair well (manual curation in data)
- Presented as `ProductCard` grid

#### Recently Viewed (Keep Existing)

**Current:** `ProductPage.tsx` lines 498-527 — 4-column grid of recently viewed products.

Keep existing functionality. The `recordRecent` / `readRecentProducts` system works well.

---

## 18. Collection Redesign

### Current Architecture (Strong — enhance, don't restructure)

**Files:** `src/components/collections/*` (12 components)
**Page flow:** CollectionNav → CollectionHero → CollectionIntro → CollectionFeatured → CollectionGallery → CollectionCatalogue → CollectionStory → CollectionRelated

### Changes

#### Collection Index (SHOULD implement)

**File:** `src/components/collections/CollectionIndex.tsx`

**Enhancements:**
1. Featured collection card: wider aspect (21:9), add `DepthCard` treatment
2. Standard cards: add perspective tilt on hover
3. Add horizontal scroll carousel for mobile (optional — see Section 33)

#### Collection Hero (SHOULD implement)

**File:** `src/components/collections/CollectionHero.tsx`

**Enhancements:**
1. Add `ParallaxSection` wrapper for background image depth
2. Background image drifts at 0.2 speed on scroll
3. Gradient treatment: keep existing warm/cool/exclusive systems
4. Typography: keep existing display type + body + CTA

#### Collection Gallery (SHOULD implement)

**File:** `src/components/collections/CollectionGallery.tsx`

**Enhancements:**
1. Lightbox: add cinematic entrance animation (scale 0.98→1 + opacity, 280ms)
2. Gallery images: add subtle shadow on hover
3. Lightbox navigation: add keyboard shortcut hints
4. Touch swipe: keep existing implementation

#### Collection Catalogue (Keep Existing)

**File:** `src/components/collections/CollectionCatalogue.tsx`

No changes needed. The collection-scoped filtering and pagination is well-built.

#### Collection Story (SHOULD implement)

**File:** `src/components/collections/CollectionStory.tsx`

**Enhancement:**
- Use `.type-quote` for editorial statements
- Add editorial image alongside story text (if available)

---

## 19. About Redesign

### Current Architecture

**File:** `src/components/about/AboutPage.tsx` (166 lines)
**Sections:** Hero → Origin → Values → Creative Influence

### Changes

#### Hero (SHOULD implement)

**Enhancement:**
- Add campaign image alongside text (use existing `campaign-01-editorial.webp`)
- Layout: 7/5 column — text left, image right
- Image: `Media` component with art-directed crop

#### Origin (SHOULD implement)

**Enhancement:**
- Add editorial image of Jos / studio (FUTURE photography dependency)
- For now: keep text-only with strong typography
- Add pull quote using `.type-quote` type level

#### Values (Keep Existing)

**Current:** 3 values with accent border-left treatment. Well-designed.

No changes needed.

#### Creative Influence (Keep Existing)

**Current:** "70% African. 30% Western. 100% SUS." section. Strong copy.

No changes needed.

#### New: Founder Section (FUTURE — requires photography)

**Add when founder photography is available:**
- Brief bio of Mr. Shedrack (use only verified facts from `src/data/brand.ts`)
- Portrait image
- Quote or statement

**Do NOT fabricate founder details beyond what exists in `BRAND` data.**

#### New: Timeline (SHOULD implement)

**Add key brand moments (verified facts only):**
- 2019: Founded in Jos, Plateau State, Nigeria
- Current: Three collections (Signature, After Dark, Limited)
- Current: Unisex fashion for men and women

**Do NOT invent milestones that don't exist.**

---

## 20. Editorial Redesign

### Current Architecture

**File:** `src/components/editorial/EditorialPage.tsx` (91 lines)
**Sections:** EditorialHero → Grid of editorial cards

### Changes

#### Hero (Keep Existing)

**Current:** Feature article with heading, intro, pull quote, and large image. Well-designed.

No structural changes.

#### Card Grid (SHOULD implement)

**Enhancement:**
1. Mixed-size grid: 1 large feature card + 2 medium + 3 standard (instead of uniform 3-column)
2. Add category filter tabs: All, Craft, Culture, Style, People, Place
3. Cards: add `DepthCard` treatment on hover
4. Add reading time estimate (calculate from body text length)

#### Category Filtering (SHOULD implement)

**Implementation:**
- Add filter state (URL param or local state)
- Filter `EDITORIAL_ENTRIES` by `category` field
- Animated layout transition when filter changes (CSS Grid reflow)

---

## 21. SUS World Redesign

### Current Architecture

**File:** `src/components/sus-world/SusWorldPage.tsx` (80 lines)
**Sections:** Hero → Grid of world story cards

### Changes

#### Hero (Keep Existing)

**Current:** Heading, editorial statement, clean typography. Well-designed.

No structural changes.

#### Card Grid (SHOULD implement)

**Enhancement:**
1. Category-grouped sections: People, City, Culture, Style, Art
2. Each category has its own heading + card row
3. Featured story spotlight (larger card at top)
4. Cards: add `DepthCard` treatment on hover

#### Category Navigation (SHOULD implement)

**Add horizontal category tabs** (similar to `CategoryNav` in shop):
- All, People, City, Culture, Style, Art
- Filter stories by category

---

## 22. Navigation Redesign

### Desktop Sidebar (SHOULD enhance)

**File:** `src/components/layout/DesktopSidebar.tsx` (151 lines)

**Enhancements:**
1. **Glass background on scroll:** When content scrolls past the sidebar top, add subtle glass treatment
   - Detect scroll position via IntersectionObserver on a sentinel element
   - Toggle `backdrop-blur-[8px]` class
2. **Active state glow:** Current active nav item gets subtle accent glow (box-shadow with accent color at low opacity)
3. **Search trigger:** Move search button to more prominent position (currently at bottom)

**Keep existing:**
- Numbered nav entries (01-07)
- Brand lockup
- Bag link
- WhatsApp link
- Currency display
- EST. 2019 badge

### Mobile Header (SHOULD enhance)

**File:** `src/components/layout/SiteHeader.tsx` (84 lines)

**Enhancements:**
1. **Smoother transparent → solid transition:** Current implementation uses IntersectionObserver (well-built). Enhance by adding `backdrop-blur` transition (currently abrupt)
2. **Bag count animation:** When item is added to bag, animate the count badge (scale pulse)

**Keep existing:**
- Transparent over hero, solid on scroll
- Hamburger → full-screen menu
- Brand lockup center

### Mobile Menu (SHOULD enhance)

**File:** `src/components/layout/MobileMenu.tsx` (152 lines)

**Enhancements:**
1. **Cinematic entrance:** Current fade-in (`.menu-panel` animation) is minimal. Enhance with scale(0.98→1) + fade, duration 280ms
2. **Featured image:** Add optional background image behind menu items (campaign photo at low opacity)

**Keep existing:**
- Full-screen overlay
- Numbered nav items with large display text
- Focus trapping
- Escape handling
- Bottom bar with search/bag/email

---

## 23. Footer Redesign

### Priority: P1 — High Impact

**File:** `src/components/layout/Footer.tsx` (122 lines)

### Current State

4-column grid: Brand story | Explore nav | Customer nav | Social links
Minimal, functional, forgettable.

### Proposed Redesign

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   SUS WEARS                                             │
│   Shedrack Unisex Stitches                              │
│                                                         │
│   Nigerian fashion from Jos, Plateau State,             │
│   cut unisex for men and women since 2019.              │
│                                                         │
│   The silhouette is the logo.                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Explore          Customer         Follow              │
│   ───────          ────────         ──────              │
│   Shop             Contact          Instagram           │
│   Collections      WhatsApp         TikTok              │
│   SUS World        Shopping         X                   │
│   Editorial                                              │
│   About                                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Stay in the world.                                    │
│   [email input]                        [Subscribe]      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   © 2026 SUS WEARS. All rights reserved.               │
│   Privacy · Terms                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Changes (MUST implement)

1. **Brand statement:** Oversized `.type-quote` for tagline "The silhouette is the logo."
2. **Newsletter:** Move email capture from homepage to footer (available on every page)
3. **Social links:** Add Instagram/TikTok/X icons (currently text-only — use existing SVG icons from `src/components/icons/index.tsx`)
4. **Legal links:** Add Privacy and Terms placeholders
5. **EST. 2019 treatment:** Use metallic gradient for "Est. 2019 · Jos, Plateau State, Nigeria"
6. **Subtle grain:** Add hero-style film grain overlay (existing SVG noise pattern from `hero.css`)
7. **Spacing:** Increase vertical padding for luxury feel

---

## 24. Glass Strategy

### Glass Recipe

```css
.glass-surface {
  background: rgba(23, 21, 19, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(42, 38, 32, 0.5);
}
```

### Where to Use Glass (MUST implement)

| Component | Current State | Glass Treatment |
|-----------|--------------|-----------------|
| `SiteHeader` (mobile) | `backdrop-blur-[6px]` on transparent state | Increase to `blur(16px)`, add glass border |
| `CollectionNav` | `backdrop-blur-sm` | Increase to `blur(16px)`, add glass bg + border |
| Filter drawer header | `backdrop-blur-sm` | Increase to `blur(16px)`, add glass bg + border |
| NEW: Floating product controls | N/A | Glass surface for zoom/share buttons |
| NEW: Modal surfaces | N/A | Glass background for overlay panels |

### Where NOT to Use Glass

- **Product cards** — use depth + shadow instead
- **Navigation links** — solid backgrounds
- **Full-page overlays** — use solid dark backgrounds
- **Buttons** — keep solid (accent filled or outline)
- **Input fields** — keep solid background
- **Footer** — solid background with grain texture

### Glass Rules

1. **Warm tint only** — never cold/blue glass
2. **Border required** — glass without border looks unfinished
3. **Blur amount:** 16px (not too blurry, not too clear)
4. **Opacity:** 0.72 (reads as premium, not transparent)
5. **Maximum 2 glass surfaces per viewport** — restraint is key

---

## 25. Mobile Strategy

### Breakpoints (Keep Existing)

```css
sm: 40rem   (640px)
md: 48rem   (768px)
lg: 64rem   (1024px) — sidebar appears
xl: 80rem   (1280px)
```

### Mobile-Specific Behavior

| Feature | Mobile Behavior |
|---------|----------------|
| Navigation | Full-screen menu overlay (existing — keep) |
| Sidebar | Hidden, replaced by mobile header (existing — keep) |
| Product grid | 2 columns (existing — keep) |
| Collection gallery | Single column (existing — keep) |
| Hero carousel | Full viewport, transparent header, parallax disabled (existing — keep) |
| Filter panel | Bottom-sheet drawer (existing — keep) |
| Search | Top-sheet overlay (existing — keep) |
| Product gallery | Swipe left/right to change image (NEW) |
| Cards | No perspective tilt on touch devices (no hover) |
| Parallax | Reduce speed by 50% on mobile |
| R3F experiments | Disabled on mobile |

### Touch Targets

Enforce minimum 44px touch targets on all interactive elements. Current implementation mostly complies — verify during implementation.

### Mobile Performance

- Lazy-load all below-fold images (existing via `sizes` prop — verify)
- Reduce hero to 3 layers on mobile (drop Z0 grain, simplify Z2 grade)
- Disable CSS 3D perspective tilt on touch devices
- Cap animations at 30fps on low-end devices

---

## 26. Accessibility Strategy

### Existing Foundations (Keep)

The current implementation has strong accessibility:

1. **Skip-to-content link** in `AppShell.tsx`
2. **Focus-visible outlines** on all interactive elements (accent color, 2px outline, 3px offset)
3. **prefers-reduced-motion** global kill switch in `globals.css` (line 93-101)
4. **ARIA on overlays:** `aria-modal`, `role="dialog"`, focus trapping in `MobileMenu`, `FilterDrawer`, `SearchOverlay`, `CollectionGallery` lightbox
5. **Body scroll lock** on overlays
6. **Escape key handling** on all overlays
7. **Keyboard navigation** in lightbox (arrow keys), search overlay (arrow keys)
8. **Live regions:** `aria-live="polite"` on bag count, product notices
9. **Semantic HTML:** `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`, heading hierarchy
10. **Image alt text:** All images have descriptive alt text

### New Requirements (MUST implement)

1. **All CSS 3D effects must have non-3D fallbacks:**
   - Perspective tilt: disabled when `prefers-reduced-motion: reduce`
   - Parallax: `transform: none` when reduced motion preferred
   - Page transitions: instant swap when reduced motion preferred

2. **Keyboard navigation for product image gallery:**
   - Arrow keys to change image
   - Tab to move between thumbnails
   - Enter/Space to select thumbnail

3. **Contrast verification:**
   - Current: #f2ede4 on #0b0a09 = 14.8:1 (WCAG AAA) — excellent
   - Accent on dark: #c2a878 on #0b0a09 = 7.2:1 (WCAG AAA) — excellent
   - Muted text: #8a8375 on #0b0a09 = 4.1:1 (WCAG AA for large text) — acceptable

4. **Touch target sizes:** All interactive elements ≥ 44×44px on mobile

5. **Screen reader testing:** Verify all new components with VoiceOver/NVDA

6. **Reduced motion behavior for all new motion:**
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

## 27. Performance Strategy

### Current Optimizations (Keep)

1. **Next.js Image** with quality tiers (50/75/90) and responsive srcset
2. **Self-hosted fonts** with unicode-range subsetting (no network fetch)
3. **Metric-compatible fallback fonts** (ascent-override/descent-override for CLS)
4. **No animation libraries** — pure CSS + IntersectionObserver
5. **Static data layer** — no database queries, no API calls for content
6. **Sharp** for server-side image optimization

### New Optimizations (MUST implement)

1. **Dynamic imports for any R3F components:**
   ```tsx
   const HeroAtmosphere = dynamic(() => import('./HeroAtmosphere'), { ssr: false });
   ```

2. **Intersection Observer lazy loading** — extend existing `Reveal` pattern to all below-fold images

3. **Font preloading** — preload only critical font subsets (Cormorant Latin, Manrope Latin)

4. **Image blur placeholders** — add tiny inline base64 blur for all images (existing `next/image` supports this via `placeholder="blur"`)

5. **Route prefetching** — Next.js Link prefetches on hover by default (keep)

### Performance Budget

| Metric | Target | Current (estimated) |
|--------|--------|-------------------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~2.0s |
| Cumulative Layout Shift | < 0.1 | ~0.05 |
| Total Blocking Time | < 200ms | ~150ms |
| JavaScript bundle (gzipped) | < 250KB | ~120KB |
| CSS (gzipped) | < 50KB | ~35KB |
| Fonts (gzipped) | < 100KB | ~80KB |
| Total page weight | < 1MB | ~600KB |

### R3F Impact Budget

| Addition | Size (gzipped) | Gate |
|----------|---------------|------|
| three.js core | ~65KB | Required if R3F used |
| @react-three/fiber | ~45KB | Required if R3F used |
| @react-three/drei | ~30KB | Optional helpers |
| **Total R3F** | **~140KB** | **Must keep total JS < 250KB** |

**Decision:** R3F adds ~140KB gzipped. This exceeds the remaining budget headroom (250KB - 120KB = 130KB available). Therefore:

- R3F is **OPTIONAL** — only ship if visual value justifies the cost
- CSS-only approach stays within budget with zero additional JS
- If R3F is used, consider tree-shaking unused drei helpers
- Monitor bundle size with `next build` + `@next/bundle-analyzer`

---

## 28. Proposed Dependencies

### Baseline (CSS-First — No New Dependencies)

The luxury redesign can be fully achieved with zero new dependencies:

| Package | Status | Notes |
|---------|--------|-------|
| next | 16.3.0 (existing) | Keep |
| react | 19.2.8 (existing) | Keep |
| tailwindcss | v4 (existing) | Keep |
| sharp | ^0.35.3 (existing) | Keep |
| **No new packages** | — | All depth, motion, and 3D via CSS |

### Optional Enhancements

| Package | Size (gzipped) | Purpose | Required? |
|---------|---------------|---------|-----------|
| framer-motion | ~30KB | Page transitions, enhanced scroll | NO — CSS transitions sufficient |
| @react-three/fiber | ~45KB | 3D rendering | NO — behind performance gate |
| @react-three/drei | ~30KB | 3D helpers | NO — only with R3F |
| three | ~65KB | Three.js core | NO — peer dep for R3F |
| @next/bundle-analyzer | devDep | Bundle analysis | Recommended for dev |

### Recommendation

**Ship Phase 1-3 with zero new dependencies.** Evaluate R3F in Phase 4 only if the hero experiment demonstrates clear visual value within the performance budget.

---

## 29. Component Architecture

### Proposed Structure

```
src/components/
├── layout/                    # Application shell
│   ├── AppShell.tsx           # EXISTING — add PageTransition wrapper
│   ├── DesktopSidebar.tsx     # EXISTING — add glass on scroll
│   ├── DesktopUtilityBar.tsx  # EXISTING — no changes
│   ├── SiteHeader.tsx         # EXISTING — enhance transitions
│   ├── MobileMenu.tsx         # EXISTING — cinematic entrance
│   ├── Footer.tsx             # EXISTING — luxury redesign
│   ├── BrandLockup.tsx        # EXISTING — no changes
│   ├── NavLink.tsx            # EXISTING — no changes
│   ├── BagLink.tsx            # EXISTING — no changes
│   └── PageTransition.tsx     # NEW — route transition wrapper
│
├── ui/                        # Reusable primitives
│   ├── Badge.tsx              # EXISTING — no changes
│   ├── Button.tsx             # EXISTING — no changes
│   ├── Container.tsx          # EXISTING — no changes
│   ├── DepthCard.tsx          # NEW — 3D perspective tilt card
│   ├── Divider.tsx            # EXISTING — no changes
│   ├── GlassSurface.tsx       # NEW — luxury glass panel
│   ├── IconButton.tsx         # EXISTING — no changes
│   ├── Image.tsx              # EXISTING — no changes
│   ├── Input.tsx              # EXISTING — no changes
│   ├── Media.tsx              # EXISTING — no changes
│   ├── ParallaxSection.tsx    # NEW — scroll parallax wrapper
│   ├── Section.tsx            # EXISTING — no changes
│   ├── SectionHeader.tsx      # EXISTING — no changes
│   └── Typography.tsx         # EXISTING — add type-quote, type-label
│
├── motion/                    # Animation components
│   └── Reveal.tsx             # EXISTING — add blur, blur-reveal variants
│
├── hero/                      # Hero system
│   ├── Hero.tsx               # EXISTING — add Z0 parallax, optional R3F
│   ├── HeroMedia.tsx          # EXISTING — no changes
│   ├── HeroCopy.tsx           # EXISTING — no changes
│   ├── HeroControls.tsx       # EXISTING — no changes
│   └── HeroScrollIndicator.tsx # EXISTING — no changes
│
├── home/                      # Homepage sections
│   ├── HomePage.tsx           # EXISTING — restructure to 9 sections (hypothesis)
│   ├── BrandStatement.tsx     # NEW — merged BrandIntro + BrandManifesto
│   ├── FeaturedCollection.tsx # NEW — merged FeaturedFashion + CollectionShowcase
│   ├── EditorialMoment.tsx    # NEW — merged EditorialFeature + CraftStory
│   ├── ContactCta.tsx         # NEW — merged WhatsAppCta + contact
│   ├── CategoryShowcase.tsx   # EXISTING — add DepthCard
│   ├── NewDropSection.tsx     # EXISTING — enhance featured product
│   ├── SusWorldTeaser.tsx     # EXISTING — add ParallaxSection
│   └── NewsletterSection.tsx  # EXISTING — move to footer
│
├── shop/                      # Shop experience
│   ├── ProductGrid.tsx        # EXISTING — no changes
│   ├── ShopHeader.tsx         # EXISTING — enhance typography
│   ├── ShopToolbar.tsx        # EXISTING — no changes
│   ├── ShopEditorial.tsx      # EXISTING — no changes
│   ├── CategoryNav.tsx        # EXISTING — no changes
│   ├── FilterPanel.tsx        # EXISTING — add glass to header
│   ├── FilterFields.tsx       # EXISTING — no changes
│   ├── ActiveFilterChips.tsx  # EXISTING — no changes
│   ├── SearchOverlay.tsx      # EXISTING — add recent/trending
│   ├── Pagination.tsx         # EXISTING — no changes
│   └── EmptyState.tsx         # EXISTING — no changes
│
├── product/                   # Product experience
│   ├── ProductCard.tsx        # EXISTING — wrap in DepthCard
│   ├── ProductPage.tsx        # EXISTING — major redesign (sticky panel, viewer)
│   └── ProductImageViewer.tsx # NEW — immersive zoom/pan image viewer
│
├── collections/               # Collection experience
│   ├── CollectionIndex.tsx    # EXISTING — add DepthCard to cards
│   ├── CollectionPage.tsx     # EXISTING — no changes
│   ├── CollectionHero.tsx     # EXISTING — add ParallaxSection
│   ├── CollectionGallery.tsx  # EXISTING — enhance lightbox
│   ├── CollectionIntro.tsx    # EXISTING — no changes
│   ├── CollectionFeatured.tsx # EXISTING — no changes
│   ├── CollectionCatalogue.tsx # EXISTING — no changes
│   ├── CollectionCatalogueControls.tsx # EXISTING — no changes
│   ├── CollectionStory.tsx    # EXISTING — use type-quote
│   ├── CollectionRelated.tsx  # EXISTING — add DepthCard
│   ├── CollectionCard.tsx     # EXISTING — add DepthCard
│   └── CollectionNav.tsx      # EXISTING — add glass treatment
│
├── about/                     # About page
│   └── AboutPage.tsx          # EXISTING — add imagery, timeline
│
├── editorial/                 # Editorial page
│   └── EditorialPage.tsx      # EXISTING — add category filtering, mixed grid
│
├── sus-world/                 # SUS World page
│   └── SusWorldPage.tsx       # EXISTING — add category navigation
│
├── cart/                      # Cart page
│   └── CartPage.tsx           # EXISTING — no changes
│
├── checkout/                  # Checkout page
│   └── CheckoutPage.tsx       # EXISTING — no changes
│
└── icons/                     # SVG icons
    └── index.tsx              # EXISTING — no changes
```

### Component Count Summary

| Category | Existing | New | Total |
|----------|----------|-----|-------|
| Layout | 9 | 1 | 10 |
| UI | 11 | 3 | 14 |
| Motion | 1 | 0 | 1 |
| Hero | 5 | 0 | 5 |
| Home | 14 | 4 | 18 |
| Shop | 11 | 0 | 11 |
| Product | 2 | 1 | 3 |
| Collections | 12 | 0 | 12 |
| About | 1 | 0 | 1 |
| Editorial | 1 | 0 | 1 |
| SUS World | 1 | 0 | 1 |
| Cart | 1 | 0 | 1 |
| Checkout | 1 | 0 | 1 |
| Icons | 1 | 0 | 1 |
| **Total** | **81** | **9** | **90** |

### New Files to Create

1. `src/components/layout/PageTransition.tsx`
2. `src/components/ui/GlassSurface.tsx`
3. `src/components/ui/DepthCard.tsx`
4. `src/components/ui/ParallaxSection.tsx`
5. `src/components/product/ProductImageViewer.tsx`
6. `src/components/home/BrandStatement.tsx`
7. `src/components/home/FeaturedCollection.tsx`
8. `src/components/home/EditorialMoment.tsx`
9. `src/components/home/ContactCta.tsx`

### Files to Modify

1. `src/styles/tokens.css` — add glass, metallic, shadow tokens
2. `src/styles/motion.css` — add blur variants, cinematic durations, reduced-motion gates
3. `src/styles/typography.css` — add type-quote, type-label
4. `src/app/globals.css` — add new tokens to Tailwind theme, update section spacing
5. `src/components/layout/AppShell.tsx` — wrap children in PageTransition
6. `src/components/layout/Footer.tsx` — luxury redesign
7. `src/components/layout/DesktopSidebar.tsx` — glass on scroll
8. `src/components/layout/SiteHeader.tsx` — enhanced transitions
9. `src/components/layout/MobileMenu.tsx` — cinematic entrance
10. `src/components/product/ProductCard.tsx` — wrap in DepthCard
11. `src/components/product/ProductPage.tsx` — sticky panel, ProductImageViewer
12. `src/components/motion/Reveal.tsx` — add blur variants
13. `src/components/home/HomePage.tsx` — restructure sections
14. `src/components/home/CategoryShowcase.tsx` — add DepthCard
15. `src/components/home/NewDropSection.tsx` — enhance featured product
16. `src/components/home/SusWorldTeaser.tsx` — add ParallaxSection
17. `src/components/home/NewsletterSection.tsx` — move to footer or simplify
18. `src/components/collections/CollectionHero.tsx` — add ParallaxSection
19. `src/components/collections/CollectionCard.tsx` — add DepthCard
20. `src/components/collections/CollectionRelated.tsx` — add DepthCard
21. `src/components/collections/CollectionNav.tsx` — add glass treatment
22. `src/components/collections/CollectionGallery.tsx` — enhance lightbox
23. `src/components/editorial/EditorialPage.tsx` — add category filtering
24. `src/components/sus-world/SusWorldPage.tsx` — add category navigation
25. `src/components/about/AboutPage.tsx` — add imagery, timeline

---

## 30. Page-by-Page Scores

### Scoring Methodology

Each page scored 1-10 across: Visual Design, Interaction Quality, Content Presentation, Mobile Experience, Accessibility, Performance.

| Page | Score | What's Working | What's Weak | Priority |
|------|-------|---------------|-------------|----------|
| **Homepage** | 7/10 | Hero system (9/10), typography (8/10), brand voice (9/10) | 13 sections with uniform rhythm, no depth, flat card treatments | P1 |
| **Shop** | 7/10 | Filtering system (8/10), search (7/10), editorial interlude (8/10) | Generic product cards, no hover depth, SVG images | P1 |
| **Product** | 6/10 | Functional gallery, variant selection, accordions | No immersive viewer, no sticky panel, generic layout | P0 |
| **Collections** | 8/10 | Per-collection theming (9/10), gallery (8/10), story sections (7/10) | Minor polish on lightbox, cards could use depth | P2 |
| **About** | 7/10 | Strong copy (9/10), good structure (7/10) | No imagery, no founder section | P2 |
| **Editorial** | 6/10 | Good hero (7/10), clean card grid (6/10) | No category filtering, basic grid, no depth | P2 |
| **SUS World** | 6/10 | Good hero (7/10), clean grid (6/10) | No category navigation, basic cards | P2 |
| **Bag** | 7/10 | Functional (8/10), cross-tab sync (7/10) | Basic layout, no upsell | P3 |
| **Checkout** | 5/10 | Functional shell (5/10) | "Coming soon" state, minimal | P3 |
| **Navigation** | 8/10 | Distinctive sidebar (9/10), excellent mobile menu (8/10) | Minor glass enhancement | P2 |
| **Footer** | 5/10 | Basic 4-column grid (5/10) | No brand expression, no newsletter, minimal | P1 |
| **Mobile** | 7/10 | Good responsive (7/10), touch-friendly (7/10) | Could use swipe gestures, reduced complexity | P2 |

### Target Scores After Redesign

| Page | Current | Target | Key Improvement |
|------|---------|--------|----------------|
| Homepage | 7 | 9 | Varied pacing, depth, cinematic motion |
| Shop | 7 | 8 | Depth cards, enhanced hover |
| Product | 6 | 9 | Immersive viewer, sticky panel, editorial |
| Collections | 8 | 9 | Parallax, glass, richer lightbox |
| About | 7 | 8 | Imagery, timeline |
| Editorial | 6 | 8 | Category filtering, mixed grid |
| SUS World | 6 | 8 | Category navigation, depth |
| Bag | 7 | 7 | Minor polish |
| Checkout | 5 | 6 | Minimal changes |
| Navigation | 8 | 9 | Glass, enhanced transitions |
| Footer | 5 | 8 | Luxury redesign, newsletter |
| Mobile | 7 | 8 | Swipe, reduced complexity |

---

## 31. Before / After Design Direction

### CURRENT: What Feels Generic

| Element | Current Treatment | Why It Feels Generic |
|---------|------------------|---------------------|
| Product cards | Flat background, opacity hover, no shadow | Every e-commerce template does this |
| Page navigation | Instant hard cuts | No sense of spatial continuity |
| Section transitions | Uniform reveal timing | Every section arrives the same way |
| Cards throughout | Same 4/5 aspect, same hover, same spacing | No visual hierarchy between content types |
| Footer | Basic 4-column text grid | Standard template footer |
| Product detail | Functional form layout | Not immersive, not editorial |
| Modals | Basic fade + scale | Not cinematic |
| Depth | Zero perspective, zero parallax | Everything on one flat plane |

### TARGET: What Feels Premium

| Element | Target Treatment | Why It Feels Premium |
|---------|-----------------|---------------------|
| Product cards | Perspective tilt on hover, shadow elevation, accent glow | Apple Store product cards |
| Page navigation | 800ms cinematic fade + translate | Luxury fashion sites (Bottega Veneta, Loewe) |
| Section transitions | Varied timing, blur reveals, parallax | Editorial magazine pacing |
| Cards throughout | Mixed sizes, depth treatments, glass overlays | Curated, not templated |
| Footer | Brand statement, newsletter, grain texture | Fashion house footer (Celine, The Row) |
| Product detail | Sticky panel, zoom viewer, editorial story | Premium PDP (Net-a-Porter, SSENSE) |
| Modals | Cinematic scale entrance, glass backdrop | High-end modal patterns |
| Depth | Perspective tilt, scroll parallax, z-layered hero | Spatial design language |

### The Transformation in One Line

**Before:** A well-built e-commerce site with dark mode.
**After:** A cinematic digital flagship for an African luxury fashion house.

---

## 32. Priorities

### P0 — Critical (Must fix before redesign is considered successful)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1 | Product detail page immersive redesign | `ProductPage.tsx`, new `ProductImageViewer.tsx` | Large |
| 2 | CSS 3D depth system (DepthCard, tokens, motion) | `tokens.css`, `motion.css`, new `DepthCard.tsx` | Medium |

### P1 — High Impact (Major visual/UX improvements)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 3 | Page transition system | New `PageTransition.tsx`, `AppShell.tsx` | Medium |
| 4 | Homepage restructure (hypothesis) | `HomePage.tsx`, new section components | Large |
| 5 | Product card depth treatment | `ProductCard.tsx` | Small |
| 6 | Footer luxury redesign | `Footer.tsx` | Medium |
| 7 | Enhanced motion vocabulary | `motion.css`, `Reveal.tsx` | Small |
| 8 | Glass surface component | New `GlassSurface.tsx`, `tokens.css` | Small |

### P2 — Enhancement (Premium polish)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 9 | Collection hero parallax | `CollectionHero.tsx`, new `ParallaxSection.tsx` | Small |
| 10 | Editorial category filtering | `EditorialPage.tsx` | Medium |
| 11 | SUS World category navigation | `SusWorldPage.tsx` | Medium |
| 12 | About page imagery + timeline | `AboutPage.tsx` | Medium |
| 13 | Mobile swipe gestures on hero | `Hero.tsx` | Small |
| 14 | Search enhancement | `SearchOverlay.tsx` | Small |
| 15 | Desktop sidebar glass on scroll | `DesktopSidebar.tsx` | Small |
| 16 | Mobile menu cinematic entrance | `MobileMenu.tsx` | Small |

### P3 — Experimental (Optional 3D/advanced effects)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 17 | R3F hero atmosphere experiment | `Hero.tsx`, new `HeroAtmosphere.tsx` | Large |
| 18 | R3F product wireframe (FUTURE) | Requires 3D assets | Very Large |
| 19 | Horizontal scroll carousels | Various | Medium |

---

## 33. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Build the design system foundation that everything else depends on.

| Task | Priority | Dependencies |
|------|----------|-------------|
| Expand design tokens (glass, metallic, shadows, spacing scale) | P0 | None |
| Add type-quote and type-label to typography system | P1 | None |
| Create GlassSurface component | P1 | Tokens |
| Create DepthCard component | P0 | Tokens, motion |
| Create ParallaxSection component | P2 | Tokens |
| Enhance Reveal with blur variants | P1 | None |
| Add cinematic/dramatic durations and easing | P1 | None |
| Add reduced-motion gates for all new motion | P0 | None |
| Create PageTransition component | P1 | Motion tokens |
| Add shadow tokens | P1 | None |

**Validation:** All new primitives work in isolation. Existing components unaffected.

### Phase 2: Core Pages (Week 3-4)

**Goal:** Redesign the highest-impact pages.

| Task | Priority | Dependencies |
|------|----------|-------------|
| Product detail page redesign (sticky panel, viewer) | P0 | Phase 1 |
| Product card DepthCard treatment | P1 | DepthCard |
| Homepage restructure (validate hypothesis) | P1 | Phase 1, new section components |
| Footer luxury redesign | P1 | Glass, tokens |
| New homepage section components (BrandStatement, FeaturedCollection, EditorialMoment, ContactCta) | P1 | Phase 1 |
| Wire PageTransition into AppShell | P1 | PageTransition |

**Validation:** Product page feels immersive. Homepage pacing improved. Footer feels premium.

### Phase 3: Enhancement (Week 5-6)

**Goal:** Premium polish across remaining pages.

| Task | Priority | Dependencies |
|------|----------|-------------|
| Collection hero parallax | P2 | ParallaxSection |
| Collection card DepthCard | P2 | DepthCard |
| Editorial category filtering | P2 | None |
| SUS World category navigation | P2 | None |
| About page imagery + timeline | P2 | None |
| Mobile swipe on hero | P2 | None |
| Search enhancement (recent/trending) | P2 | None |
| Desktop sidebar glass on scroll | P2 | GlassSurface |
| Mobile menu cinematic entrance | P2 | Motion tokens |

**Validation:** All pages feel cohesive. Premium polish throughout.

### Phase 4: 3D & Polish (Week 7-8)

**Goal:** Optional 3D experiments + final optimization.

| Task | Priority | Dependencies |
|------|----------|-------------|
| R3F hero atmosphere experiment | P3 | Performance gate |
| Performance optimization | P0 | All phases |
| Accessibility audit | P0 | All phases |
| Cross-browser testing | P0 | All phases |
| Bundle size analysis | P1 | R3F decision |

**Validation:** Performance budget met. Accessibility verified. R3F decision made.

---

## 34. Acceptance Criteria

### Visual Quality

1. [ ] Every page scores 8/10 or higher on the design scorecard (Section 30)
2. [ ] "This looks expensive" — confirmed by visual review against luxury fashion benchmarks
3. [ ] Site is beautiful as a static composition with all animations disabled
4. [ ] No generic template patterns visible
5. [ ] Typography hierarchy is clear and architectural
6. [ ] Color palette is restrained and cohesive
7. [ ] Spacing is generous and consistent

### Technical Quality

8. [ ] Lighthouse Performance score ≥ 90
9. [ ] All animations respect `prefers-reduced-motion: reduce`
10. [ ] All interactive elements keyboard-accessible
11. [ ] No layout shift (CLS < 0.1)
12. [ ] Mobile touch targets ≥ 44px
13. [ ] All existing tests pass (`npm test`)
14. [ ] No TypeScript errors (`npm run typecheck`)
15. [ ] No lint errors (`npm run lint`)

### Functionality

16. [ ] No existing functionality broken
17. [ ] All routes render correctly
18. [ ] Shopping bag works end-to-end
19. [ ] Product filtering and search work correctly
20. [ ] Collection pages display correctly
21. [ ] Mobile menu opens/closes correctly
22. [ ] All overlays handle focus trapping and Escape

### Performance

23. [ ] JavaScript bundle < 250KB gzipped (CSS-first baseline)
24. [ ] If R3F added: total JS < 400KB gzipped
25. [ ] First Contentful Paint < 1.5s
26. [ ] Largest Contentful Paint < 2.5s
27. [ ] No regression from current performance baseline

---

## 35. Risks and Mitigations

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| 1 | R3F bundle size exceeds budget | High | High | CSS-first baseline achieves target without R3F. R3F is optional, behind performance gate. |
| 2 | Performance regression from new motion | High | Medium | All motion uses CSS transitions (compositor-driven). No JS animation libraries. Reduced-motion gates on everything. |
| 3 | Homepage restructure loses content | Medium | Medium | Treat as hypothesis. Validate before implementing. Keep all content accessible even if sections merge. |
| 4 | SVG images look different from real photography | Low | High | Design system works with both. SVGs are legitimate assets, not problems. When photography arrives, it enhances but doesn't gate. |
| 5 | Accessibility regression from new components | High | Low | All new components follow existing ARIA patterns. Automated testing. Manual audit in Phase 4. |
| 6 | Mobile performance degradation | High | Medium | Disable R3F on mobile. Reduce animation complexity. Cap at 30fps on low-end devices. |
| 7 | CSS 3D transforms cause jank | Medium | Low | Use `will-change` sparingly. Test on target devices. Fallback to 2D if needed. |
| 8 | Page transitions feel slow | Medium | Medium | 800ms is deliberate — luxury pacing. But test with users. Can reduce to 600ms if feedback warrants. |
| 9 | Glassmorphism looks dated | Low | Low | Glass usage is extremely restrained (max 2 per viewport). Warm-tinted, not cold/blue. Not the primary design language. |
| 10 | Scope creep delays delivery | High | High | Strict P0/P1/P2/P3 priorities. Phase-gated implementation. Ship P0+P1 first, enhance later. |

---

## Appendix A: Existing Data Structures Reference

### Brand Data (`src/data/brand.ts`)

```ts
BRAND = {
  shortName: "SUS",
  name: "SUS WEARS",
  legalName: "Shedrack Unisex Stitches",
  tagline: "The silhouette is the logo",
  descriptor: "Unisex luxury streetwear",
  founder: "Mr. Shedrack",
  foundedYear: 2019,
  origin: { city: "Jos", state: "Plateau State", country: "Nigeria", region: "West Africa" },
  audience: { genders: ["men", "women"], framing: "unisex" },
  creativeInfluence: { african: 0.7, western: 0.3 },
  casting: { men: 0.5, women: 0.5 },
}
```

### Navigation Data (`src/data/nav.ts`)

```ts
PRIMARY_NAV = [
  { label: "Home", href: "/", number: 1 },
  { label: "Shop", href: "/shop", number: 2 },
  { label: "Collections", href: "/collections", matchPrefix: true, number: 3 },
  { label: "SUS World", href: "/sus-world", number: 4 },
  { label: "Editorial", href: "/editorial", matchPrefix: true, number: 5 },
  { label: "About", href: "/about", number: 6 },
]
BAG_NAV = { label: "Bag", href: "/cart", number: 7 }
```

### Product Categories

```ts
ProductCategory = "tees" | "hoodies" | "outerwear" | "accessories"
ProductCollectionId = "signature" | "after-dark" | "limited"
```

### Collection Themes

```ts
Signature:  { surface: "#17130f", accent: "#c2a878", mediaTreatment: "warm" }
After Dark: { surface: "#0d0f12", accent: "#8fa3b5", mediaTreatment: "cool" }
Limited:    { surface: "#140d0e", accent: "#b0606a", mediaTreatment: "exclusive" }
```

---

## Appendix B: File Change Summary

### New Files (9)

1. `src/components/layout/PageTransition.tsx`
2. `src/components/ui/GlassSurface.tsx`
3. `src/components/ui/DepthCard.tsx`
4. `src/components/ui/ParallaxSection.tsx`
5. `src/components/product/ProductImageViewer.tsx`
6. `src/components/home/BrandStatement.tsx`
7. `src/components/home/FeaturedCollection.tsx`
8. `src/components/home/EditorialMoment.tsx`
9. `src/components/home/ContactCta.tsx`

### Modified Files (25)

1. `src/styles/tokens.css`
2. `src/styles/motion.css`
3. `src/styles/typography.css`
4. `src/app/globals.css`
5. `src/components/layout/AppShell.tsx`
6. `src/components/layout/Footer.tsx`
7. `src/components/layout/DesktopSidebar.tsx`
8. `src/components/layout/SiteHeader.tsx`
9. `src/components/layout/MobileMenu.tsx`
10. `src/components/product/ProductCard.tsx`
11. `src/components/product/ProductPage.tsx`
12. `src/components/motion/Reveal.tsx`
13. `src/components/home/HomePage.tsx`
14. `src/components/home/CategoryShowcase.tsx`
15. `src/components/home/NewDropSection.tsx`
16. `src/components/home/SusWorldTeaser.tsx`
17. `src/components/home/NewsletterSection.tsx`
18. `src/components/collections/CollectionHero.tsx`
19. `src/components/collections/CollectionCard.tsx`
20. `src/components/collections/CollectionRelated.tsx`
21. `src/components/collections/CollectionNav.tsx`
22. `src/components/collections/CollectionGallery.tsx`
23. `src/components/editorial/EditorialPage.tsx`
24. `src/components/sus-world/SusWorldPage.tsx`
25. `src/components/about/AboutPage.tsx`

### Unchanged Files

All data files, type definitions, lib utilities, icon components, cart, checkout, and shop infrastructure remain unchanged.

---

**End of specification.**
