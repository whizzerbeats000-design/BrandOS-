import {
  PRICE_RANGES,
  PRODUCTS,
  getCollectionLabel,
  getColorOption,
} from "@/data/catalogue";
import type { Product, ProductCategory, ProductCollectionId } from "@/types";

export const PAGE_SIZE = 12;

export type SortId = "featured" | "newest" | "price-asc" | "price-desc" | "name";
export type CategoryFilter = "all" | ProductCategory;

export interface CatalogueSearchParams {
  category: CategoryFilter;
  collection: ProductCollectionId | null;
  size: string | null;
  color: string | null;
  price: string | null;
  sort: SortId;
  q: string | null;
  page: number;
}

export type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const SORT_IDS: readonly string[] = ["featured", "newest", "price-asc", "price-desc", "name"];
const CATEGORY_IDS: readonly string[] = ["all", "tees", "hoodies", "outerwear", "accessories"];
const COLLECTION_IDS: readonly string[] = ["signature", "after-dark", "limited"];

export function parseSearchParams(
  params: Readonly<Record<string, SearchParamValue>>,
): CatalogueSearchParams {
  const category = first(params.category) as CategoryFilter | undefined;
  const collection = first(params.collection) as ProductCollectionId | undefined;
  const size = first(params.size) ?? null;
  const color = first(params.color) ?? null;
  const price = first(params.price) ?? null;
  const sort = first(params.sort) as SortId | undefined;
  const q = first(params.q)?.trim() || null;
  const rawPage = Number.parseInt(first(params.page) ?? "1", 10);

  const resolvedCategory = category ?? "all";
  const resolvedSort = sort ?? "featured";

  return {
    category: CATEGORY_IDS.includes(resolvedCategory) ? (resolvedCategory as CategoryFilter) : "all",
    collection: COLLECTION_IDS.includes(collection ?? "")
      ? (collection as ProductCollectionId)
      : null,
    size,
    color,
    price: PRICE_RANGES.some((r) => r.id === price) ? price : null,
    sort: SORT_IDS.includes(resolvedSort) ? (resolvedSort as SortId) : "featured",
    q,
    page: Number.isFinite(rawPage) ? clampInt(rawPage, 1, 1000) : 1,
  };
}

export function applyFilters(params: CatalogueSearchParams, items: readonly Product[] = PRODUCTS): Product[] {
  const priceRange = PRICE_RANGES.find((r) => r.id === params.price);

  return items.filter((product) => {
    if (params.category !== "all" && product.category !== params.category) return false;
    if (params.collection && product.collection !== params.collection) return false;
    if (params.size && !product.sizes.includes(params.size)) return false;
    if (params.color && !product.colors.includes(params.color)) return false;
    if (priceRange) {
      const minOk = priceRange.min === null || product.price >= priceRange.min;
      const maxOk = priceRange.max === null || product.price < priceRange.max;
      if (!minOk || !maxOk) return false;
    }
    if (params.q) {
      const haystack = [
        product.name,
        product.category,
        getCollectionLabel(product.collection),
        ...product.keywords,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(params.q.toLowerCase())) return false;
    }
    return true;
  });
}

export function sortProducts(products: readonly Product[], sort: SortId): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case "price-desc":
      return list.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case "newest":
      return list.sort(
        (a, b) =>
          Number(b.newArrival) - Number(a.newArrival) ||
          a.id.localeCompare(b.id, undefined, { numeric: true }),
      );
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return list.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          a.id.localeCompare(b.id, undefined, { numeric: true }),
      );
  }
}

export interface PaginationResult {
  items: Product[];
  page: number;
  total: number;
  totalPages: number;
}

export function paginate(products: readonly Product[], page: number): PaginationResult {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = clampInt(page, 1, totalPages);
  return {
    items: products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    page: safePage,
    total,
    totalPages,
  };
}

/** Build a catalogue query string. Pass current params plus changes. */
export function buildHref(
  current: CatalogueSearchParams,
  changes: { set?: Partial<CatalogueSearchParams>; clear?: readonly string[] },
  base = "/shop",
): string {
  const clear = new Set(changes.clear ?? []);
  const merged: Record<string, string> = {};

  const put = (key: string, value: string | null | undefined) => {
    if (clear.has(key)) return;
    if (value === null || value === undefined || value === "") return;
    if (key === "category" && value === "all") return;
    merged[key] = value;
  };

  put("category", changes.set?.category !== undefined ? changes.set.category : current.category);
  put("collection", changes.set?.collection !== undefined ? changes.set.collection : current.collection);
  put("size", changes.set?.size !== undefined ? changes.set.size : current.size);
  put("color", changes.set?.color !== undefined ? changes.set.color : current.color);
  put("price", changes.set?.price !== undefined ? changes.set.price : current.price);
  put("sort", changes.set?.sort !== undefined ? changes.set.sort : current.sort);
  put("q", changes.set?.q !== undefined ? changes.set.q : current.q);
  put("page", changes.set?.page !== undefined ? String(changes.set.page) : current.page > 1 ? String(current.page) : undefined);

  const qs = new URLSearchParams(merged).toString();
  return qs ? `${base}?${qs}` : base;
}

export interface ActiveFilter {
  key: "category" | "collection" | "size" | "color" | "price" | "q";
  label: string;
}

export function getActiveFilters(params: CatalogueSearchParams): ActiveFilter[] {
  const filters: ActiveFilter[] = [];
  if (params.category !== "all") filters.push({ key: "category", label: params.category });
  if (params.collection)
    filters.push({ key: "collection", label: getCollectionLabel(params.collection) });
  if (params.size) filters.push({ key: "size", label: params.size.toUpperCase() });
  if (params.color) filters.push({ key: "color", label: getColorOption(params.color).name });
  const priceRange = PRICE_RANGES.find((r) => r.id === params.price);
  if (priceRange) filters.push({ key: "price", label: priceRange.label });
  if (params.q) filters.push({ key: "q", label: `"${params.q}"` });
  return filters;
}
