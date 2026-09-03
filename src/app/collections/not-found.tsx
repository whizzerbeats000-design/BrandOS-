import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { getAllCollections, getCollectionProducts } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Collection not found",
  robots: { index: false, follow: false },
};

export default function CollectionsNotFound() {
  const collections = getAllCollections();

  return (
    <Container className="flex flex-col items-center gap-16 py-24 text-center">
      <div className="flex flex-col items-center gap-6">
        <p className="type-nav text-foreground-muted">404 — Collection not found</p>
        <h1 className="type-display uppercase text-foreground">This story doesn&rsquo;t exist.</h1>
        <p className="max-w-md text-foreground-secondary">
          The collection you asked for isn&rsquo;t here. Browse the stories we&rsquo;ve told so far.
        </p>
        <Link
          href="/collections"
          className="type-nav border border-foreground/25 bg-foreground px-6 py-3.5 text-background transition-colors duration-standard ease-standard hover:bg-foreground-muted"
        >
          All collections
        </Link>
      </div>

      {collections.length > 0 ? (
        <div className="w-full text-left">
          <p className="type-metadata mb-6 text-center text-foreground-muted">Available collections</p>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-14">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                pieceCount={getCollectionProducts(collection).length}
                sizes="(min-width: 1024px) 28rem, 100vw"
              />
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
