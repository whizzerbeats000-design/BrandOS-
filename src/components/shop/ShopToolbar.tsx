"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { buildHref, getActiveFilters, type CatalogueSearchParams } from "@/lib/catalogue";
import { SORT_OPTIONS } from "@/data/catalogue";
import { ChevronDownIcon, SlidersIcon } from "@/components/icons";
import { FilterDrawer } from "@/components/shop/FilterPanel";
import { SearchOverlay } from "@/components/shop/SearchOverlay";

interface ShopToolbarProps {
  total: number;
  params: CatalogueSearchParams;
}

export function ShopToolbar({ total, params }: ShopToolbarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = getActiveFilters(params).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="type-metadata text-foreground-muted">
          {total} piece{total === 1 ? "" : "s"}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <SearchOverlay />

          <div className="relative">
            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={params.sort}
              onChange={(event) =>
                router.replace(buildHref(params, { set: { sort: event.target.value as CatalogueSearchParams["sort"] } }), {
                  scroll: false,
                })
              }
              className={cn(
                "type-nav appearance-none rounded-none border-0 border-b border-border bg-transparent py-2.5 pr-8 text-foreground",
                "transition-colors duration-standard ease-standard hover:border-foreground-muted focus:border-accent focus:outline-none",
              )}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id} className="bg-background text-foreground">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          </div>

          {params.q ? (
            <button
              type="button"
              className={cn(
                "type-nav inline-flex items-center gap-2 border-b border-border py-2.5 text-foreground-secondary transition-colors duration-standard ease-standard hover:border-accent hover:text-accent",
              )}
              onClick={() => router.replace(buildHref(params, { set: { q: null, page: 1 } }), { scroll: false })}
            >
              Searching “{params.q}”
              <span aria-hidden="true">×</span>
            </button>
          ) : null}

          <button
            type="button"
            className={cn(
              "type-nav inline-flex items-center gap-2 border-b border-border py-2.5 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent lg:hidden",
              activeCount > 0 && "border-accent/60 text-accent",
            )}
            onClick={() => setDrawerOpen(true)}
          >
            <SlidersIcon className="h-4 w-4" />
            Filters
            {activeCount > 0 ? <span className="text-accent">({activeCount})</span> : null}
          </button>
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} params={params} />
    </div>
  );
}