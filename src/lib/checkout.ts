import { resolveBag, type BagLineDisplay } from "@/lib/bagMeta";
import { formatPrice } from "@/lib/format";
import { buildOrderContactUrl, formatOrderMessage } from "@/lib/integrations";
import type { BagLine } from "@/lib/bag";

/**
 * Checkout integration point — the honest pre-launch order handoff.
 *
 * A real payment gateway is a later-phase concern. Until it exists the "Contact
 * to order" action resolves to the brand's real ordering path: the bag contents
 * are formatted into a message the customer sends to the atelier via WhatsApp
 * (or email as a fallback). No payment is attempted or implied.
 *
 * IMPORTANT: the message is a customer-facing summary for the atelier, never an
 * authoritative price. Prices, stock and totals are re-confirmed by the seller
 * on receipt, and a future server-side checkout must price from canonical
 * catalogue data (see docs/SECURITY-FUTURE-COMMERCE.md).
 */
export interface OrderHandoff {
  ok: boolean;
  reason?: "empty";
  message: string;
  result?: {
    href: string;
    channel: "whatsapp" | "email";
    /** The pre-filled order message the customer will send. */
    handoffMessage: string;
  };
}

export async function startCheckout(bag: BagLine[]): Promise<OrderHandoff> {
  const items = resolveBag(bag);
  if (items.length === 0) {
    return { ok: false, reason: "empty", message: "Your bag is empty." };
  }

  const subtotal = items.reduce((sum, item) => sum + item.linePrice, 0);
  const lines = items.map((item: BagLineDisplay) => ({
    name: item.product.name,
    colorName: item.colorName,
    sizeLabel: item.sizeLabel,
    quantity: item.line.quantity,
    linePrice: item.linePrice,
  }));
  const handoffMessage = formatOrderMessage(lines, subtotal, (price) => formatPrice(price));
  const result = buildOrderContactUrl(handoffMessage);

  return {
    ok: true,
    message:
      result.channel === "whatsapp"
        ? "We'll confirm your order on WhatsApp."
        : "We'll confirm your order by email.",
    result,
  };
}