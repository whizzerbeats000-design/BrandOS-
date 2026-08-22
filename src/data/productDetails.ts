import type { ProductCategory } from "@/types";

/**
 * SEED DATA — product details, size guide, shipping & returns.
 *
 * These values are structured placeholders so the architecture can evolve
 * into real per-product content. Nothing here claims to be a final business
 * policy. Swap per-category seeds for per-product records in a later phase.
 */

export interface ProductDetailFields {
  details: string;
  material: string;
  fit: string;
  care: string;
}

export const PRODUCT_DETAILS: Record<ProductCategory, ProductDetailFields> = {
  tees: {
    details:
      "Cut with a soft shoulder and a clean hem. Garment-dyed, pre-shrunk, and washed once for a settled hand.",
    material: "Heavyweight 240gsm cotton jersey, combed and ring-spun.",
    fit: "True to size with a relaxed drape. Take your usual size for the intended silhouette.",
    care: "Machine wash cold, inside out. Line dry. Do not bleach. Warm iron.",
  },
  hoodies: {
    details:
      "Brushed-back loopback fleece with flat matte hardware. A generous cut that holds its shape through the day.",
    material: "480gsm loopback fleece, 85% cotton / 15% recycled polyester.",
    fit: "Generous without drowning. Sized true; size down if you want a closer cut.",
    care: "Machine wash cold with like colours. Reshape and line dry. Do not tumble dry.",
  },
  outerwear: {
    details:
      "Fully lined and taped at the seams. Water-repellent outer with a quiet, structured drape.",
    material: "Water-repellent cotton gabardine and matte nylon, depending on the piece.",
    fit: "Cut longer with room to layer. Take your usual size over a knit or shirt.",
    care: "Specialist dry clean only. Store on a padded hanger away from direct light.",
  },
  accessories: {
    details: "Finished by hand and inspected piece by piece before it ships.",
    material: "Full-grain leather, merino wool, or washed cotton twill depending on the piece.",
    fit: "One size, sized for the way you already wear it.",
    care: "Wipe with a soft dry cloth. Keep away from water and store in the dust bag provided.",
  },
};

/* ---- Size guide (seed) ---- */

export interface SizeGuideRow {
  label: string;
  values: string[];
}

export const SIZE_GUIDE = {
  /** Seed marker — measurements are illustrative until real fit data exists. */
  seed: true,
  fitNotes: [
    "Cut to sit true to size in the chest and shoulder.",
    "If you are between sizes, take the larger for layering.",
    "Accessories are one size.",
  ],
  howToMeasure: [
    "Chest — measure around the fullest part, keeping the tape level.",
    "Shoulder — measure from shoulder seam to shoulder seam across the back.",
    "Length — measure from the shoulder seam to the hem at the centre back.",
  ],
  measurements: [
    { label: "XS", values: ["88–92 cm", "43 cm", "68 cm"] },
    { label: "S", values: ["94–98 cm", "45 cm", "70 cm"] },
    { label: "M", values: ["100–104 cm", "47 cm", "72 cm"] },
    { label: "L", values: ["106–110 cm", "49 cm", "74 cm"] },
    { label: "XL", values: ["112–116 cm", "51 cm", "76 cm"] },
    { label: "XXL", values: ["118–122 cm", "53 cm", "78 cm"] },
  ] satisfies SizeGuideRow[],
} as const;

/* ---- Shipping & returns (placeholder) ---- */

export interface PolicyBlock {
  title: string;
  body: string;
}

export const SHIPPING_RETURNS = {
  /** Placeholder marker — final policy pending business sign-off. */
  placeholder: true,
  blocks: [
    {
      title: "Shipping",
      body: "Orders are prepared within 1–2 working days. Shipping times and costs are calculated at checkout by region.",
    },
    {
      title: "Delivery",
      body: "UK: 1–3 working days · EU: 3–6 working days · Rest of world: 5–10 working days. Tracking is emailed once your order leaves us.",
    },
    {
      title: "Returns & exchanges",
      body: "Unworn pieces with tags attached can be returned within 14 days of delivery for a refund or exchange. Final policy to be confirmed.",
    },
    {
      title: "Regions",
      body: "We currently ship to the UK, EU, and most of the world. Duties and taxes are settled at checkout where applicable.",
    },
  ] satisfies PolicyBlock[],
} as const;
