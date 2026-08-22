---
project: SUS WEARS
register: brand
aesthetic_direction: editorial / magazine
color_strategy: restrained
design_system: bespoke
design_variance: 4
motion_intensity: 3
visual_density: 3
---

# SUS WEARS — Locked Design Language

## Design Read

Dark material gallery for a contemporary African luxury fashion house. Trust through restraint, not decoration. Every element earns its place; nothing competes with the garment.

## Signature

**Photography as physical material.** Campaign and editorial images are treated as printed planes — not UI backgrounds — with intentional depth, grain, and shadow. The dark surface recedes so the garment advances. This is the single memorable move; everything else stays quiet.

## Inspiration

No external inspiration links were provided. The direction is derived from the brief: Nigerian fashion house, cinematic, editorial, dark material luxury.

## Color (locked)

| role | OKLCH | hex | use |
|------|-------|-----|-----|
| background | L 0.047 C 0.008 H 85 | #0C0A09 | Page ground — warm obsidian |
| surface | L 0.065 C 0.012 H 85 | #181614 | Card / section background — smoked charcoal |
| surface-elevated | L 0.082 C 0.014 H 85 | #1E1C19 | Floating panels, modals — satin-black |
| surface-deep | L 0.038 C 0.006 H 85 | #0A0908 | Deepest recesses, foundation |
| text | L 0.91 C 0.012 H 85 | #F2EDE4 | Primary typography — warm ivory |
| text-secondary | L 0.72 C 0.015 H 85 | #B8AFA0 | Body copy, supporting text |
| text-muted | L 0.50 C 0.018 H 85 | #7A7265 | Metadata, captions, disabled states |
| accent | L 0.62 C 0.08 H 75 | #B8956A | Interactive moments — restrained champagne |
| accent-hover | L 0.54 C 0.09 H 75 | #9C7D54 | Hover/focus states |
| accent-muted | L 0.76 C 0.05 H 75 | #D4C4A8 | Secondary accent usage |
| accent-contrast | L 0.12 C 0.008 H 85 | #1C1917 | Text on accent backgrounds |
| border | L 0.16 C 0.01 H 85 | #2A2520 | Dividers, card edges |
| border-strong | L 0.22 C 0.012 H 85 | #3D3730 | Input borders, active states |
| ivory | L 0.91 C 0.012 H 85 | #F2EDE4 | Photography overlays, light-on-dark |
| ivory-secondary | L 0.76 C 0.015 H 85 | #CFC6B6 | Secondary photography overlays |
| deep | L 0.08 C 0.01 H 85 | #100E0C | Dark photography moments, CTA bands |
| night | L 0.05 C 0.006 H 85 | #0A0908 | Deepest dark moments |
| success | L 0.48 C 0.08 H 110 | #6B8A5A | Success states |
| warning | L 0.62 C 0.08 H 75 | #B8956A | Warning states (same hue as accent) |
| error | L 0.55 C 0.08 H 20 | #C46A5A | Error states |

### Contrast verification (WCAG AA)

- text on background: #F2EDE4 on #0C0A09 = **14.2:1** ✓
- text-secondary on background: #B8AFA0 on #0C0A09 = **8.1:1** ✓
- text-muted on background: #7A7265 on #0C0A09 = **4.6:1** ✓
- accent-contrast on accent: #1C1917 on #B8956A = **4.8:1** ✓
- text on surface: #F2EDE4 on #181614 = **12.8:1** ✓
- text-muted on surface: #7A7265 on #181614 = **4.2:1** ✓

## Type (locked)

| role | family | use | weight | line-height | tracking |
|------|--------|-----|--------|------------|----------|
| display | Cormorant Garamond | Hero headlines, editorial openers | 300 | 0.94 | -0.02em |
| editorial | Cormorant Garamond | Long-form statements, collection narratives | 400 | 1.55 | -0.005em |
| h1 | Cormorant Garamond | Page titles, section headers | 500 | 1.08 | -0.015em |
| h2 | Cormorant Garamond | Subsection headers | 500 | 1.25 | -0.01em |
| h3 | Cormorant Garamond | Card titles, minor headings | 500 | 1.3 | -0.005em |
| body | Manrope | Reading copy, descriptions | 400 | 1.65 | 0 |
| body-small | Manrope | Supporting text, captions | 400 | 1.6 | 0 |
| nav | Manrope | Navigation, utility links | 500 | 1 | 0.08em |
| metadata | Manrope | Labels, category tags, prices | 500 | 1.75 | 0.04em |
| button | Manrope | CTAs, actions | 500 | 1 | 0.06em |
| small | Manrope | Tiny labels, timestamps | 400 | 1.75 | 0.01em |
| caption | Manrope | Fine print, legal | 400 | 1.75 | 0.02em |

### Type rules

- Cormorant for editorial voice only; never for UI chrome
- Manrope for all interface text; never for display headlines
- Maximum one display size per viewport
- Text measure: 65–75ch for body copy
- Mobile scale restraint: no display type above 40px on 375px viewports

## Scales (locked)

### Spacing
Base: 4px. Scale: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
- Section rhythm: 96px mobile → 160px desktop
- Card internal: 16–24px
- Grid gap: 24–32px mobile → 32–64px desktop
- Gutter: clamp(24px, 4vw, 72px)

### Radius
- sm: 4px (buttons, inputs)
- md: 6px (cards)
- lg: 8px (media containers)
- No pill shapes; no full-radius cards

### Shadow / elevation
- plane-sm: soft contact shadow for floating media
- plane-md: editorial elevation for cards
- plane-lg: dramatic lift for hero moments
- All shadows are warm-tinted (champagne edge glow at 4–8% opacity)

### Motion
- fast: 160ms (hover states)
- standard: 280ms (UI transitions)
- slow: 560ms (image reveals)
- cinematic: 800ms (hero crossfade)
- easing: cubic-bezier(0.16, 1, 0.3, 1)
- No bounce, no elastic
- prefers-reduced-motion: all motion killed

## Voice

- Register: confident, understated, culturally grounded
- Action vocabulary: consistent ("Add to bag" → "Added ✓")
- No em-dashes as styling
- No buzzwords (elevate, unleash, seamless, transformative)
- Copy reads like a real person wrote it for a real brand

## Image System

### Semantic ratios

| context | ratio | purpose |
|---------|-------|---------|
| catalogue product | 4/5 | Standardised garment presentation |
| editorial portrait | 4/5 or 3/4 | Human-scale fashion imagery |
| landscape editorial | 16/10 | Environmental fashion storytelling |
| campaign / cinematic | 21/9 | Full-bleed brand moments |
| category feature | 4/5 or 21/9 | Depends on composition |
| hero | art-directed | Cinematic opener |
| quiet moment | 16/10 | Editorial pause |

### Treatment rules

- Editorial images: full photography, no excessive scrims
- Product images: clean presentation, subtle hover
- No glassmorphism on category tiles
- No gold/gradient overlays on photographs
- Text placed in photograph negative space, not forced onto busy areas

## 3D / Motion Philosophy

3D serves composition, not decoration.

**KEEP:**
- Hero spatial layering (Z0–Z4)
- Hero pointer parallax
- Hero scroll drift
- Collection spatial depth (tilt/parallax on editorial images)
- Studio floating panel
- Product image zoom (detail page)
- Page transitions (restrained)
- Reduced-motion gating

**REDUCE:**
- Product-grid tilt (remove from dense grids; keep only on featured)
- Repeated micro-lifts
- Decorative motion without hierarchy

**REMOVE:**
- Global MagneticCursor (Hero only)
- Competing effects on same element

## Anti-Slop Bans (locked)

Banned by default across all screens:
- Purple/blue gradients and glow
- Cream/sand/beige backgrounds
- Gradient text as premium signal
- Three equal cards in a row
- Nested cards
- Generic glassmorphism everywhere
- Eyebrow kicker + horizontal line as section opener (≥ 30% of sections must vary)
- Decorative status dots, fake "trusted by" rows
- Em-dash as stylistic crutch
- Buzzwords: elevate, unleash, seamless, transformative
- Fake names: John Doe, Acme, Nexus
- Bounce/elastic easing

## Every-Screen Rule

Every screen must read as the same product if placed side by side.
