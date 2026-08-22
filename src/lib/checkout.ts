import type { BagLine } from "@/lib/bag";

/**
 * Checkout integration point — Buy Now entry.
 *
 * A real payment gateway is a later-phase concern. Until then every Buy Now
 * attempt resolves to a truthful result: the piece is saved to the bag and the
 * caller is told checkout itself is not wired yet.
 */
export interface CheckoutResult {
  ok: boolean;
  reason?: "not-available";
  message: string;
}

export async function startCheckout(bag: BagLine[]): Promise<CheckoutResult> {
  if (bag.length === 0) {
    return { ok: false, reason: "not-available", message: "Your bag is empty." };
  }
  return {
    ok: false,
    reason: "not-available",
    message: "Checkout opens in a later phase — your piece is saved in the bag.",
  };
}
