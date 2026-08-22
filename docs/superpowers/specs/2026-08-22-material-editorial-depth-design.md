# SUS WEARS — Material Editorial Depth

**Date:** 2026-08-22
**Status:** Approved
**Scope:** Architectural visual-system refinement across the entire frontend

---

## 1. Core Philosophy

**Material Depth** as the primary system. **Editorial Restraint** as the secondary principle.

The objective is not to make the website look more "3D." The objective is to make the interface feel physically considered, tactile, premium, and editorial.

The visitor should not think: "This website has lots of 3D effects."
They should think: "This feels expensive."

**Rejected:** Spatial Atmosphere (scroll-linked gradients, depth-of-field blur, environmental lighting). The depth comes from geometry, typography, photography, and spacing — not from system-wide effects.

---

## 2. DepthCard Refinement

**Files:** `src/components/ui/DepthCard.tsx`, `src/styles/motion.css`

### Current state
- `MAX_DEGREES = 3` — too much rotation, reads as mechanical gimbal
- No hover lift — rotation only
- Transition: `var(--duration-standard)` (280ms) with `var(--ease-standard)` — too fast, too linear
- Touch devices: correctly disabled

### Proposed changes

| Property | Current | Proposed | Rationale |
|----------|---------|----------|-----------|
| `MAX_DEGREES` | 3 | 1.5 | Subtler rotation — felt, not seen |
| Hover transform | none | `translateY(-3px)` | Physical lift — object has weight |
| Easing | `var(--ease-standard)` | `var(--ease-cinematic)` | Slower, weightier settle |
| Duration | 280ms | 560ms | Weightier — mass takes time to move |
| Reduced motion | kills transforms | no change | Already correct |
| Touch devices | disabled | no change | Already correct |

### Application scope

**Keep tilt:** ProductCard (physical object examination), DepthImage (editorial photographs).

**Remove tilt from:** FeaturedProducts `product-plane` cards — these use `.product-plane:hover .product-plane__media { transform: scale(1.015) }` which is already appropriate. DepthCard wrapper is redundant here.

---

## 3. Shadow/Material System

**Files:** `src/styles/tokens.css`, `src/styles/planes.css`

### Current state
- `--shadow-plane-sm/md/lg` exist with champagne glow at 6-12% opacity
- `--shadow-plane-md`: tight contact edge + ambient shadow + champagne ring

### Proposed shadow hierarchy

**Contact shadow** (new token `--shadow-contact`):
```css
0 1px 2px rgba(10, 9, 8, 0.15)
```
Tight, dark, immediate. Establishes the object sits ON the page.

**Ambient shadow** (refine `--shadow-plane-md`):
```css
0 2px 4px rgba(10, 9, 8, 0.08),
0 24px 48px -16px rgba(10, 9, 8, 0.18)
```
Softer, larger. Champagne glow removed — the warm ground already creates warmth.

**Accent light:** Remove explicit champagne glow from plane shadows. The warm ground (#0C0A09) and warm-tinted shadows create warmth naturally. Champagne at 6-12% reads as a color feature; without it, warmth comes from the material.

### Application
- ProductCard: `--shadow-contact` on hover, `--shadow-plane-sm` at rest
- DepthImage: `--shadow-plane-md` (refined)
- StudioSection image: `--shadow-plane-md` (refined)
- CollectionShowcase acts: `--shadow-plane-md` (refined)
- NOT: SectionHeader, Button, Footer columns, newsletter form, MobileMenu

---

## 4. Grain / Material Texture

**File:** `src/styles/tokens.css`

### Current state
`--grain-opacity: 0.03` (3%) — effectively invisible.

### Proposed change
`--grain-opacity: 0.05` (5%)

Single token change. At 5% the texture becomes material tooth — you feel the page has quality without seeing noise. Performance: no change (single fixed SVG, compositing cost only).

---

## 5. Section Depth

**Files:** `src/styles/planes.css`

### Current state
Sections are flat stacked panels with no spatial separation.

### Proposed hierarchy

**Page canvas:** `--color-background` (#0C0A09, warm obsidian)

Three transition points receive depth separation via a `.section-depth` class:

| Transition | Target section | Rationale |
|-----------|---------------|-----------|
| Hero to BrandStatement | BrandStatement | First editorial moment after the hero — establishes the ground |
| FeaturedProducts to EditorialMoment | EditorialMoment | Commerce to editorial transition — spatial shift |
| NewsletterSection to WhatsAppCta | WhatsAppCta | Closing moment — the final beat |

Sections with existing spatial treatments (CollectionShowcase plane shadows, StudioSection plane treatment, EditorialMoment elevated surface color) rely on those treatments for depth. The `.section-depth` class is for transitions that lack other spatial cues.

### Mechanism
New CSS class in `planes.css`:
```css
.section-depth {
  box-shadow: 0 -1px 0 rgba(10, 9, 8, 0.06);
}
```
A 1px warm-dark line at the top edge. Applied via className on the three target section components listed above.

---

## 6. Editorial Image Parallax

**Files:** `src/components/ui/ParallaxSection.tsx`, consumers

### Current state
`speed={0.18}`, max 50px offset.

### Proposed change
`speed={0.18}` to `speed={0.22}` on editorial images only (DepthImage in CollectionShowcase, StudioSection, EditorialMoment).

22% increase in drift — noticeable as "breathing" but not "floating." Max 50px clamp stays. Hero parallax unchanged (has its own system).

---

## 7. Typography as Depth Mechanism

**File:** `src/styles/typography.css`

### Changes

| Element | Current | Proposed | Rationale |
|---------|---------|----------|-----------|
| `.type-display` weight | 400 | 300 | Lighter = more editorial, less commercial |
| `.type-h1` weight | 600 | 500 | Slightly lighter to reduce weight against display |
| `.type-body` max-width | none | `65ch` | Optimal reading measure |

No font changes. Cormorant Garamond + Manrope stay. No new tracking or line-height changes — the existing values are well-calibrated.

---

## 8. Studio Section Fix

**File:** `src/components/home/StudioSection.tsx`

### Investigation findings
The StudioSection currently uses `className="bg-background"` which resolves to `#0C0A09` (warm obsidian). The `plane` class inside has `background: var(--color-surface)` = `#181614` (smoked charcoal). The `plane--deep` class overrides only the shadow, not the background.

The `Media` component applies `bg-surface` (#181614) as a loading fallback. On a dark theme this is appropriate.

### Root cause
The `.plane` base class applies `background: var(--color-surface)` (#181614) which is lighter than the section background (#0C0A09). On a dark theme this creates a visible lighter rectangle — the "leak." The `plane--deep` variant should override this background to match the section, but it only overrides the shadow.

### Fix
In `planes.css`, add to `.plane--deep`:
```css
.plane--deep {
  background: var(--color-deep);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4),
              0 28px 56px -28px rgba(0, 0, 0, 0.55);
}
```
`--color-deep` (#100E0C) matches the intended dark-field surface. The plane reads as part of the dark, not floating on it.

---

## 9. Unified Visual Language

Shared tokens/primitives for all card and media components:

| Property | Token | Value |
|----------|-------|-------|
| Border radius | `--radius-md` | 0.375rem |
| Contact shadow | `--shadow-contact` | (new, see Section 3) |
| Ambient shadow | `--shadow-plane-md` | (refined, see Section 3) |
| Hover lift | DepthCard | translateY(-3px) at 560ms cinematic |
| Aspect ratios | editorial | 4/5, 3/4, 16/10, 21/9 (unchanged) |
| Borders | `--color-border` / `--color-border-strong` | structural / emphasis |

Components share geometry rules but remain semantically distinct. ProductCard, FeaturedProductCard, CollectionCard, DepthImage, StudioSection image all use compatible material treatment.

---

## 10. Rejected Approaches

The following are explicitly NOT part of this spec:

- Scroll-linked environmental gradients
- Depth-of-field blur (CSS `filter: blur()`)
- Constantly changing color washes
- Heavy focus glows
- Complex scroll-linked lighting
- WebGL / Three.js / shader effects
- New animation libraries
- Glassmorphism expansion
- Decorative gradients
- Bounce / elastic easing

---

## 11. Performance Requirements

No regressions allowed in:
- JavaScript bundle size
- Lazy loading behavior
- Image loading strategy
- Hydration stability
- Mobile performance
- Route transition speed
- Reduced-motion compliance

Before adding any visual effect: "Does this materially improve the experience?" If not, do not add it.

---

## 12. Responsive Behavior

**Desktop (64rem+):** Full material system — DepthCard tilt, parallax, shadows, grain, section depth.

**Tablet (40-64rem):** Reduced tilt (same MAX_DEGREES but less noticeable on larger screens), reduced parallax, same shadows/grain.

**Mobile (< 40rem):** Tilt disabled via existing `@media (hover: none)`. Parallax reduced. Shadows simplified. Grain unchanged. Typography hierarchy preserved. The mobile experience should still feel premium through spacing, shadows, and typography — not expensive effects.

---

## 13. Quality Gate

Before considering work complete, evaluate the homepage with effects disabled (reduced motion, no hover). If the site still looks premium because of typography, spacing, photography, composition, and geometry — the system is successful.

If the site only looks impressive when animations are running, the design system is not strong enough.

---

## 14. Components Touched

| Component | Changes |
|-----------|---------|
| `DepthCard.tsx` | MAX_DEGREES 3 to 1.5, add translateY(-3px) hover, cinematic easing, slow duration |
| `motion.css` | Update `.depth-card-inner` transition duration and easing |
| `tokens.css` | Grain 3% to 5%, add `--shadow-contact`, refine `--shadow-plane-*` |
| `planes.css` | Refine shadow values, add `.section-depth`, fix `.plane--deep` background |
| `typography.css` | Display weight 400 to 300, h1 weight 600 to 500, body max-width 65ch |
| `StudioSection.tsx` | Fix plane background via `.plane--deep` fix |
| `FeaturedProducts.tsx` | Remove DepthCard wrapper from product-plane cards |
| `CollectionShowcase.tsx` | Parallax speed 0.18 to 0.22 |
| `BrandStatement.tsx` | Add `.section-depth` class |
| `EditorialMoment.tsx` | Add `.section-depth` class, parallax speed 0.18 to 0.22 |
| `WhatsAppCta.tsx` | Add `.section-depth` class |

---

## 15. Final Creative Rule

The final SUS WEARS frontend should communicate:

"Quiet luxury with physical presence."

Not: "Look how much technology is running underneath this website."

The 3D should be felt, not seen. The final experience should feel like entering a beautifully designed Lagos fashion atelier — tactile materials, controlled lighting, carefully placed garments, photography, typography, and silence between moments.
