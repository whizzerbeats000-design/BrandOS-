import type { CSSProperties } from "react";
import { CollectionNav } from "@/components/collections/CollectionNav";
import { CollectionHero } from "@/components/collections/CollectionHero";
import { CollectionIntro } from "@/components/collections/CollectionIntro";
import { CollectionEditorialSelection } from "@/components/collections/CollectionEditorialSelection";
import { CollectionStoryVisual } from "@/components/collections/CollectionStoryVisual";
import { CollectionDesignMoment } from "@/components/collections/CollectionDesignMoment";
import { CollectionRelated } from "@/components/collections/CollectionRelated";
import { CollectionFinalFrame } from "@/components/collections/CollectionFinalFrame";
import type { CatalogueSearchParams } from "@/lib/catalogue";
import type { Collection } from "@/types";

interface CollectionPageProps {
  collection: Collection;
  catalogueParams: CatalogueSearchParams;
}

export function CollectionPage({ collection }: CollectionPageProps) {
  const themeVars = {
    "--collection-surface": collection.theme.surface,
    "--collection-accent": collection.theme.accent,
  } as CSSProperties;

  return (
    <div style={themeVars}>
      <CollectionNav activeSlug={collection.slug} accent={collection.theme.accent} />
      <CollectionHero collection={collection} />
      <CollectionIntro collection={collection} />
      <CollectionEditorialSelection collection={collection} />
      <CollectionStoryVisual collection={collection} />
      <CollectionDesignMoment collection={collection} />
      <CollectionRelated collection={collection} />
      <CollectionFinalFrame collection={collection} />
    </div>
  );
}
