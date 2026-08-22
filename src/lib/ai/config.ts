import "server-only";

export const AI_MODELS = {
  flash: "gemini-3.1-flash-image",
  pro: "gemini-3-pro-image",
} as const;

export type AiModelId = keyof typeof AI_MODELS;

export const AI_MODEL_VALUES: readonly string[] = Object.values(AI_MODELS);

export const AI_IMAGE_PROVIDERS = ["gemini", "nvidia"] as const;
export type AiImageProvider = (typeof AI_IMAGE_PROVIDERS)[number];

const DEFAULT_MODEL = AI_MODELS.flash;
const DEFAULT_IMAGE_SIZE = "1K";

export const DEFAULT_NVIDIA_MODEL = "black-forest-labs/flux.1-dev";

export function resolveImageProvider(envValue: string | undefined): AiImageProvider {
  return envValue?.trim().toLowerCase() === "nvidia" ? "nvidia" : "gemini";
}

export function resolveModel(envValue: string | undefined): string {
  if (!envValue) return DEFAULT_MODEL;
  const trimmed = envValue.trim();
  if (AI_MODEL_VALUES.includes(trimmed)) return trimmed;
  if (/^[\w./-]{3,}$/.test(trimmed)) return trimmed;
  return DEFAULT_MODEL;
}

export function resolveImageSize(envValue: string | undefined): "1K" | "2K" {
  return envValue?.trim().toUpperCase() === "2K" ? "2K" : DEFAULT_IMAGE_SIZE;
}

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  return key && key.trim().length > 0 && key.trim() !== "YOUR_KEY_HERE" ? key.trim() : null;
}

export function getNvidiaApiKey(): string | null {
  const key = process.env.NVIDIA_API_KEY;
  return key && key.trim().length > 0 && key.trim() !== "YOUR_KEY_HERE" ? key.trim() : null;
}

export function getNvidiaImageModel(): string {
  const model = process.env.NVIDIA_IMAGE_MODEL?.trim();
  if (model && /^[\w./-]{3,}$/.test(model)) return model;
  return DEFAULT_NVIDIA_MODEL;
}

export function getAiAdminToken(): string | null {
  const token = process.env.AI_ADMIN_TOKEN;
  return token && token.trim().length > 0 && token.trim() !== "YOUR_ADMIN_TOKEN_HERE" ? token.trim() : null;
}

export function geminiConfigured(): boolean {
  return getGeminiApiKey() !== null;
}

export function nvidiaConfigured(): boolean {
  return getNvidiaApiKey() !== null;
}

export function anyProviderConfigured(): boolean {
  return geminiConfigured() || nvidiaConfigured();
}
