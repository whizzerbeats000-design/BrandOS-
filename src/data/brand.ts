/* ============================================================
   SUS WEARS — Brand Config
   Single source of truth for the house identity.
   Verified brand facts:
   - Name meaning: SHEDRACK UNISEX STITCHES
   - Founder: Mr. Shedrack
   - Founded: 2019
   - Origin: Lagos State, Nigeria (Shedrack worked in Jos before moving to Lagos)
   - Audience: men + women (unisex)
   ============================================================ */

export const BRAND = {
  shortName: "SUS",
  name: "SUS WEARS",
  legalName: "Shedrack Unisex Stitches",
  tagline: "The silhouette is the logo",
  descriptor: "Unisex fashion brand",
  founder: "Mr. Shedrack",
  foundedYear: 2019,
  origin: {
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    region: "West Africa",
    flat: "Lagos, Nigeria",
  },
  location: {
    address: "Obalende Ijeh Police Barrack, Along Dolphine Road, Opposite Ijeh Primary School, Lagos State, Nigeria",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    flat: "Lagos, Nigeria",
  },
  contact: {
    whatsapp: "09070970886",
    email: "suswears469@gmail.com",
  },
  social: {
    instagram: "https://www.instagram.com/sus_wears?igsi=Y3A1cmp2cHQ4OWl6",
    facebook: "https://www.facebook.com/share/1CMCAozViD/",
    tiktok: "https://www.tiktok.com/@suswears",
    x: "https://x.com/suswears",
  },
  audience: {
    description: "Men and women",
    genders: ["men", "women"],
    framing: "unisex",
  },
  /** Creative influence split — African and Western design traditions. */
  creativeInfluence: {
    african: 0.7,
    western: 0.3,
  },
  /** Casting rule — balanced representation. */
  casting: {
    men: 0.5,
    women: 0.5,
  },
} as const;

export const BRAND_STORY = {
  eyebrow: "The House",
  title: "From Jos to Lagos, one stitch at a time.",
  paragraphs: [
    "Mr. Shedrack was already working as a fashion designer in Jos, Plateau State, before moving to Lagos in 2019. The move marked the beginning of SUS WEARS as a brand — built from practical tailoring experience and a clear sense of how people in Lagos dress.",
    "Shedrack Unisex Stitches was founded in Lagos in 2019. The brand creates clothing for both men and women, combining the precision of earlier tailoring work with the energy of one of Nigeria's most dynamic fashion markets.",
    "Today, every piece is cut to fit the body rather than the catalogue. The silhouette is the logo.",
  ],
} as const;