import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";
import { BRAND } from "@/data/brand";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of SUS WEARS — founded by Mr. Shedrack in Lagos in 2019. Unisex fashion built on tailoring craft, contemporary style, and attention to detail.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About — SUS WEARS",
    description:
      "The story of SUS WEARS — founded by Mr. Shedrack in Lagos in 2019. Unisex fashion built on tailoring craft.",
    url: `${SITE_URL}/about`,
    siteName: BRAND.name,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/about-hero.webp`,
        width: 1254,
        height: 1254,
        alt: "SUS WEARS — contemporary unisex fashion from Lagos, Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — SUS WEARS",
    description: "The story of SUS WEARS — unisex fashion built on tailoring craft in Lagos, Nigeria.",
    images: [`${SITE_URL}/images/about-hero.webp`],
  },
};

export default function About() {
  return <AboutPage />;
}
