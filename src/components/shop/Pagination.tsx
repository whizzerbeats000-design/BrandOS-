import Link from "next/link";
import { cn } from "@/lib/cn";
import { buildHref, type CatalogueSearchParams } from "@/lib/catalogue";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  params: CatalogueSearchParams;
  /** Base path for built links — defaults to the full shop catalogue. */
  base?: string;
}

function pageHref(params: CatalogueSearchParams, page: number, base: string): string {
  return buildHref(params, { set: { page } }, base);
}

export function Pagination({ page, totalPages, params, base = "/shop" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 border-t border-border pt-8">
      <Link
        href={pageHref(params, page - 1, base)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard",
          page <= 1 ? "pointer-events-none opacity-40" : "hover:text-accent",
        )}
        aria-label="Previous page"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Link>

      {pages.map((number) => {
        const active = number === page;
        return (
          <Link
            key={number}
            href={pageHref(params, number, base)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "type-nav inline-flex h-11 w-11 items-center justify-center border transition-colors duration-standard ease-standard",
              active
                ? "border-accent text-accent"
                : "border-transparent text-foreground-muted hover:border-border hover:text-foreground",
            )}
          >
            {number}
          </Link>
        );
      })}

      <Link
        href={pageHref(params, page + 1, base)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard",
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:text-accent",
        )}
        aria-label="Next page"
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </nav>
  );
}
