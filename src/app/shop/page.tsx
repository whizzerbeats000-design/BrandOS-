import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { CategoryNav } from "@/components/shop/CategoryNav";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { ProductGrid, ProductGridSkeleton } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";
import { EmptyState } from "@/components/shop/EmptyState";
import { ShopEditorial } from "@/components/shop/ShopEditorial";
import { applyFilters, paginate, parseSearchParams, sortProducts } from "@/lib/catalogue";
import { Suspense } from "react";
import { BRAND } from "@/data/brand";
import { SITE_URL } from "@/lib/site";

const SHOP_OG_IMAGE = `${SITE_URL}/images/campaign/campaign-05-hero-mobile.webp`;

export const metadata: Metadata = {
  title: "Shop",
  description: `Shop the SUS WEARS collection — unisex pieces cut in ${BRAND.location.city}, ${BRAND.location.country}. Tees, hoodies, outerwear and accessories, made by ${BRAND.legalName}.`,
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop — SUS WEARS",
    description: `Unisex pieces cut in ${BRAND.location.city}, ${BRAND.location.country} — tees, hoodies, outerwear and accessories by ${BRAND.legalName}.`,
    url: `${SITE_URL}/shop`,
    siteName: BRAND.name,
    type: "website",
    images: [
      {
        url: SHOP_OG_IMAGE,
        width: 900,
        height: 1600,
        alt: "SUS WEARS unisex clothing collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop — SUS WEARS",
    description: `Unisex pieces cut in ${BRAND.location.city}, ${BRAND.location.country} — by ${BRAND.legalName}.`,
    images: [SHOP_OG_IMAGE],
  },
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = parseSearchParams(await searchParams);
  const sorted = sortProducts(applyFilters(params), params.sort);
  const { items, total, totalPages, page } = paginate(sorted, params.page);

  return (
    <>
      <ShopHeader />
      <div className="flex flex-col">
        {items.length > 0 ? (
          <Container className="flex flex-col gap-10 pb-24 pt-10 lg:gap-12">
            <CategoryNav params={params} />

            <Suspense fallback={<div className="h-12 animate-pulse bg-background-secondary" />}>
              <ShopToolbar total={total} params={params} />
            </Suspense>

            <Suspense fallback={null}>
              <FilterPanel params={params} className="hidden border-b border-border pb-6 lg:block" />
            </Suspense>

            <ActiveFilterChips params={params} />

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={items} />
            </Suspense>

            <Pagination page={page} totalPages={totalPages} params={params} />
          </Container>
        ) : (
          <EmptyState />
        )}

        {items.length > 0 && <ShopEditorial />}
      </div>
    </>
  );
}
