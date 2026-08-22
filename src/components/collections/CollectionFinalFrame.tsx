import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Media } from "@/components/ui/Media";
import Link from "next/link";
import type { Collection } from "@/types";

interface CollectionFinalFrameProps {
  collection: Collection;
}

export function CollectionFinalFrame({ collection }: CollectionFinalFrameProps) {
  const style = { "--collection-accent": collection.theme.accent } as CSSProperties;
  const lastImage = collection.gallery[collection.gallery.length - 1];
  return (
    <section aria-labelledby="final-frame-title" style={style} className="pb-[var(--section-spacing-mobile)] md:pb-[var(--section-spacing-desktop)]">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            {(lastImage && (
              <div className="relative aspect-[16/9] w-full max-w-[38rem] mx-auto overflow-hidden bg-surface">
                                <Media
                  media={{
                    desktop: lastImage.src,
                    alt: lastImage.alt,
                  }}
                  sizes="(min-width: 64rem) 80vw, 100vw"
                  className="absolute inset-0"
                />
              </div>
            ))}
            <h2 id="final-frame-title" className="type-h2 text-foreground">
              The house continues.
            </h2>
            <Link
              href="/collections"
              className="type-nav inline-flex items-center gap-2 text-[var(--collection-accent)] hover:underline"
            >
              Explore the collections
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
