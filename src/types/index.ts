export type AspectRatio = "1/1" | "3/4" | "4/5" | "4/3" | "16/9" | "16/10" | "9/16" | "21/9";

export type MotionVariant = "fade" | "reveal" | "zoom" | "slide" | "blur" | "blur-reveal";

export interface ImageSource {
  src: string;
  alt: string;
  /** Editorial framing. Defaults to "3/4" for fashion imagery. */
  aspectRatio?: AspectRatio;
  /** Tailwind `object-position` value, e.g. "object-center". */
  position?: string;
  /** True for above-the-fold imagery loaded eagerly. */
  priority?: boolean;
  /** Image quality tier: 50 | 75 | 90. Defaults to 75. */
  quality?: 50 | 75 | 90;
}

/* ---- Cinematic hero types ---- */

export type HeroCopyPosition = "bottom-left" | "bottom-right" | "left" | "right";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  cta: HeroCta;
  media: HeroMediaSource;
  /** Art-directed placement of the copy over the photograph. Defaults to "bottom-left". */
  copyPosition?: HeroCopyPosition;
}

/* ---- Magnetic cursor types ---- */

export type CursorState = "default" | "link" | "image";

export interface CursorConfig {
  lagMs?: number;
  expandPx?: number;
  color?: string;
}

/* ---- Scroll progress ---- */

export interface ScrollProgressConfig {
  trackColor?: string;
  progressColor?: string;
  thickness?: number;
}

export interface HeroMediaSource {
  desktop: string;
  /** Dedicated mobile composition. Falls back to `desktop` when absent. */
  mobile?: string;
  alt: string;
  /** Focal point as percentage coordinates (0-100). Defaults to center. */
  focalPoint?: { x: number; y: number };
  /** Art-directed mobile focal point (overrides `focalPoint` for the mobile crop). */
  mobileFocalPoint?: { x: number; y: number };
}

export interface HeroCta {
  label: string;
  href: string;
}

/* ---- Commerce ---- */

export type ProductCategory = "tees" | "hoodies" | "outerwear" | "accessories";
export type ProductCollectionId = "signature" | "after-dark" | "limited";
export type Availability = "in-stock" | "low-stock" | "sold-out";
/** Fit orientation. SUS pieces are cut unisex; gendered fits may exist later. */
export type ProductGender = "men" | "women" | "unisex";

export interface ProductImage {
  src: string;
  alt: string;
  focalPoint?: { x: number; y: number };
  position?: string;
  type?: "product" | "detail" | "campaign" | "editorial";
  aspectRatio?: AspectRatio;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface SizeOption {
  id: string;
  label: string;
}

export interface ProductVariant {
  id: string;
  /** Reference to a ColorOption id. */
  color: string;
  /** Reference to a SizeOption id, or null for one-size categories. */
  size: string | null;
  price: number;
  sku: string;
  availability: Availability;
  inventory: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  /** ISO 4217 currency code. Defaults to USD. */
  currency?: string;
  category: ProductCategory;
  collection: ProductCollectionId;
  /** Fit orientation — see ProductGender. Defaults to "unisex". */
  gender?: ProductGender;
  /** Ordered gallery. The first image is the card thumbnail. */
  images: ProductImage[];
  /** Explicit product thumbnail for cards and grids. Falls back to images[0]. */
  productImage?: ProductImage;
  /** Product-level availability (derived from variants). */
  availability: Availability;
  /** Size option ids available on this product. */
  sizes: string[];
  /** Color option ids available on this product. */
  colors: string[];
  variants: ProductVariant[];
  featured: boolean;
  newArrival: boolean;
  /** Optional editorial label — used only when meaningful, e.g. "Limited". */
  badge?: string;
  keywords: string[];
  /** Editorial framing for the card image. Defaults to "4/5". */
  aspectRatio?: AspectRatio;
}

/* ---- Editorial ---- */

export type CollectionStatus = "current" | "archived" | "upcoming";

export type MediaTreatment = "warm" | "cool" | "exclusive";

export interface CollectionTheme {
  /** Tint used for theme-tinted panels and overlines. */
  surface: string;
  /** Collection accent colour (drives overlines, glows, active states). */
  accent: string;
  /** Drives the cinematic treatment of campaign imagery. */
  mediaTreatment: MediaTreatment;
}

export interface CollectionGalleryImage {
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  /** Optional editorial caption under the image. */
  caption?: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  /** Short label for collection nav ("Signature"). */
  eyebrow: string;
  /** Hero statement, e.g. "BUILT FOR PRESENCE." */
  tagline: string;
  year: string;
  season: string;
  status: CollectionStatus;
  /** One-line description for cards and the index page. */
  shortDescription: string;
  /** Editorial introduction for the landing page. */
  description: string;
  /** Optional oversized editorial statement. */
  editorialQuote?: string;
  heroImage: HeroMediaSource;
  /** Campaign gallery — order defines the visual rhythm. */
  gallery: CollectionGalleryImage[];
  /** Deliberate ranking of featured pieces (product slugs). */
  featuredProductIds: string[];
  /** Explicit membership override. Omit to derive from product data. */
  productIds?: string[];
  theme: CollectionTheme;
  /** Narrative sections for the landing page story block. */
  story: CollectionStorySection[];
  /** Deterministic recommendation — next story in the narrative. */
  relatedCollectionId?: string;
  cta: HeroCta;
}

export interface CollectionStorySection {
  heading: string;
  body: string;
}

export interface EditorialFeature {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  pullQuote: string;
  cta: HeroCta;
  media: HeroMediaSource;
}

/* ---- Homepage sections ---- */

export interface HomepageFact {
  label: string;
  value: string;
}

export interface BrandIntroData {
  eyebrow: string;
  title: string;
  intro: string;
  statement: string;
  supporting: string;
  facts: HomepageFact[];
}

export interface FeaturedFashionItem {
  id: string;
  label: string;
  description: string;
  cta: HeroCta;
  media: HeroMediaSource;
}

export interface FeaturedFashionData {
  eyebrow: string;
  title: string;
  description: string;
  items: FeaturedFashionItem[];
}

export interface CategoryShowcaseItem {
  id: string;
  label: string;
  description: string;
  href: string;
  media: HeroMediaSource;
}

export interface CategoryShowcaseData {
  eyebrow: string;
  title: string;
  description: string;
  items: CategoryShowcaseItem[];
}

export interface CollectionShowcaseData {
  eyebrow: string;
  title: string;
  description: string;
}

export interface CraftStoryData {
  eyebrow: string;
  title: string;
  statement: string;
  paragraphs: string[];
  cta: HeroCta;
  media: HeroMediaSource;
}

export interface NeonTeaserData {
  eyebrow: string;
  name: string;
  title: string;
  description: string;
  cta: HeroCta;
}

export interface ContactCtaData {
  eyebrow: string;
  title: string;
  description: string;
  primary: HeroCta;
  secondary: { label: string; href: string; note?: string };
}

/* ---- SUS World ---- */

export type WorldCategory =
  | "people"
  | "city"
  | "sound"
  | "culture"
  | "style"
  | "art";

export interface WorldStoryBody {
  /** Short standalone paragraph. */
  text: string;
  /** Optional secondary image inside the body. */
  media?: HeroMediaSource;
}

export interface WorldStoryProductLink {
  slug: string;
  label: string;
}

export interface WorldStoryCollectionLink {
  slug: string;
  label: string;
}

export interface WorldStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: WorldCategory;
  heroImage: HeroMediaSource;
  /** Additional imagery for the story page gallery. */
  gallery?: HeroMediaSource[];
  featured?: boolean;
  publishedAt?: string;
  author?: string;
  tags?: string[];
  body: WorldStoryBody[];
  /** Optional contextual connection to a look from the shop. */
  product?: WorldStoryProductLink;
  /** Optional contextual connection to a collection. */
  collection?: WorldStoryCollectionLink;
}
