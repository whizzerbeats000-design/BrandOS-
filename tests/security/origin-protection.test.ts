import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { scanSource, scanBundle, ALLOWED_NEXT_PUBLIC } from "../../scripts/lib/origin-check.mjs";

const root = join(import.meta.dirname, "..", "..");
const srcDir = join(root, "src");
const staticDir = join(root, ".next", "static");

/**
 * ORIGIN-PROTECTION INVARIANT
 * ---------------------------
 * "All production application traffic must pass through the intended edge
 *  security layer; private origin infrastructure must never be directly
 *  internet-reachable, and nothing in shipped source or the client bundle may
 *  disclose private infrastructure (IPs, hostnames, paths, secrets)."
 */

describe("origin protection — shipped source", () => {
  it("contains no private IPv4 / IPv6 addresses", () => {
    const v = scanSource(srcDir).filter((x) => /IPv4|IPv6/.test(x));
    expect(v).toEqual([]);
  });

  it("contains no internal hostnames (db.internal, api.corp, *.local)", () => {
    const v = scanSource(srcDir).filter((x) => /internal hostname/.test(x));
    expect(v).toEqual([]);
  });

  it("contains no hardcoded origin API base URLs", () => {
    const v = scanSource(srcDir).filter((x) => /origin-flavoured URL/.test(x));
    expect(v).toEqual([]);
  });

  it("contains no filesystem paths / absolute internal paths", () => {
    const v = scanSource(srcDir).filter((x) => /filesystem path/.test(x));
    expect(v).toEqual([]);
  });

  it("references only the intentional NEXT_PUBLIC_ env vars in shipped code", () => {
    expect([...ALLOWED_NEXT_PUBLIC]).toContain("NEXT_PUBLIC_SITE_URL");
    expect([...ALLOWED_NEXT_PUBLIC]).toContain("NEXT_PUBLIC_WHATSAPP_NUMBER");
    const v = scanSource(srcDir).filter((x) => /unexpected NEXT_PUBLIC_/.test(x));
    expect(v).toEqual([]);
  });

  it("never references secret-shaped env vars (SECRET/TOKEN/KEY) in shipped code", () => {
    const v = scanSource(srcDir).filter((x) => /secret env referenced/.test(x));
    expect(v).toEqual([]);
  });

  it("does not ship source maps in the publicly served static bundle", () => {
    if (!existsSync(staticDir)) return; // build not present; nothing to check
    const v = scanBundle(staticDir).filter((x) => /source map|sourceMappingURL/.test(x));
    expect(v).toEqual([]);
  });
});

describe("origin protection — built client bundle", () => {
  const bundleAvailable = existsSync(staticDir);

  it("contains no private IPs or internal hostnames", () => {
    if (!bundleAvailable) return;
    const v = scanBundle(staticDir).filter((x) => /IPv4|IPv6|internal hostname/.test(x));
    expect(v).toEqual([]);
  });

  it("contains no filesystem paths", () => {
    if (!bundleAvailable) return;
    const v = scanBundle(staticDir).filter((x) => /filesystem path/.test(x));
    expect(v).toEqual([]);
  });

  it("contains no NEXT_PUBLIC_ env vars outside the intentional list", () => {
    if (!bundleAvailable) return;
    const v = scanBundle(staticDir).filter((x) => /unexpected NEXT_PUBLIC_/.test(x));
    expect(v).toEqual([]);
  });
});

describe("origin protection — detector self-test (must catch real leaks)", () => {
  // Guard against a detector that silently never matches.
  const probe = (body: string) => {
    const dir = join(root, ".tmp-origin-probe");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "leak.ts"), body);
    const v = scanSource(dir);
    rmSync(dir, { recursive: true, force: true });
    return v.length;
  };

  it("flags a private IP (192.168.x)", () => {
    expect(probe('const o = "http://192.168.1.9/api";')).toBeGreaterThan(0);
  });
  it("flags an internal hostname (db.internal)", () => {
    expect(probe('const h = "db.internal:5432";')).toBeGreaterThan(0);
  });
  it("flags a secret env reference (process.env.API_KEY)", () => {
    expect(probe("const k = process.env.API_KEY;")).toBeGreaterThan(0);
  });
  it("flags a filesystem path (/root/)", () => {
    expect(probe('const p = "/root/secrets";')).toBeGreaterThan(0);
  });
});
