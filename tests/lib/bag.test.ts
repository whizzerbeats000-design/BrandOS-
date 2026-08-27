import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

function localStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

describe("bag operations", () => {
  let mock: ReturnType<typeof localStorageMock>;

  beforeEach(() => {
    mock = localStorageMock();
    vi.stubGlobal("localStorage", mock);
    vi.stubGlobal("window", { localStorage: mock, dispatchEvent: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getBag returns empty array when no data", async () => {
    const { getBag } = await import("../../src/lib/bag");
    expect(getBag()).toEqual([]);
  });

  it("getBag parses valid bag data", async () => {
    const data = [{ productId: "tee-01", variantId: "tee-01-bone-m", quantity: 2 }];
    mock.getItem.mockReturnValueOnce(JSON.stringify(data));
    const { getBag } = await import("../../src/lib/bag");
    const bag = getBag();
    expect(bag).toHaveLength(1);
    expect(bag[0].productId).toBe("tee-01");
  });

  it("getBag returns empty for invalid data", async () => {
    mock.getItem.mockReturnValueOnce("not json");
    const { getBag } = await import("../../src/lib/bag");
    expect(getBag()).toEqual([]);
  });

  it("addToBag adds a new line", async () => {
    mock.getItem.mockReturnValueOnce("[]");
    const { addToBag } = await import("../../src/lib/bag");
    const result = await addToBag({ productId: "tee-01", variantId: "tee-01-bone-m", quantity: 1 });
    expect(result.ok).toBe(true);
    expect(mock.setItem).toHaveBeenCalled();
  });

  it("addToBag rejects invalid quantity", async () => {
    const { addToBag } = await import("../../src/lib/bag");
    const result = await addToBag({ productId: "tee-01", variantId: "tee-01-bone-m", quantity: 0 });
    expect(result.ok).toBe(false);
  });

  it("getBagCount returns 0 for empty bag", async () => {
    const { getBagCount } = await import("../../src/lib/bag");
    expect(getBagCount()).toBe(0);
  });
});
