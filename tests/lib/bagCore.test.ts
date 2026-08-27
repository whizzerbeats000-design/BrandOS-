import { describe, expect, it } from "vitest";
import {
  MAX_QTY,
  MIN_QTY,
  bagCount,
  isValidLine,
  lineKey,
  mergeBag,
  normalizeBag,
  type BagLine,
} from "@/lib/bagCore";

function line(productId: string, variantId: string, quantity: number): BagLine {
  return { productId, variantId, quantity };
}

describe("lineKey — composite identity", () => {
  it("distinguishes lines that share a variant id across products", () => {
    expect(lineKey({ productId: "a", variantId: "m" })).not.toBe(
      lineKey({ productId: "b", variantId: "m" }),
    );
  });

  it("is consistent for the same product+variant", () => {
    expect(lineKey({ productId: "a", variantId: "m" })).toBe(
      lineKey({ productId: "a", variantId: "m" }),
    );
  });
});

describe("mergeBag — variant integrity", () => {
  it("merges the same product+variant by summing quantity", () => {
    const next = mergeBag([line("a", "m", 1)], line("a", "m", 2));
    expect(next).toEqual([line("a", "m", 3)]);
  });

  it("does NOT collapse the same variant id across different products", () => {
    const next = mergeBag([line("a", "m", 1)], line("b", "m", 1));
    expect(next).toEqual([line("a", "m", 1), line("b", "m", 1)]);
  });

  it("keeps different variants of the same product as separate lines", () => {
    const next = mergeBag([line("a", "m", 1)], line("a", "l", 1));
    expect(next).toEqual([line("a", "m", 1), line("a", "l", 1)]);
  });

  it("appends a new line when none matches", () => {
    const next = mergeBag([], line("a", "m", 1));
    expect(next).toEqual([line("a", "m", 1)]);
  });

  it("caps the merged quantity at MAX_QTY", () => {
    const next = mergeBag([line("a", "m", MAX_QTY)], line("a", "m", 2));
    expect(next[0].quantity).toBe(MAX_QTY);
  });

  it("drops a structurally invalid line", () => {
    const invalid = { productId: "", variantId: "m", quantity: 1 };
    const next = mergeBag([line("a", "m", 1)], invalid);
    expect(next).toEqual([line("a", "m", 1)]);
  });
});

describe("normalizeBag — hardening stored data", () => {
  it("removes malformed lines and clamps valid-but-out-of-range ones", () => {
    const next = normalizeBag([
      line("a", "m", 1),
      { productId: "a", variantId: 42, quantity: 1 } as unknown as BagLine,
      { productId: "b", variantId: "l", quantity: -3 },
      123 as unknown as BagLine,
    ]);
    expect(next).toEqual([line("a", "m", 1), { productId: "b", variantId: "l", quantity: 1 }]);
  });

  it("clamps out-of-range quantities to the valid range", () => {
    const next = normalizeBag([line("a", "m", -5), line("b", "l", 999), line("c", "s", 2.6)]);
    expect(next.map((l) => l.quantity)).toEqual([MIN_QTY, MAX_QTY, 3]);
  });

  it("returns [] for a non-array input", () => {
    expect(normalizeBag(null as unknown as BagLine[])).toEqual([]);
  });
});

describe("isValidLine", () => {
  it("accepts a well-formed line", () => {
    expect(isValidLine(line("a", "m", 1))).toBe(true);
  });

  it("rejects lines with non-positive or non-finite quantities", () => {
    expect(isValidLine(line("a", "m", 0))).toBe(false);
    expect(isValidLine(line("a", "m", -1))).toBe(false);
    expect(isValidLine({ productId: "a", variantId: "m", quantity: NaN })).toBe(false);
  });

  it("rejects a non-object", () => {
    expect(isValidLine(null)).toBe(false);
    expect(isValidLine("nope")).toBe(false);
  });
});

describe("bagCount", () => {
  it("sums quantities and ignores invalid lines", () => {
    expect(
      bagCount([
        line("a", "m", 2),
        line("b", "l", 3),
        line("a", "m", 0),
      ]),
    ).toBe(5);
  });

  it("returns 0 for an empty or invalid bag", () => {
    expect(bagCount([])).toBe(0);
    expect(bagCount(null as unknown as BagLine[])).toBe(0);
  });
});
