#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getAdminToken, getServerUrl, postGenerate } from "./lib.mjs";

const args = process.argv.slice(2);

function usage() {
  console.log(`SUS WEARS — AI image generation CLI

Usage:
  node scripts/ai/generate.mjs --file <spec.json> [--count <n>]
  node scripts/ai/generate.mjs --json '<request object>'

  --file   Path to a JSON spec (array of requests or { requests: [...] })
  --count  Number of images per request (default 1, max 4)
  --dry    Print the request payloads without calling the API

The CLI calls the protected server route /api/ai/generate, so run
the dev/production server first. The admin token is read from
AI_ADMIN_TOKEN in .env.local. The Gemini API key stays on the server.
`);
}

const flag = (name) => {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : undefined;
};

const file = flag("--file");
const inline = flag("--json");
const count = Number(flag("--count") || "1");
const dry = args.includes("--dry");

if (!file && !inline) {
  usage();
  process.exit(1);
}

let requests = [];
if (file) {
  const resolved = path.resolve(process.cwd(), file);
  if (!existsSync(resolved)) {
    console.error(`Spec file not found: ${resolved}`);
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(resolved, "utf8"));
  requests = Array.isArray(parsed) ? parsed : parsed.requests;
} else {
  requests = [JSON.parse(inline)];
}

if (!Array.isArray(requests) || requests.length === 0) {
  console.error("No requests found in the spec.");
  process.exit(1);
}

if (dry) {
  for (const request of requests) {
    console.log(`[dry-run] ${request.name} -> ${request.category} / ${request.preset}`);
  }
  process.exit(0);
}

const token = getAdminToken();
if (!token) {
  console.error("AI_ADMIN_TOKEN is not set. Add it to .env.local.");
  process.exit(1);
}
console.log(`Server: ${getServerUrl()}`);
console.log(`Generating ${requests.length} request(s) x${count}...\n`);

for (const request of requests) {
  console.log(`→ ${request.name} (${request.category})`);
  const { status, json } = await postGenerate(request, { count });
  if (status === 401) {
    console.error(`  [${status}] Unauthorized — check AI_ADMIN_TOKEN`);
    process.exit(1);
  }
  if (status === 503) {
    console.error(`  [${status}] ${json?.error || "Server not configured"}`);
    process.exit(1);
  }
  if (status === 429) {
    console.error(`  [${status}] Rate limited — wait a minute and retry`);
    process.exit(1);
  }
    if (json?.results) {
      for (const result of json.results) {
        if (result.ok) {
          console.log(`  ✓ ${result.path} (${result.width}x${result.height}, ${(result.bytes / 1024).toFixed(0)} kB, id=${result.id})`);
          if (result.provider || result.model) {
            console.log(`    provider: ${result.provider || "?"} · model: ${result.model || "?"}`);
          }
        } else {
          console.error(`  ✗ ${result.error || "failed"}`);
          if (result.prompt) {
            console.error(`    prompt: ${result.prompt.slice(0, 200)}${result.prompt.length > 200 ? "…" : ""}`);
          }
        }
      }
    } else {
    console.error(`  ✗ ${json?.error || `HTTP ${status}`}`);
  }
  console.log("");
}
