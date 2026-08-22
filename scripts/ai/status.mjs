#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(process.cwd(), "src/data/ai-assets.json");
const stats = (assets) => {
  const total = assets.length || 1;
  const nigerian = assets.filter((a) => a.influence === "nigerian" || a.influence === "fusion").length;
  const western = assets.filter((a) => a.influence === "western" || a.influence === "global").length;
  const people = assets.filter((a) => a.gender === "male" || a.gender === "female");
  const male = people.filter((a) => a.gender === "male").length;
  return {
    total: assets.length,
    nigerianShare: Math.round((nigerian / total) * 100),
    westernShare: Math.round((western / total) * 100),
    maleShare: people.length ? Math.round((male / people.length) * 100) : 0,
    femaleShare: people.length ? Math.round(((people.length - male) / people.length) * 100) : 0,
  };
};

if (!existsSync(manifestPath)) {
  console.log("No manifest yet — nothing has been generated.");
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const assets = manifest.assets || [];
const s = stats(assets);
const pending = assets.filter((a) => a.status === "pending").length;
const approved = assets.filter((a) => a.status === "approved").length;
const rejected = assets.filter((a) => a.status === "rejected").length;

console.log(`SUS WEARS AI asset manifest`);
console.log(`Total: ${assets.length}  (approved: ${approved}, pending: ${pending}, rejected: ${rejected})`);
console.log(`Distribution — Nigerian/fusion ${s.nigerianShare}% · Western/global ${s.westernShare}% · Male ${s.maleShare}% · Female ${s.femaleShare}%`);
console.log("");
for (const asset of assets) {
  console.log(`  [${asset.status.padEnd(8)}] ${asset.id}  ${asset.path}  (${asset.width}x${asset.height}, ${(asset.bytes / 1024).toFixed(0)} kB)`);
  console.log(`           ${asset.category} · ${asset.preset} · ${asset.gender} · ${asset.influence}`);
}
