import { describe, expect, it } from "vitest";
import { scoreEntry, searchCatalogue, type SearchEntry } from "@/data/search";

function entry(partial: Partial<SearchEntry> = {}): SearchEntry {
  return {
    slug: partial.slug ?? "signature-bone-tee",
    name: partial.name ?? "Signature Bone Tee",
    category: partial.category ?? "Tees",
    collection: partial.collection ?? "Signature",
    keywords: partial.keywords ?? ["tee", "bone", "crew"],
    price: partial.price ?? 240,
    imageSrc: partial.imageSrc ?? "/images/shop/tees-01-a.webp",
    imageAlt: partial.imageAlt ?? "Signature Bone Tee",
    aspectRatio: partial.aspectRatio,
  };
}

const SAMPLE: SearchEntry[] = [
  entry({ slug: "bone-crew-tee", name: "Bone Crew Tee", keywords: ["tee", "bone", "crew"] }),
  entry({ slug: "noir-hoodie", name: "Noir Hoodie", category: "Hoodies", keywords: ["hoodie", "noir"] }),
  entry({ slug: "camel-coat", name: "Camel Overshirt Coat", category: "Outerwear", keywords: ["coat", "overshirt", "camel"] }),
];

describe("scoreEntry", () => {
  it("ranks name matches above keyword-only matches", () => {
    expect(scoreEntry(entry(), "signature bone tee")).toBe(100); // exact name
    expect(scoreEntry(entry(), "signature bone")).toBe(80); // name prefix
    expect(scoreEntry(entry(), "bone")).toBe(60); // name substring
  });

  it("matches an exact keyword that is not in the name", () => {
    const e = entry({ keywords: ["tee", "cotton"] });
    expect(scoreEntry(e, "cotton")).toBe(55); // keyword exact
  });

  it("returns null for an empty term", () => {
    expect(scoreEntry(entry(), "")).toBeNull();
  });

  it("returns null for an unrelated term", () => {
    expect(scoreEntry(entry(), "shoes")).toBeNull();
    expect(scoreEntry(entry(), "zzz")).toBeNull();
  });
});

describe("searchCatalogue", () => {
  it("returns [] for an empty query", () => {
    expect(searchCatalogue("", SAMPLE)).toEqual([]);
  });

  it("returns [] for an empty index", () => {
    expect(searchCatalogue("tee", [])).toEqual([]);
  });

  it("finds by name substring", () => {
    const results = searchCatalogue("crew", SAMPLE);
    expect(results.map((r) => r.slug)).toEqual(["bone-crew-tee"]);
  });

  it("finds by category", () => {
    const results = searchCatalogue("outerwear", SAMPLE);
    expect(results.map((r) => r.slug)).toEqual(["camel-coat"]);
  });

  it("is case-insensitive", () => {
    expect(searchCatalogue("NOIR", SAMPLE).map((r) => r.slug)).toEqual(["noir-hoodie"]);
  });

  it("ranks the strongest match first", () => {
    const results = searchCatalogue("coat", SAMPLE);
    expect(results.map((r) => r.slug)).toEqual(["camel-coat"]);
  });

  it("matches a partial first word via name prefix", () => {
    const results = searchCatalogue("bon", SAMPLE);
    expect(results.map((r) => r.slug)).toEqual(["bone-crew-tee"]);
  });

  it("requires every token of a multi-word query to match", () => {
    const results = searchCatalogue("bone noir", SAMPLE);
    expect(results.map((r) => r.slug)).toEqual([]);
  });

  it("applies the limit", () => {
    const results = searchCatalogue("e", SAMPLE, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });
});
