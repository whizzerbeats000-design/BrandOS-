import { describe, expect, it } from "vitest";
import { PRODUCTS, CATEGORIES, SIZE_OPTIONS, COLOR_OPTIONS } from "@/data/catalogue";
import { EDITORIAL_ENTRIES, EDITORIAL_FEATURE } from "@/data/editorial";
import { WORLD_STORIES } from "@/data/world";
import { COLLECTIONS as CMS_COLLECTIONS } from "@/data/collections";

describe("catalogue data structure", () => {
  it("has all category options", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(ids).toContain("all");
    expect(ids).toContain("tees");
    expect(ids).toContain("hoodies");
    expect(ids).toContain("outerwear");
    expect(ids).toContain("accessories");
  });

  it("has size options", () => {
    expect(SIZE_OPTIONS.length).toBeGreaterThan(0);
  });

  it("has color options", () => {
    expect(COLOR_OPTIONS.length).toBeGreaterThan(0);
  });

  it("PRODUCTS is an array (may be empty before launch)", () => {
    expect(Array.isArray(PRODUCTS)).toBe(true);
  });

  it("every product has a unique slug if any exist", () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every product has a unique id if any exist", () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("collection data structure", () => {
  it("CMS collections is an array (may be empty before launch)", () => {
    expect(Array.isArray(CMS_COLLECTIONS)).toBe(true);
  });
});

describe("editorial data structure", () => {
  it("EDITORIAL_FEATURE is null or valid object", () => {
    if (EDITORIAL_FEATURE !== null) {
      expect(EDITORIAL_FEATURE.id).toBeTruthy();
      expect(EDITORIAL_FEATURE.title).toBeTruthy();
    }
  });

  it("EDITORIAL_ENTRIES is an array (may be empty before launch)", () => {
    expect(Array.isArray(EDITORIAL_ENTRIES)).toBe(true);
  });
});

describe("world stories data structure", () => {
  it("WORLD_STORIES is an array (may be empty before launch)", () => {
    expect(Array.isArray(WORLD_STORIES)).toBe(true);
  });
});
