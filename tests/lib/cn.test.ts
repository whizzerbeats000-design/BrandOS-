import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins string classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional objects", () => {
    expect(cn({ active: true, hidden: false })).toBe("active");
  });

  it("skips falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });

  it("handles mixed string and object inputs", () => {
    expect(cn("base", { active: true }, "extra")).toBe("base active extra");
  });
});
