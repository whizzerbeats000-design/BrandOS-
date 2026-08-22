import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AiAssetManifest,
  AiAssetRecord,
  AiAssetStatus,
  AiCategory,
  AiGender,
  AiInfluence,
  AiPresetId,
} from "./types";

export const MANIFEST_PATH = path.resolve(process.cwd(), "src/data/ai-assets.json");

const EMPTY_MANIFEST: AiAssetManifest = { version: 1, updatedAt: "", assets: [] };

export async function readManifest(): Promise<AiAssetManifest> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(raw) as AiAssetManifest;
    return {
      version: parsed.version ?? 1,
      updatedAt: parsed.updatedAt ?? "",
      assets: Array.isArray(parsed.assets) ? parsed.assets : [],
    };
  } catch {
    return { ...EMPTY_MANIFEST };
  }
}

export async function writeManifest(manifest: AiAssetManifest): Promise<void> {
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  const updated: AiAssetManifest = { ...manifest, updatedAt: new Date().toISOString() };
  await writeFile(MANIFEST_PATH, JSON.stringify(updated, null, 2), "utf8");
}

export function assetIdFromName(name: string, createdAt: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base}-${createdAt.replace(/\D/g, "").slice(0, 14)}`;
}

export interface NewAssetRecord {
  name: string;
  category: AiCategory;
  preset: AiPresetId;
  gender: AiGender;
  influence: AiInfluence;
  path: string;
  width: number;
  height: number;
  mimeType: string;
  bytes: number;
  prompt: string;
  provider?: string;
  model?: string;
}

export async function appendAsset(record: NewAssetRecord): Promise<AiAssetRecord> {
  const manifest = await readManifest();
  const createdAt = new Date().toISOString();
  const id = assetIdFromName(record.name, createdAt);
  const full: AiAssetRecord = {
    id,
    name: record.name,
    category: record.category,
    preset: record.preset,
    gender: record.gender,
    influence: record.influence,
    status: "pending",
    path: record.path,
    width: record.width,
    height: record.height,
    mimeType: record.mimeType,
    bytes: record.bytes,
    prompt: record.prompt,
    provider: record.provider,
    model: record.model,
    createdAt,
  };
  manifest.assets.push(full);
  await writeManifest(manifest);
  return full;
}

export async function setAssetStatus(ids: string[], status: AiAssetStatus): Promise<AiAssetRecord[]> {
  const manifest = await readManifest();
  const target = new Set(ids);
  const changed: AiAssetRecord[] = [];
  for (const asset of manifest.assets) {
    if (target.has(asset.id)) {
      asset.status = status;
      if (status === "approved") asset.approvedAt = new Date().toISOString();
      else delete asset.approvedAt;
      changed.push(asset);
    }
  }
  if (changed.length > 0) await writeManifest(manifest);
  return changed;
}

export function distributionStats(assets: AiAssetRecord[]) {
  const byInfluence = new Map<AiInfluence, number>();
  const byGender = new Map<AiGender, number>();
  for (const asset of assets) {
    byInfluence.set(asset.influence, (byInfluence.get(asset.influence) ?? 0) + 1);
    byGender.set(asset.gender, (byGender.get(asset.gender) ?? 0) + 1);
  }
  const total = assets.length || 1;
  const nigerian = (byInfluence.get("nigerian") ?? 0) + (byInfluence.get("fusion") ?? 0);
  const western = (byInfluence.get("western") ?? 0) + (byInfluence.get("global") ?? 0);
  const people = (byGender.get("male") ?? 0) + (byGender.get("female") ?? 0);
  const male = byGender.get("male") ?? 0;
  return {
    total: assets.length,
    nigerianShare: Math.round((nigerian / total) * 100),
    westernShare: Math.round((western / total) * 100),
    maleShare: people > 0 ? Math.round((male / people) * 100) : 0,
    femaleShare: people > 0 ? Math.round(((people - male) / people) * 100) : 0,
    byInfluence: Object.fromEntries(byInfluence),
    byGender: Object.fromEntries(byGender),
  };
}
