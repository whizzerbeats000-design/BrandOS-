# Hero Visual Rebuild — Feature Spec

Binds to `.ulpi/design/DESIGN.md`. Re-read it first; every value here derives from it.

## 0. Problem framed in user terms

A visitor lands on SUS WEARS and the first thing they see is the campaign photograph. Today it can
present wrong: the floating glass card is painted *behind* the image (a stacking-context defect, not
a styling taste), the stage's bottom edge and card are clipped by the section boundary on mobile, and
the hero image can remain invisible after SSR/hydration because visibility is gated on a client-only
`onLoad` event. Result: the house looks broken before the page has said a word.

**Goal:** the hero reads as a deliberate layered editorial scene — photograph dominant, glass card
physically in front, image visible on first render, correct at every viewport, and no element leaking
into the next section.

## 1. User flows + states

### Primary flow
1. Land on `/` → hero paints: atmosphere (L0) → campaign photo on a bounded stage (L2) → glass card
   overlapping the stage edge (L4) → copy + controls (L5).
2. Photo and card are visible immediately; skeleton (if any) is *behind* the image and fades out.
3. Autoplay advances slides every 7s unless reduced-motion, hover, focus, or visibility-hidden pause.
4. User clicks dot / arrow / pause → transition 1200ms `--ease-accent`, card and copy re-enter.
5. User clicks card CTA or copy CTA → navigate (signature collection / shop / sus-world).

### States (each interactive element)
- **Media:** loading (image visible + faint skeleton pulse over it) · loaded (skeleton opacity 0) ·
  error (warm `hero-fallback` gradient panel, no broken-image icon) · incoming (crossfade 1200ms).
- **Autoplay:** running · paused-by-hover · paused-by-focus · paused-by-tab-hidden ·
  disabled (reduced-motion). Dots show a progress fill; paused state freezes fill.
- **Controls:** idle · hover (accent border/icon) · focus-visible (accent outline) · active.
- **Card:** idle · hover (title accent shift) · focus-visible.

### Edge cases
- Image decodes before hydration → `ready` must not strand it invisible (check `complete`/`naturalWidth`
  at hydration and mark loaded).
- Slow network → image still visible as soon as SSR paints (no opacity-0 gating); skeleton is the
  only thing that waits.
- Reduced-motion → no autoplay, no parallax, no entry animations; slides swap instantly.
- Viewport 360–430 → card must stay inside hero bounds; no horizontal overflow; model/garment not
  cropped off-frame (focal point controls the 3:4 mobile crop).
- `overflow-hidden` on the hero must not clip the card/shadow → hero needs bottom padding that fits
  the card overhang + contact shadow at every breakpoint.

## 2. Component specifications

### HeroMedia (media layer)
- **Purpose:** render the campaign photo pair (desktop 7:4 landscape, mobile 3:4 portrait) with
  focal-point object-position, eager for the first slide, lazy for incoming slides.
- **Props:** `media: HeroMediaSource` · `priority?: boolean` · `sizes?: string` · `quality?: 50|75|90`
  (default 90) · `className?`.
- **States:** table above. **Critical rule:** the `<img>` is never gated by `opacity-0`; a
  `pointer-events-none` skeleton overlay sits *above* the image and fades out on `onLoad`.
- **Accessibility:** wrapper `aria-hidden="true"` (copy is the readable content).
- **Edge cases:** `onError` → fallback panel; mobile image hidden on `lg+`, desktop hidden below `lg`
  (both still hydrate fine).

### HeroStage (L2/L3)
- **Purpose:** the bounded dimensional panel — `aspect-[3/4] lg:aspect-[7/4]`, `overflow-hidden`,
  `border-radius 0.5rem`, recessed shadow gap, hairline rim (z-10), contact shadow on implied floor.
- **Isolation:** the stage must establish `isolation: isolate` so its internal z-layers (media z-1/z-2,
  rim z-10) cannot escape.

### HeroGlassCard (L4) + its parallax wrapper
- **Purpose:** floating editorial metadata card overlapping the stage's lower-left edge.
- **CRITICAL stacking fix:** the parallax wrapper (`--px/--py` translate) creates a fresh stacking
  context at `z-auto` → painted at level 0, *under* the media's z-2. The wrapper must carry an
  explicit `z-index: 30` so the card is always painted above media (z-2) and rim (z-10).
- **Position:** `-bottom-6 -left-6` mobile / `-bottom-8 -left-8` desktop; width `min(14rem, 28vw)`.
- **States/accessibility:** it is an `<a>` to the collection; hover accent shift; focus-visible outline.

### Hero.tsx scene
- Layer container `hero-root` = `isolate overflow-hidden`, with bottom padding so the card + contact
  shadow fit inside the section (never clipped). Mobile: `min-height: calc(100svh - header)` and a
  compact title scale (`clamp(2.25rem, 7.5vw, 3.5rem)`) so the image is dominant. Desktop: content
  height, `padding-bottom: 5rem`.
- Copy column (L5, z-50) left on desktop; stage + card in the right column; on mobile the copy stacks
  above the stage. Controls (dots/arrows/pause) bottom-right z-50.

### Hero copy
- Eyebrow (accent) → display title → optional description → outline CTA. Staggered `hero-line-in`
  120ms; reduced-motion → static.

## 3. Real-image mapping (the source of visual truth)

Only two approved campaign photographs exist (`/mnt/sdcard/sus wears images/sus wears 1.png`
1659×948, `sus wears 2.png` 1639×959). No placeholder SVGs where a real asset fits.

| Section | asset (desktop / mobile) | focalPoint |
|---|---|---|
| Hero slide 1 | campaign-01-desktop.webp (1600×914) / campaign-01-mobile.webp (768×1024) | x72 y42 |
| Hero slide 2 | campaign-02-desktop.webp / campaign-02-mobile.webp | x58 y45 |
| Featured fashion — tailored | campaign-01-editorial.webp (960×1200, 4:5) | x62 y42 |
| Featured fashion — draped | campaign-02-editorial.webp | x55 y42 |
| SUS World teaser | campaign-01-desktop / campaign-01-mobile | x62 y40 |
| Craft story | campaign-02-editorial.webp | x55 y40 |
| Editorial feature | campaign-01-desktop / campaign-01-mobile | x58 y40 |
| Collection: signature | campaign-01-desktop / campaign-01-mobile | x62 y40 |
| Collection: after-dark | campaign-02-desktop / campaign-02-mobile | x55 y42 |
| Collection: limited | campaign-01-desktop / campaign-01-mobile | x30 y45 |

Derived assets generated by `scripts/generate-campaign.mjs` (sharp, WebP quality 90, subject-aware
attention crop). Focal points are tuned per placement so faces/garments are never cut.

## 4. Build handoff

- **Target agent:** `nextjs-senior-engineer` (SSR/App Router). In this environment: delegate to the
  `general` engineering agent with this file + DESIGN.md as the brief.
- **Design system:** bespoke (per DESIGN.md). Theme from the locked tokens; do NOT redesign or
  re-implement components.
- **Scope for the agent:** the spec above is implemented and browser-verified across 360/375/390/412/
  430/768/1024/1280/1440/1536/1920 — hero media visible, card above image, no clipping, no overflow,
  no console errors, controls interactive. Then `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- **Acceptance criteria:** all states/edge cases above hold in a real browser; lint/tsc/build pass;
  the 2 real campaign photos are the visual truth in every mapped section; no SVG placeholder remains
  where a real asset exists.

> Implement exactly this spec. Theme the design system with our locked tokens; do NOT redesign or
> re-implement its components.