# SUS WEARS — Product Requirements Document

## 1. Product Overview

SUS WEARS is a unisex luxury streetwear e-commerce storefront. The brand — Shedrack Unisex Stitches — was founded in 2019 in Jos, Plateau State, Nigeria. Every piece is cut for men and women, drawing from a 70/30 blend of African and Western reference points.

The application is built with Next.js 16.3 (App Router), React 19, Tailwind CSS v4, and TypeScript 5.

## 2. Brand Identity

- **Name:** SUS WEARS (Shedrack Unisex Stitches)
- **Tagline:** "The silhouette is the logo"
- **Descriptor:** Unisex luxury streetwear
- **Founder:** Mr. Shedrack
- **Founded:** 2019
- **Origin:** Jos, Plateau State, Nigeria
- **Audience:** Men and women (unisex framing)
- **Creative influence:** 70% African / 30% Western
- **Casting:** 50% men / 50% women

## 3. Design System

### Theme
- Dark luxury aesthetic: warm near-black base, champagne accent
- Self-hosted Cormorant Garamond (display) + Manrope (body) fonts
- Design tokens defined in `src/styles/tokens.css`
- Motion system with reduced-motion support

### Components
- `Section`, `Container`, `Typography`, `Button`, `Badge`, `Media`, `Image`
- Layout: `AppShell`, `SiteHeader`, `DesktopSidebar`, `Footer`, `MobileMenu`
- Hero: `Hero`, `HeroCopy`, `HeroMedia`, `HeroControls`
- Product: `ProductPage`, `ProductCard`
- Collections: `CollectionPage`, `CollectionIndex`, `CollectionCard`

## 4. Pages & Routes

### Implemented Routes

| Route | Component | Status |
|-------|-----------|--------|
| `/` | `HomePage` | Complete — 13 sections |
| `/shop` | Shop catalogue | Complete — filtering, sorting, pagination |
| `/shop/[slug]` | `ProductPage` | Complete — JSON-LD, variants, add-to-bag |
| `/collections` | `CollectionIndex` | Complete |
| `/collections/[slug]` | `CollectionPage` | Complete — 3 collections |
| `/cart` | `CartPage` | Complete — localStorage bag |
| `/foundation` | Design system | Complete |
| `/api/ai/generate` | AI image gen | Complete |

### Placeholder Routes (Need Implementation)

| Route | Current State | Required |
|-------|---------------|----------|
| `/about` | `PagePlaceholder` | Real about page with brand story |
| `/editorial` | `PagePlaceholder` | Editorial landing page |
| `/sus-world` | `PagePlaceholder` | World stories landing page |

### Missing Routes (Not Yet Created)

| Route | Purpose |
|-------|---------|
| `/checkout` | Checkout flow (graceful "coming soon") |
| `/shipping` | Shipping information |
| `/returns` | Returns policy |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## 5. Data Layer

### Catalogue (`src/data/catalogue.ts`)
- 8 products across 4 categories: tees, hoodies, outerwear, accessories
- 3 collections: signature, after-dark, limited
- Full variant system with color, size, price, availability, inventory

### Collections (`src/data/collections.ts`)
- 3 collections with hero images, galleries, themes, stories
- Deterministic recommendation (relatedCollectionId)

### Homepage (`src/data/homepage.ts`)
- 13 sections with full content data
- Brand intro, manifesto, featured fashion, category showcase
- Collection showcase, craft story, editorial feature
- SUS World teaser, new drop, neon teaser, WhatsApp CTA, newsletter

### Editorial (`src/data/editorial.ts`)
- Single editorial feature defined
- Needs expansion for editorial page

### Brand (`src/data/brand.ts`)
- Complete brand identity data
- Brand story with paragraphs

### Types (`src/types/index.ts`)
- Comprehensive type system for products, collections, editorial, homepage sections
- WorldStory type defined but no data files exist

## 6. Commerce Features

### Product Catalogue
- Category filtering, price sorting, search
- Product detail with JSON-LD structured data
- Color/size variant selection
- Add-to-bag with inventory tracking
- Recently viewed products (localStorage)

### Cart/Bag
- localStorage persistence
- Custom event broadcasting (`bag:updated`)
- Quantity management (1-10)
- Remove items
- Empty bag state

### Checkout
- **Status:** Not wired — returns `{ ok: false, reason: "not-available" }`
- **Required:** Graceful "coming soon" page showing bag contents

### Integrations
- WhatsApp contact: configured via `NEXT_PUBLIC_WHATSAPP_NUMBER` env var
- Email fallback: `hello@suswears.com`
- AI concierge "Neon": gated by `NEXT_PUBLIC_AI_NEON` env var

## 7. Navigation

### Primary Nav (sidebar/mobile)
1. Home (`/`)
2. Shop (`/shop`)
3. Collections (`/collections`)
4. SUS World (`/sus-world`)
5. Editorial (`/editorial`)
6. About (`/about`)
7. Bag (`/cart`)

### Footer Nav
- Explore: Shop, Collections, SUS World, Editorial, About
- Customer: Contact, WhatsApp (when configured), Shopping, Shipping, Returns
- Social: **Empty** — needs Instagram, TikTok, Twitter/X links
- Legal: Privacy, Terms, Shipping, Returns

## 8. Testing Requirements

### Current State
- Vitest configured (`vitest.config.ts`)
- Playwright configured (`playwright.config.ts`)
- 1 test file: `tests/catalogue.test.ts` (2 tests)
- No E2E tests

### Required Coverage
- Unit tests for `src/lib/` utilities (bag, format, variant, collections, recently, cn)
- Unit tests for product data logic (search, filtering, sorting)
- E2E smoke tests for critical user flows (homepage, shop, product, cart)

## 9. Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number (E.164) | No |
| `NEXT_PUBLIC_AI_NEON` | Enable Neon AI concierge | No |
| `AI_ADMIN_TOKEN` | Neon admin token | No |
| `NVIDIA_API_KEY` | NVIDIA API for image generation | No |
| `GEMINI_API_KEY` | Gemini API for image generation | No |

## 10. Acceptance Criteria

### About Page
- Displays brand story using `BRAND_STORY` data from `src/data/brand.ts`
- Includes founder info, origin, philosophy
- Uses existing design patterns (Section, Container, Typography, Media)
- Has proper metadata
- Passes lint and type checks

### Editorial Page
- Displays editorial feature using `EDITORIAL_FEATURE` from `src/data/editorial.ts`
- Includes hero image, pull quote, story preview
- Uses existing design patterns
- Has proper metadata

### SUS World Page
- Defines sample `WorldStory` data in `src/data/world.ts`
- Creates world story cards using existing component patterns
- Includes category display
- Has proper metadata

### Social Navigation
- Populates `SOCIAL_NAV` in `src/data/nav.ts`
- Footer renders social links when configured

### Test Coverage
- Unit tests for lib utilities
- E2E smoke tests for critical flows
- All tests pass

### Checkout
- `/checkout` route shows "coming soon" page
- Displays bag contents
- "Buy Now" navigates to `/checkout` instead of silently failing

## 11. Constraints

- Must not modify existing working functionality
- Must follow existing code patterns and design system
- Must pass lint, type checks, and existing tests
- Each task must be independently executable
- Tasks must have concrete acceptance criteria
