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
import { ShopBrandIntro } from "@/components/shop/ShopBrandIntro";
import { applyFilters, paginate, parseSearchParams, sortProducts } from "@/lib/catalogue";
import { Suspense } from "react";
import { BRAND } from "@/data/brand";

export const metadata: Metadata = {
  title: "Shop — SUS WEARS",
  description: `Shop the SUS WEARS collection — unisex pieces cut in ${BRAND.location.city}, ${BRAND.location.country}. Tees, hoodies, outerwear and accessories, made by ${BRAND.legalName}.`,
  alternates: {
    canonical: "/shop",
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
          <Container className="pb-24 pt-10">
            <ShopBrandIntro />
            <div className="mt-16 border-t border-border pt-16">
              <EmptyState />
            </div>
          </Container>
        )}

        <ShopEditorial />
      </div>
    </>
  );
}
