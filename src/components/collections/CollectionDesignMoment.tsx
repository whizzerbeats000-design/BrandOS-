import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Collection } from "@/types";

interface CollectionDesignMomentProps {
  collection: Collection;
}

export function CollectionDesignMoment({ collection }: CollectionDesignMomentProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;
  return (
    <section aria-labelledby="design-moment-title" style={style} className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-4">
              <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                Craft & Design
              </p>
              <h2 id="design-moment-title" className="type-h2 text-foreground">
                Details that define
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Four aspects */}
          <div className="flex flex-col gap-3">
            <h3 className="type-nav text-[var(--collection-accent)]">Material</h3>
            <p className="text-base leading-relaxed text-foreground-secondary">
              Considered construction
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="type-nav text-[var(--collection-accent)]">Form</h3>
            <p className="text-base leading-relaxed text-foreground-secondary">
              Thoughtful silhouette
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="type-nav text-[var(--collection-accent)]">Detail</h3>
            <p className="text-base leading-relaxed text-foreground-secondary">
              Attention to detail
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="type-nav text-[var(--collection-accent)]">Design</h3>
            <p className="text-base leading-relaxed text-foreground-secondary">
              Intentional design
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
