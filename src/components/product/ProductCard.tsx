"use client";
import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getColorOption } from "@/data/catalogue";
import { addToBag } from "@/lib/bag";
import { recordRecent } from "@/lib/recently";
import { firstPurchasableVariant } from "@/lib/variant";
import { buildProductEnquiryUrl } from "@/lib/integrations";
import { DepthCard } from "@/components/ui/DepthCard";
import type { AspectRatio, Product } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowUpRightIcon } from "@/components/icons";

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
};

export type ProductCardVariant = "catalogue" | "featured" | "editorial";

interface ProductCardProps {
  product: Product;
  /** Responsive sizes hint for `next/image`. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Editorial framing override. */
  aspectRatio?: AspectRatio;
  /** Card DNA variant:
   * - catalogue: full commerce card (tilt, hover swap, add-to-bag, badges)
   * - featured: editorial card (image hover, metadata, price, no tilt)
   * - editorial: minimal card (image + title only)
   */
  variant?: ProductCardVariant;
}

type BagState = "idle" | "adding" | "added";

const VARIANT_CLASSES: Record<ProductCardVariant, string> = {
  catalogue: "product-card",
  featured: "product-plane",
  editorial: "product-editorial",
};

export function ProductCard({
  product,
  sizes = "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
  priority = false,
  className,
  aspectRatio,
  variant = "catalogue",
}: ProductCardProps) {
  const reduced = useReducedMotion();
  const href = `/product/${product.slug}`;
  const soldOut = product.availability === "sold-out";
  const lowStock = product.availability === "low-stock";
  const aspect = aspectRatio ?? product.aspectRatio ?? "4/5";
  const gender = product.gender ?? "unisex";
  const thumbnail = product.productImage ?? product.images[0];
  const hoverView = product.images[1];
  const enquiry = buildProductEnquiryUrl(product.name);
  const isCatalogue = variant === "catalogue";
  const isFeatured = variant === "featured";
  const isEditorial = variant === "editorial";

  const meta = [product.category, gender].filter(Boolean).join(" · ");

  const [bagState, setBagState] = useState<BagState>("idle");

  const handleAddToBag = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (bagState === "adding" || bagState === "added") return;
    const variant = firstPurchasableVariant(product);
    if (!variant) return;
    setBagState("adding");
    try {
      await addToBag({ productId: product.id, variantId: variant.id, quantity: 1 });
      recordRecent(product.slug);
      setBagState("added");
    } catch {
      setBagState("idle");
    }
  };

  useEffect(() => {
    if (bagState !== "added") return;
    const idleTimer = window.setTimeout(() => {
      setBagState("idle");
    }, 2000);
    return () => clearTimeout(idleTimer);
  }, [bagState]);

  const cardContent = (
    <>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface depth-layer",
          isCatalogue && "transition-shadow duration-slow ease-cinematic group-hover:shadow-[var(--shadow-plane-lg)]",
          isFeatured && "product-plane__media",
          isEditorial && "overflow-hidden",
          ASPECT_CLASSES[aspect],
        )}
      >
        <div className="absolute inset-0 h-full w-full">
        {isCatalogue && hoverView ? (
          <>
            <NextImage
              src={thumbnail.src}
              alt={thumbnail.alt}
              fill
              sizes={sizes}
              priority={priority}
              className={cn(
                "object-cover transition-transform duration-slow ease-cinematic group-hover:scale-[1.02]",
                reduced && "reduce-motion",
              )}
            />
            <NextImage
              src={hoverView.src}
              alt={hoverView.alt}
              fill
              sizes={sizes}
              priority={priority}
              className={cn(
                "object-cover opacity-0 transition-opacity duration-standard ease-standard group-hover:opacity-100",
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-standard ease-standard group-hover:opacity-100">
              <span className="inline-flex items-center gap-[var(--space-2)] bg-background/85 px-[var(--space-4)] py-[var(--space-2)] text-foreground backdrop-blur-sm">
                <span className="type-metadata">View piece</span>
                <ArrowUpRightIcon className="h-3 w-3" aria-hidden="true" />
              </span>
            </div>
          </>
        ) : (
          <NextImage
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover",
              isFeatured && "transition-transform duration-slow ease-cinematic group-hover:scale-[1.02]",
              isCatalogue && "transition-transform duration-slow ease-cinematic group-hover:scale-[1.02]",
              reduced && "reduce-motion",
            )}
          />
        )}
      </div>

        {(isCatalogue || isFeatured) && product.badge ? (
          <span className="absolute left-[var(--space-4)] top-[var(--space-4)] bg-background/85 px-[var(--space-3)] py-[var(--space-1)] backdrop-blur-sm">
            <span className="type-metadata text-foreground-secondary">{product.badge}</span>
          </span>
        ) : null}
        {soldOut && (isCatalogue || isFeatured) ? (
          <span className="absolute right-[var(--space-4)] top-[var(--space-4)] bg-background/85 px-[var(--space-3)] py-[var(--space-1)] backdrop-blur-sm">
            <span className="type-metadata text-foreground-secondary">Sold out</span>
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-col gap-[var(--space-2)]",
          isCatalogue && "mt-[var(--space-3)]",
          isFeatured && "mt-[var(--space-3)]",
          isEditorial && "mt-3",
        )}
      >
        <p className={cn("type-metadata text-foreground-muted", isEditorial && "text-foreground-secondary")}>
          {isEditorial ? product.category : meta}
          {lowStock && (isCatalogue || isFeatured) ? <span className="text-foreground"> · Only a few left</span> : null}
        </p>
        <h3
          className={cn(
            "text-foreground transition-colors duration-standard ease-standard",
            isCatalogue && "type-body font-medium",
            isFeatured && "type-body font-medium",
            isEditorial && "type-h3 font-medium",
          )}
        >
          {product.name}
        </h3>

        {(isCatalogue || isFeatured) && product.colors.length > 1 && (
          <ul className="mt-[var(--space-1)] flex items-center gap-[var(--space-1)]" aria-label={`${product.colors.length} colours`}>
            {product.colors.map((colorId) => (
              <li
                key={colorId}
                title={getColorOption(colorId).name}
                className="h-3 w-3 rounded-full border border-border-strong"
                style={{ backgroundColor: getColorOption(colorId).hex }}
              />
            ))}
          </ul>
        )}

        <div
          className={cn(
            "flex items-center justify-between gap-[var(--space-3)]",
            isEditorial && "mt-2",
          )}
        >
          <p className={cn("type-price text-foreground-secondary", isEditorial && "text-foreground")}>
            {formatPrice(product.price, product.currency)}
          </p>

          {!soldOut && isCatalogue ? (
            <button
              type="button"
              onClick={handleAddToBag}
              aria-label={
                bagState === "adding"
                  ? "Adding to bag..."
                  : bagState === "added"
                    ? "Added to bag"
                    : `Add ${product.name} to bag`
              }
              className={cn(
                "type-button inline-flex items-center justify-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] transition-colors duration-standard ease-standard",
                bagState === "idle" &&
                  "border border-border-strong text-foreground hover:border-foreground",
                bagState !== "idle" && "bg-accent text-accent-contrast",
              )}
            >
              {bagState === "idle" && "Add to bag"}
              {bagState === "adding" && "Adding…"}
              {bagState === "added" && "Added ✓"}
            </button>
          ) : soldOut && (isCatalogue || isFeatured) ? (
            <a
              href={enquiry.href}
              className="link-underline type-nav text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground"
            >
              Ask about this piece
            </a>
          ) : isFeatured || isEditorial ? (
            <span className="type-nav text-foreground-muted transition-colors duration-standard ease-standard group-hover:text-foreground">
              View <ArrowUpRightIcon className="h-3 w-3 inline-block ml-1" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <span aria-live="polite" className="sr-only">
          {bagState === "added" ? `${product.name} added to bag.` : ""}
        </span>
      </div>
    </>
  );

  if (isCatalogue) {
    return (
      <DepthCard
        intensity={0.5}
        className={cn("product-card group flex flex-col", reduced && "reduce-motion", className)}
      >
        <Link href={href} className="relative block overflow-hidden" aria-label={`${product.name}, ${meta}`}>
          {cardContent}
        </Link>
      </DepthCard>
    );
  }

  return (
    <Link
      href={href}
      className={cn("group flex flex-col", VARIANT_CLASSES[variant], className)}
      aria-label={`${product.name}, ${meta}`}
    >
      {cardContent}
    </Link>
  );
}
