import Link from "next/link";

interface EmptyStateProps {
  /** Base path for the clear-filters link — defaults to the full shop catalogue. */
  base?: string;
  /** Title of the destination shown in the copy and link. */
  destination?: string;
}

export function EmptyState({ base = "/shop", destination = "full catalogue" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <p className="type-display uppercase text-foreground">No pieces found.</p>
      <p className="max-w-md text-foreground-secondary">
        Nothing matches those filters. Try loosening a constraint, or start fresh from the {destination}.
      </p>
      <Link
        href={base}
        className="type-nav border border-foreground/25 bg-foreground px-6 py-3.5 text-background transition-colors duration-standard ease-standard hover:bg-foreground-muted"
      >
        Clear filters
      </Link>
    </div>
  );
}
