# SUS WEARS — AI Image Generation System

Server-side image generation for the SUS WEARS visual library using the Gemini
API or NVIDIA NIM. Every asset is created ahead of time by a
developer/administrator — normal page rendering never calls the generation API
(cost control).

## 1. Configuration

Copy the template and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
|---|---|
| `AI_IMAGE_PROVIDER` | Provider to use: `gemini` (default) or `nvidia` |
| `GEMINI_API_KEY` | Gemini API key (server-side only) |
| `NVIDIA_API_KEY` | NVIDIA build.nvidia.com key (server-side only) |
| `NVIDIA_IMAGE_MODEL` | NVIDIA model id, default `black-forest-labs/flux.1-dev` |
| `AI_ADMIN_TOKEN` | Shared secret required to call the generation endpoint |
| `AI_MODEL` | Gemini image model, default `gemini-3.1-flash-image` (options: `gemini-3.1-flash-image`, `gemini-3-pro-image`) |
| `AI_IMAGE_SIZE` | `1K` (default) or `2K` |

`.env.local` is gitignored (`.env*`). `.env.local.example` is committed as a
placeholder-only template. Never commit the real key, and never reference the
key from client components — it only ever lives in server code.

Get a Gemini key at https://aistudio.google.com/apikey and an NVIDIA key at
https://build.nvidia.com.

## 2. Architecture

```
AI image request (CLI / admin)
        ↓
POST /api/ai/generate   (protected by AI_ADMIN_TOKEN + rate limit)
        ↓
src/lib/ai/imageGenerator.ts   → provider dispatch (gemini | nvidia)
        ↓
  gemini → GoogleGenAI (gemini-3.1-flash-image / gemini-3-pro-image)
  nvidia → flux.1-dev via https://ai.api.nvidia.com/v1/genai/<model>
        ↓
validation (decodable, non-empty)  +  retry (max 2)
        ↓
src/lib/ai/assets.ts   → sharp: WebP, resized per category, ≤ quality 82
        ↓
public/images/ai/<category>/<name>.webp
        ↓
src/data/ai-assets.json manifest (status: pending → approved | rejected)
        ↓
website (approved assets only)
```

Files:

- `src/lib/ai/config.ts` — env access, centralized model names, provider selection
- `src/lib/ai/types.ts` — categories, presets, genders, influences, campaigns, manifest
- `src/lib/ai/presets.ts` — six style presets
- `src/lib/ai/prompts.ts` — brand guide + structured prompt generators (incl. campaign formats)
- `src/lib/ai/imageGenerator.ts` — provider dispatch, retries, validation
- `src/lib/ai/nvidia.ts` — NVIDIA NIM adapter (flux.1-dev)
- `src/lib/ai/assets.ts` — sharp optimization + storage
- `src/lib/ai/manifest.ts` — asset record + approval workflow + distribution stats
- `src/app/api/ai/generate/route.ts` — protected endpoint

## 3. How to generate an image

Start the server (dev or production), then:

```bash
npm run ai:generate -- --file scripts/ai/specs/test-batch.json
npm run ai:generate -- --json '{"category":"collection-hero","preset":"cinematic_campaign",...}'
```

Each request supports: `category`, `preset`, `gender`, `influence`,
`composition`, `aspectRatio`, `name`, `campaign`, `garment`, `environment`,
`mood`, `colors`, `collection`, `product`, `notes`, `model`.

- `campaign` — structured campaign format: `hero`, `male`, `female`,
  `dual-model`, `nigerian-editorial`, `craft`, `sus-world`, `editorial`,
  `product`.
- `--dry` prints payloads without calling the API.
- `--count 2` generates multiple variants of one request.
- To regenerate an approved asset, generate again and re-review — the previous
  file is never overwritten silently; the new asset gets a new id.

## 3.1 Provider selection

Set `AI_IMAGE_PROVIDER` in `.env.local`:

- `nvidia` — calls `https://ai.api.nvidia.com/v1/genai/<NVIDIA_IMAGE_MODEL>`
  (default `black-forest-labs/flux.1-dev`) with an OpenAI-style image payload
  (`prompt`, `width`, `height`, `seed`, `steps`, `cfg_scale`, `mode`), decodes
  the base64 JPEG artifact, and continues through the same pipeline.
- `gemini` — calls Google GenAI with `responseModalities: ["IMAGE"]`.

The provider is chosen on the server; the CLI and client never see the keys.

## 4. Style presets

| Preset | Use for |
|---|---|
| `luxury_nigerian_editorial` | Nigerian-forward editorial and portraits |
| `modern_african_streetwear` | Lagos street fashion |
| `contemporary_western_editorial` | Global contemporary editorial |
| `premium_studio` | Studio campaigns |
| `cinematic_campaign` | Hero and campaign imagery |
| `minimal_product` | Product photography |

## 5. Brand distribution strategy

Maintain across the whole library (not per page):

- **70% Nigerian/African fashion identity** — `influence: "nigerian"` (modern
  Nigerian tailoring, Adire/Aso-Oke-inspired detail, Lagos/Abuja contexts).
- **30% Western/contemporary** — `influence: "western"`.
- **~50% male / 50% female** across `gender` fields.

Track your library:

```bash
npm run ai:status
```

## 6. Asset storage

```
public/images/ai/
  heroes/          # home-hero
  collections/     # collection-hero, collection-campaign
  products/        # product, product-detail
  editorial/       # home-editorial, editorial-portrait
  lifestyle/       # lifestyle, street-fashion
  campaigns/       # studio-campaign, promotional
  sus-world/       # sus-world
```

Naming: `sus-<subject>-<name>-<NN>.webp` (e.g. `sus-hero-signature-01.webp`,
`sus-product-trench-sand-front.webp`). Names are sanitized automatically.

Generated files are optimized WebP (quality 82, capped width per category, e.g.
1024px products / 2048px heroes). `next/image` serves responsive device-size
variants on request, so large originals are not sent to small screens.

## 7. Approval workflow

Quality gate: nothing goes on the website until a human reviews it.

```bash
npm run ai:status                       # list all assets
npm run ai:approve -- --list            # list ids
npm run ai:approve approved sus-hero    # approve by id prefix
npm run ai:approve rejected sus-product # reject and regenerate
```

Reject anything with distorted hands, broken anatomy, malformed garments,
text/logos, unnatural faces or poor composition. When in doubt, generate
another.

## 8. Consistency

Gemini does not guarantee pixel-identical garment reproduction. For product and
campaign consistency (front/back/detail/model views), pass an approved
reference image via the `referencePaths` option in the generation service so the
model edits from that reference instead of generating from scratch. Keep one
reference image per product or campaign.

## 9. Security

- API keys are read only on the server (`GEMINI_API_KEY`, `NVIDIA_API_KEY`),
  never in client code or bundles.
- The endpoint requires `x-ai-admin-token: <AI_ADMIN_TOKEN>` (401 otherwise).
- The endpoint rate-limits per IP (10 requests/min) and caps `count` at 4.
- Keys are never logged; errors return safe diagnostics only.
- Generation never runs during page rendering.

## 10. Cost control

- Generation happens only through the admin workflow above.
- A visitor hitting any page never triggers generation — the site renders
  pre-generated assets.
- Generate in small curated batches and reuse approved assets.
