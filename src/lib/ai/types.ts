import type { AspectRatio } from "@/types";

export const AI_CATEGORIES = [
  "home-hero",
  "home-editorial",
  "collection-hero",
  "collection-campaign",
  "product",
  "product-detail",
  "lifestyle",
  "street-fashion",
  "studio-campaign",
  "editorial-portrait",
  "sus-world",
  "promotional",
] as const;

export type AiCategory = (typeof AI_CATEGORIES)[number];

export const AI_GENDERS = ["male", "female", "mixed", "none"] as const;
export type AiGender = (typeof AI_GENDERS)[number];

export const AI_INFLUENCES = ["nigerian", "western", "fusion", "global"] as const;
export type AiInfluence = (typeof AI_INFLUENCES)[number];

export const AI_PRESETS = [
  "luxury_nigerian_editorial",
  "modern_african_streetwear",
  "contemporary_western_editorial",
  "premium_studio",
  "cinematic_campaign",
  "minimal_product",
] as const;

export type AiPresetId = (typeof AI_PRESETS)[number];

export const AI_COMPOSITIONS = [
  "subject-right",
  "subject-left",
  "subject-center",
  "full-bleed",
  "two-subject",
] as const;

export type AiComposition = (typeof AI_COMPOSITIONS)[number];

export const AI_CAMPAIGNS = [
  "hero",
  "male",
  "female",
  "dual-model",
  "nigerian-editorial",
  "craft",
  "sus-world",
  "editorial",
  "product",
] as const;

export type AiCampaign = (typeof AI_CAMPAIGNS)[number];

export type AiAspectRatio = Extract<
  AspectRatio,
  "1/1" | "3/4" | "4/3" | "16/9" | "9/16"
> | "21/9" | "4/5" | "2/3";

export interface AiProductRef {
  slug: string;
  name: string;
  category: string;
  colors: string[];
  description: string;
}

export interface AiGenerationRequest {
  category: AiCategory;
  preset: AiPresetId;
  gender: AiGender;
  influence: AiInfluence;
  composition: AiComposition;
  aspectRatio: AiAspectRatio;
  name: string;
  campaign?: AiCampaign;
  garment?: string;
  environment?: string;
  mood?: string;
  colors?: string;
  collection?: string;
  product?: AiProductRef;
  notes?: string;
  model?: "flash" | "pro";
}

export interface AiGenerationOptions {
  count?: number;
  referencePaths?: string[];
  imageSize?: "1K" | "2K";
}

export type AiAssetStatus = "pending" | "approved" | "rejected";

export interface AiAssetRecord {
  id: string;
  name: string;
  category: AiCategory;
  preset: AiPresetId;
  gender: AiGender;
  influence: AiInfluence;
  status: AiAssetStatus;
  path: string;
  width: number;
  height: number;
  mimeType: string;
  bytes: number;
  prompt: string;
  provider?: string;
  model?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface AiAssetManifest {
  version: number;
  updatedAt: string;
  assets: AiAssetRecord[];
}

export interface AiGenerateResult {
  ok: boolean;
  id?: string;
  name?: string;
  path?: string;
  width?: number;
  height?: number;
  bytes?: number;
  error?: string;
  retries?: number;
}
