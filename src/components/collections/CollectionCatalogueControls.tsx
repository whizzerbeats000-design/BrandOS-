"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { buildHref, type CatalogueSearchParams } from "@/lib/catalogue";
import { getColorOption, SORT_OPTIONS } from "@/data/catalogue";
import { ChevronDownIcon, SlidersIcon } from "@/components/icons";
import type { CollectionFilterOptions } from "@/lib/collections";
import type { Collection } from "@/types";

interface CollectionCatalogueControlsProps {
  collection: Collection;
  params: CatalogueSearchParams;
  options: CollectionFilterOptions;
  base: string;
  /** Which layout this instance powers — keeps DOM ids unique. */
  layout: "mobile" | "desktop";
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

function Field({ id, label, value, options, onChange, className }: FieldProps) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "type-nav w-full appearance-none rounded-none border-0 border-b border-border bg-transparent py-2.5 pr-8 text-foreground",
          "transition-colors duration-standard ease-standard hover:border-foreground-muted focus:border-accent focus:outline-none",
          value === "" && "text-foreground-muted",
        )}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id} className="bg-background text-foreground">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
    </div>
  );
}

/** Interactive filter + sort controls for a collection catalogue. */
export function CollectionCatalogueControls({
  collection,
  params,
  options,
  base,
  layout,
}: CollectionCatalogueControlsProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = params.size || params.color || params.price ? 1 : 0;
  const prefix = `${collection.slug}-${layout}`;

  const apply = (set: Partial<CatalogueSearchParams>) => {
    router.replace(buildHref(params, { set: { ...set, page: 1 } }, base), { scroll: false });
  };

  const showSize = options.sizes.length > 1;
  const showColor = options.colors.length > 1;
  const showPrice = options.priceRanges.length > 1;
  const hasFilters = showSize || showColor || showPrice;

  const fields = (
    <div className="flex flex-col gap-6">
      {showSize ? (
        <Field
          id={`${prefix}-filter-size`}
          label="Size"
          value={params.size ?? ""}
          options={[{ id: "", label: "Size · All" }, ...options.sizes.map((s) => ({ id: s, label: `Size ${s}` }))]}
          onChange={(value) => apply({ size: value || null })}
        />
      ) : null}
      {showColor ? (
        <Field
          id={`${prefix}-filter-colour`}
          label="Colour"
          value={params.color ?? ""}
          options={[{ id: "", label: "Colour · All" }, ...options.colors.map((id) => ({ id, label: getColorOption(id).name }))]}
          onChange={(value) => apply({ color: value || null })}
        />
      ) : null}
      {showPrice ? (
        <Field
          id={`${prefix}-filter-price`}
          label="Price"
          value={params.price ?? ""}
          options={[{ id: "", label: "Price · All" }, ...options.priceRanges]}
          onChange={(value) => apply({ price: value || null })}
        />
      ) : null}
    </div>
  );

  const sortField = (
    <Field
      id={`${prefix}-sort`}
      label="Sort"
      value={params.sort}
      options={SORT_OPTIONS}
      onChange={(value) => apply({ sort: value as CatalogueSearchParams["sort"] })}
    />
  );

  if (layout === "desktop") {
    return (
      <div className="hidden flex-col gap-8 lg:flex">
        {hasFilters ? (
          <div className="flex flex-col gap-4">
            <h3 className="type-nav text-foreground-muted">Refine</h3>
            {fields}
          </div>
        ) : null}
        <div className="flex flex-col gap-4">
          <h3 className="type-nav text-foreground-muted">Sort</h3>
          {sortField}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={`${collection.slug}-mobile-filters`}
          className={cn(
            "type-nav inline-flex items-center gap-2 border-b border-border py-2.5 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent",
            activeCount > 0 && "border-accent/60 text-accent",
          )}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <SlidersIcon className="h-4 w-4" />
          Filters
          {activeCount > 0 ? <span className="text-accent">({activeCount})</span> : null}
        </button>
        <div className="relative w-40">
          {sortField}
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={`${collection.slug}-mobile-filters`}
          className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-border pb-6 lg:hidden"
        >
          {hasFilters ? (
            fields
          ) : (
            <p className="type-metadata col-span-2 text-foreground-muted">
              No filters needed — every piece in this collection is shown.
            </p>
          )}
        </div>
      ) : null}
    </>
  );
}
