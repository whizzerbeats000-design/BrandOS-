import type { Product, Collection } from "@/types";
import { CATEGORIES, COLOR_OPTIONS, PRODUCTS, SIZE_OPTIONS } from "@/data/catalogue";

/**
 * Catalogue validation — the build/test-time gate that makes real inventory
 * fail loudly instead of silently shipping a broken PDP or shop.
 *
 * The catalogue is intentionally empty before launch (see tests/data-integrity
 * and tests/catalogue). This module is the contract that protects the moment
 * real stock is introduced: dangling image paths, referential breaks between
 * variants/sizes/colours, duplicate slugs and missing required fields are
 * caught here, not at runtime in the browser.
 *
 * Deliberately Node-free: these pure functions run in any environment. The
 * only host-dependent check (image files existing on disk) runs in the test
 * layer via `validateImagePathsOnDisk`, which is not part of the client-shared
 * module graph.
 */

export type CatalogueIssueSeverity = "error" | "warning";

export interface CatalogueIssue {
  severity: CatalogueIssueSeverity;
  /** Where the problem is, e.g. `products[0].slug` or image path. */
  path: string;
  message: string;
}

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id).filter((id) => id !== "all");
export const SIZE_IDS = SIZE_OPTIONS.map((s) => s.id);
export const COLOR_IDS = COLOR_OPTIONS.map((c) => c.id);
export const PRODUCT_COLLECTION_IDS = ["signature", "after-dark", "limited"];
export const AVAILABILITY_VALUES = ["in-stock", "low-stock", "sold-out"] as const;

export function isDanglingImagePath(src: string): boolean {
  return !src.startsWith("/") || src.includes("..");
}

/** Validate an array of products. Empty arrays are valid (pre-launch). */
export function validateProducts(products: readonly Product[]): CatalogueIssue[] {
  const issues: CatalogueIssue[] = [];
  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();

  products.forEach((product, index) => {
    const at = (field: string) => `PRODUCTS[${index}]${field ? "." + field : ""}`;

    if (!product.name || typeof product.name !== "string") {
      issues.push({ severity: "error", path: at("name"), message: "Missing product name." });
    }
    if (!product.slug || typeof product.slug !== "string") {
      issues.push({ severity: "error", path: at("slug"), message: "Missing product slug." });
    } else if (seenSlugs.has(product.slug)) {
      issues.push({ severity: "error", path: at("slug"), message: `Duplicate slug "${product.slug}".` });
    } else {
      seenSlugs.add(product.slug);
    }

    if (seenIds.has(product.id)) {
      issues.push({ severity: "error", path: at("id"), message: `Duplicate id "${product.id}".` });
    } else {
      seenIds.add(product.id);
    }

    if (!product.description || !product.description.trim()) {
      issues.push({ severity: "error", path: at("description"), message: "Missing product description." });
    }

    if (!CATEGORY_IDS.includes(product.category)) {
      issues.push({
        severity: "error",
        path: at("category"),
        message: `Unknown category "${String(product.category)}".`,
      });
    }

    if (!PRODUCT_COLLECTION_IDS.includes(product.collection)) {
      issues.push({
        severity: "error",
        path: at("collection"),
        message: `Unknown collection "${String(product.collection)}".`,
      });
    }

    if (!Number.isFinite(product.price) || product.price < 0) {
      issues.push({
        severity: "error",
        path: at("price"),
        message: `Price must be a finite number >= 0 (got ${String(product.price)}).`,
      });
    }

    if (!product.images || product.images.length === 0) {
      issues.push({ severity: "error", path: at("images"), message: "At least one image is required." });
    } else {
      product.images.forEach((img, i) => {
        if (!img?.src) {
          issues.push({
            severity: "error",
            path: at(`images[${i}].src`),
            message: "Image is missing a src.",
          });
          return;
        }
        if (isDanglingImagePath(img.src)) {
          issues.push({
            severity: "error",
            path: at(`images[${i}].src`),
            message: `Image path must be an absolute site path (got "${img.src}").`,
          });
        }
        if (!img.alt || !img.alt.trim()) {
          issues.push({
            severity: "warning",
            path: at(`images[${i}].alt`),
            message: `Image alt text is empty (${img.src}).`,
          });
        }
      });
    }

    if (product.productImage && isDanglingImagePath(product.productImage.src)) {
      issues.push({
        severity: "error",
        path: at("productImage.src"),
        message: `ProductImage path must be an absolute site path (got "${product.productImage.src}").`,
      });
    }

    product.sizes.forEach((size) => {
      if (!SIZE_IDS.includes(size)) {
        issues.push({
          severity: "error",
          path: at(`sizes`),
          message: `Unknown size "${String(size)}".`,
        });
      }
    });
    product.colors.forEach((color) => {
      if (!COLOR_IDS.includes(color)) {
        issues.push({
          severity: "error",
          path: at(`colors`),
          message: `Unknown colour "${String(color)}".`,
        });
      }
    });

    if (!product.variants || product.variants.length === 0) {
      issues.push({ severity: "error", path: at("variants"), message: "At least one variant is required." });
    } else {
      product.variants.forEach((variant, i) => {
        const vat = at(`variants[${i}]`);
        if (!product.colors.includes(variant.color)) {
          issues.push({
            severity: "error",
            path: `${vat}.color`,
            message: `Variant colour "${variant.color}" is not declared in product.colors.`,
          });
        }
        if (variant.size !== null && !product.sizes.includes(variant.size)) {
          issues.push({
            severity: "error",
            path: `${vat}.size`,
            message: `Variant size "${variant.size}" is not declared in product.sizes.`,
          });
        }
        if (!AVAILABILITY_VALUES.includes(variant.availability)) {
          issues.push({
            severity: "error",
            path: `${vat}.availability`,
            message: `Unknown availability "${String(variant.availability)}".`,
          });
        }
        if (!Number.isInteger(variant.inventory) || variant.inventory < 0) {
          issues.push({
            severity: "error",
            path: `${vat}.inventory`,
            message: "Inventory must be a non-negative integer.",
          });
        }
      });

      // Referential completeness: every declared colour and size must be
      // purchasable through at least one variant.
      for (const color of product.colors) {
        if (!product.variants.some((v) => v.color === color)) {
          issues.push({
            severity: "error",
            path: at(`colors`),
            message: `Colour "${color}" has no variants.`,
          });
        }
      }
      const usesNullSize = product.variants.some((v) => v.size === null);
      if (usesNullSize) {
        // One-size product: allow the single variant to carry the size.
        for (const size of product.sizes) {
          if (!product.variants.some((v) => v.size === null || v.size === size)) {
            issues.push({
              severity: "error",
              path: at(`sizes`),
              message: `Size "${size}" has no variant.`,
            });
          }
        }
      } else {
        for (const size of product.sizes) {
          if (!product.variants.some((v) => v.size === size)) {
            issues.push({
              severity: "error",
              path: at(`sizes`),
              message: `Size "${size}" has no variant.`,
            });
          }
        }
      }
    }

    // Product-level availability must reconcile with variant availability.
    const allSoldOut = product.variants.every((v) => v.availability === "sold-out");
    const anyInStock = product.variants.some((v) => v.availability !== "sold-out");
    if (allSoldOut && product.availability !== "sold-out") {
      issues.push({
        severity: "warning",
        path: at("availability"),
        message: "All variants are sold out but product.availability is not sold-out.",
      });
    }
    if (anyInStock && product.availability === "sold-out") {
      issues.push({
        severity: "warning",
        path: at("availability"),
        message: "Some variants are purchasable but product.availability is sold-out.",
      });
    }
  });

  return issues;
}

/** Validate collections against the products they reference. */
export function validateCollections(
  collections: readonly Collection[],
  products: readonly Product[],
): CatalogueIssue[] {
  const issues: CatalogueIssue[] = [];
  const bySlug = new Set(products.map((p) => p.slug));
  const seenSlugs = new Set<string>();

  collections.forEach((collection, index) => {
    const at = `COLLECTIONS[${index}].${collection.slug || "?"}`;
    if (seenSlugs.has(collection.slug)) {
      issues.push({ severity: "error", path: `${at}.slug`, message: `Duplicate collection slug "${collection.slug}".` });
    } else {
      seenSlugs.add(collection.slug);
    }

    const refs = [
      ...(collection.featuredProductIds ?? []),
      ...(collection.productIds ?? []),
    ];
    refs.forEach((slug) => {
      if (!bySlug.has(slug)) {
        issues.push({
          severity: "warning",
          path: `${at}.featuredProductIds`,
          message: `Collection references missing product slug "${slug}".`,
        });
      }
    });
  });

  return issues;
}

/** Convenience: validate the live catalogue and throw on any error. */
export function assertCatalogue(
  products: readonly Product[] = PRODUCTS,
  collections?: readonly Collection[],
): void {
  const all = [
    ...validateProducts(products),
    ...(collections ? validateCollections(collections, products) : []),
  ];
  const errors = all.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    const list = errors.map((e) => `  [${e.path}] ${e.message}`).join("\n");
    throw new Error(`Catalogue validation failed with ${errors.length} error(s):\n${list}`);
  }
}
