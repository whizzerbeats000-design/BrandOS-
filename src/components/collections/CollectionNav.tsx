import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getCollectionNavItems } from "@/lib/collections";
import { Container } from "@/components/ui/Container";
import type { Collection } from "@/types";

interface CollectionNavProps {
  activeSlug?: string;
  /** Accent used for the active link — themed per collection. */
  accent?: string;
}

export function CollectionNav({ activeSlug, accent }: CollectionNavProps) {
  const collections = getCollectionNavItems();
  const style = { "--collection-accent": accent ?? "var(--color-accent)" } as CSSProperties;

  return (
    <nav
      aria-label="Collections"
      style={style}
      className="sticky top-16 z-30 border-y border-border bg-background/90 backdrop-blur-sm lg:top-[4.5rem]"
    >
      <Container className="flex items-center gap-6 overflow-x-auto py-3 lg:gap-10">
        <Link
          href="/collections"
          className={cn(
            "type-nav shrink-0 whitespace-nowrap transition-colors duration-standard ease-standard",
            !activeSlug
              ? "text-[var(--collection-accent)]"
              : "text-foreground-muted hover:text-foreground",
          )}
        >
          All collections
        </Link>
        {collections.map((collection: Collection) => {
          const active = collection.slug === activeSlug;
          return (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "type-nav shrink-0 whitespace-nowrap transition-colors duration-standard ease-standard",
                active
                  ? "text-[var(--collection-accent)]"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {collection.name}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
