import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Head from "next/head";
import "./globals.css";
import "../styles/fonts.css";
import { AppShell } from "@/components/layout/AppShell";
import { BRAND } from "@/data/brand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const BRAND_TITLE = `${BRAND.name} — Luxury Fashion House`;
const BRAND_DESCRIPTION =
  "Unisex streetwear from Lagos, Nigeria — cut since 2019 to fit the body, not the catalogue.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND_TITLE,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    BRAND.name,
    BRAND.legalName,
    "unisex fashion",
    "luxury streetwear",
    "African fashion",
    "Lagos",
    "Nigeria",
  ],
  authors: [{ name: BRAND.founder }],
  creator: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND.name,
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F1EEE7",
  colorScheme: "light",
};

function JSONLD() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/sus-wears-mark.svg`,
    description: BRAND_DESCRIPTION,
    founder: {
      "@type": "Person",
      name: BRAND.founder,
    },
    foundingLocation: {
      "@type": "Place",
      name: BRAND.location.flat,
    },
    foundingDate: `${BRAND.foundedYear}-01-01`,
    brand: BRAND.name,
    aggregateRating: undefined, // intentionally omitted as per instructions
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Head>
          <JSONLD />
        </Head>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
