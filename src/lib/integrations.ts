/* ============================================================
   SUS WEARS — Integrations
   Central contact + AI concierge ("Neon") integration points.
   Placeholder values are deliberately inert until real
   credentials are supplied via env. No UI lives here.
   ============================================================ */

/* ---- WhatsApp ---- */

const DEFAULT_WHATSAPP_NUMBER = "09070970886";

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

/* ---- AI concierge "Neon" ---- */

/** Client-facing name of the in-session fashion advisor. */
export const AI_NEON = {
  name: "Neon",
  role: "SUS WEARS fashion advisor",
  endpoint: "/api/ai/neon",
} as const;

/** Gateway reference — keeps the chat admin token out of client bundles. */
export function getNeonAdminToken(): string | null {
  const token = process.env.AI_ADMIN_TOKEN;
  return token && token.trim().length > 0 && token.trim() !== "YOUR_ADMIN_TOKEN_HERE"
    ? token.trim()
    : null;
}

export function neonEnabled(): boolean {
  return getNeonAdminToken() !== null;
}

/**
 * Client-visible gate for the Neon entry button. Server access still
 * requires the admin token; this only decides whether the button is shown.
 */
export function neonVisible(): boolean {
  return process.env.NEXT_PUBLIC_AI_NEON === "true";
}