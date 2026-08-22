import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About — SUS WEARS",
  description:
    "The story of SUS WEARS — founded by Mr. Shedrack in Lagos in 2019. Unisex fashion built on tailoring craft, contemporary style, and attention to detail.",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return <AboutPage />;
}
