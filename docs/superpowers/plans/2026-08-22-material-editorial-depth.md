# Material Editorial Depth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the SUS WEARS frontend feel physically considered, tactile, premium, and editorial through material depth and editorial restraint.

**Architecture:** CSS token updates + JS constant change + className additions. No new components, no new dependencies. All changes are pure refinement of existing systems.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-08-22-material-editorial-depth-design.md`

## Global Constraints

- No new JS dependencies
- No new animation libraries
- No WebGL / Three.js / shader effects
- No scroll-linked environmental gradients
- No depth-of-field blur
- No glassmorphism expansion
- No decorative gradients
- No bounce / elastic easing
- Preserve existing performance architecture
- Preserve existing responsive behavior
- Preserve existing reduced-motion behavior
- Preserve SUS WEARS brand identity
- Typography weights: display=300, h1=500 (already correct — no change needed)
- Success criterion: material depth, editorial restraint, more expensive-feeling experience

---

### Task 1: Design Token Updates

**Files:**
- Modify: `src/styles/tokens.css:68-91`

**Interfaces:**
- Consumes: nothing
- Produces: `--shadow-contact` token, refined `--shadow-plane-*` tokens, updated `--grain-opacity`

- [ ] **Step 1: Add `--shadow-contact` token and refine shadow tokens**

In `src/styles/tokens.css`, replace the shadows section (lines 68-88) with:

```css
  /* ---- Shadows (material depth on dark ground) ----
     One light source: warm key from above. Shadows are soft, warm,
     and directional — they model form against the obsidian page. */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(184, 149, 106, 0.06);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(184, 149, 106, 0.08);
  --shadow-lg: 0 10px 28px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(184, 149, 106, 0.1);
  --shadow-xl: 0 18px 50px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(184, 149, 106, 0.12);

  /* ---- Contact shadow (tight, immediate — object sits ON the page) ---- */
  --shadow-contact: 0 1px 2px rgba(10, 9, 8, 0.15);

  /* ---- Image planes (photography as physical objects on dark ground) ---- */
  --shadow-plane-sm:
    0 1px 1px rgba(0, 0, 0, 0.2),
    0 10px 24px -12px rgba(0, 0, 0, 0.5);
  --shadow-plane-md:
    0 2px 4px rgba(10, 9, 8, 0.08),
    0 24px 48px -16px rgba(10, 9, 8, 0.18);
  --shadow-plane-lg:
    0 4px 8px rgba(10, 9, 8, 0.1),
    0 48px 96px -32px rgba(10, 9, 8, 0.22);
```

- [ ] **Step 2: Update grain opacity**

In `src/styles/tokens.css`, change line 91:

```css
  --grain-opacity: 0.05;
```

- [ ] **Step 3: Verify tokens compile**

Run: `npx tsc --noEmit`
Expected: No new errors (pre-existing errors only)

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "refactor(design-tokens): refine shadow hierarchy, add contact token, increase grain"
```

---

### Task 2: Plane Material System

**Files:**
- Modify: `src/styles/planes.css:38-44` (`.plane--deep` background fix)
- Create: `.section-depth` class in same file

**Interfaces:**
- Consumes: `--shadow-contact`, `--shadow-plane-md` tokens from Task 1
- Produces: `.plane--deep` with dark background, `.section-depth` class

- [ ] **Step 1: Fix `.plane--deep` background**

In `src/styles/planes.css`, replace lines 38-44:

```css
/* Deep moments (photography on dark fields) — the shadow goes quiet
   so the plane reads as part of the dark, not floating on it. */
.plane--deep {
  background: var(--color-deep);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.4),
    0 28px 56px -28px rgba(0, 0, 0, 0.55);
}
```

- [ ] **Step 2: Add `.section-depth` class**

Add after the `.plane--deep` block (after line 44), before the `.plane-lift` block:

```css

/* Section depth — a 1px warm-dark line at the top edge.
   Marks transitions between spatial layers. */
.section-depth {
  box-shadow: 0 -1px 0 rgba(10, 9, 8, 0.06);
}
```

- [ ] **Step 3: Verify CSS parses**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/styles/planes.css
git commit -m "refactor(planes): fix plane--deep background, add section-depth separator"
```

---

### Task 3: DepthCard Refinement

**Files:**
- Modify: `src/components/ui/DepthCard.tsx:15` (MAX_DEGREES constant)
- Modify: `src/styles/motion.css:272-276` (depth-card-inner transition)

**Interfaces:**
- Consumes: `--ease-cinematic`, `--duration-slow` tokens from tokens.css
- Produces: refined DepthCard behavior (1.5° max, hover lift, cinematic easing)

- [ ] **Step 1: Update MAX_DEGREES constant**

In `src/components/ui/DepthCard.tsx`, change line 15:

```typescript
const MAX_DEGREES = 1.5;
```

- [ ] **Step 2: Add hover lift via CSS**

In `src/styles/motion.css`, replace lines 272-276:

```css
  .depth-card-inner {
    transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
    transition:
      transform var(--duration-slow) var(--ease-cinematic),
      box-shadow var(--duration-slow) var(--ease-cinematic);
    will-change: transform;
  }
```

Then add a hover state after the `.depth-card-inner` block (before the `@media (prefers-reduced-motion: reduce)` block):

```css
  .depth-card-container:hover .depth-card-inner {
    transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-3px);
  }
```

- [ ] **Step 3: Update reduced-motion handler**

In `src/styles/motion.css`, the existing `@media (prefers-reduced-motion: reduce)` block for depth-card (lines 278-284) stays unchanged — it already kills transforms and will-change. The new hover rule inherits this behavior.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/DepthCard.tsx src/styles/motion.css
git commit -m "refactor(depth-card): reduce max tilt to 1.5deg, add hover lift, cinematic easing"
```

---

### Task 4: Typography Refinement

**Files:**
- Modify: `src/styles/typography.css:128-134` (`.type-body` max-width)

**Interfaces:**
- Consumes: nothing
- Produces: optimal reading measure on `.type-body`

Note: `.type-display` weight is already 300 and `.type-h1` weight is already 500. No weight changes needed.

- [ ] **Step 1: Add max-width to `.type-body`**

In `src/styles/typography.css`, replace lines 128-134:

```css
.type-body {
  font-family: var(--font-sans);
  font-size: var(--type-body);
  font-weight: var(--fw-body);
  line-height: var(--type-body-line-height);
  letter-spacing: 0;
  max-width: 65ch;
}
```

- [ ] **Step 2: Verify no layout breakage**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/styles/typography.css
git commit -m "refactor(typography): add 65ch max-width to body text for optimal reading measure"
```

---

### Task 5: FeaturedProducts Depth Cleanup

**Files:**
- Modify: `src/components/product/ProductCard.tsx:111` (featured variant class)

**Interfaces:**
- Consumes: `.product-plane__media` CSS from planes.css (provides scale(1.015) hover)
- Produces: featured variant uses product-plane hover, not depth-layer--lift

- [ ] **Step 1: Remove `depth-layer--lift` from featured variant**

In `src/components/product/ProductCard.tsx`, change line 111:

```typescript
          isFeatured && "product-plane__media",
```

(Remove `depth-layer--lift` — the `product-plane__media` class already provides the appropriate scale hover via planes.css)

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/components/product/ProductCard.tsx
git commit -m "refactor(product-card): remove redundant depth-layer--lift from featured variant"
```

---

### Task 6: Parallax Speed Updates

**Files:**
- Modify: `src/components/editorial/DepthImage.tsx:57,67` (speed 0.18 to 0.22)
- Modify: `src/components/home/StudioSection.tsx:46` (speed 0.15 to 0.22)
- Modify: `src/components/home/EditorialMoment.tsx:43-48` (add parallax prop)

**Interfaces:**
- Consumes: `ParallaxSection` component with `speed` prop
- Produces: editorial images drift at 0.22 speed

- [ ] **Step 1: Update DepthImage parallax speed**

In `src/components/editorial/DepthImage.tsx`, change both occurrences of `speed={0.18}` to `speed={0.22}` (lines 57 and 67):

```typescript
      <ParallaxSection speed={0.22} className={className}>
```

- [ ] **Step 2: Update StudioSection parallax speed**

In `src/components/home/StudioSection.tsx`, change line 46:

```typescript
          <ParallaxSection speed={0.22}>
```

- [ ] **Step 3: Add parallax to EditorialMoment**

In `src/components/home/EditorialMoment.tsx`, add `parallax` prop to the DepthImage on lines 43-48:

```typescript
            <DepthImage
              media={feature.media}
              tilt
              parallax
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="aspect-[16/10]"
            />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add src/components/editorial/DepthImage.tsx src/components/home/StudioSection.tsx src/components/home/EditorialMoment.tsx
git commit -m "refactor(parallax): increase editorial drift to 0.22, add parallax to EditorialMoment"
```

---

### Task 7: Section Depth Classes

**Files:**
- Modify: `src/components/home/BrandStatement.tsx:20` (add className)
- Modify: `src/components/home/EditorialMoment.tsx:14` (add className)
- Modify: `src/components/home/WhatsAppCta.tsx:30` (add className)

**Interfaces:**
- Consumes: `.section-depth` CSS class from planes.css (Task 2)
- Produces: three sections with spatial separation lines

- [ ] **Step 1: Add `.section-depth` to BrandStatement**

In `src/components/home/BrandStatement.tsx`, change line 20:

```typescript
      className="relative overflow-hidden bg-background section-depth"
```

- [ ] **Step 2: Add `.section-depth` to EditorialMoment**

In `src/components/home/EditorialMoment.tsx`, change line 14:

```typescript
    <Section aria-labelledby="editorial-moment-heading" className="bg-surface-elevated section-depth">
```

- [ ] **Step 3: Add `.section-depth` to WhatsAppCta**

In `src/components/home/WhatsAppCta.tsx`, change line 30:

```typescript
    <Section aria-labelledby="contact-heading" className="bg-deep section-depth">
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add src/components/home/BrandStatement.tsx src/components/home/EditorialMoment.tsx src/components/home/WhatsAppCta.tsx
git commit -m "refactor(sections): add section-depth separator to BrandStatement, EditorialMoment, WhatsAppCta"
```

---

### Task 8: Full Verification

**Files:**
- No new files

**Interfaces:**
- Consumes: all tasks above
- Produces: passing tests, clean build, no regressions

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No new errors (pre-existing errors only)

- [ ] **Step 2: Run tests**

Run: `npx vitest run`
Expected: 49/49 passing (unchanged)

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Clean build, no errors

- [ ] **Step 4: Verify reduced-motion compliance**

Inspect `src/styles/motion.css` — confirm:
- `.depth-card-inner` reduced-motion block still kills transforms
- `@media (hover: none)` block still disables tilt on touch
- No new animations without reduced-motion handling

- [ ] **Step 5: Verify no new dependencies**

Run: `cat package.json | grep -E "three|gsap|framer|lenis"`
Expected: No matches

- [ ] **Step 6: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "chore: final verification fixes"
```
