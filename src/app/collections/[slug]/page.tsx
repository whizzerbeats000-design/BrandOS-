import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollection, getAllCollections, getCollectionProducts } from "@/lib/collections";
import { parseSearchParams } from "@/lib/catalogue";
import type { ProductCollectionId } from "@/types";

interface CollectionRouteProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return {
    title: `${collection.name} — Collection`,
    description: collection.shortDescription,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} — SUS WEARS`,
      description: collection.shortDescription,
      images: [
        {
          url: collection.heroImage.desktop,
          alt: collection.heroImage.alt,
        },
      ],
    },
  };
}

function CollectionJsonLd({ slug }: { slug: string }) {
  const collection = getCollection(slug);
  if (!collection) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.name,
    description: collection.shortDescription,
    url: `/collections/${collection.slug}`,
    numberOfItems: getCollectionProducts(collection).length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function CollectionRoute({ params, searchParams }: CollectionRouteProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const catalogueParams = {
    ...parseSearchParams(await searchParams),
    collection: collection.slug as ProductCollectionId,
  };

  return (
    <>
      <CollectionJsonLd slug={slug} />
      <CollectionPage collection={collection} catalogueParams={catalogueParams} />
    </>
  );
}
