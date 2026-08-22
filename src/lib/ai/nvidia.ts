import "server-only";
import { getNvidiaApiKey, getNvidiaImageModel, resolveImageSize } from "./config";
import { generatePrompt } from "./prompts";
import type { AiGenerationOptions, AiGenerationRequest } from "./types";

export interface NvidiaImageResult {
  ok: boolean;
  bytes?: Buffer;
  mimeType?: string;
  prompt?: string;
  model?: string;
  error?: string;
}

const NVIDIA_API_BASE = "https://ai.api.nvidia.com/v1/genai";

const NVIDIA_ASPECT_SIZES: Record<string, { width: number; height: number }> = {
  "1/1": { width: 1024, height: 1024 },
  "3/4": { width: 768, height: 1024 },
  "4/3": { width: 1024, height: 768 },
  "9/16": { width: 768, height: 1344 },
  "16/9": { width: 1344, height: 768 },
  "4/5": { width: 1024, height: 1280 },
  "2/3": { width: 896, height: 1344 },
  "21/9": { width: 1344, height: 768 },
};

const NVIDIA_STEPS = 28;
const NVIDIA_CFG_SCALE = 3.5;

function aspectSize(aspectRatio: string): { width: number; height: number } {
  return NVIDIA_ASPECT_SIZES[aspectRatio] ?? NVIDIA_ASPECT_SIZES["1/1"];
}

function decodeBase64Image(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

export async function generateWithNvidia(
  request: AiGenerationRequest,
  options: AiGenerationOptions = {},
): Promise<NvidiaImageResult> {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) {
    return { ok: false, error: "NVIDIA_API_KEY is not configured on the server" };
  }

  const model = getNvidiaImageModel();
  const prompt = generatePrompt(request);
  const size = aspectSize(request.aspectRatio);
  const imageSize = options.imageSize ?? resolveImageSize(process.env.AI_IMAGE_SIZE);

  let width = size.width;
  let height = size.height;
  if (imageSize === "2K") {
    width = Math.min(Math.round(width * 2), 2048);
    height = Math.min(Math.round(height * 2), 2048);
  }

  const payload = {
    prompt,
    width,
    height,
    seed: 0,
    steps: NVIDIA_STEPS,
    cfg_scale: NVIDIA_CFG_SCALE,
    mode: "base",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 240_000);

    const response = await fetch(`${NVIDIA_API_BASE}/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const responseBody = (await response.json().catch(() => null)) as {
      artifacts?: Array<{ base64?: string; finishReason?: string; seed?: number }>;
      status?: number;
      title?: string;
      detail?: string;
    } | null;

    if (!response.ok) {
      const detail = responseBody?.detail ?? responseBody?.title ?? `HTTP ${response.status}`;
      return { ok: false, error: `NVIDIA image generation failed: ${detail}`, prompt };
    }

    const artifact = responseBody?.artifacts?.[0];
    if (!artifact?.base64) {
      return { ok: false, error: "NVIDIA returned no image data", prompt };
    }
    if (artifact.finishReason && artifact.finishReason !== "SUCCESS") {
      return { ok: false, error: `NVIDIA generation finished with status: ${artifact.finishReason}`, prompt };
    }

    const bytes = decodeBase64Image(artifact.base64);
    if (bytes.length < 10_000) {
      return { ok: false, error: "Generated image rejected: content too small to be a valid image", prompt };
    }

    return { ok: true, bytes, mimeType: "image/jpeg", prompt, model };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const safe = /abort/i.test(message) ? "NVIDIA request timed out after 240s" : message;
    return { ok: false, error: safe, prompt };
  }
}
