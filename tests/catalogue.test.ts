import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/data/catalogue";

describe("catalogue", () => {
  it("PRODUCTS is an empty array (no fake data pre-launch)", () => {
    expect(PRODUCTS).toEqual([]);
  });
});
