"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [transitioning, setTransitioning] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname || reduced) {
      prevPathname.current = pathname;
      return;
    }
    prevPathname.current = pathname;

    setTransitioning(true);
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setTransitioning(false);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, reduced]);

  return (
    <div
      className={cn(
        "page-transition",
        transitioning && "page-transition-out",
      )}
    >
      {pathname !== "/" ? (
        <div aria-hidden="true" className="h-header-mobile lg:h-header-desktop" />
      ) : null}
      {children}
    </div>
  );
}
