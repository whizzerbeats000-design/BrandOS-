"use client";

/**
 * Cart abstraction — integration point for the full bag phase (Prompt 10).
 *
 * A minimal, honest client-side bag: persists to localStorage, merges lines,
 * and reports real state. The complete cart UI/checkout belongs to a later
 * phase; this is the contract they will consume.
 */

export interface BagLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface BagResult {
  ok: boolean;
  error?: string;
}

const STORAGE_KEY = "sus:bag";

/** Broadcast when the bag mutates so shell components can refresh live counts. */
export const BAG_UPDATE_EVENT = "sus:bag-updated";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BAG_UPDATE_EVENT));
}

export function getBag(): BagLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is BagLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as BagLine).productId === "string" &&
        typeof (line as BagLine).variantId === "string" &&
        typeof (line as BagLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function getBagCount(): number {
  return getBag().reduce((sum, line) => sum + line.quantity, 0);
}

function persist(bag: BagLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
  } catch {
    /* storage unavailable — the interaction still resolves */
  }
}

export async function addToBag(line: BagLine): Promise<BagResult> {
  if (line.quantity < 1 || !Number.isInteger(line.quantity)) {
    return { ok: false, error: "Please choose a quantity." };
  }
  const bag = getBag();
  const existing = bag.find((l) => l.variantId === line.variantId);
  if (existing) {
    existing.quantity += line.quantity;
  } else {
    bag.push({ ...line });
  }
  persist(bag);
  notify();
  return { ok: true };
}

export function clearBag(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  notify();
}
