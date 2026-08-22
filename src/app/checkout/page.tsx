import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your bag and contact us to complete your SUS WEARS order.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
