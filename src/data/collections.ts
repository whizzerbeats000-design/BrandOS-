import type { Collection } from "@/types";

export const COLLECTIONS: readonly Collection[] = [
  {
    id: "signature",
    slug: "signature",
    name: "Signature",
    eyebrow: "Collection",
    tagline: "BUILT FOR PRESENCE.",
    year: "2026",
    season: "S/S 2026",
    status: "current",
    shortDescription:
      "The core SUS WEARS wardrobe — unisex silhouettes cut to last beyond a single season.",
    description:
      "Signature is the house language made permanent. Each piece is cut from a single pattern logic: unisex, precise, built to move with the body. No ornamentation, no excess — only the garment.",
    editorialQuote: "The silhouette is the logo.",
    heroImage: {
      desktop: "/images/collections/signature/hero-desktop.webp",
      mobile: "/images/collections/signature/hero-mobile.webp",
      alt: "SUS WEARS Signature collection — a figure in structured unisex tailoring under warm light",
      focalPoint: { x: 50, y: 35 },
    },
    gallery: [
      { src: "/images/collections/signature/gallery-01.webp", alt: "Signature — piece 01", aspectRatio: "3/4" },
      { src: "/images/collections/signature/gallery-02.webp", alt: "Signature — piece 02", aspectRatio: "3/4" },
      { src: "/images/collections/signature/gallery-03.webp", alt: "Signature — piece 03", aspectRatio: "4/5" },
      { src: "/images/collections/signature/gallery-04.webp", alt: "Signature — piece 04", aspectRatio: "3/4" },
      { src: "/images/collections/signature/gallery-05.webp", alt: "Signature — piece 05", aspectRatio: "3/4" },
      { src: "/images/collections/signature/gallery-06.webp", alt: "Signature — piece 06", aspectRatio: "4/5" },
    ],
    featuredProductIds: [],
    theme: {
      surface: "#181614",
      accent: "#B8956A",
      mediaTreatment: "warm",
    },
    story: [
      {
        heading: "One pattern logic",
        body: "Every Signature piece begins from the same premise: a silhouette that works on both a man and a woman without compromise. The fit is architectural — precise at the shoulder, generous through the body.",
      },
      {
        heading: "Material intention",
        body: "Nigerian cotton and woven cloth, selected for weight and drape. The fabric must fall, not hover. Each piece is cut to age — the garment becomes more itself over time.",
      },
    ],
    relatedCollectionId: "after-dark",
    cta: { label: "Explore Signature", href: "/collections/signature" },
    designMoment: [
      {
        label: "Material",
        detail: "Heavy Nigerian cotton and woven cloth, chosen for weight and drape — it falls rather than hovers.",
      },
      {
        label: "Form",
        detail: "One cut block for men and women, precise at the shoulder, generous through the body.",
      },
      {
        label: "Construction",
        detail: "Finished seams and considered weight so the garment gains character as it ages.",
      },
      {
        label: "Details",
        detail: "No ornamentation, no badges — proportion carries the whole silhouette.",
      },
    ],
  },
  {
    id: "after-dark",
    slug: "after-dark",
    name: "After Dark",
    eyebrow: "Collection",
    tagline: "DRESSED FOR THE NIGHT.",
    year: "2026",
    season: "A/W 2026",
    status: "current",
    shortDescription:
      "A darker wardrobe — matte surfaces, deep tones, and light that finds you.",
    description:
      "After Dark is built for the hours when the city changes. Matte surfaces that absorb light rather than reflect it. Deep tones that anchor the silhouette. Pieces composed for presence in a room.",
    editorialQuote: "Light that finds you.",
    heroImage: {
      desktop: "/images/collections/after-dark/hero-desktop.webp",
      mobile: "/images/collections/after-dark/hero-mobile.webp",
      alt: "SUS WEARS After Dark collection — a figure in deep-toned structured tailoring against a warm dark ground",
      focalPoint: { x: 52, y: 38 },
    },
    gallery: [
      { src: "/images/collections/after-dark/gallery-01.webp", alt: "After Dark — piece 01", aspectRatio: "3/4" },
      { src: "/images/collections/after-dark/gallery-02.webp", alt: "After Dark — piece 02", aspectRatio: "3/4" },
      { src: "/images/collections/after-dark/gallery-03.webp", alt: "After Dark — piece 03", aspectRatio: "4/5" },
      { src: "/images/collections/after-dark/gallery-04.webp", alt: "After Dark — piece 04", aspectRatio: "3/4" },
      { src: "/images/collections/after-dark/gallery-05.webp", alt: "After Dark — piece 05", aspectRatio: "3/4" },
      { src: "/images/collections/after-dark/gallery-06.webp", alt: "After Dark — piece 06", aspectRatio: "4/5" },
    ],
    featuredProductIds: [],
    theme: {
      surface: "#100E0C",
      accent: "#9C7D54",
      mediaTreatment: "warm",
    },
    story: [
      {
        heading: "Presence in a room",
        body: "These are not party pieces. After Dark is built for the kind of presence that doesn't announce itself. The silhouette does the work; the fabric absorbs the light.",
      },
      {
        heading: "Deep material",
        body: "Every surface in this collection is matte. Deep-toned heavy cotton and woven cloth that drape rather than cling. Built for Lagos evenings and the hours that follow.",
      },
    ],
    relatedCollectionId: "limited",
    cta: { label: "Explore After Dark", href: "/collections/after-dark" },
    designMoment: [
      {
        label: "Material",
        detail: "Matte surfaces that absorb light — deep-toned cotton chosen for the hours after dark.",
      },
      {
        label: "Form",
        detail: "The silhouette does the work; the cut stays quiet and present in a room.",
      },
      {
        label: "Finish",
        detail: "Heavy cloth that drapes rather than clings, made for Lagos evenings.",
      },
      {
        label: "Detail",
        detail: "Light finds you — surface and fabric treated so low light reads as depth.",
      },
    ],
  },
  {
    id: "limited",
    slug: "limited",
    name: "Limited",
    eyebrow: "Collection",
    tagline: "ISSUED ONCE.",
    year: "2026",
    season: "Limited Run",
    status: "current",
    shortDescription:
      "Small-run pieces cut from remaining cloth — each number unique, none repeated.",
    description:
      "Limited is the atelier's practice: pieces cut from remaining cloth in the studio at the end of each production run. Each garment carries a number. None are repeated.",
    editorialQuote: "Each number, once.",
    heroImage: {
      desktop: "/images/collections/limited/hero-desktop.webp",
      mobile: "/images/collections/limited/hero-mobile.webp",
      alt: "SUS WEARS Limited collection — a single garment on a neutral ground, numbered and finished by hand",
      focalPoint: { x: 50, y: 40 },
    },
    gallery: [
      { src: "/images/collections/limited/gallery-01.webp", alt: "Limited — piece 01", aspectRatio: "3/4" },
      { src: "/images/collections/limited/gallery-02.webp", alt: "Limited — piece 02", aspectRatio: "3/4" },
      { src: "/images/collections/limited/gallery-03.webp", alt: "Limited — piece 03", aspectRatio: "4/5" },
      { src: "/images/collections/limited/gallery-04.webp", alt: "Limited — piece 04", aspectRatio: "3/4" },
      { src: "/images/collections/limited/gallery-05.webp", alt: "Limited — piece 05", aspectRatio: "3/4" },
      { src: "/images/collections/limited/gallery-06.webp", alt: "Limited — piece 06", aspectRatio: "4/5" },
    ],
    featuredProductIds: [],
    theme: {
      surface: "#1E1C19",
      accent: "#D4C4A8",
      mediaTreatment: "warm",
    },
    story: [
      {
        heading: "Nothing wasted",
        body: "Every bolt of cloth produces a Limited piece. The remaining fabric that would otherwise be cut away becomes a one-off — finished to the same standard as the main collection, issued with a number.",
      },
      {
        heading: "The number is the name",
        body: "Limited pieces are not named. They carry a number: the count of that specific garment in that specific run. The number is stamped on the label and never reused.",
      },
    ],
    relatedCollectionId: "signature",
    cta: { label: "Explore Limited", href: "/collections/limited" },
    designMoment: [
      {
        label: "Material",
        detail: "Remaining cloth saved from each production run — finished to the same standard as the line.",
      },
      {
        label: "Form",
        detail: "One-of-one cuts, none repeated, sized to the body rather than the catalogue.",
      },
      {
        label: "Finish",
        detail: "Hand-finished to the house standard — the number is stamped on the label, never reused.",
      },
      {
        label: "Detail",
        detail: "Nothing wasted — every bolt becomes a garment, issued once with its own number.",
      },
    ],
  },
] as const;

export const FEATURED_COLLECTION: Collection | null = COLLECTIONS[0] ?? null;
