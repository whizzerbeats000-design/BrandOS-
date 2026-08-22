import { NextResponse } from "next/server";
import { anyProviderConfigured, getAiAdminToken } from "@/lib/ai/config";
import { optimizeAsset, sanitizeName, writeAsset } from "@/lib/ai/assets";
import { generateImage } from "@/lib/ai/imageGenerator";
import { appendAsset } from "@/lib/ai/manifest";
import {
  AI_CATEGORIES,
  AI_COMPOSITIONS,
  AI_GENDERS,
  AI_INFLUENCES,
  AI_PRESETS,
  type AiGenerationRequest,
} from "@/lib/ai/types";

export const runtime = "nodejs";

const RATE_LIMIT_PER_MINUTE = 10;
const rateBuckets = new Map<string, { windowStart: number; count: number }>();

type GenerateBody = AiGenerationRequest & { count?: number };

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > 60_000) {
    rateBuckets.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_PER_MINUTE;
}

function isValidBody(body: unknown): body is GenerateBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!AI_CATEGORIES.includes(b.category as (typeof AI_CATEGORIES)[number])) return false;
  if (!AI_PRESETS.includes(b.preset as (typeof AI_PRESETS)[number])) return false;
  if (!AI_GENDERS.includes(b.gender as (typeof AI_GENDERS)[number])) return false;
  if (!AI_INFLUENCES.includes(b.influence as (typeof AI_INFLUENCES)[number])) return false;
  if (!AI_COMPOSITIONS.includes(b.composition as (typeof AI_COMPOSITIONS)[number])) return false;
  if (typeof b.aspectRatio !== "string" || !/^(\d+)\/(\d+)$/.test(b.aspectRatio)) return false;
  if (typeof b.name !== "string" || b.name.trim().length === 0) return false;
  if (b.count !== undefined && typeof b.count !== "number") return false;
  return true;
}

export async function POST(request: Request) {
  const adminToken = getAiAdminToken();
  if (!adminToken) {
    return NextResponse.json(
      { ok: false, error: "AI generation is not enabled — AI_ADMIN_TOKEN is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-ai-admin-token");
  if (!provided || provided !== adminToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!anyProviderConfigured()) {
    return NextResponse.json(
      { ok: false, error: "No AI provider is configured — set GEMINI_API_KEY or NVIDIA_API_KEY on the server" },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded — wait a minute before generating again" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const requestBody = body as GenerateBody;
  const count = Math.min(Math.max(1, Number.isInteger(requestBody.count) ? requestBody.count ?? 1 : 1), 4);

  try {
    const results = [];
    for (let i = 0; i < count; i += 1) {
      const outcome = await generateImage(requestBody);
      if (!outcome.ok || !outcome.image) {
        results.push({
          ok: false,
          error: outcome.error ?? "generation failed",
          retries: outcome.retries,
          prompt: outcome.prompt,
        });
        continue;
      }
      const baseName = count > 1 ? `${sanitizeName(requestBody.name)}-${String(i + 1).padStart(2, "0")}` : sanitizeName(requestBody.name);
      const optimized = await optimizeAsset(outcome.image.bytes, requestBody.category);
      const written = await writeAsset(baseName, requestBody.category, optimized);
      const record = await appendAsset({
        name: baseName,
        category: requestBody.category,
        preset: requestBody.preset,
        gender: requestBody.gender,
        influence: requestBody.influence,
        path: written.path,
        width: optimized.width,
        height: optimized.height,
        mimeType: optimized.mimeType,
        bytes: optimized.bytes.length,
        prompt: outcome.image.prompt,
        provider: outcome.image.provider,
        model: outcome.image.model,
      });
      results.push({
        ok: true,
        id: record.id,
        name: record.name,
        path: record.path,
        width: record.width,
        height: record.height,
        mimeType: record.mimeType,
        bytes: record.bytes,
        retries: outcome.retries,
        provider: record.provider,
        model: record.model,
      });
    }
    const anyOk = results.some((r) => r.ok);
    return NextResponse.json({ ok: anyOk, results }, { status: anyOk ? 200 : 502 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Image generation failed on the server",
        detail: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
