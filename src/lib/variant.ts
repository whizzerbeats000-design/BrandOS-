import type { Product, ProductVariant } from "@/types";

/** All variants for a given colour, in the product's declared size order. */
export function variantsForColor(
  product: Product,
  colorId: string,
): ProductVariant[] {
  const order = product.sizes.indexOf.bind(product.sizes);
  return product.variants
    .filter((v) => v.color === colorId)
    .sort((a, b) => {
      if (a.size === null) return b.size === null ? 0 : -1;
      if (b.size === null) return 1;
      return order(a.size) - order(b.size);
    });
}

/** The exact variant for a colour + size selection, if it exists. */
export function variantForSelection(
  product: Product,
  colorId: string,
  sizeId: string | null,
): ProductVariant | undefined {
  return product.variants.find((v) => v.color === colorId && v.size === sizeId);
}

/** Whether a colour has at least one purchasable variant. */
export function isColorAvailable(product: Product, colorId: string): boolean {
  return product.variants.some((v) => v.color === colorId && v.availability !== "sold-out");
}

/** Whether a specific colour + size combination can be purchased. */
export function isSizeAvailable(
  product: Product,
  colorId: string,
  sizeId: string | null,
): boolean {
  const variant = variantForSelection(product, colorId, sizeId);
  return variant !== undefined && variant.availability !== "sold-out";
}

/** Availability label from product data. */
export function availabilityLabel(
  availability: Product["availability"],
): string {
  switch (availability) {
    case "low-stock":
      return "Low stock";
    case "sold-out":
      return "Sold out";
    default:
      return "In stock";
  }
}
