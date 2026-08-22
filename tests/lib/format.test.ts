import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats NGN price with symbol", () => {
    const result = formatPrice(180);
    expect(result).toContain("180");
  });

  it("formats zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });

  it("formats large prices", () => {
    const result = formatPrice(1180);
    expect(result).toContain("1,180");
  });

  it("accepts custom currency", () => {
    const result = formatPrice(100, "USD");
    expect(result).toContain("100");
  });
});
