import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles/fonts.css";
import { AppShell } from "@/components/layout/AppShell";
import { BRAND } from "@/data/brand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const BRAND_TITLE = `${BRAND.name} — Unisex Fashion House`;
const BRAND_DESCRIPTION =
  "Contemporary unisex fashion from Lagos, Nigeria — cut since 2019 to fit the body, not the catalogue.";

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
    "Nigerian fashion",
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <JSONLD />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
