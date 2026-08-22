import { MARKET } from "@/data/site";

export function formatPrice(price: number, currency: string = MARKET.currency.code): string {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
}
