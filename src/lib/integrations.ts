/* ============================================================
   SUS WEARS — Integrations
   Central contact integration points.
   ============================================================ */

/* ---- WhatsApp ---- */

const DEFAULT_WHATSAPP_NUMBER = "2349070970886";

/** E.164 business number, e.g. "2348012345678". Override via env. */
export function getWhatsAppNumber(): string {
  const value = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER;
  return value.replace(/[^\d]/g, "");
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello SUS WEARS — I'd like to make an enquiry.";

const DEFAULT_ENQUIRY_EMAIL = "suswears469@gmail.com";

export function buildWhatsAppUrl(message?: string): string {
  const number = getWhatsAppNumber();
  if (!number) return "#";
  const text = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Product enquiry pathway. Uses WhatsApp when a business number is
 * configured, otherwise falls back to email. The number is never rendered.
 */
export function buildProductEnquiryUrl(productName: string): {
  href: string;
  channel: "whatsapp" | "email";
} {
  if (whatsappEnabled()) {
    return {
      href: buildWhatsAppUrl(`Hello SUS WEARS — I'd like to ask about the ${productName}.`),
      channel: "whatsapp",
    };
  }
  return {
    href: `mailto:${DEFAULT_ENQUIRY_EMAIL}?subject=${encodeURIComponent(`Enquiry — ${productName}`)}`,
    channel: "email",
  };
}

export function whatsappEnabled(): boolean {
  return getWhatsAppNumber().length > 0;
}

/** An order line summary used to build the pre-launch order message. */
export interface OrderMessageLine {
  name: string;
  colorName: string;
  sizeLabel: string;
  quantity: number;
  linePrice: number;
}

const ORDER_INTRO = "Hello SUS WEARS — I'd like to order:";

/**
 * Build the human-readable order message from the client bag. This is a copy
 * the customer can review before sending — it is never treated as an
 * authoritative price (prices are re-confirmed by the atelier upon receipt).
 */
export function formatOrderMessage(
  lines: OrderMessageLine[],
  subtotal: number,
  formatPriceFn: (price: number) => string,
): string {
  const body = lines.map((line, index) => {
    const size = line.sizeLabel && line.sizeLabel !== "One size" ? ` · ${line.sizeLabel}` : "";
    const colour = line.colorName ? ` · ${line.colorName}` : "";
    return `${index + 1}. ${line.name}${colour}${size} × ${line.quantity} — ${formatPriceFn(line.linePrice)}`;
  });
  return `${ORDER_INTRO}\n${body.join("\n")}\nTotal: ${formatPriceFn(subtotal)}`;
}

/**
 * Build the pre-launch "contact to order" destination for a set of bag lines.
 * Uses WhatsApp when a business number is configured, otherwise falls back to
 * email, so the customer always has a real, honest next step with the bag
 * contents pre-filled. No checkout is performed here today.
 */
export function buildOrderContactUrl(
  message: string,
): { href: string; channel: "whatsapp" | "email"; handoffMessage: string } {
  if (whatsappEnabled()) {
    return { href: buildWhatsAppUrl(message), channel: "whatsapp", handoffMessage: message };
  }
  return {
    href: `mailto:${DEFAULT_ENQUIRY_EMAIL}?subject=${encodeURIComponent("Order — SUS WEARS bag")}&body=${encodeURIComponent(message)}`,
    channel: "email",
    handoffMessage: message,
  };
}