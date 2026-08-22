"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ShopErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ShopError({ error, reset }: ShopErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-6 px-gutter py-24 text-center">
      <p className="type-nav text-foreground-muted">Something went wrong</p>
      <h1 className="type-display uppercase text-foreground">The shelves rattled.</h1>
      <p className="max-w-md text-foreground-secondary">
        The catalogue failed to load. Try again, or head back to the shop and start fresh.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="type-nav border border-foreground/25 bg-foreground px-6 py-3.5 text-background transition-colors duration-standard ease-standard hover:bg-foreground-muted"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="type-nav border border-border px-6 py-3.5 text-foreground transition-colors duration-standard ease-standard hover:border-foreground-muted"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
