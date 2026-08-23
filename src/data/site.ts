/* ============================================================
   SUS WEARS — Site / Market Config
   Default market + currency + the utility-bar messaging.
   Currency switching belongs to a later commerce phase; this
   is the single source the shell reads from today.
   ============================================================ */

export const MARKET = {
  country: "Nigeria",
  currency: {
    code: "NGN",
    symbol: "₦",
  },
} as const;

/** Utility-bar callout. */
export const SHIPPING_MESSAGE = "Lagos, Nigeria";