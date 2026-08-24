import type { ReactNode } from "react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { GrainOverlay } from "@/components/editorial/GrainOverlay";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-contrast"
      >
        Skip to content
      </a>

      {/* Responsive top navigation — translucent over the hero, ivory on scroll */}
      <SiteHeader />

      {/* Content column */}
      <div className="flex flex-1 flex-col">
        <ScrollProgress />
        <GrainOverlay />

        <main id="main" className="scroll-margin-top-[var(--spacing-header-desktop)] flex-1">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
      </div>
    </div>
  );
}