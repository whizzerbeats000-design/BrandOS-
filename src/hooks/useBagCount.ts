"use client";

import { useCallback, useSyncExternalStore } from "react";
import { BAG_UPDATE_EVENT, getBagCount } from "@/lib/bag";

/** Tracks mutable bag state without a bespoke store.
 *  Subscribes to bag mutations and cross-tab storage writes. */
function subscribe(callback: () => void): () => void {
  window.addEventListener(BAG_UPDATE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(BAG_UPDATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBagCount(): number {
  const getSnapshot = useCallback(() => getBagCount(), []);
  const getServerSnapshot = useCallback(() => 0, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}