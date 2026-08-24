"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FilterFields } from "@/components/shop/FilterFields";
import { getActiveFilters, type CatalogueSearchParams } from "@/lib/catalogue";
import { CloseIcon } from "@/components/icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

interface FilterPanelProps {
  params: CatalogueSearchParams;
  className?: string;
  /** Base path for built links — defaults to the full shop catalogue. */
  base?: string;
}

export function FilterPanel({ params, className, base = "/shop" }: FilterPanelProps) {
  const active = getActiveFilters(params).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="type-nav text-foreground-muted">Refine</h2>
        {active > 0 ? (
          <Link
            href={base}
            className="type-nav text-foreground-secondary underline-offset-4 transition-colors duration-standard ease-standard hover:text-accent hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>
      <FilterFields params={params} base={base} />
    </div>
  );
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  params: CatalogueSearchParams;
  /** Base path for built links — defaults to the full shop catalogue. */
  base?: string;
}

export function FilterDrawer({ open, onClose, params, base = "/shop" }: FilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.overflow = "";
      panel.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Filters">
      <button
        type="button"
        aria-label="Close filters"
        className="filter-backdrop absolute inset-0 cursor-default bg-black/60"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        className="filter-sheet absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto overscroll-behavior-contain border-t border-border bg-background pb-[calc(env(safe-area-inset-bottom)+1rem)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur-sm">
          <h2 className="type-nav uppercase tracking-[0.24em] text-foreground">Filters</h2>
          <div className="flex items-center gap-3">
            <Link
              href={base}
              onClick={onClose}
              className="type-nav text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground"
            >
              Clear all
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close filters"
              className="inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors duration-standard ease-standard hover:text-accent"
              onClick={onClose}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="px-5 py-6">
          <FilterFields params={params} onApplied={onClose} base={base} />
        </div>
        <div className="px-5 pb-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="type-nav w-full border border-foreground/25 bg-foreground px-6 py-4 text-background transition-colors duration-standard ease-standard hover:bg-foreground-muted"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
