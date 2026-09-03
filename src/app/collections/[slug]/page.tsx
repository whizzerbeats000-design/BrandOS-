import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollection, getAllCollections, getCollectionProducts } from "@/lib/collections";
import { parseSearchParams } from "@/lib/catalogue";
import { SITE_URL } from "@/lib/site";
import { BRAND } from "@/data/brand";
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

  const heroImage = `${SITE_URL}${collection.heroImage.desktop}`;
  return {
    title: `${collection.name} Collection`,
    description: collection.shortDescription,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} — SUS WEARS`,
      description: collection.shortDescription,
      url: `${SITE_URL}/collections/${collection.slug}`,
      siteName: BRAND.name,
      type: "website",
      images: [
        {
          url: heroImage,
          alt: collection.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name} — SUS WEARS`,
      description: collection.shortDescription,
      images: [heroImage],
    },
  };
}

function CollectionJsonLd({ slug }: { slug: string }) {
  const collection = getCollection(slug);
  if (!collection) return null;

  const products = getCollectionProducts(collection);
  // No item list when the catalogue is empty — an ItemList with zero items is
  // misleading to schema consumers, so omit it entirely until products exist.
  if (products.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.name,
    description: collection.shortDescription,
    url: `${SITE_URL}/collections/${collection.slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${SITE_URL}/product/${product.slug}`,
    })),
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
