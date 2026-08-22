import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { AiCategory } from "./types";

export const AI_ASSET_DIR = "public/images/ai";

const CATEGORY_DIRS: Record<AiCategory, string> = {
  "home-hero": "heroes",
  "home-editorial": "editorial",
  "collection-hero": "collections",
  "collection-campaign": "collections",
  product: "products",
  "product-detail": "products",
  lifestyle: "lifestyle",
  "street-fashion": "lifestyle",
  "studio-campaign": "campaigns",
  "editorial-portrait": "editorial",
  "sus-world": "sus-world",
  promotional: "campaigns",
};

const CATEGORY_MAX_WIDTH: Record<AiCategory, number> = {
  "home-hero": 2048,
  "home-editorial": 1600,
  "collection-hero": 2048,
  "collection-campaign": 2048,
  product: 1024,
  "product-detail": 1600,
  lifestyle: 1600,
  "street-fashion": 1600,
  "studio-campaign": 2048,
  "editorial-portrait": 1600,
  "sus-world": 2048,
  promotional: 1600,
};

export interface OptimizedAsset {
  bytes: Buffer;
  width: number;
  height: number;
  mimeType: string;
}

export async function optimizeAsset(source: Buffer, category: AiCategory): Promise<OptimizedAsset> {
  const maxWidth = CATEGORY_MAX_WIDTH[category];
  const pipeline = sharp(source);
  const metadata = await pipeline.metadata();

  let resized = pipeline;
  if (metadata.width && metadata.width > maxWidth) {
    resized = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const bytes = await resized.webp({ quality: 82, effort: 6 }).toBuffer();
  const outMeta = await sharp(bytes).metadata();
  return {
    bytes,
    width: outMeta.width ?? 0,
    height: outMeta.height ?? 0,
    mimeType: "image/webp",
  };
}

export function sanitizeName(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "sus-asset";
}

export function categoryDir(category: AiCategory): string {
  return CATEGORY_DIRS[category];
}

export async function writeAsset(
  name: string,
  category: AiCategory,
  optimized: OptimizedAsset,
): Promise<{ path: string; absolutePath: string }> {
  const relativePath = `${AI_ASSET_DIR}/${categoryDir(category)}/${name}.webp`;
  const absolutePath = path.resolve(process.cwd(), "public", "images", "ai", categoryDir(category), `${name}.webp`);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, optimized.bytes);
  const urlPath = `/${relativePath.replace(/^public\//, "")}`;
  return { path: urlPath, absolutePath };
}
