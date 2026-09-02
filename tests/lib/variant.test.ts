import { describe, expect, it } from "vitest";
import { isColorAvailable, isSizeAvailable, variantsForColor, variantForSelection, availabilityLabel, firstPurchasableVariant } from "@/lib/variant";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "mock-tee-01",
  slug: "mock-tee",
  name: "Mock Tee",
  description: "A mock tee for testing",
  price: 120,
  category: "tees",
  collection: "signature",
  images: [],
  variants: [
    { id: "v1", color: "bone", size: "s", price: 120, availability: "in-stock", sku: "MOCK-BN-S", inventory: 10 },
    { id: "v2", color: "bone", size: "m", price: 120, availability: "in-stock", sku: "MOCK-BN-M", inventory: 8 },
    { id: "v3", color: "bone", size: "l", price: 120, availability: "low-stock", sku: "MOCK-BN-L", inventory: 2 },
    { id: "v4", color: "noir", size: "s", price: 120, availability: "in-stock", sku: "MOCK-NO-S", inventory: 5 },
    { id: "v5", color: "noir", size: "m", price: 120, availability: "sold-out", sku: "MOCK-NO-M", inventory: 0 },
  ],
  sizes: ["s", "m", "l"],
  colors: ["bone", "noir"],
  availability: "in-stock",
  featured: false,
  newArrival: false,
  keywords: ["mock"],
};

describe("variantsForColor", () => {
  it("returns variants for a valid color", () => {
    const variants = variantsForColor(mockProduct, "bone");
    expect(variants.length).toBe(3);
    expect(variants.every((v) => v.color === "bone")).toBe(true);
  });

  it("returns empty for invalid color", () => {
    const variants = variantsForColor(mockProduct, "nonexistent");
    expect(variants).toHaveLength(0);
  });
});

describe("variantForSelection", () => {
  it("finds exact variant", () => {
    const variant = variantForSelection(mockProduct, "bone", "m");
    expect(variant).toBeDefined();
    expect(variant?.color).toBe("bone");
    expect(variant?.size).toBe("m");
  });

  it("returns undefined for missing variant", () => {
    const variant = variantForSelection(mockProduct, "bone", "xxl");
    expect(variant).toBeUndefined();
  });
});

describe("isColorAvailable", () => {
  it("returns true for available color", () => {
    expect(isColorAvailable(mockProduct, "bone")).toBe(true);
  });

  it("returns false for invalid color", () => {
    expect(isColorAvailable(mockProduct, "nonexistent")).toBe(false);
  });
});

describe("isSizeAvailable", () => {
  it("returns true for available size", () => {
    expect(isSizeAvailable(mockProduct, "bone", "m")).toBe(true);
  });

  it("returns false for sold-out size", () => {
    expect(isSizeAvailable(mockProduct, "noir", "m")).toBe(false);
  });
});

describe("availabilityLabel", () => {
  it("returns correct labels", () => {
    expect(availabilityLabel("in-stock")).toBe("In stock");
    expect(availabilityLabel("low-stock")).toBe("Low stock");
    expect(availabilityLabel("sold-out")).toBe("Sold out");
  });
});

describe("firstPurchasableVariant", () => {
  it("returns the first in-stock variant in declared colour/size order", () => {
    const v = firstPurchasableVariant(mockProduct);
    // "bone" is the first colour; "s" is its first size (v1 is in-stock)
    expect(v?.id).toBe("v1");
  });

  it("skips sold-out sizes within a colour", () => {
    const product: Product = {
      ...mockProduct,
      variants: [
        { id: "a", color: "bone", size: "s", price: 120, availability: "sold-out", sku: "A", inventory: 0 },
        { id: "b", color: "bone", size: "m", price: 120, availability: "in-stock", sku: "B", inventory: 5 },
      ],
    };
    const v = firstPurchasableVariant(product);
    expect(v?.id).toBe("b");
  });

  it("skips a fully sold-out colour in favour of the next purchasable one", () => {
    const product: Product = {
      ...mockProduct,
      variants: [
        { id: "a", color: "bone", size: "s", price: 120, availability: "sold-out", sku: "A", inventory: 0 },
        { id: "b", color: "bone", size: "m", price: 120, availability: "sold-out", sku: "B", inventory: 0 },
        { id: "c", color: "noir", size: "s", price: 120, availability: "in-stock", sku: "C", inventory: 3 },
      ],
    };
    const v = firstPurchasableVariant(product);
    expect(v?.id).toBe("c");
  });

  it("returns undefined when every variant is sold out", () => {
    const soldOut: Product = {
      ...mockProduct,
      variants: mockProduct.variants.map((v) => ({ ...v, availability: "sold-out" as const })),
    };
    expect(firstPurchasableVariant(soldOut)).toBeUndefined();
  });
});
