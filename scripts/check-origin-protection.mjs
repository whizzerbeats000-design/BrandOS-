#!/usr/bin/env node
/**
 * Origin-protection regression checker (CLI).
 * Run: node scripts/check-origin-protection.mjs
 * Enforces: no private infrastructure leaks in shipped source or the built
 * client bundle. Exit 0 = clean, exit 1 = violations found.
 */
import { join } from "node:path";
import { existsSync } from "node:fs";
import { scanSource, scanBundle } from "./lib/origin-check.mjs";

const root = process.argv[2] ? join(process.cwd(), process.argv[2]) : process.cwd();
const srcDir = join(root, "src");
const staticDir = join(root, ".next", "static");

const violations = [...scanSource(srcDir), ...(existsSync(staticDir) ? scanBundle(staticDir) : [])];

if (violations.length === 0) {
  console.log("ORIGIN PROTECTION OK — no private-infrastructure leaks in source or bundle.");
  process.exit(0);
}

console.error("ORIGIN PROTECTION VIOLATIONS:");
for (const v of violations) console.error("  - " + v);
process.exit(1);
