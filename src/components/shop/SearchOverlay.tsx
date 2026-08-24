"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { SEARCH_INDEX, searchCatalogue } from "@/data/search";
import { formatPrice } from "@/lib/format";
import { CloseIcon, SearchIcon } from "@/components/icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

interface SearchOverlayProps {
  triggerLabel?: string;
}

/** Premium catalogue search. Opens a focused, accessible overlay with live results.
 *  Results link to product routes; the summary row links into /shop?q=... */
export function SearchOverlay({ triggerLabel = "Search" }: SearchOverlayProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchCatalogue(query), [query]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (results.length === 0) return;
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) => {
          const next = (current + direction) % results.length;
          return next < 0 ? results.length - 1 : next;
        });
        return;
      }
      if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        const entry = results[activeIndex];
        close();
        router.push(`/product/${entry.slug}`);
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

    const close = () => {
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    };

    panel.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      root.style.overflow = previousOverflow;
      document.body.style.overflow = "";
      panel.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, activeIndex]);

  const scrollActiveIntoView = (index: number) => {
    setActiveIndex(index);
    if (index < 0) return;
    const item = panelRef.current?.querySelector<HTMLElement>(`[data-search-index="${index}"]`);
    item?.scrollIntoView({ block: "nearest" });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="type-nav inline-flex items-center gap-3 border-b border-border py-2.5 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{triggerLabel}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Search the catalogue"
        >
          <button
            type="button"
            aria-label="Close search"
            className="search-backdrop absolute inset-0 cursor-default bg-black/60"
            onClick={() => {
              setOpen(false);
              setQuery("");
              setActiveIndex(-1);
              window.setTimeout(() => triggerRef.current?.focus(), 0);
            }}
            tabIndex={-1}
          />
          <div
            ref={panelRef}
            className="search-sheet absolute inset-x-0 top-0 mx-auto max-w-2xl overflow-y-auto overscroll-behavior-contain border-b border-border bg-background pb-6 pt-5"
          >
            <div className="px-5">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <SearchIcon className="h-5 w-5 shrink-0 text-foreground-muted" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(-1);
                  }}
                  placeholder="Search name, category or collection"
                  aria-label="Search the catalogue"
                  className="type-body w-full rounded-none border-0 bg-transparent py-1 text-foreground placeholder:text-foreground-muted focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-foreground transition-colors duration-standard ease-standard hover:text-accent"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                    window.setTimeout(() => triggerRef.current?.focus(), 0);
                  }}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4">
              {query.trim() === "" ? (
                <p className="type-body-small text-foreground-muted">
                  Start typing to search {SEARCH_INDEX.length} pieces.
                </p>
              ) : results.length === 0 ? (
                <div className="flex flex-col gap-3 py-6">
                  <p className="type-body text-foreground">Nothing found for “{query.trim()}”.</p>
                  <p className="type-body-small text-foreground-muted">
                    Try a different name, category or colour.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {results.map((entry, index) => (
                    <li key={entry.slug}>
                      <a
                        href={`/product/${entry.slug}`}
                        data-search-index={index}
                        className="group flex items-center gap-4 py-3"
                        onMouseEnter={() => scrollActiveIntoView(index)}
                        onFocus={() => scrollActiveIntoView(index)}
                      >
                        <span className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-surface">
                          <NextImage
                            src={entry.imageSrc}
                            alt={entry.imageAlt}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="type-body font-medium text-foreground transition-colors duration-standard ease-standard group-hover:text-accent">
                            {entry.name}
                          </span>
                          <span className="type-metadata text-foreground-muted">
                            {entry.category} · {entry.collection}
                            {entry.aspectRatio ? ` · ${entry.aspectRatio}` : ""}
                          </span>
                        </span>
                        <span className="type-price shrink-0 text-foreground-secondary">
                          {formatPrice(entry.price)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {query.trim() !== "" && results.length > 0 ? (
                <a
                  href={`/shop?q=${encodeURIComponent(query.trim())}`}
                  className="link-underline type-nav mt-4 block text-foreground-muted transition-colors duration-standard ease-standard hover:text-accent"
                >
                  View all results for “{query.trim()}”
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}