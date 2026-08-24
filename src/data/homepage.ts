import type {
  BrandIntroData,
  ContactCtaData,
  CraftStoryData,
  HeroMediaSource,
} from "@/types";

export interface HomepageCopy {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export const MANIFESTO = {
  eyebrow: "Manifesto",
  lines: ["Rooted in Nigerian craft.", "Designed for every expression."],
  supporting:
    "Contemporary fashion for men and women, cut from one language — fit by the body, not by the catalogue.",
} as const;

export const BRAND_INTRO: BrandIntroData = {
  eyebrow: "The House",
  title: "SUS WEARS",
  intro: "Shedrack Unisex Stitches.",
  statement: "Fashion from Lagos, made for men and women who care about how they look and how they are remembered.",
  supporting:
    "Mr. Shedrack was already working as a fashion designer in Jos before moving to Lagos in 2019. The move marked the beginning of SUS WEARS — built from practical tailoring experience and a clear sense of how people in Lagos dress.",
  facts: [
    { label: "Founded", value: "2019" },
    { label: "Based in", value: "Lagos, Nigeria" },
    { label: "Craft", value: "Made for men & women" },
  ],
};

export const CRAFT_STORY: CraftStoryData = {
  eyebrow: "The Craft",
  title: "Every piece begins with craft.",
  statement: "From a tailoring studio to a wardrobe without borders.",
  paragraphs: [
    "SUS WEARS grew out of practical tailoring experience — cloth measured, cut and stitched by hand, one piece at a time. Lagos became the home of the brand in 2019.",
    "That origin still holds. Every silhouette is drafted to sit on the body and move with it, before it ever reaches a rail.",
  ],
  cta: { label: "The house story", href: "/about" },
  media: {
    desktop: "/images/home/craft-atelier-01.webp",
    alt: "Inside the SUS WEARS studio — cloth, needle and working light on the cutting table",
    focalPoint: { x: 55, y: 40 },
  },
};

export const CONTACT_CTA: ContactCtaData = {
  eyebrow: "The Atelier",
  title: "Something specific in mind?",
  description:
    "SUS WEARS grew from tailoring — bespoke requests are welcome. Speak directly with the atelier about a specific piece, a custom fit, or a question about the collection.",
  primary: { label: "Speak with the atelier", href: "/" },
  secondary: {
    label: "Make a custom request",
    href: "/",
    note: "SUS grew from tailoring — bespoke requests are welcome.",
  },
};
