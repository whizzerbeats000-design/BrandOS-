import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("recently viewed", () => {
  const STORAGE_KEY = "sus:recently-viewed";

  function mockStorage() {
    const store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    };
  }

  let storage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    storage = mockStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", { localStorage: storage });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("readRecentSlugs returns empty when no data", async () => {
    const { readRecentSlugs } = await import("@/lib/recently");
    expect(readRecentSlugs()).toEqual([]);
  });

  it("recordRecent stores a slug", async () => {
    storage.getItem.mockReturnValueOnce("[]");
    const { recordRecent } = await import("@/lib/recently");
    recordRecent("bone-crew-tee");
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(["bone-crew-tee"]),
    );
  });

  it("recordRecent deduplicates", async () => {
    storage.getItem.mockReturnValueOnce(JSON.stringify(["bone-crew-tee", "noir-crew-tee"]));
    const { recordRecent } = await import("@/lib/recently");
    recordRecent("bone-crew-tee");
    const stored = JSON.parse(storage.setItem.mock.calls[0][1]);
    expect(stored).toEqual(["bone-crew-tee", "noir-crew-tee"]);
  });

  it("readRecentSlugs returns invalid data as empty", async () => {
    storage.getItem.mockReturnValueOnce("not json");
    const { readRecentSlugs } = await import("@/lib/recently");
    expect(readRecentSlugs()).toEqual([]);
  });
});
