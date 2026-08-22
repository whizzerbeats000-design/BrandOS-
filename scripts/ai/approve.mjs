#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(process.cwd(), "src/data/ai-assets.json");
const args = process.argv.slice(2);

function usage() {
  console.log(`SUS WEARS — asset approval workflow

Usage:
  node scripts/ai/approve.mjs <status> <id-or-name...>
  node scripts/ai/approve.mjs --list

  <status>  approved | rejected | pending
  <id...>   Full asset ids, or name prefixes to match.

The quality gate (Prompt 22): only approved assets may be used on the
website. Review each generated image, then approve or reject it here.
`);
}

if (!existsSync(manifestPath)) {
  console.error("No manifest yet — generate assets first.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (args.includes("--list")) {
  for (const asset of manifest.assets || []) {
    console.log(`  [${asset.status.padEnd(8)}] ${asset.id}  ${asset.path}`);
  }
  process.exit(0);
}

const status = args[0];
if (!["approved", "rejected", "pending"].includes(status) || args.length < 2) {
  usage();
  process.exit(1);
}

const patterns = args.slice(1);
const changed = [];
for (const asset of manifest.assets || []) {
  if (patterns.some((p) => asset.id === p || asset.id.startsWith(p) || asset.name.includes(p))) {
    asset.status = status;
    if (status === "approved") asset.approvedAt = new Date().toISOString();
    else delete asset.approvedAt;
    changed.push(asset);
  }
}

if (changed.length === 0) {
  console.error("No assets matched.");
  process.exit(1);
}

manifest.updatedAt = new Date().toISOString();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Marked ${changed.length} asset(s) as ${status}:`);
for (const asset of changed) {
  console.log(`  ${asset.id}  ${asset.path}`);
}
