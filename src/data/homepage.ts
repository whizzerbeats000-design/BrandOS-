import type {
  BrandIntroData,
  CategoryShowcaseData,
  CollectionShowcaseData,
  ContactCtaData,
  CraftStoryData,
  FeaturedFashionData,
  HeroMediaSource,
  NeonTeaserData,
} from "@/types";

export interface HomepageCopy {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export interface SusWorldTeaserData {
  eyebrow: string;
  title: string;
  statement: string;
  cta: { label: string; href: string };
  media: HeroMediaSource;
}

export const NEW_DROP_COPY: HomepageCopy = {
  eyebrow: "New Drop — 001",
  title: "The latest from SUS.",
  description:
    "A first act in wool, cotton and hand-finished hardware — cut for the everyday, composed for the extraordinary.",
  action: { label: "View all new arrivals", href: "/shop" },
};

export const SUS_WORLD_TEASER: SusWorldTeaserData = {
  eyebrow: "SUS World",
  title: "There is a world behind the cloth.",
  statement:
    "Houses, rituals, movement and sound — an ecosystem that began in one studio and now moves through the world.",
  cta: { label: "Enter SUS world", href: "/sus-world" },
  media: {
    desktop: "/images/home/susworld-teaser.webp",
    mobile: "/images/home/susworld-teaser.webp",
    alt: "A lone figure beneath a vast night sky — the world beyond the SUS WEARS cloth",
    focalPoint: { x: 62, y: 40 },
  },
};

export const MANIFESTO = {
  eyebrow: "Manifesto",
  lines: ["Rooted in Nigerian craft.", "Designed for every expression."],
  supporting:
    "Contemporary fashion for men and women, cut from one language — fit by the body, not by the catalogue.",
} as const;

export const NEWSLETTER_COPY: HomepageCopy = {
  eyebrow: "Newsletter",
  title: "Stay in the world.",
  description:
    "Occasional letters from the house — new drops, stories and invitations before anyone else.",
};

/* ============================================================
   Brand introduction — the few-seconds pitch.
   Real facts only: Shedrack Unisex Stitches · Lagos · 2019 ·
   fashion for men and women.
   ============================================================ */

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

/* ============================================================
   Featured fashion — the visual proof, large imagery.
   Casting stays 50/50 male / female across the section.
   ============================================================ */

export const FEATURED_FASHION: FeaturedFashionData = {
  eyebrow: "The Look",
  title: "See what SUS looks like.",
  description:
    "Two expressions, one house — structured tailoring beside draped volume, both cut for every body.",
  items: [
    {
      id: "mens-tailoring",
      label: "For him — tailored",
      description: "Overcoats and clean lines, cut to move.",
      cta: { label: "Shop tailoring", href: "/shop" },
      media: {
        desktop: "/images/campaign/campaign-01-editorial.webp",
        alt: "SUS WEARS men's tailoring — a figure in a structured overcoat in warm chamber light",
        focalPoint: { x: 62, y: 42 },
      },
    },
    {
      id: "womens-drape",
      label: "For her — draped",
      description: "Volumes and soft structure, built to linger.",
      cta: { label: "Shop draped pieces", href: "/shop" },
      media: {
        desktop: "/images/campaign/campaign-02-editorial.webp",
        alt: "SUS WEARS women's silhouette — draped volumes in warm chamber light",
        focalPoint: { x: 55, y: 42 },
      },
    },
  ],
};

/* ============================================================
   Shop by category — only confirmed catalogue categories,
   served as editorial tiles rather than a card grid.
   ============================================================ */

export const CATEGORY_SHOWCASE: CategoryShowcaseData = {
  eyebrow: "Categories",
  title: "Shop by category.",
  description: "Four families, one language. Each one built to layer with the next.",
  items: [
    {
      id: "tees",
      label: "Tees",
      description: "Heavyweight jersey, garment-dyed.",
      href: "/shop?category=tees",
      media: {
        desktop: "/images/home/category-tees.webp",
        alt: "SUS WEARS tees — a clean folded jersey study in warm light",
      },
    },
    {
      id: "hoodies",
      label: "Hoodies",
      description: "Loopback fleece, soft structure.",
      href: "/shop?category=hoodies",
      media: {
        desktop: "/images/home/category-hoodies.webp",
        alt: "SUS WEARS hoodies — a hooded silhouette in warm light",
      },
    },
    {
      id: "outerwear",
      label: "Outerwear",
      description: "Coats that carry the line.",
      href: "/shop?category=outerwear",
      media: {
        desktop: "/images/home/category-outerwear.webp",
        alt: "SUS WEARS outerwear — a long tailored coat study in warm light",
      },
    },
    {
      id: "accessories",
      label: "Accessories",
      description: "Objects that finish the look.",
      href: "/shop?category=accessories",
      media: {
        desktop: "/images/home/category-accessories.webp",
        alt: "SUS WEARS accessories — a considered object study in warm light",
      },
    },
  ],
};

/* ============================================================
   Featured collections — real collections only.
   ============================================================ */

export const COLLECTION_SHOWCASE_DATA: CollectionShowcaseData = {
  eyebrow: "Collections",
  title: "The world in three acts.",
  description: "Signature, After Dark and Limited — three ways into the house.",
};

/* ============================================================
   Craft / story — the human origin behind the cloth.
   No founder portrait; the image is the atelier itself.
   ============================================================ */

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

/* ============================================================
   Neon — personal style concierge. Hidden until configured.
   ============================================================ */

export const NEON_TEASER: NeonTeaserData = {
  eyebrow: "Neon",
  name: "NEON",
  title: "Find your SUS.",
  description:
    "A personal SUS WEARS style concierge — on call to help you choose looks, build outfits and find the pieces that are actually you.",
  cta: { label: "Begin with Neon", href: "/shop" },
};

/* ============================================================
   Contact — WhatsApp when configured, mail otherwise.
   Never hardcodes the number in the UI.
   ============================================================ */

export const CONTACT_CTA: ContactCtaData = {
  eyebrow: "Contact",
  title: "Have something specific in mind?",
  description:
    "Talk to a real person at SUS WEARS. For a specific piece, a custom request or simply to ask a question.",
  primary: { label: "Chat with SUS", href: "/" },
  secondary: {
    label: "Make a custom request",
    href: "/",
    note: "SUS grew from tailoring — bespoke requests are welcome.",
  },
};
