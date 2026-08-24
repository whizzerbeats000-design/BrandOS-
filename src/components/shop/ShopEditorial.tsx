import { Container } from "@/components/ui/Container";
import NextImage from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/brand";

/** Editorial interlude within the catalogue — men + women, shot in the house language.
 *  Keeps the grid's gender balance visible without disturbing discovery flow. */
export function ShopEditorial() {
  return (
    <section aria-label="The SUS WEARS unisex wardrobe" className="border-t border-border pt-16 lg:pt-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-5 lg:gap-6">
            <p className="type-metadata text-accent">
              {BRAND.audience.framing.toUpperCase()} WARDROBE
            </p>
            <h2 className="type-h1 text-foreground">
              Cut for him.
              <br />
              Cut for her.
              <br />
              Cut the same.
            </h2>
            <p className="type-body max-w-md text-foreground-secondary">
              Every SUS piece is designed without a gender section — one cut block, sized to a
               body, finished by hand. From a single studio in {BRAND.location.city},{" "}
              {BRAND.location.state}, {BRAND.location.country}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-[var(--gutter)] lg:col-span-7">
          {[
            { src: "/images/home/featured-men-01.webp", alt: "Male model in SUS WEARS structured tailoring" },
            { src: "/images/home/featured-women-01.webp", alt: "Female model in SUS WEARS draped styling" },
          ].map((image) => (
            <Link
              key={image.src}
              href="/shop"
              className="group relative block overflow-hidden bg-surface"
              aria-label="Browse the full catalogue"
            >
              <div className="relative aspect-[4/5]">
                <NextImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 29vw, 50vw"
                  className="object-cover transition-opacity duration-slow ease-standard group-hover:opacity-90"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}