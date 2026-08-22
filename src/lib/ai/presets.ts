import "server-only";
import type { AiInfluence, AiPresetId } from "./types";

export interface StylePreset {
  id: AiPresetId;
  label: string;
  lighting: string;
  composition: string;
  environment: string;
  fashionDirection: string;
  photography: string;
  realism: string;
  defaultInfluence: AiInfluence;
}

export const STYLE_PRESETS: Record<AiPresetId, StylePreset> = {
  luxury_nigerian_editorial: {
    id: "luxury_nigerian_editorial",
    label: "Luxury Nigerian Editorial",
    lighting: "soft key light with warm-golden skin tone, gentle shadows, cinematic colour grade with restrained contrast",
    composition: "editorial environmental framing with generous negative space for type",
    environment: "contemporary Nigerian architecture — modern Lagos or Abuja interiors and rooftops, raw concrete, warm timber, brass detail",
    fashionDirection:
      "modern Nigerian luxury: contemporary Nigerian tailoring, modern kaftan and agbada-inspired volumes, Adire-inspired and Aso-Oke-inspired detailing used sparingly, relaxed tailoring, hand-crafted woven textures",
    photography: "medium-format fashion editorial, 85mm compression, shallow believable depth of field, professional model direction",
    realism: "realistic fabric drape and garment construction, natural skin texture, anatomically correct, no AI artifacts",
    defaultInfluence: "nigerian",
  },
  modern_african_streetwear: {
    id: "modern_african_streetwear",
    label: "Modern African Streetwear",
    lighting: "golden hour or urban blue-hour light, natural bounce off concrete and glass, cinematic shadows",
    composition: "street-level environmental framing, subject anchored with background depth",
    environment:
      "Lagos street at dusk, wet asphalt reflections, contemporary Nigerian urban architecture, layered city depth",
    fashionDirection:
      "Afro-urban styling: contemporary Nigerian streetwear, relaxed oversized silhouettes, elevated tees, hoodies, tailored overcoats worn off-duty, one tasteful Nigerian textile accent per outfit",
    photography: "35mm editorial environmental portrait, authentic urban reportage energy with fashion discipline",
    realism: "physical plausible light, realistic fabrics, natural skin and hair texture, believable motion and posture",
    defaultInfluence: "nigerian",
  },
  contemporary_western_editorial: {
    id: "contemporary_western_editorial",
    label: "Contemporary Western Editorial",
    lighting: "clean directional studio or window light with soft fill, minimal shadows",
    composition: "editorial full or three-quarter frame with clean negative space",
    environment: "minimal modern atelier or neutral architectural space, subtle texture, refined set design",
    fashionDirection:
      "global contemporary fashion: modern minimalism, luxury streetwear, oversized tailoring, contemporary workwear, elevated basics, monochrome styling, clean Western silhouettes",
    photography: "fashion editorial, medium format, controlled lighting, precise composition",
    realism: "accurate tailoring, natural skin, realistic fabric, professional fashion model presence",
    defaultInfluence: "western",
  },
  premium_studio: {
    id: "premium_studio",
    label: "Premium Studio",
    lighting: "large softbox key, controlled shadows, sophisticated sculptural lighting, gentle rim",
    composition: "clean full or three-quarter body framing, neutral graded studio backdrop",
    environment:
      "premium neutral studio, architectural background, minimal set, subtle texture, no generic white ecommerce look",
    fashionDirection:
      "studio campaign: refined garments as the visual authority, structured tailoring, coordinated sets, elevated basics, one textile accent",
    photography: "professional studio fashion photography, medium format, precise garment presentation",
    realism: "garment construction accurate to the seams, natural fabric folds, realistic skin, no excessive atmosphere",
    defaultInfluence: "global",
  },
  cinematic_campaign: {
    id: "cinematic_campaign",
    label: "Cinematic Campaign",
    lighting: "cinematic side light or single shaft of window light, dramatic but controlled, filmic colour grade",
    composition: "strong fashion silhouette, mood-driven environmental framing with negative space for typography",
    environment:
      "atmospheric and architectural — late-night city, chamber interiors, arches and long shadows, contemporary Nigerian or neutral settings",
    fashionDirection:
      "campaign statement pieces: statement outerwear, long coats, draped volumes, matte finishes, monochrome with a single restrained accent",
    photography: "cinematic campaign photography, controlled depth of field, editorial model direction",
    realism: "filmic but physically plausible light and shadow, realistic fabric and anatomy, no synthetic glow",
    defaultInfluence: "fusion",
  },
  minimal_product: {
    id: "minimal_product",
    label: "Minimal Product",
    lighting: "soft even lighting, gentle shadows, neutral and premium backdrop",
    composition: "garment centered or subtly off-centre, clean framing, full garment visible",
    environment: "neutral premium background with minimal set design and subtle texture",
    fashionDirection:
      "garment-led: accurate construction, visible seams and stitching, natural folds, realistic fabric weight and drape",
    photography: "commercial product photography, focused clarity, garment remains the visual authority",
    realism: "no excessive atmosphere, no floating effects, accurate seams and textures, physically realistic fabric",
    defaultInfluence: "global",
  },
};

export function getPreset(id: AiPresetId): StylePreset {
  return STYLE_PRESETS[id];
}
