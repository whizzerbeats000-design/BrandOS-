import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { BRAND } from "@/data/brand";
import { SITE_URL } from "@/lib/site";

const HOME_TITLE = `${BRAND.name} — Contemporary Unisex Fashion, Lagos, Nigeria`;
const HOME_DESCRIPTION =
  "Contemporary unisex fashion from Lagos, Nigeria — cut since 2019 to fit the body, not the catalogue.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  return <HomePage />;
}
