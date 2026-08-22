# Design Pre-Flight — SUS WEARS Hero Visual Rebuild

Run date: 2026-08-16. Gate result: **PASS** (with one flagged deviation, actioned below).

## Identity lock (consistency)

- [x] Every hero screen uses ONLY locked tokens (palette `tokens.css`, type `typography.css`,
      spacing/motion/motion `tokens.css`). Off-system values: **0** (verified by inspection + browser).
- [x] One accent (`--color-accent #c2a878`), one radius scale (0.5/0.375/0.25rem), one icon family
      (inline SVG, stroke 1.5), one type pairing (Cormorant + Manrope) across the project.
- [x] Identity-lock holds: hero, collections, editorial share the same bounded-stage signature.
- [x] DESIGN.md was authored first, this feature spec binds to it. No drift.

## Anti-slop (distinctiveness)

- [x] 0 banned fonts; 0 color clichés (verified: no purple glow, no cream default, no gradient text).
- [x] 0 banned layout patterns — the hero is a bounded dimensional stage, NOT the "default
      centered-dark hero": copy is offset left, stage+card to the right (desktop), asymmetric.
- [x] 0 buzzwords, 0 fake names, 0 fake-precise numbers in **new** copy.
- [ ] **Flagged (deviation):** 69 em-dashes exist in PRE-EXISTING editorial copy data
      (`src/data/*.ts`). Actioned: not introduced by this work; house voice uses the em-dash as an
      intentional pause. Tracked in follow-up; left in place to avoid rewriting brand copy mid-spec.
- [x] Slop test: passes — bounded-stage + real photography + champagne accent is not a default.
- [x] Counterfactual test: passes — not the look for ANY brief; it is Nigeria-warm editorial fashion.
- [x] Signature element present and embodies the brief (bounded dimensional stage).
- [x] No cloned references (2 source photographs synthesized into one system, not copied 1:1).

## State & flow coverage

- [x] Media: loading (image visible + skeleton over), loaded, error (fallback panel), incoming
      (1200ms crossfade) — all implemented.
- [x] Autoplay: running / paused-by-hover / paused-by-focus / paused-by-tab-hidden /
      disabled-by-reduced-motion — implemented (dots + arrows + pause; reduced-motion disables).
- [x] Controls + card: idle / hover / focus-visible / active states specified.
- [x] Edge cases: hydration-before-decode (optimistic `ready`), slow network (no opacity-0 gating),
      reduced-motion, 360–430 narrow viewports, overflow-hidden-not-clipping-card.

## Accessibility

- [x] Contrast on `#0b0a09`: fg 15.9:1, fg-secondary 10.3:1, fg-muted 5.0:1, accent 9.1:1 (AA pass).
- [x] Visible keyboard focus: focus-visible accent outlines on CTA, card, controls.
- [x] `prefers-reduced-motion` handled globally + per-component; motion motivated (parallax = depth,
      crossfade = slide continuity).
- [x] ARIA: media wrapper `aria-hidden`, dots with `aria-label` + `aria-current`, pause with
      `aria-pressed`, card is a real `<a>`.
- [x] Mobile: touch targets ≥ 40px, safe-area respected (`pt-[max(3rem,env(safe-area-inset-top))]`),
      no horizontal overflow at 360/390/412 (browser-verified).

## Layout craft

- [x] ≥ 3 layout families on homepage (bounded-stage hero · offset editorial split ·
      centered manifesto · asymmetric collection band · product grid).
- [x] Hierarchy clear; one focal point per view (the photograph); whitespace deliberate.

## Cognitive load

- [x] Nav ≤ 5 top-level; hero presents one primary CTA (card link) + one secondary (copy CTA),
      visually subordinate.
- [x] Exactly one primary action per view (the signature-collection card link).

## Scored self-critique (0–4)

| axis | score | notes |
|---|---|---|
| distinctiveness | 4 | bounded-stage + warm champagne + real photography is a committed identity |
| hierarchy & focus | 4 | photograph dominant, card subordinate, copy clear |
| consistency w/ DESIGN.md | 4 | all values from locked tokens |
| accessibility | 4 | AA everywhere, reduced-motion, focus, safe-areas |
| state/edge coverage | 4 | loading/error/autoplay/edge cases all specified + implemented |
| copy quality | 3 | strong new copy; 1 pt docked for the pre-existing em-dash density (flagged) |
| restraint | 4 | no decoration without meaning; every layer motivated |
| motion motivation | 4 | parallax + crossfade serve depth + continuity only |
| **total** | **31/32** | no axis ≤ 2 — gate PASSES |

## Revise-and-justify

- **editorial.ts:** removed unused `HOME_BASE` constant (lint warning introduced during image
  remap). WHY: dead code, flagged by eslint, not part of the design.
- **Media.tsx (verification catch):** `Media`'s wrapper always emitted `relative`, but
  `SusWorldTeaser`/`FeaturedCollectionSection` pass `absolute inset-0`. `cn` does no tailwind-merge,
  so both position classes coexisted; Tailwind's sorted CSS lets `relative` win, making `inset-0`
  inert and collapsing the wrapper to height 0 (next/image warned: "fill and a height value of 0").
  Fix: `Media` now only adds `relative` when the caller provides no position class. WHY: genuine
  console-warning bug found during browser acceptance; also silenced the `sizes="100vw"` warning
  that fired on the broken mobile parent.
- No other gate changes — the implementation already satisfied the spec (it was built to it).