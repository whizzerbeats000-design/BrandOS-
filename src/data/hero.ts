import type { HeroSlide, HeroMediaSource } from "@/types";

export const HERO_AUTOPLAY_MS = 7000;

/*
   4-slide cinematic hero.
   Each slide uses REAL, UNIQUE campaign photography from /public/images/campaign/.
   No image is shared across slides — every frame is its own moment.
   Mobile crops are art-directed separate 9:16 compositions.
   The Z0–Z4 layering is preserved; each slide has subtle differences
   in copy position and focal point so the narrative breathes.
*/
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "after-dark",
    eyebrow: "New Collection · 2026",
    title: "AFTER DARK",
    description:
      "A darker wardrobe for night — matte surfaces, deep tones and light that finds you.",
    cta: { label: "Explore the collection", href: "/collections/after-dark" },
    copyPosition: "bottom-left",
    media: {
      desktop: "/images/campaign/campaign-02-desktop-1600.webp",
      mobile: "/images/campaign/campaign-02-hero-mobile.webp",
      alt: "A figure in structured SUS WEARS tailoring against a deep warm ground — After Dark campaign",
      focalPoint: { x: 58, y: 40 },
      mobileFocalPoint: { x: 78, y: 44 },
    },
  },
  {
    id: "the-campaign",
    eyebrow: "THE NEW CAMPAIGN",
    title: "Cut for the collective.",
    description:
      "Structured overcoats and draped volumes, composed together in warm chamber light.",
    cta: { label: "Shop the campaign", href: "/shop" },
    copyPosition: "bottom-left",
    media: {
      desktop: "/images/campaign/campaign-01-desktop-1600.webp",
      mobile: "/images/campaign/campaign-01-hero-mobile.webp",
      alt: "A figure in structured SUS WEARS tailoring against a warm dark ground — cinematic campaign photography",
      focalPoint: { x: 56, y: 38 },
      mobileFocalPoint: { x: 76, y: 44 },
    },
  },
  {
    id: "silhouette",
    eyebrow: "SILHOUETTE",
    title: "Form follows function.",
    description:
      "Minimal. Purposeful. Reduced to the essential line.",
    cta: { label: "View the collection", href: "/collections/signature" },
    copyPosition: "bottom-left",
    media: {
      desktop: "/images/campaign/campaign-04-desktop-1600.webp",
      mobile: "/images/campaign/campaign-04-hero-mobile.webp",
      alt: "A figure in SUS WEARS tailoring against a warm dark ground",
      focalPoint: { x: 62, y: 40 },
      mobileFocalPoint: { x: 80, y: 44 },
    },
  },
  {
    id: "jubilee",
    eyebrow: "JOS, 2019",
    title: "Rooted in Nigerian craft.",
    description:
      "Designed for every expression. From Lagos to the world.",
    cta: { label: "See the brand story", href: "/about" },
    copyPosition: "bottom-right",
    media: {
      desktop: "/images/campaign/campaign-05-desktop-1600.webp",
      mobile: "/images/campaign/campaign-05-hero-mobile.webp",
      alt: "A figure beneath a vast night sky — the world beyond the SUS WEARS cloth",
      focalPoint: { x: 30, y: 45 },
      mobileFocalPoint: { x: 52, y: 48 },
    },
  },
];
