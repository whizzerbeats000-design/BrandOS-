import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/data/catalogue";

describe("catalogue", () => {
  it("should include accessories", () => {
    const accessories = PRODUCTS.filter((product) => product.category === "accessories");
    expect(accessories.length).toBeGreaterThan(0);
  });

  it("should expose a one-size variant for every accessory", () => {
    const accessories = PRODUCTS.filter((product) => product.category === "accessories");
    for (const product of accessories) {
      expect(product.variants.length, `${product.slug} should have at least one variant`).toBeGreaterThan(0);
      expect(
        product.variants.some((variant) => variant.size === null),
        `${product.slug} should expose a one-size variant`,
      ).toBe(true);
    }
  });
});