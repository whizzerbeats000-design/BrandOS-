"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { buildHref, type CatalogueSearchParams } from "@/lib/catalogue";
import {
  COLLECTIONS,
  COLOR_OPTIONS,
  PRICE_RANGES,
  SIZE_OPTIONS,
} from "@/data/catalogue";
import { ChevronDownIcon } from "@/components/icons";
import type { ProductCollectionId } from "@/types";

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "type-nav w-full appearance-none rounded-none border-0 border-b border-border bg-transparent py-2.5 pr-9 text-foreground",
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
      <ChevronDownIcon className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
    </div>
  );
}

interface FilterFieldsProps {
  params: CatalogueSearchParams;
  onApplied?: () => void;
  /** Base path for built links — defaults to the full shop catalogue. */
  base?: string;
}

export function FilterFields({ params, onApplied, base = "/shop" }: FilterFieldsProps) {
  const router = useRouter();

  const update = (set: Partial<CatalogueSearchParams>) => {
    router.replace(buildHref(params, { set: { ...set, page: 1 } }, base), { scroll: false });
    onApplied?.();
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
      <FilterSelect
        id="filter-collection"
        label="Collection"
        value={params.collection ?? ""}
        options={[{ id: "", label: "Collection · All" }, ...COLLECTIONS]}
        onChange={(value) => update({ collection: (value || null) as ProductCollectionId | null })}
      />
      <FilterSelect
        id="filter-size"
        label="Size"
        value={params.size ?? ""}
        options={[{ id: "", label: "Size · All" }, ...SIZE_OPTIONS]}
        onChange={(value) => update({ size: value || null })}
      />
      <FilterSelect
        id="filter-colour"
        label="Colour"
        value={params.color ?? ""}
        options={[{ id: "", label: "Colour · All" }, ...COLOR_OPTIONS.map((c) => ({ id: c.id, label: c.name }))]}
        onChange={(value) => update({ color: value || null })}
      />
      <FilterSelect
        id="filter-price"
        label="Price"
        value={params.price ?? ""}
        options={[{ id: "", label: "Price · All" }, ...PRICE_RANGES]}
        onChange={(value) => update({ price: value || null })}
      />
    </div>
  );
}
