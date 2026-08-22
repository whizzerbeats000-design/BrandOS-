import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";

export const metadata: Metadata = {
  title: "Editorial",
  description:
    "Stories, craft, and the world of SUS WEARS — from the atelier to the streets.",
  alternates: {
    canonical: "/editorial",
  },
};

export default function EditorialRoute() {
  return <EditorialPage />;
}
