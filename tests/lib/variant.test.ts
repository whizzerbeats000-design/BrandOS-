import { describe, expect, it } from "vitest";
import { isColorAvailable, isSizeAvailable, variantsForColor, variantForSelection, availabilityLabel } from "@/lib/variant";
import { PRODUCTS } from "@/data/catalogue";

const tee = PRODUCTS.find((p) => p.id === "tee-01")!;
const acc = PRODUCTS.find((p) => p.id === "acc-01")!;

describe("variantsForColor", () => {
  it("returns variants for a valid color", () => {
    const variants = variantsForColor(tee, "bone");
    expect(variants.length).toBeGreaterThan(0);
    expect(variants.every((v) => v.color === "bone")).toBe(true);
  });

  it("returns empty for invalid color", () => {
    const variants = variantsForColor(tee, "nonexistent");
    expect(variants).toHaveLength(0);
  });
});

describe("variantForSelection", () => {
  it("finds exact variant", () => {
    const variant = variantForSelection(tee, "bone", "m");
    expect(variant).toBeDefined();
    expect(variant?.color).toBe("bone");
    expect(variant?.size).toBe("m");
  });

  it("returns undefined for missing variant", () => {
    const variant = variantForSelection(tee, "bone", "xxxl");
    expect(variant).toBeUndefined();
  });
});

describe("isColorAvailable", () => {
  it("returns true for available color", () => {
    expect(isColorAvailable(tee, "bone")).toBe(true);
  });

  it("returns false for invalid color", () => {
    expect(isColorAvailable(tee, "nonexistent")).toBe(false);
  });
});

describe("isSizeAvailable", () => {
  it("returns true for available size", () => {
    expect(isSizeAvailable(tee, "bone", "m")).toBe(true);
  });

  it("returns false for sold-out size", () => {
    const hoodie = PRODUCTS.find((p) => p.id === "hoodie-06")!;
    expect(isSizeAvailable(hoodie, "graphite", "m")).toBe(false);
  });
});

describe("availabilityLabel", () => {
  it("returns correct labels", () => {
    expect(availabilityLabel("in-stock")).toBe("In stock");
    expect(availabilityLabel("low-stock")).toBe("Low stock");
    expect(availabilityLabel("sold-out")).toBe("Sold out");
  });
});

describe("accessory variants", () => {
  it("has null size for one-size products", () => {
    const variants = variantsForColor(acc, "ink");
    expect(variants.length).toBeGreaterThan(0);
    expect(variants[0].size).toBeNull();
  });
});
