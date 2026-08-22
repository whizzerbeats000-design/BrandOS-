# SUS WEARS — Product Summary

## What is this?

SUS WEARS is a **unisex luxury streetwear e-commerce storefront** built with Next.js 16.3, React 19, Tailwind CSS v4, and TypeScript. The brand — Shedrack Unisex Stitches — was founded in 2019 in Jos, Plateau State, Nigeria. The house cuts every piece for men and women alike, drawing from a 70/30 blend of African and Western reference points.

## Current State

The application is **substantially built out** with a complete navigation shell, product catalogue, cart system, 3 collection pages, 13 homepage sections, and an AI image generation pipeline. Several pages remain as placeholder stubs, and core commerce features (checkout, account system) are not yet wired.

## What Works

| Area | Status |
|------|--------|
| Navigation shell (sidebar, mobile, utility bar, footer) | Complete |
| Hero section (2 slides, parallax, autoplay) | Complete |
| Product catalogue (filtering, sorting, pagination, search) | Complete |
| Product detail pages (JSON-LD, color/size, add-to-bag, recently viewed) | Complete |
| Cart/bag system (localStorage, custom events) | Complete |
| 3 collection pages (Signature, After Dark, Limited) | Complete |
| 13 homepage sections | Complete |
| Design system (tokens, typography, motion, fonts) | Complete |
| Foundation page (`/foundation`) | Complete |
| AI image generation pipeline (Gemini + NVIDIA) | Complete |

## What Needs Work

| Area | Status |
|------|--------|
| `/about` page | Placeholder stub — needs real content |
| `/editorial` page | Placeholder stub — needs real content |
| `/sus-world` page | Placeholder stub — needs real content |
| Social navigation | Empty array — needs platform links |
| Unit test coverage | 1 test file (2 tests) — needs expansion |
| E2E smoke tests | None — needs Playwright flows |
| Checkout flow | Returns "not available" — needs graceful handling |

## Tech Stack

- **Framework:** Next.js 16.3 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Language:** TypeScript 5
- **Testing:** Vitest (unit), Playwright (E2E)
- **Fonts:** Cormorant Garamond + Manrope (self-hosted)
- **Theme:** Dark luxury (warm near-black, champagne accent)

## Agent Task System

This project uses the Ralph agent loop for task execution. Tasks are defined in `.agent/tasks.json` with individual specs in `.agent/tasks/TASK-{ID}.json`. Each task is independently executable and includes acceptance criteria.
