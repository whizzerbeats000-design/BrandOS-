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