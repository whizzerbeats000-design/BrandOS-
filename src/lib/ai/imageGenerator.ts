import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI, type ContentListUnion } from "@google/genai";
import sharp from "sharp";
import { getGeminiApiKey, resolveImageProvider, resolveImageSize, resolveModel } from "./config";
import { generatePrompt } from "./prompts";
import { generateWithNvidia } from "./nvidia";
import type { AiGenerationOptions, AiGenerationRequest } from "./types";

export interface GeneratedImage {
  bytes: Buffer;
  mimeType: string;
  width: number;
  height: number;
  prompt: string;
  provider: string;
  model?: string;
}

export interface GenerateImageResult {
  ok: boolean;
  image?: GeneratedImage;
  error?: string;
  prompt?: string;
  retries?: number;
  provider?: string;
}

const API_ASPECT_RATIOS: Record<string, string> = {
  "1/1": "1:1",
  "3/4": "3:4",
  "4/3": "4:3",
  "9/16": "9:16",
  "16/9": "16:9",
  "4/5": "3:4",
  "2/3": "3:4",
  "21/9": "16:9",
};

async function decodeDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(buffer).metadata();
    return { width: metadata.width ?? 0, height: metadata.height ?? 0 };
  } catch {
    return { width: 0, height: 0 };
  }
}

async function loadReferenceParts(referencePaths: string[]) {
  const parts: Array<{ inlineData: { data: string; mimeType: string } }> = [];
  for (const filePath of referencePaths) {
    const resolved = path.resolve(process.cwd(), "public", "images", "ai", filePath.replace(/^\//, ""));
    const bytes = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const mimeType =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    parts.push({ inlineData: { data: bytes.toString("base64"), mimeType } });
  }
  return parts;
}

function extractImage(response: unknown): { bytes: Buffer; mimeType: string } | null {
  const candidate = (response as { candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }> })
    ?.candidates?.[0];
  const part = candidate?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) return null;
  const mimeType = part.inlineData.mimeType ?? "image/png";
  return { bytes: Buffer.from(part.inlineData.data, "base64"), mimeType };
}

async function callGemini(
  request: AiGenerationRequest,
  options: AiGenerationOptions,
  referenceParts: Array<{ inlineData: { data: string; mimeType: string } }>,
  model: string,
) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return { ok: false as const, error: "GEMINI_API_KEY is not configured on the server" };
  }

  const prompt = generatePrompt(request);
  const client = new GoogleGenAI({ apiKey });
  const contents: ContentListUnion = referenceParts.length > 0 ? [prompt, ...referenceParts] : prompt;

  try {
    const response = await client.models.generateContent({
      model,
      contents,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: API_ASPECT_RATIOS[request.aspectRatio] ?? "1:1",
          imageSize: options.imageSize ?? resolveImageSize(process.env.AI_IMAGE_SIZE),
        },
      },
    });

    const image = extractImage(response);
    if (!image) {
      return { ok: false as const, error: "Gemini returned no image data", prompt };
    }
    return { ok: true as const, prompt, ...image };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const safe = /quota|rate|429/i.test(message)
      ? "Gemini quota exceeded for this API key — check plan or billing"
      : message;
    return { ok: false as const, error: safe, prompt };
  }
}

export async function generateImage(
  request: AiGenerationRequest,
  options: AiGenerationOptions = {},
): Promise<GenerateImageResult> {
  const provider = resolveImageProvider(process.env.AI_IMAGE_PROVIDER);
  const model = request.model === "pro" ? "gemini-3-pro-image" : resolveModel(process.env.AI_MODEL);
  const maxRetries = 2;

  if (provider === "nvidia") {
    let lastError: string | undefined;
    let lastPrompt: string | undefined;
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const result = await generateWithNvidia(request, options);
        if (!result.ok) {
          lastError = result.error;
          lastPrompt = result.prompt;
          continue;
        }
        const dimensions = await decodeDimensions(result.bytes!);
        if (dimensions.width === 0 || dimensions.height === 0) {
          lastError = "Generated image could not be decoded";
          lastPrompt = result.prompt;
          continue;
        }
        if (result.bytes!.length < 10_000) {
          lastError = "Generated image rejected: content too small to be a valid image";
          lastPrompt = result.prompt;
          continue;
        }
        return {
          ok: true,
          image: {
            bytes: result.bytes!,
            mimeType: result.mimeType ?? "image/jpeg",
            width: dimensions.width,
            height: dimensions.height,
            prompt: result.prompt ?? "",
            provider: "nvidia",
            model: result.model,
          },
          retries: attempt,
          provider: "nvidia",
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        lastError = message;
      }
    }
    return {
      ok: false,
      error: lastError ?? "Image generation failed",
      prompt: lastPrompt,
      retries: maxRetries,
      provider: "nvidia",
    };
  }

  let referenceParts: Array<{ inlineData: { data: string; mimeType: string } }> = [];
  if (options.referencePaths && options.referencePaths.length > 0) {
    try {
      referenceParts = await loadReferenceParts(options.referencePaths);
    } catch (error) {
      return {
        ok: false,
        error: `Could not load reference image: ${error instanceof Error ? error.message : "unknown"}`,
      };
    }
  }

  let lastError: string | undefined;
  let lastPrompt: string | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const result = await callGemini(request, options, referenceParts, model);
      if (!result.ok) {
        lastError = result.error;
        lastPrompt = result.prompt;
        continue;
      }
      const dimensions = await decodeDimensions(result.bytes);
      if (dimensions.width === 0 || dimensions.height === 0) {
        lastError = "Generated image could not be decoded";
        lastPrompt = result.prompt;
        continue;
      }
      if (result.bytes.length < 10_000) {
        lastError = "Generated image rejected: content too small to be a valid image";
        lastPrompt = result.prompt;
        continue;
      }
      return {
        ok: true,
        image: {
          bytes: result.bytes,
          mimeType: result.mimeType,
          width: dimensions.width,
          height: dimensions.height,
          prompt: result.prompt,
          provider: "gemini",
          model,
        },
        retries: attempt,
        provider: "gemini",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      if (/api[ _-]?key/i.test(message) && /not (found|valid|provided)|invalid|401|403/i.test(message)) {
        return { ok: false, error: "Gemini rejected the API key — check GEMINI_API_KEY", retries: attempt };
      }
      lastError = message;
    }
  }

  return { ok: false, error: lastError ?? "Image generation failed", prompt: lastPrompt, retries: maxRetries };
}
