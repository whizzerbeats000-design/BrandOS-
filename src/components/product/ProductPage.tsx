"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getCategoryLabel, getColorOption, getCollectionLabel } from "@/data/catalogue";
import { PRODUCT_DETAILS, SHIPPING_RETURNS, SIZE_GUIDE } from "@/data/productDetails";
import { addToBag } from "@/lib/bag";
import { recordRecent, readRecentProducts } from "@/lib/recently";
import { isColorAvailable, isSizeAvailable, variantForSelection, variantsForColor } from "@/lib/variant";
import { ProductImageViewer } from "@/components/product/ProductImageViewer";
import { CRAFT_STORY } from "@/data/homepage";
import type { Product } from "@/types";

type ButtonState = "idle" | "adding" | "added" | "error";

interface ProductPageProps {
  product: Product;
}

interface NoticeState {
  kind: "info" | "error" | "success";
  message: string;
}

function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="inline-flex items-center border border-border-strong">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange((q) => Math.max(1, q - 1))}
        disabled={quantity <= 1}
        className="flex h-12 w-12 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <span aria-hidden="true">−</span>
      </button>
      <span aria-live="polite" className="type-body w-14 text-center text-foreground">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange((q) => Math.min(10, q + 1))}
        disabled={quantity >= 10}
        className="flex h-12 w-12 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

function AccordionSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  const contentId = `acc-${id}-content`;
  return (
    <div id={`acc-${id}`} className="border-b border-border">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => onToggle(id)}
          className="type-nav flex w-full items-center justify-between py-6 text-foreground transition-colors duration-standard ease-standard hover:text-accent"
        >
          {title}
          <span aria-hidden="true" className={cn("transition-transform duration-standard ease-standard", open && "rotate-45")}>
            +
          </span>
        </button>
      </h2>
      <div id={contentId} hidden={!open} className="pb-8">
        {children}
      </div>
    </div>
  );
}

export function ProductPage({ product }: ProductPageProps) {
  const router = useRouter();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [colorId, setColorId] = useState(product.colors[0]);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [openSections, setOpenSections] = useState(new Set(["details"]));
  const recent = readRecentProducts();

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

    const variantAvailable = isSizeAvailable(product, colorId, sizeId);

    const handleAddToBag = async () => {
    if (!colorId || !sizeId) {
      setNotice({ kind: "error", message: "Please select a color and size" });
      return;
    }
    const variant = variantForSelection(product, colorId, sizeId);
    if (!variant || variant.availability === "sold-out") {
      setNotice({ kind: "error", message: "Selected size/color unavailable" });
      return;
    }
    setButtonState("adding");
    try {
      await addToBag({
        productId: product.id,
        variantId: variant.id,
        quantity,
      });
      recordRecent(product.slug);
      setButtonState("added");
      setNotice({ kind: "success", message: "Added to bag" });
    } catch (err) {
      setButtonState("error");
      setNotice({ kind: "error", message: "Could not add to bag" });
    }
  };

  useEffect(() => {
    if (buttonState === "added" || buttonState === "error") {
      const timer = setTimeout(() => {
        setButtonState("idle");
        setNotice(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  // Determine hero image (designated product image or first gallery image)
  const heroImage = product.productImage ?? product.images[0];

  return (
    <div className="min-h-[calc(100vh_-_4rem)] bg-background flex flex-col">
      {/* Hero Image Section - full bleed */}
      <section className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <ProductImageViewer
            images={product.images}
            activeIndex={galleryIndex}
            onIndexChange={setGalleryIndex}
            sizes="(min-width: 64rem) 80vw, 100vw"
            className="object-contain"
            aspectRatio={product.aspectRatio}
          />
        </div>
        {/* Image counter */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground/80 text-xs">
            <span>{galleryIndex + 1}</span>
            <span aria-hidden="true" className="h-px w-px bg-foreground-muted/40" />
            <span>{product.images.length}</span>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
        {/* Product Info Panel (Desktop: sticky sidebar, Mobile: stacked above editorial) */}
        <aside
          className="lg:w-2/5 lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto w-full border-r border-border"
        >
          <div className="px-6 py-10 lg:px-10 lg:py-12">
            <h1 className="type-display mb-4 text-foreground">
              {product.name}
            </h1>
            <p className="type-body mb-6 text-foreground-secondary">
              {product.description}
            </p>
            <p className="type-title mb-4 text-foreground">
              {formatPrice(product.price, product.currency)}
            </p>

            {/* Color selector */}
            {product.colors.length > 1 && (
              <>
                <p className="type-metadata mb-2 text-foreground-muted">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((cid) => (
                    <button
                      key={cid}
                      aria-label={getColorOption(cid).name}
                      onClick={() => {
                        setColorId(cid);
                        // reset size when color changes
                        setSizeId(null);
                      }}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-full border border-border-strong",
                        colorId === cid && "bg-accent/20",
                                !isColorAvailable(product, cid) && "opacity-40 pointer-events-none"
                      )}
                                            disabled={!isColorAvailable(product, cid)}
                    >
                      <span
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: getColorOption(cid).hex }}
                      />
                    </button>
                  ))}
                </div>
                                {(!isColorAvailable(product, colorId)) && (
                  <p className="mt-2 text-error text-sm">Selected color unavailable</p>
                )}
              </>
            )}

            {/* Size selector */}
            {product.sizes.length > 1 && (
              <>
                <p className="type-metadata mb-2 mt-6 text-foreground-muted">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sid) => (
                    <button
                      key={sid}
                      aria-label={sid}
                      onClick={() => setSizeId(sid)}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-full border border-border-strong",
                        sizeId === sid && "bg-accent/20",
                        !variantAvailable && "opacity-40 pointer-events-none"
                      )}
                      disabled={!variantAvailable}
                    >
                      {sid}
                    </button>
                  ))}
                </div>
                {(!variantAvailable) && (
                  <p className="mt-2 text-error text-sm">Selected size unavailable for this color</p>
                )}
              </>
            )}

            {/* Quantity stepper */}
            <div className="mt-6 flex items-center gap-4">
              <p className="type-metadata flex-shrink-0 text-foreground-muted">Quantity</p>
              <QuantityStepper quantity={quantity} onChange={setQuantity} />
            </div>

            {/* Add to bag button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={!variantAvailable || buttonState === "adding"}
                className={cn(
                  "type-button w-full flex items-center justify-center gap-2",
                  buttonState === "adding" && "bg-accent/90 text-accent-contrast animate-pulse",
                  buttonState === "added" && "bg-accent/90 text-accent-contrast",
                  !variantAvailable && "opacity-50 pointer-events-none"
                )}
              >
                {buttonState === "adding" ? ("Adding…") : ("Add to bag")}
              </button>
            </div>

            {/* Notice */}
            {notice && (
              <div className="mt-4 px-4 py-2 rounded border">
                <p className="type-body-small text-center">
                  {notice.kind === "success" ? ("✓ " + notice.message) : ("✗ " + notice.message)}
                </p>
              </div>
            )}

            {/* View Piece link (optional) */}
            <div className="mt-6">
              <a
                href="#"
                className="type-metadata text-foreground hover:underline"
              >
                View piece details
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content (Editorial) */}
        <main className="lg:w-3/5 w-full px-6 py-10 lg:px-12 lg:py-16">
          {/* Image thumbnails (optional) */}
          {product.images.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.src}
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => setGalleryIndex(idx)}
                  className={cn(
                    "h-12 w-12 shrink-0 object-cover border border-border/50",
                    galleryIndex === idx && "border-foreground"
                  )}
                >
                  <NextImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Editorial story block */}
          <div className="mb-14 border-t border-border pt-10">
            <p className="type-metadata text-accent">{CRAFT_STORY.eyebrow}</p>
            <h2 className="type-h2 mb-4 text-foreground">{CRAFT_STORY.title}</h2>
            <p className="type-editorial text-foreground">{CRAFT_STORY.statement}</p>
            {CRAFT_STORY.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="type-body text-foreground-secondary mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Accordion sections for details, shipping, etc. */}
          <div className="space-y-6">
            <AccordionSection
              id="details"
              title="Product details"
              open={openSections.has("details")}
              onToggle={toggleSection}
            >
              <div className="prose prose-sm text-foreground-secondary max-w-none">
                                {product.description && (
                  <p>{product.description}</p>
                )}
                {(() => {
                  const details = PRODUCT_DETAILS[product.category];
                  return (
                    <>
                      <p className="type-body text-foreground-secondary">{details.details}</p>
                      <p className="type-body text-foreground-secondary mt-4">
                        <span className="type-nav text-foreground">Material</span> · {details.material}
                      </p>
                      <p className="type-body text-foreground-secondary mt-4">
                        <span className="type-nav text-foreground">Fit</span> · {details.fit}
                      </p>
                      <p className="type-body text-foreground-secondary mt-4">
                        <span className="type-nav text-foreground">Care</span> · {details.care}
                      </p>
                    </>
                  );
                })()}
              </div>
            </AccordionSection>

            <AccordionSection
              id="shipping"
              title="Shipping & returns"
              open={openSections.has("shipping")}
              onToggle={toggleSection}
            >
              <dl className="flex flex-col gap-6">
                {SHIPPING_RETURNS.blocks.map((block) => (
                  <div key={block.title}>
                    <dt className="type-nav mb-1.5 text-foreground">{block.title}</dt>
                    <dd className="type-body-small max-w-xl text-foreground-secondary">{block.body}</dd>
                  </div>
                ))}
              </dl>
            </AccordionSection>

          </div>

          {/* Recently viewed */}
          {recent.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="type-h3 mb-6 text-foreground">Recently viewed</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recent.slice(0, 4).map((summary) => (
                  <a
                    key={summary.slug}
                    href={`/product/${summary.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-surface mb-4">
                      <NextImage
                        src={summary.image.src}
                        alt={summary.image.alt}
                        fill
                        className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <p className="type-body-small font-medium text-foreground transition-colors duration-standard ease-standard group-hover:text-accent">
                        {summary.name}
                      </p>
                      <p className="type-price text-foreground-secondary">
                        {formatPrice(summary.price, summary.currency)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
      </section>

      {/* Footer placeholder – will be replaced later */}
      <footer className="mt-auto bg-background/50">
        <div className="text-center py-6 text-foreground-muted">
          © {new Date().getFullYear()} SUS WEARS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
