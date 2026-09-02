import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles/fonts.css";
import { AppShell } from "@/components/layout/AppShell";
import { BRAND } from "@/data/brand";

const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sus-wears.vercel.app";
  try {
    return new URL(raw).href.replace(/\/$/, "");
  } catch {
    return "https://sus-wears.vercel.app";
  }
})();

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
    images: [
      {
        url: `${SITE_URL}/images/campaign/campaign-05-hero-mobile.webp`,
        width: 1600,
        height: 900,
        alt: "SUS WEARS — Contemporary unisex fashion from Lagos, Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [`${SITE_URL}/images/campaign/campaign-05-hero-mobile.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F1EEE7",
  colorScheme: "light",
};

function JSONLD() {
  const organization: Record<string, unknown> = {
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
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.location.address,
      addressLocality: BRAND.location.city,
      addressRegion: BRAND.location.state,
      addressCountry: BRAND.location.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${BRAND.contact.whatsapp}`,
      email: BRAND.contact.email,
      contactType: "customer service",
      availableLanguage: ["en"],
    },
    sameAs: [
      BRAND.social.instagram,
      BRAND.social.facebook,
      BRAND.social.tiktok,
    ],
  };
  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: SITE_URL,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
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
