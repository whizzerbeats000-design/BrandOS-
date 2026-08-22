import { describe, expect, it } from "vitest";
import { PRODUCTS, CATEGORIES, COLLECTIONS, SIZE_OPTIONS, COLOR_OPTIONS } from "@/data/catalogue";
import { EDITORIAL_ENTRIES, EDITORIAL_FEATURE } from "@/data/editorial";
import { WORLD_STORIES } from "@/data/world";

describe("product data integrity", () => {
  it("has at least one product per category", () => {
    const categories = CATEGORIES.filter((c) => c.id !== "all");
    for (const cat of categories) {
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      expect(count, `${cat.id} should have at least 1 product`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every product has a unique slug", () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every product has a unique id", () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every product has at least one variant", () => {
    for (const p of PRODUCTS) {
      expect(p.variants.length, `${p.slug} should have variants`).toBeGreaterThan(0);
    }
  });

  it("every variant has a price > 0", () => {
    for (const p of PRODUCTS) {
      for (const v of p.variants) {
        expect(v.price, `${p.slug} variant ${v.id} price`).toBeGreaterThan(0);
      }
    }
  });

  it("every variant references a valid color from COLOR_OPTIONS", () => {
    const colorIds = COLOR_OPTIONS.map((c) => c.id);
    for (const p of PRODUCTS) {
      for (const v of p.variants) {
        expect(colorIds, `${p.slug} variant ${v.id} has invalid color ${v.color}`).toContain(v.color);
      }
    }
  });

  it("non-accessories use sizes from SIZE_OPTIONS", () => {
    const sizeIds = SIZE_OPTIONS.map((s) => s.id);
    for (const p of PRODUCTS) {
      if (p.category === "accessories") continue;
      for (const v of p.variants) {
        if (v.size !== null) {
          expect(sizeIds, `${p.slug} variant ${v.id} has invalid size ${v.size}`).toContain(v.size);
        }
      }
    }
  });

  it("accessories have at least one null-size variant", () => {
    const accessories = PRODUCTS.filter((p) => p.category === "accessories");
    for (const p of accessories) {
      expect(p.variants.some((v) => v.size === null), `${p.slug} should have null-size variant`).toBe(true);
    }
  });

  it("every product has images array with entries", () => {
    for (const p of PRODUCTS) {
      expect(p.images.length, `${p.slug} should have images`).toBeGreaterThan(0);
    }
  });

  it("every product has an availability status", () => {
    const valid = ["in-stock", "low-stock", "sold-out"] as const;
    for (const p of PRODUCTS) {
      expect(valid, `${p.slug} has invalid availability`).toContain(p.availability);
    }
  });
});

describe("collection data integrity", () => {
  it("has all expected collections", () => {
    expect(COLLECTIONS.length).toBe(3);
    expect(COLLECTIONS.map((c) => c.id)).toEqual(["signature", "after-dark", "limited"]);
  });
});

describe("editorial data integrity", () => {
  it("has editorial feature with required fields", () => {
    expect(EDITORIAL_FEATURE.id).toBeTruthy();
    expect(EDITORIAL_FEATURE.title).toBeTruthy();
    expect(EDITORIAL_FEATURE.media.desktop).toBeTruthy();
  });

  it("has at least one editorial entry", () => {
    expect(EDITORIAL_ENTRIES.length).toBeGreaterThan(0);
  });

  it("every editorial entry has a unique slug", () => {
    const slugs = EDITORIAL_ENTRIES.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every editorial entry has required fields", () => {
    for (const e of EDITORIAL_ENTRIES) {
      expect(e.slug, "slug").toBeTruthy();
      expect(e.title, "title").toBeTruthy();
      expect(e.excerpt, "excerpt").toBeTruthy();
      expect(e.publishedAt, "publishedAt").toBeTruthy();
      expect(e.heroImage.desktop, "heroImage.desktop").toBeTruthy();
    }
  });
});

describe("world stories data integrity", () => {
  it("has at least one world story", () => {
    expect(WORLD_STORIES.length).toBeGreaterThan(0);
  });

  it("every story has a unique slug", () => {
    const slugs = WORLD_STORIES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every story has required fields", () => {
    for (const s of WORLD_STORIES) {
      expect(s.slug, "slug").toBeTruthy();
      expect(s.title, "title").toBeTruthy();
      expect(s.excerpt, "excerpt").toBeTruthy();
      expect(s.body.length, "body paragraphs").toBeGreaterThan(0);
      expect(s.heroImage.desktop, "heroImage.desktop").toBeTruthy();
    }
  });
});
