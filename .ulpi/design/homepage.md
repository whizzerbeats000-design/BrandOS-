---
feature: homepage
register: brand
aesthetic_direction: editorial / magazine
design_system: bespoke
design_variance: 4
motion_intensity: 3
visual_density: 3
status: implemented
---

# SUS WEARS — Homepage Spec

## 1. Design Read

Dark material gallery for a contemporary African luxury fashion house. Trust through restraint. The garment is the protagonist; the interface is the gallery wall.

## 2. User Flow

### Primary journey

1. **Arrive** → Hero carousel presents the current collection mood
2. **Absorb** → Brand statement establishes voice and provenance
3. **Discover** → Category showcase opens wardrobe families
4. **Immerse** → Collection acts tell the seasonal narrative
5. **Shop** → New drop + featured products provide commercial entry points
6. **Connect** → Craft story, studio, editorial deepen the relationship
7. **Convert** → Newsletter + WhatsApp CTA

### States

- **Loading**: Hero image loads with cinematic crossfade; skeleton states not required (photography is the content)
- **Empty**: N/A — homepage always has content
- **Error**: Fallback to static hero image; no user-facing error state needed
- **Reduced motion**: All animations respect `prefers-reduced-motion`; hero crossfades instantly, parallax disabled, tilt disabled

## 3. Section Architecture

### Rhythm pattern

```
HERO (dominant)
  ↓
BRAND STATEMENT (quiet)
  ↓
CATEGORY SHOWCASE (visual discovery)
  ↓
COLLECTION SHOWCASE (cinematic narrative)
  ↓
NEW DROP (commerce)
  ↓
FEATURED PRODUCTS (editorial hybrid)
  ↓
CRAFT STORY (human / cultural)
  ↓
QUIET MOMENT (rest — full-bleed image + single quote)
  ↓
STUDIO (cinematic pause)
  ↓
EDITORIAL MOMENT (narrative)
  ↓
NEWSLETTER (quiet conversion)
  ↓
WHATSAPP CTA (clear conversion)
```

### Section spacing

- Between major sections: 96px mobile → 160px desktop
- Within sections: 32–64px depending on density
- No uniform section height; each section breathes according to its content weight

## 4. Component Specs

### Hero

**Purpose**: Cinematic opener — full-bleed photography with editorial type in the photograph's negative space.

**Spec**:
- Height: 78svh mobile → 80svh desktop
- Layers: Z0 atmosphere → Z1 photography → Z2 grade → Z3 type → Z4 controls
- Copy position: art-directed per slide (`bottom-left`, `center`, `top-right`)
- Typography: `type-hero` — Cormorant Garamond 300, clamp(2.25rem, 5.5vw, 5rem), line-height 0.95
- Controls: minimal — pause/play, slide indicators, scroll cue
- MagneticCursor: present only here, scoped to hero scene
- Reduced motion: instant crossfade, no parallax

**States**: autoplaying, paused, reduced-motion

**Accessibility**: `aria-roledescription="carousel"`, `aria-label`, `aria-live` for copy, keyboard focusable, focus pauses autoplay.

### BrandStatement

**Purpose**: First moment of calm after the hero. Establishes brand voice without chrome.

**Spec**:
- Layout: 12-col grid, statement spans cols 1–9, metadata cols 10–12 on desktop
- Typography: `EditorialHeading` with `size="display"`, italic line 1
- No eyebrow, no CTA, no chrome
- Metadata: `01 — The House` in `type-metadata`

**States**: N/A (static)

### CategoryShowcase

**Purpose**: Visual wardrobe discovery — image-first, not a card grid.

**Spec**:
- Layout: 8/4 split on desktop (campaign tile left, stacked compact tiles right)
- Campaign tile: 4/5 mobile → 3/4 desktop
- Compact tiles: 4/5 each, stacked vertically
- No GlassSurface overlays
- Text placed in photograph negative space via gradient scrims
- Typography: `type-display` for category name, `type-metadata` for description

**States**: hover reveals "View" arrow and shifts gradient opacity

**Accessibility**: `aria-label` on each tile combining label + description

### CollectionShowcase

**Purpose**: Three-art cinematic narrative — each act has distinct composition.

**Spec**:

**Act I** (Signature):
- Layout: text left (cols 1–4), image right (cols 6–12), image bleeds right edge
- Image: 4/5 mobile → 3/4 desktop, `tilt` enabled
- Typography: `EditorialHeading size="h1"`, `type-editorial` for description
- Opening: collection name as primary heading (no "Act I" label)

**Act II** (After Dark):
- Layout: image left (cols 1–7), text right (cols 9–12), image bleeds left edge
- Image: 3/4, `parallax` enabled, `mt-24` for vertical offset
- Typography: `type-display` for "02", `EditorialHeading size="h1"` for name
- Opening: editorial number "02" replaces generic label

**Act III** (Limited):
- Layout: full-bleed 21/9 image, floating ivory panel bottom-left
- Panel: `bg-background`, `max-w-xl`, `shadow-plane-md`
- Typography: `type-display` for "03", `EditorialHeading size="h2"` for name
- No season/tagline metadata (removed for restraint)

**States**: hover on image triggers subtle tilt/parallax

**Accessibility**: `aria-label` per act, semantic `<article>` and `<section>`

### NewDropSection

**Purpose**: Editorial lookbook for latest arrivals — commerce disguised as curation.

**Spec**:
- Layout: dominant piece (7 cols, 16/10 ratio) + supporting stack (5 cols, 4/5 ratio)
- No SectionHeader, no GlassSurface, no chrome
- Typography: `type-metadata` for "New Drop — 001" only
- ProductCard variant: `featured` for all pieces

**States**: hover reveals product name and subtle image scale

### FeaturedProducts

**Purpose**: The wardrobe — asymmetric editorial grid, not a product catalog.

**Spec**:
- Layout: one dominant hero piece (16/10, 70vw) + three supporting pieces (4/5, 3-col grid below)
- Spacing: generous `mt-24` between hero and support
- Typography: `EditorialHeading size="display"` for "Pieces worth keeping."
- Supporting copy: one sentence only
- CTA: `MagneticLink` "View all pieces" at section end
- ProductCard variant: `featured` for all pieces

**States**: hover reveals product name and subtle image scale

### CraftStory

**Purpose**: Human/cultural narrative — the making, not just the product.

**Spec**:
- Layout: 5/7 split, text left, image right
- Typography: `type-metadata` for eyebrow, `type-h1` for title, `type-editorial` for statement, `type-body` for paragraphs
- No decorative elements

**States**: N/A (static)

### QuietMoment

**Purpose**: Rest — full-bleed image with a single editorial statement. No heading, no eyebrow, no chrome.

**Spec**:
- Height: 60vh mobile → 75vh desktop
- Single pull quote in `type-editorial`
- Gradient scrim: `from-background via-background/40 to-background/10`
- No CTA, no navigation, no metadata

**States**: N/A (static)

### StudioSection

**Purpose**: Cinematic pause — the atelier as physical space.

**Spec**:
- Layout: full-bleed image with floating ivory panel
- Panel: `bg-background`, `p-8 lg:p-12`, `shadow-plane-md`
- Typography: `EditorialHeading` with `italicLine={1}`
- MagneticLink for CTA

**States**: hover on image triggers subtle scale

### EditorialMoment

**Purpose**: Narrative deep-dive — text + image + pull quote.

**Spec**:
- Layout: 5/7 split, text left, image right
- Typography: `type-h1` for title, `type-editorial` for statement and pull quote, `type-body` for intro
- No eyebrow (removed for variation)

**States**: hover on image triggers DepthImage tilt

### NewsletterSection

**Purpose**: Quiet conversion — email capture without pressure.

**Spec**:
- Layout: 2-col on desktop, stacked on mobile
- Typography: `type-metadata` for eyebrow, `type-h2` for title, `type-body` for description
- Form: email input + submit button, `type-button`
- No decorative elements

**States**: success/error inline, no modal

### WhatsAppCta

**Purpose**: Clear conversion — direct contact entry point.

**Spec**:
- Layout: centered, minimal
- Typography: `type-h2` for heading, `type-body` for supporting text
- CTA: Button component, full-width on mobile

## 5. Component Specs

### ProductCard (unified)

**Variants**:

| variant | use case | image ratio | tilt | badges | add-to-bag | hover |
|---------|----------|-------------|------|--------|------------|-------|
| catalogue | shop grid | 4/5 | yes | yes | yes | image swap + view piece |
| featured | homepage, new drop | 3/4 or 16/10 | no | yes | no | subtle scale 1.02 |
| editorial | editorial moments | 4/5 | no | no | no | minimal |

**Internal spacing**:
- Image → metadata: 12px
- Metadata → title: 4px
- Title → price: 8px
- Price → CTA: 8px

**Typography**:
- Metadata: `type-metadata`
- Title: `type-body` medium
- Price: `type-price`
- CTA: `type-button`

### DepthImage

**Purpose**: Editorial photography with intentional spatial depth.

**Props**:
- `media`: ImageSource
- `tilt`: boolean — enables pointer-driven ±3° rotation
- `parallax`: boolean — enables scroll-driven offset
- `className`: aspect ratio override

**Behavior**:
- Tilt: rAF-throttled pointer tracking, max ±3°, disabled on coarse pointers and reduced motion
- Parallax: scroll-driven offset up to 50px, disabled on reduced motion
- Shadow: `shadow-plane-md` for floating effect

### MagneticLink

**Purpose**: Editorial CTA with subtle pointer magnetism.

**Behavior**:
- Tracks pointer within 200px radius
- Translates link 4–8px toward pointer
- Disabled on coarse pointers and reduced motion

### SectionHeader

**Purpose**: Standardized section opening — eyebrow + heading + description + action.

**Note**: Used sparingly. New sections should vary openings rather than defaulting to this pattern.

## 6. Build Handoff

**Target agent**: `nextjs-senior-engineer` (App Router, Server Components, TypeScript, Tailwind v4)

**Design system**: Bespoke. No external component library. Build on existing primitives:
- `Section`, `Container`, `Media`, `DepthImage`, `ProductCard`, `Reveal`, `EditorialHeading`, `MagneticLink`

**Acceptance criteria**:

1. All pages render at 375px, 768px, 1024px, 1440px, 1920px without horizontal scroll
2. All text passes WCAG AA contrast (verified ratios in DESIGN.md)
3. `prefers-reduced-motion` disables all animation and parallax
4. Keyboard navigation works for all interactive elements (focus-visible visible)
5. Hero autoplay pauses on hover/focus; manual controls work
6. ProductCard variants render correctly with specified aspect ratios
7. CollectionShowcase acts render with distinct compositions (no uniform openings)
8. CategoryShowcase has no GlassSurface overlays
9. BrandLockup tracking is 0.18em (not 0.32em)
10. MagneticCursor renders only in Hero, not globally

**Setup note**: Theme the bespoke system with the locked tokens in `DESIGN.md`. Do NOT redesign or re-implement components. Implement exactly this spec.
