import { redirect } from "next/navigation";

/**
 * Pre-launch checkout placeholder.
 *
 * There is no payment backend yet, so the honest ordering path lives on the
 * cart ("Contact to order", which opens WhatsApp/email with the bag contents).
 * This route now forwards there to avoid a second, competing checkout
 * experience. It stays routed so a real checkout can land here later.
 */
export default function CheckoutRoute() {
  redirect("/cart");
}