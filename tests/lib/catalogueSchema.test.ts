import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Product, Collection, ProductVariant } from "@/types";
import {
  assertCatalogue,
  validateCollections,
  validateProducts,
} from "@/lib/catalogueSchema";
import { PRODUCTS } from "@/data/catalogue";
import { COLLECTIONS } from "@/data/collections";

/** Build a minimal, fully-valid product for mutation in each test. */
function validProduct(overrides: Partial<Product> = {}): Product {
  const variant: ProductVariant = {
    id: "sig-bone-m",
    color: "bone",
    size: "m",
    price: 240,
    sku: "SIG-BONE-M",
    availability: "in-stock",
    inventory: 5,
  };
  const base: Product = {
    id: "sig-tee-01",
    slug: "signature-bone-tee",
    name: "Signature Bone Tee",
    description: "A unisex tee cut from a considered pattern.",
    price: 240,
    category: "tees",
    collection: "signature",
    images: [
      { src: "/images/shop/tees-01-a.webp", alt: "Signature Bone Tee front" },
      { src: "/images/shop/tees-01-b.webp", alt: "Signature Bone Tee back" },
    ],
    availability: "in-stock",
    sizes: ["m"],
    colors: ["bone"],
    variants: [variant],
    featured: false,
    newArrival: true,
    keywords: ["tee", "bone"],
  };
  return { ...base, ...overrides };
}

function fileExists(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src));
}

describe("validateProducts", () => {
  it("accepts an empty (pre-launch) catalogue", () => {
    expect(validateProducts([])).toEqual([]);
    expect(() => assertCatalogue([])).not.toThrow();
  });

  it("accepts a fully-valid product", () => {
    expect(validateProducts([validProduct()])).toEqual([]);
  });

  it("flags a missing name", () => {
    const issues = validateProducts([validProduct({ name: "" })]);
    expect(issues.some((i) => i.path.endsWith("name"))).toBe(true);
  });

  it("flags duplicate slugs", () => {
    const p = validProduct();
    const issues = validateProducts([p, validProduct()]);
    expect(issues.some((i) => i.message.includes("Duplicate slug"))).toBe(true);
  });

  it("flags duplicate ids", () => {
    const issues = validateProducts([validProduct(), validProduct()]);
    expect(issues.some((i) => i.message.includes("Duplicate id"))).toBe(true);
  });

  it("flags an empty description", () => {
    const issues = validateProducts([validProduct({ description: "  " })]);
    expect(issues.some((i) => i.path.endsWith("description"))).toBe(true);
  });

  it("flags an unknown category and collection", () => {
    const issues = validateProducts([
      validProduct({ category: "shoes" as Product["category"] }),
    ]);
    expect(issues.some((i) => i.message.includes("Unknown category"))).toBe(true);
  });

  it("flags a negative price", () => {
    const issues = validateProducts([validProduct({ price: -5 })]);
    expect(issues.some((i) => i.message.includes("Price must be"))).toBe(true);
  });

  it("flags a dangling (non-absolute) image path", () => {
    const issues = validateProducts([
      validProduct({
        images: [{ src: "tees/01-a.webp", alt: "front" }],
      }),
    ]);
    expect(issues.some((i) => i.message.includes("absolute site path"))).toBe(true);
  });

  it("flags unknown size and colour refs", () => {
    const issues = validateProducts([
      validProduct({ sizes: ["xxl9"], colors: ["teal"] }),
    ]);
    expect(issues.some((i) => i.message.includes('Unknown size "xxl9"'))).toBe(true);
    expect(issues.some((i) => i.message.includes('Unknown colour "teal"'))).toBe(true);
  });

  it("flags variants referencing undeclared colours and sizes", () => {
    const p = validProduct();
    p.variants = [
      { ...p.variants[0], color: "noir", size: "l" },
    ];
    const issues = validateProducts([p]);
    expect(issues.some((i) => i.message.includes("not declared in product.colors"))).toBe(true);
    expect(issues.some((i) => i.message.includes("not declared in product.sizes"))).toBe(true);
  });

  it("flags a product with no variants", () => {
    const issues = validateProducts([validProduct({ variants: [] })]);
    expect(issues.some((i) => i.message.includes("At least one variant"))).toBe(true);
  });

  it("flags a declared colour with no variant", () => {
    const p = validProduct({ colors: ["bone", "noir"] });
    const issues = validateProducts([p]);
    expect(issues.some((i) => i.message.includes('Colour "noir" has no variants'))).toBe(true);
  });

  it("flags negative inventory", () => {
    const p = validProduct();
    p.variants[0].inventory = -1;
    const issues = validateProducts([p]);
    expect(issues.some((i) => i.message.includes("Inventory must be"))).toBe(true);
  });

  it("flags unknown availability", () => {
    const p = validProduct();
    p.variants[0].availability = "discontinued" as ProductVariant["availability"];
    const issues = validateProducts([p]);
    expect(issues.some((i) => i.message.includes("Unknown availability"))).toBe(true);
  });

  it("assertCatalogue throws when errors exist", () => {
    expect(() => assertCatalogue([validProduct({ name: "" })])).toThrow(
      /Catalogue validation failed/,
    );
  });
});

describe("validateCollections", () => {
  it("accepts collections referencing existing products", () => {
    const p = validProduct();
    expect(validateCollections([], [p])).toEqual([]);
  });

  it("warns when a collection references a missing product slug", () => {
    const p = validProduct();
    const collection = {
      featuredProductIds: [p.slug, "does-not-exist"],
    } as unknown as Collection;
    const issues = validateCollections([collection], [p]);
    expect(issues.some((i) => i.message.includes("missing product slug"))).toBe(true);
  });
});

describe("on-disk image integrity (real data)", () => {
  it("every PRODUCTS image resolves to a file", () => {
    const bad = PRODUCTS.flatMap((p) =>
      p.images.filter((img) => !fileExists(img.src)).map((img) => `${p.slug}: ${img.src}`),
    );
    expect(bad).toEqual([]);
  });

  it("every COLLECTIONS hero and gallery image resolves to a file", () => {
    const bad: string[] = [];
    for (const c of COLLECTIONS) {
      if (!fileExists(c.heroImage.desktop)) bad.push(`${c.slug}: ${c.heroImage.desktop}`);
      if (c.heroImage.mobile && !fileExists(c.heroImage.mobile)) {
        bad.push(`${c.slug}: ${c.heroImage.mobile}`);
      }
      for (const g of c.gallery) {
        if (!fileExists(g.src)) bad.push(`${c.slug}: ${g.src}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
