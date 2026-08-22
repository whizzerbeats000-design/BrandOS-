import type { WorldStory } from "@/types";

export const WORLD_STORIES: readonly WorldStory[] = [
  {
    id: "world-001",
    slug: "the-lagos-line",
    title: "The Lagos Line",
    excerpt:
      "In a city that moves fast, SUS WEARS builds pieces designed to keep pace — cut for Lagos movement, made for every body.",
    category: "people",
    heroImage: {
      desktop: "/images/campaign/campaign-01-desktop.webp",
      mobile: "/images/campaign/campaign-01-mobile.webp",
      alt: "A tailor in a Lagos studio working beneath warm light",
      focalPoint: { x: 55, y: 40 },
    },
    publishedAt: "2026-03-10",
    author: "SUS WEARS",
    body: [
      {
        text: "Lagos is a city that demands a certain kind of clothing. Heat, traffic, energy, and the need to look intentional without trying too hard. SUS WEARS was built for that rhythm.",
      },
      {
        text: "Every piece is cut to move with the city. The weights, the fits, the fabrics — all chosen for how they behave in Lagos weather. A trench that breathes in the afternoon heat. A pullover that holds its line without clinging.",
      },
      {
        text: "The shop at Obalende Ijeh is where the work happens. Cloth measured, cut, stitched. No prints, no badges. Just proportion and fabric.",
      },
    ],
    collection: { slug: "signature", label: "Signature" },
  },
  {
    id: "world-002",
    slug: "fabric-as-language",
    title: "Fabric as language",
    excerpt:
      "In the SUS studio, every cloth has a voice — the weight of cotton, the drape of gabardine, the quiet authority of merino.",
    category: "culture",
    heroImage: {
      desktop: "/images/campaign/campaign-02-desktop.webp",
      mobile: "/images/campaign/campaign-02-mobile.webp",
      alt: "Close-up of fabric textures under warm directional light",
      focalPoint: { x: 60, y: 42 },
    },
    publishedAt: "2026-02-15",
    author: "SUS WEARS",
    body: [
      {
        text: "Before a garment is cut, the fabric is chosen. Not for its name or its price — for its voice. A brushed-back fleece speaks differently from a garment-dyed cotton. One says warmth; the other says wear.",
      },
      {
        text: "The house works with a fixed palette of materials: cotton gabardine for structure, loopback fleece for ease, merino for quiet warmth, washed twill for daily use. Each material is selected for how it ages — not how it looks on the bolt.",
      },
      {
        text: "This is what the 70/30 split means in practice: African textile traditions inform the weight and feel, while Western garment construction gives the pieces their precision.",
      },
    ],
    product: { slug: "sand-trench-coat", label: "Sand Trench Coat" },
  },
  {
    id: "world-003",
    slug: "after-hours-in-lagos",
    title: "After hours in Lagos",
    excerpt:
      "When the city quiets down, the After Dark collection moves through it — matte surfaces, deep tones, and light that finds you.",
    category: "city",
    heroImage: {
      desktop: "/images/campaign/campaign-02-desktop-1600.webp",
      mobile: "/images/campaign/campaign-02-hero-mobile.webp",
      alt: "A figure walking through Lagos streets at night in dark outerwear",
      focalPoint: { x: 48, y: 35 },
    },
    publishedAt: "2026-01-25",
    author: "SUS WEARS",
    body: [
      {
        text: "Lagos at night is a different city. The neon fades, the traffic thins, and the streets belong to people who move with intention. The After Dark collection was built for these hours.",
      },
      {
        text: "Matte nylon, loopback fleece, shadow colours — everything finished flat so it disappears into the dark and still holds its line. Hardware is brushed, not polished. Zips are silent, not decorative.",
      },
      {
        text: "The collection is a wardrobe for the hours between: a bomber for the walk home, a hoodie for the studio at midnight, a tote that carries everything you need and nothing you don't.",
      },
    ],
    collection: { slug: "after-dark", label: "After Dark" },
  },
] as const;
