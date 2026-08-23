import type {
  AspectRatio,
  ColorOption,
  Product,
  ProductCategory,
  ProductCollectionId,
  ProductImage,
  ProductVariant,
  SizeOption,
} from "@/types";

/* ---- Categories ---- */

export interface CategoryOption {
  id: "all" | ProductCategory;
  label: string;
}

export const CATEGORIES: readonly CategoryOption[] = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "hoodies", label: "Hoodies" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
] as const;

export function getCategoryLabel(id: ProductCategory): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export interface CollectionOption {
  id: ProductCollectionId;
  label: string;
}

export const COLLECTIONS: readonly CollectionOption[] = [
  { id: "signature", label: "Signature" },
  { id: "after-dark", label: "After Dark" },
  { id: "limited", label: "Limited" },
] as const;

export function getCollectionLabel(id: ProductCollectionId): string {
  return COLLECTIONS.find((c) => c.id === id)?.label ?? id;
}

/* ---- Size & colour options ---- */

export const SIZE_OPTIONS: readonly SizeOption[] = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
] as const;

export const COLOR_OPTIONS: readonly ColorOption[] = [
  { id: "bone", name: "Bone", hex: "#E8E2D6" },
  { id: "ivory", name: "Ivory", hex: "#F2EDE3" },
  { id: "noir", name: "Noir", hex: "#161412" },
  { id: "graphite", name: "Graphite", hex: "#3B3B38" },
  { id: "clay", name: "Clay", hex: "#B0815F" },
  { id: "espresso", name: "Espresso", hex: "#4A3325" },
  { id: "olive", name: "Olive", hex: "#4C4D3C" },
  { id: "burgundy", name: "Burgundy", hex: "#5C2430" },
  { id: "steel", name: "Steel", hex: "#8E9296" },
  { id: "ink", name: "Ink", hex: "#232D38" },
  { id: "sand", name: "Sand", hex: "#D6C9B1" },
  { id: "ash", name: "Ash", hex: "#A9A9A4" },
] as const;

export function getColorOption(id: string): ColorOption {
  return (
    COLOR_OPTIONS.find((c) => c.id === id) ?? { id, name: id, hex: "#8E8E8E" }
  );
}

/* ---- Sorting & price ranges ---- */

export interface SortOption {
  id: "featured" | "newest" | "price-asc" | "price-desc" | "name";
  label: string;
}

export const SORT_OPTIONS: readonly SortOption[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price · Low to High" },
  { id: "price-desc", label: "Price · High to Low" },
  { id: "name", label: "Name" },
] as const;

export interface PriceRangeOption {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
}

export const PRICE_RANGES: readonly PriceRangeOption[] = [
  { id: "under-200", label: "Under ₦200", min: null, max: 200 },
  { id: "200-500", label: "₦200 – ₦500", min: 200, max: 500 },
  { id: "500-1000", label: "₦500 – ₦1,000", min: 500, max: 1000 },
  { id: "over-1000", label: "₦1,000 +", min: 1000, max: null },
] as const;

/* ---- Products ---- */

export const PRODUCTS: readonly Product[] = [] as const;

export const NEW_DROP_PRODUCTS: readonly Product[] = [];

export const CURATED_PRODUCTS: readonly Product[] = [];

export const SIGNATURE_PRODUCTS: readonly Product[] = [];

export interface ProductSummary {
  slug: string;
  name: string;
  price: number;
  currency?: string;
  image: ProductImage;
  aspectRatio?: AspectRatio;
}

export const PRODUCT_SUMMARIES: Record<string, ProductSummary> = {};

export function getRelatedProducts(_product: Product, _limit = 4): Product[] {
  return [];
}
