import type { ProductCategory } from "@/types";

export interface ProductDetailFields {
  details: string;
  material: string;
  fit: string;
  care: string;
}

export const PRODUCT_DETAILS: Record<ProductCategory, ProductDetailFields> = {
  tees: { details: "", material: "", fit: "", care: "" },
  hoodies: { details: "", material: "", fit: "", care: "" },
  outerwear: { details: "", material: "", fit: "", care: "" },
  accessories: { details: "", material: "", fit: "", care: "" },
};

export interface SizeGuideRow {
  label: string;
  values: string[];
}

export const SIZE_GUIDE = {
  seed: true,
  fitNotes: [] as string[],
  howToMeasure: [] as string[],
  measurements: [] as SizeGuideRow[],
} as const;

export interface PolicyBlock {
  title: string;
  body: string;
}

export const SHIPPING_RETURNS = {
  placeholder: true,
  blocks: [] as PolicyBlock[],
} as const;
