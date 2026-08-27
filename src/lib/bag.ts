"use client";

import {
  MAX_QTY,
  bagCount as coreBagCount,
  mergeBag,
  normalizeBag,
  type BagLine,
} from "@/lib/bagCore";

/**
 * Cart persistence — the client-side bag.
 *
 * A thin wrapper over the pure bag domain logic in `bagCore.ts`: reads/writes
 * localStorage, normalises stored data on read, and broadcasts a live-update
 * event so the shell and cart stay in sync across tabs.
 */

export type { BagLine } from "@/lib/bagCore";
export { MAX_QTY } from "@/lib/bagCore";

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

function readRaw(): BagLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return normalizeBag(parsed as BagLine[]);
  } catch {
    return [];
  }
}

export function getBag(): BagLine[] {
  return readRaw();
}

export function getBagCount(): number {
  return coreBagCount(readRaw());
}

/** Persist a bag and notify listeners. Shared by cart mutations. */
export function setBag(next: BagLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeBag(next)));
  } catch {
    /* storage unavailable — the interaction still resolves */
  }
  notify();
}

export async function addToBag(line: BagLine): Promise<BagResult> {
  if (line.quantity < 1 || !Number.isInteger(line.quantity)) {
    return { ok: false, error: "Please choose a quantity." };
  }
  const next = mergeBag(getBag(), { ...line, quantity: Math.min(line.quantity, MAX_QTY) });
  setBag(next);
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
