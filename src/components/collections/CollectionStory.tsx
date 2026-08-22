import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Collection } from "@/types";

interface CollectionStoryProps {
  collection: Collection;
}

export function CollectionStory({ collection }: CollectionStoryProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;

  return (
    <section aria-labelledby={`${collection.slug}-story-title`} style={style}>
      <Container className="border-t border-border pt-[var(--section-spacing-mobile)] md:pt-[var(--section-spacing-desktop)]">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-4">
              <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                The story
              </p>
              <h2 id={`${collection.slug}-story-title`} className="type-h2 text-foreground">
                Why this collection
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 lg:shrink-0">
              <div>
                <p className="type-metadata text-foreground-muted">Season</p>
                <p className="type-nav mt-1 text-foreground">{collection.season} {collection.year}</p>
              </div>
              <div>
                <p className="type-metadata text-foreground-muted">Status</p>
                <p className="type-nav mt-1 text-foreground">
                  {collection.status === "current" ? "Available now" : "Archived"}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14">
            {collection.story.map((section) => (
              <div key={section.heading} className="flex flex-col gap-3">
                <h3 className="type-nav text-[var(--collection-accent)]">{section.heading}</h3>
                <p className="text-base leading-relaxed text-foreground-secondary">{section.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
