"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/layout/NavLink";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { PRIMARY_NAV, CONTACT_EMAIL } from "@/data/nav";
import { ArrowUpRightIcon, BagIcon, CloseIcon, SearchIcon } from "@/components/icons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose }: MobileMenuProps) {
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
    <div
      ref={panelRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="menu-panel fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background"
    >
      <div className="flex h-16 shrink-0 items-center justify-between pt-safe">
        <Container className="flex w-full items-center justify-between">
          <BrandLockup />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors duration-standard ease-standard hover:text-accent"
            onClick={onClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </Container>
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <Container>
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item, index) => (
              <li key={item.href} className="menu-item" style={{ animationDelay: `${100 + index * 70}ms` }}>
                <NavLink
                  href={item.href}
                  matchPrefix={item.matchPrefix}
                  onClick={onClose}
                  showUnderline={false}
                  className="group flex w-full items-baseline gap-6 py-3"
                >
                  <span className="type-metadata w-7 shrink-0 tabular-nums text-foreground-muted transition-colors duration-standard ease-standard group-hover:text-foreground">
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span className="font-display text-4xl font-light uppercase leading-none tracking-tight text-foreground transition-colors duration-standard ease-standard group-hover:text-foreground sm:text-5xl">
                    {item.label}
                  </span>
                  <ArrowUpRightIcon className="ml-auto h-6 w-6 shrink-0 text-foreground-muted transition-colors duration-standard ease-standard group-hover:text-foreground" />
                </NavLink>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <div className="border-t border-border pb-safe">
        <Container className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-8">
            <li>
              <button
                type="button"
                aria-label="Search"
                className="type-nav inline-flex items-center gap-2 py-2 text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground"
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </button>
            </li>
            <li>
              <Link
                href="/cart"
                onClick={onClose}
                className="type-nav inline-flex items-center gap-2 py-2 text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground"
              >
                <BagIcon className="h-4 w-4" />
                Bag
              </Link>
            </li>
          </ul>
          <Link
            href={`mailto:${CONTACT_EMAIL}`}
            className={cn("type-metadata py-2 text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground")}
          >
            {CONTACT_EMAIL}
          </Link>
        </Container>
      </div>
    </div>
  );
}
