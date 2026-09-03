import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collections/CollectionIndex";
import { BRAND } from "@/data/brand";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore the SUS WEARS collections — Signature, After Dark and Limited. Full stories, designed as one gesture.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Collections — SUS WEARS",
    description:
      "Signature, After Dark and Limited — the SUS WEARS collections, designed as one gesture.",
    url: `${SITE_URL}/collections`,
    siteName: BRAND.name,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/campaign/campaign-02-hero-mobile.webp`,
        width: 900,
        height: 1600,
        alt: "SUS WEARS — Signature, After Dark and Limited collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections — SUS WEARS",
    description: "Signature, After Dark and Limited — the SUS WEARS collections.",
    images: [`${SITE_URL}/images/campaign/campaign-02-hero-mobile.webp`],
  },
};

export default function CollectionsPage() {
  return <CollectionIndex />;
}
