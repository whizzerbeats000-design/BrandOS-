# Asset Pipeline — SUS WEARS Photography System

**Created:** 2026-08-22
**Status:** Draft
**Preceded by:** Material Editorial Depth (completed)

---

## Summary

Transform 146 SVG placeholders into real photography that makes SUS WEARS look like a credible Lagos fashion house. Phased approach: commit current state → inventory → homepage first → remaining pages → quality gate.

---

## Phase 1 — Lock Current Asset State

**Goal:** Commit all existing assets to git so they're version-controlled before any changes.

### Tasks

1.1. **Commit all 165 image files** (146 SVG + 17 WebP + 2 PNG) to git
- `git add public/images/`
- Commit message: `chore: commit all image assets`
- Verify: `git status` shows no untracked images

1.2. **Remove dead code** — `LOGO_SRC` constant in `src/components/product/ProductPage.tsx:18`
- Defined but never used
- Remove the constant

1.3. **Verification**
- `npx tsc --noEmit` — clean
- `npx vitest run` — 49/49 passing
- `npm run build` — clean, 18 pages
- `git status` — no untracked image files

---

## Phase 2 — Asset Inventory

**Goal:** Map every placeholder to its route, component, section, dimensions, and replacement priority.

### 2.1 Complete Inventory Table

| Priority | Route | Section | Image Path | Type | Dimensions | Replacement Role |
|----------|-------|---------|------------|------|------------|-----------------|
| **A** | `/` | Hero (5 slides) | `campaign-02-desktop-1600.webp` / `campaign-02-hero-mobile.webp` | WebP | 1600×900 / 900×1200 | Already real |
| **A** | `/` | Hero | `campaign-01-desktop-1600.webp` / `campaign-01-hero-mobile.webp` | WebP | 1600×900 / 900×1200 | Already real |
| **A** | `/` | Hero | `campaign-02-editorial.webp` / `campaign-01-hero-mobile.webp` | WebP | Mixed | Already real |
| **A** | `/` | Hero | `campaign-01-desktop.webp` / `campaign-01-hero-mobile.webp` | WebP | Mixed | Already real |
| **A** | `/` | Hero | `campaign-02-editorial.webp` / `campaign-02-hero-mobile.webp` | WebP | Mixed | Already real |
| **A** | `/` | BrandStatement | `campaign-01-editorial.webp` / `campaign-01-hero-mobile.webp` | WebP | Mixed | Already real |
| **A** | `/` | FeaturedFashion | `campaign-01-editorial.webp` | WebP | — | Already real |
| **A** | `/` | FeaturedFashion | `campaign-02-editorial.webp` | WebP | — | Already real |
| **A** | `/` | CategoryShowcase (4 items) | `campaign-01-editorial.webp` etc | WebP | — | Already real |
| **A** | `/` | CraftStory | `campaign-02-editorial.webp` | WebP | — | Already real |
| **A** | `/` | QuietMoment | `campaign-02-editorial.webp` / `campaign-01-hero-mobile.webp` | WebP | — | Already real |
| **A** | `/` | StudioSection | `campaign-02-editorial.webp` / `campaign-01-hero-mobile.webp` | WebP | — | Campaign → Atelier photo |
| **A** | `/` | NewDropSection | `home/new-drop-featured.svg` | SVG | 1000×1333 | Campaign photography |
| **A** | `/` | NewDropSection | `home/new-drop-featured-b.svg` | SVG | 1000×1333 | Campaign photography |
| **A** | `/` | NewDropSection | `home/new-drop-01.svg` | SVG | 1000×1250 | Campaign photography |
| **A** | `/` | NewDropSection | `home/new-drop-02.svg` | SVG | 1000×1250 | Campaign photography |
| **A** | `/` | FeaturedProducts (ShopEditorial) | `home/featured-men-01.svg` | SVG | 1000×1250 | Campaign photography (male) |
| **A** | `/` | FeaturedProducts (ShopEditorial) | `home/featured-women-01.svg` | SVG | 1000×1250 | Campaign photography (female) |
| **A** | `/` | CollectionShowcase | (uses campaign WebPs) | WebP | — | Already real |
| **B** | `/` | EditorialMoment | `home/editorial-world-desktop.svg` / `home/editorial-world-mobile.svg` | SVG | 1600×1000 / 1000×1333 | Editorial photography |
| **B** | `/` | SusWorldTeaser | `home/susworld-teaser.svg` | SVG | 1920×960 | Environmental/atelier |
| **B** | `/` | Curated (4 items) | `home/curated-01.svg` through `curated-04.svg` | SVG | 1000×1250 | Campaign photography |
| **B** | `/` | CategoryShowcase | `home/category-tees.svg` etc (4) | SVG | 1000×1250 | Product photography |
| **B** | `/` | CollectionShowcase | `home/collection-signature-desktop.svg` / mobile | SVG | 1920×823 / 1000×1333 | Campaign photography |
| **B** | `/` | CraftStory | `home/craft-atelier-01.svg` | SVG | 1600×1000 | Atelier photography |
| **B** | `/shop` | ShopHero | `shop/hero-desktop.svg` / `shop/hero-mobile.svg` | SVG | 1920×1080 / 900×1200 | Campaign photography |
| **B** | `/collections/*` | Hero (×3 collections) | `collections/*/hero-desktop.svg` / `hero-mobile.svg` | SVG | 1920×1080 / 1000×1333 | Campaign photography |
| **B** | `/collections/*` | Gallery (×12 images) | `collections/*/gallery-01..04.svg` | SVG | Various | Campaign/editorial photography |
| **B** | `/editorial` | Editorial feature | (uses campaign WebPs) | WebP | — | Already real |
| **C** | `/shop` | Product variants (72 images) | `shop/tees-*.svg`, `hoodies-*.svg`, `outerwear-*.svg`, `accessories-*.svg` | SVG | 900×1125 | Product photography |
| **C** | `/about` | About page (3 images) | (uses campaign WebPs) | WebP | — | Already real |
| **C** | `/sus-world` | World stories (6 images) | (uses campaign WebPs) | WebP | — | Already real |
| **—** | `/` | Placeholders (3) | `placeholders/*.svg` | SVG | Various | Fallback only — do not replace |

### 2.2 Summary Counts

| Category | Count | Status |
|----------|-------|--------|
| Already real (WebP) | 17 files, ~40 references | No change needed |
| SVG — Homepage (Priority A) | ~12 files | Replace first |
| SVG — Homepage (Priority B) | ~20 files | Replace second |
| SVG — Shop hero / Collections (Priority B) | ~24 files | Replace third |
| SVG — Shop product variants (Priority C) | 72 files | Replace last |
| SVG — Placeholders (fallback) | 3 files | Do not replace |
| Dead constant (logo) | 1 reference | Remove |

---

## Phase 3–5 — Photography System & Art Direction

**Goal:** Define what the replacement images should look like. These phases are **art direction specs**, not implementation tasks — they guide the AI image generation prompts.

### 3.1 Visual Identity

- **Brand:** SUS WEARS (Shedrack Unisex Stitches)
- **Origin:** Lagos, Nigeria (founded 2019, Jos heritage)
- **Positioning:** Contemporary Nigerian fashion house — quiet luxury, premium craft
- **Palette compatibility:** warm near-black `#0C0A09`, ivory `#F2EDE3`, champagne `#C2A878`, earth tones
- **Aesthetic:** cinematic realism, editorial photography, naturally lit

### 3.2 Photography Categories

#### Campaign Photography
**Purpose:** Establish SUS WEARS as a fashion house.
- Male and female models
- Confident natural poses, editorial compositions
- Sophisticated styling
- Realistic Nigerian/African casting
- Cinematic studio or environmental lighting
- Feel like campaign photographs, not product catalogs

#### Product Photography
**Purpose:** Sell the clothing.
- Garment accuracy is critical
- Full garment visible
- Realistic fabric texture and drape
- Accurate silhouette
- Clean composition, consistent lighting
- Consistent background treatment
- Multiple useful crops (but we use one per slot)

#### Studio / Atelier Photography
**Purpose:** Communicate craftsmanship.
- Sewing, cutting, measuring
- Fabric, needles, sewing machines
- Hands working, garment construction
- Real atelier atmosphere
- "This clothing is actually made here"

#### Editorial Photography
**Purpose:** Tell the brand story.
- Fabric details, architectural framing
- Movement, close-ups, negative space
- Environmental portraits
- More artistic than product photography

### 3.3 Art Direction Rules

**Lighting:**
- Controlled studio light or natural light
- Soft directional key light
- Realistic shadow falloff
- Subtle warm highlights
- Deep but recoverable shadows
- Natural skin texture

**Color:**
- Compatible with SUS WEARS palette
- Warm near-black, ivory, champagne, muted earth tones
- Natural fabric colors
- Do not force every image to be dark — enough tonal variation to breathe

**Composition:**
- Full-body fashion portraits
- Three-quarter portraits
- Controlled close-ups
- Low-angle fashion perspectives where appropriate
- Detail shots of fabric and stitching
- Environmental Lagos context when appropriate
- Intentional editorial compositions — not every image centered

**Avoid:**
- Plastic skin, wax-like faces
- Excessive retouching
- Obvious AI artifacts
- Distorted hands, malformed garments
- Impossible fabric folds
- Generic stock-photo aesthetics
- Excessive bokeh, HDR appearance
- Excessive sharpening
- Fake luxury aesthetics, random gold environments
- Stereotypical "African" decoration

---

## Phase 6 — Homepage First (Priority A)

**Goal:** Replace the ~12 highest-impact homepage SVG placeholders, then QA.

### 6.1 Replacement Order

Generate images in this order, replacing the existing SVG files:

| # | File | Dimensions | Prompt Direction | Category |
|---|------|------------|-----------------|----------|
| 1 | `home/new-drop-featured.svg` | 1000×1333 (4/5) | Female model in structured SUS WEARS tailoring, warm studio light, editorial pose | Campaign |
| 2 | `home/new-drop-featured-b.svg` | 1000×1333 (4/5) | Male model in SUS WEARS tailored coat, warm studio light, editorial | Campaign |
| 3 | `home/new-drop-01.svg` | 1000×1250 (4/5) | Folded tee or flat-lay product study, warm light, fabric texture visible | Product |
| 4 | `home/new-drop-02.svg` | 1000×1250 (4/5) | Hoodie detail, fabric texture, warm studio light | Product |
| 5 | `home/featured-men-01.svg` | 1000×1250 (4/5) | Male model in structured tailoring, editorial pose, warm chamber light | Campaign |
| 6 | `home/featured-women-01.svg` | 1000×1250 (4/5) | Female model in draped volume, editorial pose, warm chamber light | Campaign |
| 7 | `home/editorial-world-desktop.svg` | 1600×1000 (16/10) | Environmental — Lagos context, fashion, wide composition | Editorial |
| 8 | `home/editorial-world-mobile.svg` | 1000×1333 (3/4) | Environmental — Lagos context, fashion, portrait crop | Editorial |
| 9 | `home/susworld-teaser.svg` | 1920×960 (2/1) | Wide environmental — Lagos cityscape or studio, cinematic | Editorial |
| 10 | `home/craft-atelier-01.svg` | 1600×1000 (16/10) | Atelier — hands on cutting table, fabric, working light | Atelier |
| 11 | `home/collection-signature-desktop.svg` | 1920×823 (21/9) | Campaign — Signature collection, wide composition | Campaign |
| 12 | `home/collection-signature-mobile.svg` | 1000×1333 (3/4) | Campaign — Signature collection, portrait crop | Campaign |

### 6.2 Homepage QA Checklist

After replacing homepage images:

- [ ] Image-to-image consistency (same brand feel across all)
- [ ] Visual rhythm (dark → light → dark variation)
- [ ] Color balance (warm tones, no clashing)
- [ ] Model/casting consistency (Nigerian/African, natural, editorial)
- [ ] Garment accuracy (realistic fabric, accurate silhouettes)
- [ ] Cropping (intentional compositions at each aspect ratio)
- [ ] Section hierarchy (hero > featured > categories > editorial)
- [ ] Loading behavior (no layout shift, no broken images)
- [ ] Mobile composition (portrait crops work on small screens)
- [ ] `npm run build` passes
- [ ] No 404s in network tab

---

## Phase 7 — Remaining Pages

### 7.1 Shop Hero (Priority B)

| File | Dimensions | Prompt Direction |
|------|------------|-----------------|
| `shop/hero-desktop.svg` | 1920×1080 (16/9) | Campaign — hero banner for shop page |
| `shop/hero-mobile.svg` | 900×1200 (3/4) | Campaign — mobile hero crop |

### 7.2 Collection Pages (Priority B)

Each collection (Signature, After Dark, Limited) has 6 SVG placeholders:

| File Pattern | Dimensions | Prompt Direction |
|-------------|------------|-----------------|
| `collections/*/hero-desktop.svg` | 1920×1080 (16/9) | Campaign — collection hero |
| `collections/*/hero-mobile.svg` | 1000×1333 (3/4) | Campaign — mobile hero crop |
| `collections/*/gallery-01.svg` | 1600×900 (16/9) | Editorial — wide gallery |
| `collections/*/gallery-02.svg` | 1000×1333 (3/4) | Product/editorial — portrait |
| `collections/*/gallery-03.svg` | 1000×1333 (3/4) | Product/editorial — portrait |
| `collections/*/gallery-04.svg` | 1920×823 (21/9) | Campaign — panoramic cast shot |

**Total:** 18 files (6 per collection × 3 collections)

### 7.3 Homepage Supporting (Priority B)

| File | Dimensions | Prompt Direction |
|------|------------|-----------------|
| `home/curated-01.svg` through `curated-04.svg` | 1000×1250 (4/5) | Campaign — curated looks |
| `home/curated-01-b.svg` | 1000×1250 (4/5) | Campaign — alternate |
| `home/category-tees.svg` | 1000×1250 (4/5) | Product — tee flat-lay or detail |
| `home/category-hoodies.svg` | 1000×1250 (4/5) | Product — hoodie detail |
| `home/category-outerwear.svg` | 1000×1250 (4/5) | Product — coat detail |
| `home/category-accessories.svg` | 1000×1250 (4/5) | Product — accessories detail |

**Total:** 10 files

### 7.4 Product Variant Images (Priority C)

**72 files** — 18 products × 4 variants (a, b, c, d), all at 900×1125 (4/5).

These are the images shown on individual product pages and in the shop grid.

| Product | File Pattern | Prompt Direction |
|---------|-------------|-----------------|
| Bone Crew Tee | `shop/tees-01-{a,b,c,d}.svg` | White/bone tee, 4 angles |
| Noir Crew Tee | `shop/tees-02-{a,b,c,d}.svg` | Black tee, 4 angles |
| Graphite Long-Sleeve | `shop/tees-03-{a,b,c,d}.svg` | Graphite tee, 4 angles |
| Olive Crew Tee | `shop/tees-04-{a,b,c,d}.svg` | Olive tee, 4 angles |
| Burgundy Long-Sleeve | `shop/tees-05-{a,b,c,d}.svg` | Burgundy tee, 4 angles |
| Ink Crew Tee | `shop/tees-06-{a,b,c,d}.svg` | Dark blue tee, 4 angles |
| Clay Pullover Hoodie | `shop/hoodies-07-{a,b,c,d}.svg` | Clay hoodie, 4 angles |
| Noir Zip Hoodie | `shop/hoodies-08-{a,b,c,d}.svg` | Black zip hoodie, 4 angles |
| Steel Pullover Hoodie | `shop/hoodies-09-{a,b,c,d}.svg` | Steel hoodie, 4 angles |
| Espresso Zip Hoodie | `shop/hoodies-10-{a,b,c,d}.svg` | Espresso hoodie, 4 angles |
| Bone Pullover Hoodie | `shop/hoodies-11-{a,b,c,d}.svg` | Bone hoodie, 4 angles |
| Graphite Zip Hoodie | `shop/hoodies-12-{a,b,c,d}.svg` | Graphite hoodie, 4 angles |
| Sand Trench Coat | `shop/outerwear-13-{a,b,c,d}.svg` | Sand trench, 4 angles |
| Noir Bomber Jacket | `shop/outerwear-14-{a,b,c,d}.svg` | Black bomber, 4 angles |
| Espresso Trench Coat | `shop/outerwear-15-{a,b,c,d}.svg` | Espresso trench, 4 angles |
| Olive Bomber Jacket | `shop/outerwear-16-{a,b,c,d}.svg` | Olive bomber, 4 angles |
| Steel Trench Coat | `shop/outerwear-17-{a,b,c,d}.svg` | Steel trench, 4 angles |
| Burgundy Bomber Jacket | `shop/outerwear-18-{a,b,c,d}.svg` | Burgundy bomber, 4 angles |

**Product photography rules:**
- Consistent background (warm neutral or off-white)
- Consistent lighting across all products in same category
- Variant angles: front, 3/4, back, detail
- Garment on invisible mannequin or flat-lay
- Accurate color representation
- Realistic fabric texture and drape

### 7.5 Accessories (Priority C)

| Product | File Pattern | Prompt Direction |
|---------|-------------|-----------------|
| Ink Cap | `shop/accessories-19-{a,b,c,d}.svg` | Dark cap, 4 angles |
| Bone Beanie | `shop/accessories-20-{a,b,c,d}.svg` | Bone beanie, 4 angles |
| Espresso Tote | `shop/accessories-21-{a,b,c,d}.svg` | Leather tote, 4 angles |
| Clay Leather Belt | `shop/accessories-22-{a,b,c,d}.svg` | Leather belt, 4 angles |
| Steel Scarf | `shop/accessories-23-{a,b,c,d}.svg` | Scarf, 4 angles |
| Noir Socks 3-Pack | `shop/accessories-24-{a,b,c,d}.svg` | Socks, 4 angles |

**Total:** 24 files

---

## Phase 8 — Image Naming

Already well-organized. Current naming convention is consistent:

- `campaign-{number}-{variant}.webp` — real campaign photos
- `shop/{category}-{number}-{letter}.svg` — product variants
- `collections/{collection}/{type}-{number}.svg` — collection gallery
- `home/{purpose}-{number}.svg` — homepage sections
- `ai/{category}/{filename}.webp` — AI-generated editorial

**No rename needed** — replace files in place.

---

## Phase 9 — Quality Gate

### Technical Checks

- [ ] All referenced images resolve (0 missing files)
- [ ] `npx tsc --noEmit` — clean
- [ ] `npx vitest run` — 49/49 passing
- [ ] `npm run build` — clean, 18 pages
- [ ] No unnecessary dependencies added
- [ ] No image-loading regressions
- [ ] No layout shift caused by missing dimensions

### Visual Checks (Priority A — Homepage)

- [ ] No obvious SVG placeholders remain
- [ ] Photography feels like one brand
- [ ] Product garments remain accurate
- [ ] No obvious AI artifacts
- [ ] No excessive darkness
- [ ] No excessive bokeh
- [ ] No generic stock imagery
- [ ] Desktop and mobile crops are intentional
- [ ] Studio photography feels authentic
- [ ] Homepage feels like a fashion house, not a template

### Visual Checks (Priority B — Collections/Shop)

- [ ] Collection heroes are compelling
- [ ] Gallery images tell a story
- [ ] Shop hero communicates the brand

### Visual Checks (Priority C — Products)

- [ ] Product images are consistent within each category
- [ ] Color accuracy across variants
- [ ] Fabric texture visible
- [ ] 4/5 aspect ratio maintained

---

## File Structure

```
public/images/
├── campaign/           # 10 real WebP — no changes
├── ai/                 # 7 real WebP — no changes
├── home/               # ~20 SVG → replace with WebP
├── shop/               # 72 SVG → replace with WebP
├── collections/        # 18 SVG → replace with WebP
├── hero/               # 7 SVG → unused (hero uses campaign/)
├── placeholders/       # 3 SVG → keep as fallbacks
└── logo/               # 1 missing → remove dead constant
```

---

## Commit Sequence

1. `chore: commit all image assets to git` (Phase 1)
2. `docs: add asset inventory` (Phase 2)
3. `images: replace homepage priority A placeholders` (Phase 6)
4. `images: replace homepage priority B placeholders` (Phase 7.3)
5. `images: replace shop hero placeholders` (Phase 7.1)
6. `images: replace collection page placeholders` (Phase 7.2)
7. `images: replace product variant placeholders` (Phase 7.4)
8. `images: replace accessory placeholders` (Phase 7.5)

---

## Constraints

- **No new dependencies** — images are static files in `public/`
- **No component changes** — replace files in place
- **No architecture changes** — existing `<Media>` component handles everything
- **Preserve filenames** — keep existing paths
- **Preserve aspect ratios** — match existing SVG dimensions
- **Preserve Material Editorial Depth** — no CSS/effect changes
- **Quality gate after each phase** — TypeScript, tests, build must pass
