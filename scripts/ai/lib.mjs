import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

export function getAdminToken() {
  const env = loadEnvFile();
  return process.env.AI_ADMIN_TOKEN || env.AI_ADMIN_TOKEN || null;
}

export function getServerUrl() {
  return process.env.AI_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function postGenerate(payload, { count = 1 } = {}) {
  const token = getAdminToken();
  const url = `${getServerUrl()}/api/ai/generate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-ai-admin-token": token || "",
    },
    body: JSON.stringify({ ...payload, count }),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}
