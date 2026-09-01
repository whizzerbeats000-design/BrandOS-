import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { BRAND } from "@/data/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — Contemporary Unisex Fashion, Lagos, Nigeria`,
  description:
    "Contemporary unisex fashion from Lagos, Nigeria — cut since 2019 to fit the body, not the catalogue.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
