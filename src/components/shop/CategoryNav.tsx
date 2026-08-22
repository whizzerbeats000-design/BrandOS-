import Link from "next/link";
import { cn } from "@/lib/cn";
import { buildHref, type CatalogueSearchParams } from "@/lib/catalogue";
import { CATEGORIES } from "@/data/catalogue";

interface CategoryNavProps {
  params: CatalogueSearchParams;
}

export function CategoryNav({ params }: CategoryNavProps) {
  return (
    <nav aria-label="Categories" className="border-b border-border">
      <ul className="flex items-center gap-6 overflow-x-auto pb-1 lg:gap-8 scrollbar-none">
        {CATEGORIES.map((category, index) => {
          const active = params.category === category.id;
          return (
            <li key={category.id} className="flex items-center shrink-0">
              {index > 0 ? (
                <span aria-hidden="true" className="mr-6 h-3 w-px bg-border-strong lg:mr-8" />
              ) : null}
              <Link
                href={buildHref(params, { set: { category: category.id as CatalogueSearchParams["category"], page: 1 } })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "type-nav block border-b py-3 transition-colors duration-standard ease-standard relative",
                  active
                    ? "border-accent text-foreground font-semibold"
                    : "border-transparent text-foreground-muted hover:border-foreground-muted/40 hover:text-foreground",
                )}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
