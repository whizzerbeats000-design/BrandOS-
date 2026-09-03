import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductPage } from "@/components/product/ProductPage";
import { getCategoryLabel, getRelatedProducts, PRODUCTS } from "@/data/catalogue";
import { SITE_URL } from "@/lib/site";

interface JsonLdBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Page not found", description: "That piece isn't in the collection." };
  const firstImage = product.images[0];
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/product/${product.slug}`,
      title: product.name,
      description: product.description,
      images: [
        {
          url: `${SITE_URL}${firstImage.src}`,
          alt: firstImage.alt,
        },
      ],
    },
  };
}

export default async function ProductPageRoute({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = getRelatedProducts();
  const breadcrumb: JsonLdBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: getCategoryLabel(product.category),
        item: `${SITE_URL}/shop?category=${product.category}`,
      },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <Container className="flex flex-col gap-10 pb-24 pt-8 lg:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {/* Product schema — enables Google rich results and Shopping integration */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((img) => `${SITE_URL}${img.src}`),
            brand: {
              "@type": "Brand",
              name: "SUS WEARS",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: product.currency,
              price: (product.price / 100).toFixed(2),
              availability:
                product.availability === "sold-out"
                  ? "https://schema.org/SoldOut"
                  : product.availability === "low-stock"
                    ? "https://schema.org/LimitedAvailability"
                    : "https://schema.org/InStock",
              url: `${SITE_URL}/product/${product.slug}`,
              seller: {
                "@type": "Organization",
                name: "SUS WEARS",
              },
            },
          }),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/shop"
              className="type-nav text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-foreground-muted">
            /
          </li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="type-nav text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground"
            >
              {getCategoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true" className="text-foreground-muted">
            /
          </li>
          <li aria-current="page">
            <span className="type-nav text-foreground">{product.name}</span>
          </li>
        </ol>
      </nav>

      <ProductPage key={product.slug} product={product} />

      {related.length > 0 ? (
        <div className="mt-24 border-t border-border pt-12">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="type-metadata mb-3 text-foreground-muted">Continue browsing</p>
              <h2 className="type-h2 text-foreground">Related pieces</h2>
            </div>
            <Link
              href="/shop"
              className="type-nav text-foreground-muted underline-offset-4 transition-colors duration-standard ease-standard hover:text-foreground hover:underline"
            >
              Shop all
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((relatedProduct) => (
              <li key={relatedProduct.slug}>
                <ProductCard
                  product={relatedProduct}
                  sizes="(min-width: 64rem) 22vw, 50vw"
                  priority={false}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Container>
  );
}
