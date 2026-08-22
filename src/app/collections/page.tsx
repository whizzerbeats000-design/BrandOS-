import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collections/CollectionIndex";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore the SUS WEARS collections — Signature, After Dark and Limited. Full stories, designed as one gesture.",
  alternates: {
    canonical: "/collections",
  },
};

export default function CollectionsPage() {
  return <CollectionIndex />;
}
