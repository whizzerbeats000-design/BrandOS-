import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Media } from "@/components/ui/Media";
import type { Collection } from "@/types";

interface CollectionStoryVisualProps {
  collection: Collection;
}

export function CollectionStoryVisual({ collection }: CollectionStoryVisualProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;
  const images = collection.gallery;
  const story = collection.story;

  if (!story || story.length === 0) return null;

  return (
    <section aria-labelledby="story-visual-title" style={style} className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-desktop)]">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-4">
              <p className="type-metadata flex items-center gap-3 text-[var(--collection-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                The story
              </p>
              <h2 id="story-visual-title" className="type-h2 text-foreground">
                Why this collection
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 space-y-8">
          {story.map((section, idx) => {
            const imgIdx = idx % images.length;
            const image = images[imgIdx];
            const isEven = idx % 2 === 0;
                        return (
              <div
                key={section.heading}
                className={cn(
                  "grid gap-4",
                  isEven ? "items-start" : "items-end",
                  "md:grid-cols-2",
                  "lg:grid-cols-[40%_60%]",
                  "lg:gap-8",
                )}
              >
                {isEven ? (
                  <>
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                      <Media
                        media={{
                          desktop: image.src,
                          alt: image.alt,
                        }}
                        sizes="100vw"
                        className="absolute inset-0"
                      />
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                      <h3 className="type-nav text-[var(--collection-accent)]">
                        {section.heading}
                      </h3>
                      <p className="text-base leading-relaxed text-foreground-secondary">
                        {section.body}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-6 flex flex-col gap-3">
                      <h3 className="type-nav text-[var(--collection-accent)]">
                        {section.heading}
                      </h3>
                      <p className="text-base leading-relaxed text-foreground-secondary">
                        {section.body}
                      </p>
                    </div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface mt-6">
                      <Media
                        media={{
                          desktop: image.src,
                          alt: image.alt,
                        }}
                        sizes="100vw"
                        className="absolute inset-0"
                      />
                    </div>
                  </>
                                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
