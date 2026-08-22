import type { Collection } from "@/types";

const IMG = "/images/collections";

export const COLLECTIONS: readonly Collection[] = [
  {
    id: "signature",
    slug: "signature",
    name: "Signature",
    eyebrow: "Collection 01",
    tagline: "Designed for presence.",
    year: "2026",
    season: "Autumn · Winter",
    status: "current",
    shortDescription:
      "Clean tailoring, warm earth tones and a wardrobe built to be noticed without trying.",
    description:
      "Signature is the house standard — tailored volumes, garment-dyed cottons and a palette drawn from earth, brass and shadow. No noise, no logos: the silhouette is the logo. Every piece is cut to be worn alone and layered without thinking, so a wardrobe of essentials reads as a point of view.",
    editorialQuote: "The silhouette is the logo.",
    heroImage: {
      desktop: "/images/campaign/campaign-01-desktop.webp",
      mobile: "/images/campaign/campaign-01-mobile.webp",
      alt: "Signature campaign — a figure in structured tailoring beneath warm chamber light",
      focalPoint: { x: 62, y: 40 },
    },
    gallery: [
      {
        src: `${IMG}/signature/gallery-01.webp`,
        alt: "Signature campaign — a figure in an overcoat and a figure in a shirt at ease in warm light",
        aspectRatio: "16/9",
        caption: "01 — Clean lines",
      },
      {
        src: `${IMG}/signature/gallery-02.webp`,
        alt: "A long coat in warm chamber light with a single rim highlight",
        aspectRatio: "3/4",
        caption: "02 — Long volumes",
      },
      {
        src: `${IMG}/signature/gallery-03.webp`,
        alt: "A brushed knit floating in warm glow above a thin horizon line",
        aspectRatio: "3/4",
        caption: "03 — Layering",
      },
      {
        src: `${IMG}/signature/gallery-04.webp`,
        alt: "The Signature cast — five figures standing in a single line",
        aspectRatio: "21/9",
        caption: "04 — The cast",
      },
    ],
    featuredProductIds: [
      "sand-trench-coat",
      "noir-crew-tee",
      "espresso-trench-coat",
      "clay-pullover-hoodie",
    ],
    theme: { surface: "#17130f", accent: "#c2a878", mediaTreatment: "warm" },
    relatedCollectionId: "after-dark",
    cta: { label: "Explore Signature", href: "/collections/signature" },
    story: [
      {
        heading: "Tailored, not decorated",
        body: "Signature starts with the cut, not the trim. Shoulders are softly structured, waists are eased, and every hem is a straight line — so the pieces read quietly from across a room and precisely up close.",
      },
      {
        heading: "The silhouette is the logo",
        body: "There are no prints and no badges. Identity lives in proportion: the fall of a trench, the fold of a hood, the weight of a fabric that hangs instead of hovering.",
      },
      {
        heading: "Built to layer",
        body: "Earth, brass and shadow form a palette that cannot clash. Coat over knit over tee — every piece is cut to sit under or over the next, so a full wardrobe composes in minutes.",
      },
    ],
  },
  {
    id: "after-dark",
    slug: "after-dark",
    name: "After Dark",
    eyebrow: "Collection 02",
    tagline: "Made for the hours between.",
    year: "2026",
    season: "Autumn · Winter",
    status: "current",
    shortDescription:
      "A darker wardrobe for night — matte surfaces, deep tones and light that finds you.",
    description:
      "After Dark lives where the city gets quiet. Matte nylon, loopback fleece and shadow colours cut for movement after hours. Pieces are built to disappear into the dark and still hold a line — hardware is flat, finishes are matte, and the palette stops at the edge of black.",
    editorialQuote: "Built for presence.",
heroImage: {
      desktop: "/images/campaign/campaign-02-desktop.webp",
      mobile: "/images/campaign/campaign-02-mobile.webp",
      alt: "After Dark campaign — a figure against a deep cool ground",
      focalPoint: { x: 55, y: 42 },
    },
    gallery: [
      {
        src: `${IMG}/after-dark/gallery-01.webp`,
        alt: "Two figures — a hoodie and an overcoat — against night window light",
        aspectRatio: "16/9",
        caption: "01 — After hours",
      },
      {
        src: `${IMG}/after-dark/gallery-02.webp`,
        alt: "A hooded figure lit by a single shaft of cool light",
        aspectRatio: "3/4",
        caption: "02 — Low light",
      },
      {
        src: `${IMG}/after-dark/gallery-03.webp`,
        alt: "A knit beneath a red moon glow in the dark",
        aspectRatio: "3/4",
        caption: "03 — Warmth in the dark",
      },
      {
        src: `${IMG}/after-dark/gallery-04.webp`,
        alt: "A coat and an overcoat crossing the late city at night",
        aspectRatio: "21/9",
        caption: "04 — The hours between",
      },
    ],
    featuredProductIds: [
      "noir-zip-hoodie",
      "noir-bomber-jacket",
      "espresso-tote",
      "burgundy-long-sleeve-tee",
    ],
    theme: { surface: "#0d0f12", accent: "#8fa3b5", mediaTreatment: "cool" },
    relatedCollectionId: "limited",
    cta: { label: "Explore After Dark", href: "/collections/after-dark" },
    story: [
      {
        heading: "For the quiet hours",
        body: "The palette stops at the edge of black and everything is finished matte — flat hardware, brushed surfaces, nothing that catches light it shouldn't. The wardrobe disappears into the dark and still holds its line.",
      },
      {
        heading: "Cut for movement",
        body: "These are pieces made to be worn while the city is still up — loopback fleece that breathes on the walk home, bombers with room through the shoulders, coats that sit still when you do.",
      },
      {
        heading: "Light that finds you",
        body: "One electric accent per night: a red knit under a hood, a burgundy cuff at the wrist. Enough to be found, never enough to be stared at.",
      },
    ],
  },
  {
    id: "limited",
    slug: "limited",
    name: "Limited",
    eyebrow: "Collection 03",
    tagline: "Issued in small numbers.",
    year: "2026",
    season: "Autumn · Winter",
    status: "current",
    shortDescription:
      "One-dye-run experiments, batch-specific colours and pieces that will not return.",
    description:
      "Limited is the studio's experiment shelf — small runs, batch-specific colours and silhouettes that test the edges of the house. No piece is ever repeated exactly. When a batch is gone, the colour is gone with it; what remains is the record that it existed.",
    editorialQuote: "When it's gone, it's gone.",
heroImage: {
      desktop: "/images/campaign/campaign-01-desktop.webp",
      mobile: "/images/campaign/campaign-01-mobile.webp",
      alt: "Limited campaign — tailored structure in warm chamber light",
      focalPoint: { x: 30, y: 45 },
    },
    gallery: [
      {
        src: `${IMG}/limited/gallery-01.webp`,
        alt: "Two coats beneath shallow arches in burgundy glow",
        aspectRatio: "16/9",
        caption: "01 — Under the arch",
      },
      {
        src: `${IMG}/limited/gallery-02.webp`,
        alt: "A knit traced by a single red line across the frame",
        aspectRatio: "3/4",
        caption: "02 — Batch specific",
      },
      {
        src: `${IMG}/limited/gallery-03.webp`,
        alt: "A hoodie inside a glowing ring, exclusive treatment",
        aspectRatio: "3/4",
        caption: "03 — The ring",
      },
      {
        src: `${IMG}/limited/gallery-04.webp`,
        alt: "The Limited line — four figures standing in one run",
        aspectRatio: "21/9",
        caption: "04 — One run",
      },
    ],
    featuredProductIds: [
      "steel-trench-coat",
      "olive-crew-tee",
      "burgundy-bomber-jacket",
      "bone-pullover-hoodie",
    ],
    theme: { surface: "#140d0e", accent: "#b86670", mediaTreatment: "exclusive" },
    cta: { label: "Explore Limited", href: "/collections/limited" },
    story: [
      {
        heading: "One dye run, one colour",
        body: "Every Limited piece is dyed in a single run and never repeated. The colour you see is the colour that batch made — a fixed point in time, sealed by the number printed on the label.",
      },
      {
        heading: "Silhouettes at the edge",
        body: "This is where the house experiments: a longer line, a deeper hood, a cut that pushes the studio's grammar one step further. What survives here graduates to Signature.",
      },
      {
        heading: "Gone is gone",
        body: "No restocks, no second dye lots. When the run is gone, the record is a photograph and the archive. That tension — between keeping and letting go — is the whole point.",
      },
    ],
  },
] as const;

export const FEATURED_COLLECTION: Collection = COLLECTIONS[0];
