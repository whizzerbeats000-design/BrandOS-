import "server-only";
import { getPreset } from "./presets";
import type { AiCampaign, AiGenerationRequest, AiGender, AiInfluence } from "./types";

const BRAND_IDENTITY = `SUS WEARS (Shedrack Unisex Stitches) is a Nigerian unisex fashion brand founded by Mr. Shedrack. Before moving to Lagos in 2019, Mr. Shedrack worked as a fashion designer in Jos, Plateau State. The move to Lagos marked the beginning of SUS WEARS as a brand, built within one of Nigeria's most dynamic fashion markets. The brand creates clothing for men and women, combining practical tailoring with a modern approach to personal style. Identity pillars: contemporary Nigerian fashion, unisex design, editorial photography, commercial usability.`;

const QUALITY_RULES = `Photography direction: professional fashion campaign photography, never generic AI stock. Realistic lens behaviour, believable depth of field, physically plausible lighting and shadows, natural skin texture and pores, realistic hair, anatomically correct hands and eyes, accurate garment construction, seams, stitching and natural folds. Avoid plastic skin, wax faces, distorted fingers, floating accessories, impossible folds, excessive bokeh, over-sharpening, artificial HDR and any obvious AI artifact.`;

const NO_TEXT_RULE = `Do not render any text, words, letters, logos, brand marks or watermarks anywhere in the image. Keep the frame clean of typography — SUS WEARS website text is overlaid separately.`;

const AVOID_LIST = `Avoid: plastic skin, wax faces, distorted fingers, extra or missing fingers, deformed hands, broken anatomy, duplicated limbs, malformed garments, floating accessories, impossible fabric folds, excessive bokeh, over-sharpening, artificial HDR, harsh shadows, low resolution, warped faces, unnatural hair and any other obvious AI artifact.`;

const PALETTE = `Colour direction: the SUS WEARS palette — black, ivory, cream, charcoal, deep brown, burgundy, muted earth tones, restrained champagne and bronze accents. Not highly saturated. African-inspired colour accents only where they elevate the design.`;

const CAMPAIGN_DIRECTION: Record<AiCampaign, string> = {
  hero: `Campaign format: home hero. One or two adult Black Nigerian fashion models in a full or three-quarter body composition with generous clean negative space reserved for overlay typography. The garment must read clearly against the background; the frame must not feel crowded. Editorial, cinematic, premium fashion-campaign energy.`,
  male: `Campaign format: menswear focus. One adult Black Nigerian male fashion model wearing contemporary SUS WEARS menswear. Confident, contemporary, editorial, naturally masculine without posturing. Tailored looks, streetwear, modern Nigerian fashion, relaxed silhouettes, luxury casual or statement outerwear.`,
  female: `Campaign format: womenswear focus. One adult Black Nigerian female fashion model wearing contemporary SUS WEARS womenswear. Confident, fashion-forward, naturally styled, elegant and editorial. Natural skin texture, realistic hair and anatomy, professional makeup, believable poses. Fashion remains the focus.`,
  "dual-model": `Campaign format: co-ed duo. One adult Black Nigerian male and one adult Black Nigerian female model together, styled as a modern unisex campaign duo. Balanced, complementary poses and styling that read as one look with two expressions. Natural, editorial, premium.`,
  "nigerian-editorial": `Campaign format: Nigerian editorial. Contemporary Nigerian fashion-editorial storytelling — modern Nigerian tailoring, Adire-inspired and Aso-Oke-inspired detailing used tastefully, contemporary agbada-inspired and kaftan silhouettes, modern minimal African luxury. The look must be intentional design, never costume or traditional ceremony wear.`,
  craft: `Campaign format: craft and construction focus. Close attention to garment craft — seams, stitching, fabric weight, drape, texture, woven detail. The material quality of Nigerian tailoring is the hero of the frame.`,
  "sus-world": `Campaign format: SUS WEARS world. Atmospheric, art-directed editorial establishing the brand universe — Lagos and contemporary Nigerian contexts, cinematic light, sculptural shadows, premium fashion-campaign mood.`,
  editorial: `Campaign format: editorial. High-fashion editorial photography with confident art direction, precise composition, deliberate negative space and a strong central subject.`,
  product: `Campaign format: product-led. The garment is the visual authority — accurate construction, visible seams and stitching, natural folds, realistic fabric weight and drape, clean premium environment with minimal distraction.`,
};

const MODEL_RULES = `Model direction: adult professional fashion models only (age 24-40). Believably diverse range of skin tones, facial features, body proportions and hairstyles. Natural, elegant, editorial presence. Do not repeat the same face across multiple images unless a campaign specifically calls for a consistent character. Clothing must read unisex — silhouettes and styling that work equally on any gender. Fashion is the focus; never sexualised framing.`;

const INFLUENCE_DIRECTION: Record<AiInfluence, string> = {
  nigerian: `Fashion influence: 70% Nigerian/African identity. Modern Nigerian fashion — contemporary Nigerian tailoring, modern Ankara interpretation, Adire-inspired patterns and Aso-Oke-inspired detailing used sparingly and tastefully, contemporary agbada-inspired and modern kaftan silhouettes, relaxed Nigerian tailoring, woven textures, hand-crafted details, Lagos and Abuja contemporary style, Afro-urban styling, modern minimal African luxury. The garments must look intentionally designed — never costume-like, never traditional ceremony wear.`,
  western: `Fashion influence: contemporary global fashion. Modern minimalism, luxury streetwear, oversized tailoring, contemporary workwear, elevated basics, modern denim, monochrome fashion, editorial high fashion, modern utility, clean Western silhouettes. The look must blend naturally with a modern global identity.`,
  fusion: `Fashion influence: a natural fusion — a modern Nigerian fashion house's take on global contemporary fashion. Roughly 70% Nigerian/African identity (modern Nigerian tailoring and textile influence) and 30% global contemporary (minimalism, streetwear, tailoring). The blend must feel inevitable, not decorative.`,
  global: `Fashion influence: contemporary global fashion with a subtle Nigerian house sensibility — refined minimalism, precise tailoring and elevated basics with an understated African textile accent allowed where it strengthens the design.`,
};

const ENVIRONMENTS: Record<string, string> = {
  "lagos-modernist":
    "contemporary Lagos architecture — raw concrete, warm glass and brass details at golden hour, city haze behind",
  "abuja-modernist":
    "modern Abuja architecture with rhythmic concrete screens, dappled shade and clean horizontal lines",
  "lagos-rooftop": "a contemporary Lagos rooftop terrace at dusk, minimal furniture, warm city light beyond",
  "lagos-street":
    "an elegant Lagos street at blue hour, wet asphalt reflections, contemporary urban Nigerian architecture",
  "nigerian-studio":
    "a contemporary creative studio in Lagos — raw concrete, steel and warm timber, soft directional daylight",
  "premium-interior":
    "a premium minimalist interior with warm timber, brass accents and soft window light",
  "neutral-studio": "a premium neutral studio, seamless graded background, architectural set, subtle texture",
  "night-city": "the late-night city — dark interiors crossed by single shafts of cool window light",
  "arch-atrium": "a minimal architectural atrium with shallow arches and long sculptural shadows",
  "west-atelier": "a minimal contemporary atelier — whitewashed walls, sculptural light, refined set design",
};

const COMPOSITIONS: Record<string, string> = {
  "subject-right":
    "subject positioned on the right third of the frame, facing left, generous clean negative space on the left for typography; no hands, faces or key garment details in the text-safe area",
  "subject-left":
    "subject positioned on the left third of the frame, facing right, generous clean negative space on the right for typography; no hands, faces or key garment details in the text-safe area",
  "subject-center": "subject centered with balanced negative space on both sides",
  "full-bleed": "full-bleed composition — the figure and environment fill the frame edge to edge",
  "two-subject": "two subjects in balanced relation, one lead figure and one supporting figure, clean negative space",
};

function genderDirection(gender: AiGender): string {
  switch (gender) {
    case "male":
      return "One adult male model. Confident, contemporary, editorial, naturally masculine without posturing. Styling options: tailored looks, streetwear, modern Nigerian fashion, relaxed silhouettes, luxury casual, statement outerwear.";
    case "female":
      return "One adult female model. Confident, fashion-forward, naturally styled, elegant and editorial. Natural skin texture, realistic hair and anatomy, professional makeup, believable poses. Fashion remains the focus.";
    case "mixed":
      return "A balanced cast of adult male and female models.";
    case "none":
      return "No people in frame. The garment, fabric study or environment is the subject.";
  }
}

function resolveEnvironment(input: AiGenerationRequest): string {
  if (input.environment && ENVIRONMENTS[input.environment]) return ENVIRONMENTS[input.environment];
  if (input.environment) return input.environment;
  return getPreset(input.preset).environment;
}

function resolveComposition(input: AiGenerationRequest): string {
  const presetComposition = getPreset(input.preset).composition;
  const mapped = COMPOSITIONS[input.composition];
  if (mapped) return `Composition: ${mapped}.`;
  return `Composition: ${presetComposition}.`;
}

function garmentLine(input: AiGenerationRequest): string {
  const parts: string[] = [];
  if (input.garment) parts.push(input.garment);
  if (input.colors) parts.push(`colourway: ${input.colors}`);
  if (input.notes) parts.push(input.notes);
  return parts.length > 0 ? `Garment: ${parts.join(" · ")}.` : "";
}

function subjectLine(input: AiGenerationRequest, showProduct: boolean): string {
  const subject = showProduct && input.product
    ? `Product: ${input.product.name} (${input.product.category}; colours: ${input.product.colors.join(", ")}). Description: ${input.product.description}.`
    : "";
  const model = input.gender === "none" ? "" : genderDirection(input.gender);
  return [subject, model].filter(Boolean).join(" ");
}

function buildPrompt(input: AiGenerationRequest, showProduct: boolean): string {
  const preset = getPreset(input.preset);
  const mood = input.mood ? `Mood: ${input.mood}.` : "";
  const collection = input.collection ? `Collection: ${input.collection}.` : "";
  const campaign = input.campaign ? CAMPAIGN_DIRECTION[input.campaign] : "";
  const environment = `Environment: ${resolveEnvironment(input)}.`;
  const lighting = `Lighting: ${preset.lighting}.`;
  const photography = `Camera and photography: ${preset.photography}.`;
  const realism = `Realism requirements: ${preset.realism}.`;

  return [
    BRAND_IDENTITY,
    INFLUENCE_DIRECTION[input.influence],
    preset.fashionDirection,
    campaign,
    subjectLine(input, showProduct),
    garmentLine(input),
    collection,
    environment,
    lighting,
    mood,
    resolveComposition(input),
    photography,
    realism,
    MODEL_RULES,
    PALETTE,
    QUALITY_RULES,
    AVOID_LIST,
    NO_TEXT_RULE,
  ]
    .filter(Boolean)
    .join("\n");
}

export function generateHomeHeroPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateHomeEditorialPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateCollectionPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateCollectionCampaignPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateProductPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, true);
}

export function generateProductDetailPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, true);
}

export function generateLifestylePrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateStreetFashionPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateStudioCampaignPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateEditorialPortraitPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generateSusWorldPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

export function generatePromotionalPrompt(input: AiGenerationRequest): string {
  return buildPrompt(input, false);
}

const CATEGORY_GENERATORS: Record<string, (input: AiGenerationRequest) => string> = {
  "home-hero": generateHomeHeroPrompt,
  "home-editorial": generateHomeEditorialPrompt,
  "collection-hero": generateCollectionPrompt,
  "collection-campaign": generateCollectionCampaignPrompt,
  product: generateProductPrompt,
  "product-detail": generateProductDetailPrompt,
  lifestyle: generateLifestylePrompt,
  "street-fashion": generateStreetFashionPrompt,
  "studio-campaign": generateStudioCampaignPrompt,
  "editorial-portrait": generateEditorialPortraitPrompt,
  "sus-world": generateSusWorldPrompt,
  promotional: generatePromotionalPrompt,
};

export function generatePrompt(input: AiGenerationRequest): string {
  const generator = CATEGORY_GENERATORS[input.category];
  if (!generator) return buildPrompt(input, input.category === "product" || input.category === "product-detail");
  return generator(input);
}
