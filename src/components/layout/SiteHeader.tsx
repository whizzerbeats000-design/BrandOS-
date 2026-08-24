"use client";

import { PRIMARY_NAV } from "@/data/nav";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { BagLink } from "@/components/layout/BagLink";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MenuIcon } from "@/components/icons";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuTriggerRef.current?.focus();
  }, []);

  /** Solid ivory on every page except the very top of the homepage. */
  const solid = !isHome || scrolled;
  const toneLight = !solid;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-safe transition-[background-color,border-color,box-shadow] duration-standard ease-standard",
          solid
            ? "border-b border-border bg-background/90 backdrop-blur-md shadow-[var(--shadow-sm)]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Mobile row: hamburger · centred wordmark · bag */}
        <div className="flex h-header-mobile items-center justify-between px-gutter lg:hidden">
          <IconButton
            ref={menuTriggerRef as Ref<HTMLButtonElement>}
            label="Open menu"
            variant="ghost"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
            className={cn(toneLight && "text-ivory hover:text-ivory")}
          >
            <MenuIcon className="h-5 w-5" />
          </IconButton>

          <span className="absolute left-1/2 -translate-x-1/2">
            <BrandLockup tone={toneLight ? "light" : "default"} />
          </span>

          <BagLink tone={toneLight ? "light" : "default"} />
        </div>

        {/* Desktop row: wordmark · centred links · bag */}
        <div className="hidden h-header-desktop items-center px-gutter lg:flex">
          <BrandLockup tone={toneLight ? "light" : "default"} />

          <nav aria-label="Primary" className="absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-[var(--space-10)]">
              {PRIMARY_NAV.map((item) => {
                const active = item.matchPrefix
                  ? pathname.startsWith(item.href)
                  : pathname === item.href;
                return (
                  <li key={`${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                         "type-nav py-2 transition-[color,background-color,border-color] duration-fast ease-standard relative",
                        toneLight
                          ? active
                            ? "text-ivory"
                            : "text-ivory-secondary hover:text-ivory"
                          : active
                            ? "text-accent"
                            : "text-foreground-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                           "absolute bottom-0 left-0 h-px bg-accent transition-transform duration-standard ease-standard",
                          active ? "right-0" : "right-1/2 group-hover:right-0"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center">
            <BagLink tone={toneLight ? "light" : "default"} />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}