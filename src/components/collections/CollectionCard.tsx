import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Media } from "@/components/ui/Media";
import { ArrowRightIcon } from "@/components/icons";
import type { Collection } from "@/types";

export type CollectionCardVariant = "featured" | "standard";

interface CollectionCardProps {
  collection: Collection;
  variant?: CollectionCardVariant;
  /** Piece count shown as metadata when provided. */
  pieceCount?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

const ASPECT: Record<CollectionCardVariant, string> = {
  featured: "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]",
  standard: "aspect-[4/5]",
};

export function CollectionCard({
  collection,
  variant = "standard",
  pieceCount,
  priority = false,
  sizes = "100vw",
  className,
}: CollectionCardProps) {
  const featured = variant === "featured";
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      aria-label={`Explore the ${collection.name} collection`}
      style={style}
      className={cn("group block", className)}
    >
      <div className={cn("relative w-full overflow-hidden bg-surface", ASPECT[variant])}>
        <Media
          media={collection.heroImage}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 transition-transform duration-slow ease-accent group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/10 transition-opacity duration-standard ease-standard group-hover:to-background/5"
        />
      </div>

      <div className={cn("flex flex-col gap-4", featured ? "lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-12 lg:pb-12" : "mt-5")}>
        <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
          <span aria-hidden="true" className="h-px w-10 bg-[var(--collection-accent)]/60" />
          {collection.eyebrow}
          {pieceCount !== undefined ? (
            <span className="text-foreground-muted">{pieceCount} pieces</span>
          ) : null}
        </p>
        <h2
          className={cn(
            "text-foreground",
            featured ? "type-h2 max-w-3xl" : "type-h3",
          )}
        >
          {collection.name}
        </h2>
        <p className="type-body-small max-w-xl text-foreground-secondary">{collection.shortDescription}</p>
        <p className="type-nav mt-2 inline-flex items-center gap-2 text-foreground transition-colors duration-standard ease-standard group-hover:text-[var(--collection-accent)]">
          Explore collection
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-standard ease-standard group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}
