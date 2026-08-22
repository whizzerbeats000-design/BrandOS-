#!/usr/bin/env node
import { argv, exit, stdout, stderr } from "node:process";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const MANIFEST_PATH = path.resolve(process.cwd(), "src/data/ai-assets.json");

function usage() {
  stdout.write(`SUS WEARS — asset assignment workflow

Usage:
  node scripts/ai/assign.mjs <asset-id-or-name> <target>

Targets:
  hero-1-desktop         Slide 1 desktop hero
  hero-1-mobile           Slide 1 mobile hero
  hero-2-desktop         Slide 2 desktop hero
  hero-2-mobile           Slide 2 mobile hero
  hero-3-desktop         Slide 3 desktop hero
  hero-3-mobile           Slide 3 mobile hero
  hero-4-desktop         Slide 4 desktop hero
  hero-4-mobile           Slide 4 mobile hero
  featured-men-01         Home featured fashion (men)
  featured-women-01       Home featured fashion (women)
  category-tees           Home category tile (tees)
  category-hoodies        Home category tile (hoodies)
  category-outerwear      Home category tile (outerwear)
  category-accessories    Home category tile (accessories)
  craft-atelier-01        Home craft story
  new-drop-01             Home new drop
  new-drop-02             Home new drop
  susworld-teaser         Home SUS World teaser
  collection-hero-<slug>-desktop
  collection-hero-<slug>-mobile
  collection-gallery-<slug>-<n>
  product-<slug>-<n>

Examples:
  node scripts/ai/assign.mjs sus-hero-signature-01 hero-2-desktop
  node scripts/ai/assign.mjs sus-editorial-lagos-01 featured-men-01
`);
}

const args = argv.slice(2);
if (args.length < 2) {
  usage();
  exit(1);
}

const [identifier, target] = args;

if (!existsSync(MANIFEST_PATH)) {
  stderr.write("No manifest — generate assets first.\n");
  exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const asset = manifest.assets?.find(
  (a) => a.id === identifier || a.name === identifier || a.id.startsWith(identifier),
);

if (!asset) {
  stderr.write(`Asset "${identifier}" not found in manifest.\n`);
  exit(1);
}

if (asset.status !== "approved") {
  stderr.write(
    `Asset "${asset.name}" is not approved (status: ${asset.status}). Approve it first:\n  npm run ai:approve -- approved ${asset.id}\n`,
  );
  exit(1);
}

if (!asset.path || !asset.width || !asset.height || asset.path === "") {
  stderr.write(`Asset "${asset.name}" has no resolved path.\n`);
  exit(1);
}

// Resolve path
function resolveHeroPath(slide: number, variant: "desktop" | "mobile", asset: any): string {
  if (variant === "desktop") {
    const p = path.resolve(process.cwd(), "src/data/hero.ts");
    let src = readFileSync(p, "utf8");
    const pattern = new RegExp(
      `(\\s+media:\\s*\\{\\s*desktop:\\s*")[^"]*("[^}]*mobile:\\s*")[^"]*("`,
    );
    // Only touch the targeted slide (nth match)
    const matches = [...src.matchAll(/media:\s*\{\s*desktop:\s*"[^"]*",\s*mobile:\s*"[^"]*"/g)];
    const slideMatch = matches[slide - 1];
    if (!slideMatch) throw new Error(`Could not find slide ${slide} media block`);
    const start = slideMatch.index + src.slice(slideMatch.index, slideMatch.index + slideMatch[0].length).indexOf('desktop:');
    const desktopLineStart = src.indexOf('desktop:', slideMatch.index);
    const lineBeforeDesktop = src.lastIndexOf('\n', desktopLineStart) + 1;
    const desktopColon = src.indexOf(':', desktopLineStart) + 1;
    const openingQuote = src.indexOf('"', desktopColon);
    const closingQuote = src.indexOf('"', openingQuote + 1);
    src = src.slice(0, openingQuote + 1) + asset.path + src.slice(closingQuote);
    writeFileSync(p, src, "utf8");
    stdout.write(`Wired ${asset.name} -> hero.ts slide ${slide} desktop (${asset.width}x${asset.height})\n`);
    return asset.path;
  }
  // mobile variant
  const p = path.resolve(process.cwd(), "src/data/hero.ts");
  let src = readFileSync(p, "utf8");
  const matches = [...src.matchAll(/media:\s*\{\s*desktop:\s*"[^"]*",\s*mobile:\s*"[^"]*"/g)];
  const slideMatch = matches[slide - 1];
  if (!slideMatch) throw new Error(`Could not find slide ${slide} media block`);
  const mobileColon = src.indexOf('mobile:', slideMatch.index);
  const openingQuote = src.indexOf('"', src.indexOf(':', mobileColon) + 1);
  const closingQuote = src.indexOf('"', openingQuote + 1);
  src = src.slice(0, openingQuote + 1) + asset.path + src.slice(closingQuote);
  writeFileSync(p, src, "utf8");
  stdout.write(`Wired ${asset.name} -> hero.ts slide ${slide} mobile (${asset.width}x${asset.height})\n`);
  return asset.path;
}

function replaceImageRef(filePath: string, needle: string, newPath: string, label: string) {
  let src = readFileSync(filePath, "utf8");
  const count = src.split(needle).length - 1;
  if (count === 0) {
    stderr.write(`Warning: target "${needle}" not found in ${path.basename(filePath)}\n`);
    return;
  }
  src = src.split(needle).join(newPath);
  writeFileSync(filePath, src, "utf8");
  stdout.write(`Wired ${asset.name} -> ${label} (${asset.width}x${asset.height})\n`);
}

try {
  if (target === "hero-1-desktop") {
    resolveHeroPath(1, "desktop", asset);
  } else if (target === "hero-1-mobile") {
    resolveHeroPath(1, "mobile", asset);
  } else if (target === "hero-2-desktop") {
    resolveHeroPath(2, "desktop", asset);
  } else if (target === "hero-2-mobile") {
    resolveHeroPath(2, "mobile", asset);
  } else if (target === "hero-3-desktop") {
    resolveHeroPath(3, "desktop", asset);
  } else if (target === "hero-3-mobile") {
    resolveHeroPath(3, "mobile", asset);
  } else if (target === "hero-4-desktop") {
    resolveHeroPath(4, "desktop", asset);
  } else if (target === "hero-4-mobile") {
    resolveHeroPath(4, "mobile", asset);
  } else if (target === "featured-men-01") {
    replaceImageRef(
      path.resolve(process.cwd(), "src/data/homepage.ts"),
      `${HOME_BASE}/featured-men-01.svg`,
      asset.path,
      "featured-men-01",
    );
  } else if (target === "featured-women-01") {
    replaceImageRef(
      path.resolve(process.cwd(), "src/data/homepage.ts"),
      `${HOME_BASE}/featured-women-01.svg`,
      asset.path,
      "featured-women-01",
    );
  } else {
    stderr.write(`Unknown target "${target}".\n`);
    usage();
    exit(1);
  }

  // Record the assignment
  const recordPath = path.resolve(process.cwd(), "src/data/ai-assignments.json");
  let assignments = { assignments: [] as any[] };
  if (existsSync(recordPath)) {
    try {
      assignments = JSON.parse(readFileSync(recordPath, "utf8"));
    } catch {
      assignments = { assignments: [] };
    }
  }
  if (!Array.isArray(assignments.assignments)) assignments.assignments = [];
  assignments.assignments.push({
    assetId: asset.id,
    assetName: asset.name,
    assetPath: asset.path,
    target,
    assignedAt: new Date().toISOString(),
  });
  writeFileSync(recordPath, JSON.stringify(assignments, null, 2) + "\n", "utf8");
  stdout.write(`Assignment recorded in src/data/ai-assignments.json\n`);
} catch (e) {
  stderr.write(`Error: ${e instanceof Error ? e.message : e}\n`);
  exit(1);
}
