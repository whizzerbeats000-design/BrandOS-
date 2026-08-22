import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Bag — SUS WEARS",
  description: "Review the pieces in your bag before checkout.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartRoute() {
  return <CartPage />;
}