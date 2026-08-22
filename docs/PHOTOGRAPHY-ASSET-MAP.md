# Photography Asset Map — SUS WEARS

**Last updated:** 2026-08-20
**Priority:** 1 — REAL PHOTOGRAPHY first, before any motion / 3D / cursor work.

## Inventory of real photographs

### Tier A — `/public/images/campaign/` (10 WebPs, 50–200KB)
The newest, highest-quality campaign set. Used in hero + collections.

| File | Bytes | Dimensions | Use |
|---|---|---|---|
| `campaign-01-desktop-1600.webp` | 65 KB | 1600w | Hero slide 1, collection hero |
| `campaign-01-desktop.webp` | 54 KB | – | Hero slide 4, secondary hero |
| `campaign-01-editorial.webp` | 111 KB | – | Featured fashion (men), collection gallery |
| `campaign-01-hero-mobile.webp` | 153 KB | mobile | Hero mobile crops |
| `campaign-01-mobile.webp` | 84 KB | mobile | Hero mobile crops |
| `campaign-02-desktop-1600.webp` | 174 KB | 1600w | Hero slide 2, big editorial |
| `campaign-02-desktop.webp` | 139 KB | – | Hero slide 3, editorial moments |
| `campaign-02-editorial.webp` | 136 KB | – | Featured fashion (women), atelier |
| `campaign-02-hero-mobile.webp` | 204 KB | mobile | Hero mobile crops |
| `campaign-02-mobile.webp` | 107 KB | mobile | Hero mobile crops |

### Tier B — `/public/images/ai/editorial/` (4 WebPs, 20–24KB)
Editorial stories. Smaller resolution — use where the photograph fills less surface.

| File | Use |
|---|---|
| `sus-editorial-lagos-01.webp` | Lagos editorial card 1 |
| `sus-editorial-lagos-02.webp` | Lagos editorial card 2 |
| `sus-editorial-western-01.webp` | Western editorial card 1 |
| `sus-editorial-western-02.webp` | Western editorial card 2 |

### Tier C — `/public/images/ai/heroes/` (3 WebPs, 14–16KB)
Smaller hero crops. Use sparingly where Tier A is unavailable.

| File | Use |
|---|---|
| `sus-hero-signature-01.webp` | Secondary hero rotation |
| `sus-hero-04b-final-check.webp` | Backup hero (male, dark) |
| `sus-hero-04b-nvidia-test.webp` | Backup hero (male, dark) |

## Slot mapping

### Homepage
- Hero (5 slides) — Tier A ✅ already wired in `src/data/hero.ts`
- SusWorldTeaser — `/images/campaign/campaign-01-desktop.webp` ✅ already wired
- CraftStory — `/images/campaign/campaign-02-editorial.webp` ✅ already wired
- FeaturedFashion.mens-tailoring — `/images/campaign/campaign-01-editorial.webp` ✅
- FeaturedFashion.womens-drape — `/images/campaign/campaign-02-editorial.webp` ✅
- CategoryShowcase (4 categories: tees, hoodies, outerwear, accessories) — **PENDING** — currently SVG
- EditorialMoment — **PENDING** — currently SVG
- NewDropSection — **PENDING** — currently SVG
- CuratedProductsSection — **PENDING** — currently SVG

### Collections
- Signature.heroImage — `/images/campaign/campaign-01-desktop.webp` ✅ already wired
- Signature.gallery (4 items) — **PENDING** — currently SVG (`gallery-01.svg` … `gallery-04.svg`)
- Limited.heroImage — `/images/campaign/campaign-02-desktop.webp` — verify
- Limited.gallery (4 items) — **PENDING**
- AfterDark.heroImage — `/images/campaign/campaign-02-editorial.webp` — verify
- AfterDark.gallery (4 items) — **PENDING**

### Shop / Catalogue
- 24 products × 4 images each = 96 product slots
- **PENDING** — all 96 currently point to `/images/shop/*.svg`

## Strategy

Until real product photography is generated, the catalogue's product slots must be visually differentiated, NOT silenced. Strategy:

1. **Real photos first** — every `editorialImage` / `heroImage` / category-tile that has a real photo → wire it now.
2. **Reframe SVG product slots honestly** — when an SVG silhouette is the only option for a product, label it as a "study" / "study" tile (not "the product"), use it sparingly, and grade it with the same cinematic treatment as the photographs so it sits in the same world.
3. **Aesthetic unity** — every image passes through the same dark/warm colour grade + film grain + soft vignette so SVGs and WebPs feel like one shoot.
4. **No fake "as-if" WebP references** — never point a slot at a non-existent file. If a real photograph doesn't exist for a slot, the slot is honestly either an SVG study or a typographic moment (text-only tile).

## Status tracking

- [x] Hero (5 slides)
- [x] SusWorldTeaser
- [x] CraftStory
- [x] FeaturedFashion (2 items)
- [ ] CategoryShowcase (4 items)
- [ ] EditorialMoment
- [ ] NewDropSection
- [ ] CuratedProductsSection
- [ ] Collections: signature.heroImage
- [ ] Collections: limited.heroImage
- [ ] Collections: after-dark.heroImage
- [ ] Collections: signature.gallery (4)
- [ ] Collections: limited.gallery (4)
- [ ] Collections: after-dark.gallery (4)
- [ ] Catalogue products (96 slots)