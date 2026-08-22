"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Treat nested routes (e.g. /collections/[slug]) as active too. */
  matchPrefix?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  showUnderline?: boolean;
}

export function NavLink({
  href,
  children,
  className,
  matchPrefix = false,
  onClick,
  showUnderline = true,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = matchPrefix ? pathname.startsWith(href) : pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn("group relative inline-flex items-center", className)}
    >
      {children}
      {showUnderline && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 -bottom-1.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-standard ease-standard group-hover:scale-x-100",
            isActive && "scale-x-100",
          )}
        />
      )}
    </Link>
  );
}
