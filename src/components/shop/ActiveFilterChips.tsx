import Link from "next/link";
import { buildHref, getActiveFilters, type CatalogueSearchParams } from "@/lib/catalogue";
import { CloseIcon } from "@/components/icons";

interface ActiveFilterChipsProps {
  params: CatalogueSearchParams;
  /** Base path for built links — defaults to the full shop catalogue. */
  base?: string;
}

export function ActiveFilterChips({ params, base = "/shop" }: ActiveFilterChipsProps) {
  const active = getActiveFilters(params);

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="type-metadata text-foreground-muted">Active:</span>
      {active.map((filter) => (
        <Link
          key={filter.key}
          href={buildHref(params, { clear: [filter.key] }, base)}
          className="type-nav inline-flex items-center gap-2 border border-border bg-background-secondary px-3 py-1.5 text-foreground-secondary transition-colors duration-standard ease-standard hover:border-accent/50 hover:text-foreground"
        >
          {filter.label}
          <CloseIcon className="h-3 w-3" />
        </Link>
      ))}
      <Link
        href={base}
        className="type-nav text-foreground-muted underline-offset-4 transition-colors duration-standard ease-standard hover:text-accent hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}
