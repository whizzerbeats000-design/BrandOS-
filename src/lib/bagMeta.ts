import { PRODUCTS } from "@/data/catalogue";
import { getColorOption } from "@/data/catalogue";
import { SIZE_OPTIONS } from "@/data/catalogue";
import type { BagLine } from "@/lib/bag";
import type { Product, ProductVariant } from "@/types";

/** A bag line enriched with the catalogue data needed to render it. */
export interface BagLineDisplay {
  line: BagLine;
  product: Product;
  variant: ProductVariant;
  colorName: string;
  sizeLabel: string;
  linePrice: number;
  image: Product["images"][number];
  url: string;
}

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

function sizeLabel(size: string | null): string {
  if (size === null) return "One size";
  return SIZE_OPTIONS.find((o) => o.id === size)?.label ?? size.toUpperCase();
}

export function resolveBagLine(line: BagLine): BagLineDisplay | null {
  const product = byId.get(line.productId);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === line.variantId);
  if (!variant) return null;
  return {
    line,
    product,
    variant,
    colorName: getColorOption(variant.color).name,
    sizeLabel: sizeLabel(variant.size),
    linePrice: variant.price * line.quantity,
    image: product.images[0],
    url: `/product/${product.slug}`,
  };
}

export function resolveBag(lines: BagLine[]): BagLineDisplay[] {
  const resolved: BagLineDisplay[] = [];
  for (const line of lines) {
    const display = resolveBagLine(line);
    if (display) resolved.push(display);
  }
  return resolved;
}