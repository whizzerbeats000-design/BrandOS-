/**
 * Pure, environment-independent bag domain logic.
 *
 * Kept free of `window`/`localStorage` so the core commerce rules are
 * unit-testable in any environment. `bag.ts` is a thin persistence wrapper
 * around these functions.
 *
 * Identity: a bag line is uniquely identified by `productId` + `variantId`.
 * Two products may legally share the same variant id across datasources, so
 * merging on `variantId` alone would collapse distinct pieces. The composite
 * `lineKey` is the single source of truth for "same purchasable configuration."
 */

export interface BagLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export const MIN_QTY = 1;
export const MAX_QTY = 10;

export function lineKey(line: { productId: string; variantId: string }): string {
  return `${line.productId}::${line.variantId}`;
}

export function isValidLine(value: unknown): value is BagLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as BagLine;
  return (
    typeof line.productId === "string" &&
    line.productId.length > 0 &&
    typeof line.variantId === "string" &&
    line.variantId.length > 0 &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    line.quantity >= MIN_QTY
  );
}

/** Clamp a quantity to a valid positive integer within [MIN_QTY, MAX_QTY]. */
function clampQuantity(quantity: number): number {
  const int = Math.round(quantity);
  return Math.max(MIN_QTY, Math.min(MAX_QTY, int));
}

/**
 * Prepare a line for the bag: normalise quantity then guard shape. Returns
 * null for a structurally invalid line (no product/variant identity).
 */
function sanitize(line: BagLine): BagLine | null {
  if (typeof line.productId !== "string" || !line.productId) return null;
  if (typeof line.variantId !== "string" || !line.variantId) return null;
  return {
    productId: line.productId,
    variantId: line.variantId,
    quantity: clampQuantity(line.quantity),
  };
}

/**
 * Merge a line into an existing bag. Lines sharing the same product+variant
 * composite identity collapse (quantities sum); other lines are appended.
 * Invalid lines are dropped. Returns a fresh array (no mutation).
 */
export function mergeBag(bag: BagLine[], line: BagLine): BagLine[] {
  const clean = sanitize(line);
  if (!clean) return Array.isArray(bag) ? bag : [];
  if (!Array.isArray(bag)) return [clean];

  const key = lineKey(clean);
  let merged = false;
  const next: BagLine[] = [];

  for (const existing of bag) {
    if (!isValidLine(existing)) continue;
    if (lineKey(existing) === key) {
      next.push({
        productId: clean.productId,
        variantId: clean.variantId,
        quantity: Math.min(MAX_QTY, existing.quantity + clean.quantity),
      });
      merged = true;
    } else {
      next.push(existing);
    }
  }

  if (!merged) next.push(clean);
  return next;
}

/** Drop invalid lines and clamp quantities to a valid range. */
export function normalizeBag(bag: BagLine[]): BagLine[] {
  if (!Array.isArray(bag)) return [];
  const next: BagLine[] = [];
  for (const line of bag) {
    const clean = sanitize(line);
    if (clean) next.push(clean);
  }
  return next;
}

export function bagCount(bag: BagLine[]): number {
  if (!Array.isArray(bag)) return 0;
  return bag.reduce((sum, line) => sum + (isValidLine(line) ? line.quantity : 0), 0);
}
