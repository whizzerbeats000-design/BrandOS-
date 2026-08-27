"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { BAG_UPDATE_EVENT, getBag, type BagLine } from "@/lib/bag";
import { formatPrice } from "@/lib/format";
import { resolveBag, type BagLineDisplay } from "@/lib/bagMeta";
import { Container } from "@/components/ui/Container";

function EmptyState() {
  return (
    <div className="flex flex-col items-start gap-6 py-20">
      <p className="type-body text-foreground-secondary">
        Your bag is empty. Add a piece from the collection before checking out.
      </p>
      <Link
        href="/shop"
        className="type-button inline-flex h-14 items-center justify-center bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
      >
        Shop the collection
      </Link>
    </div>
  );
}

function CheckoutItem({ item }: { item: BagLineDisplay }) {
  return (
    <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
      <Link
        href={item.url}
        className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-surface sm:w-24"
      >
        <NextImage
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 64rem) 8vw, 25vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={item.url}
          className="type-nav text-foreground transition-colors duration-standard ease-standard hover:text-accent"
        >
          {item.product.name}
        </Link>
        <p className="type-metadata text-foreground-muted">
          {item.colorName}
          {item.variant.size !== null ? ` · ${item.sizeLabel}` : ""}
        </p>
        <p className="type-metadata text-foreground-muted">Qty: {item.line.quantity}</p>
      </div>
      <p className="type-price text-foreground">{formatPrice(item.linePrice)}</p>
    </li>
  );
}

export function CheckoutPage() {
  const [lines, setLines] = useState<BagLine[]>(() =>
    typeof window === "undefined" ? [] : getBag(),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Listen for bag changes after the client bag is authoritative. The
    // initial value comes from the lazy initializer above, so no synchronous
    // setState is needed here.
    const sync = () => setLines(getBag());
    window.addEventListener(BAG_UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    // Mark as loaded after the first paint so SSR's empty bag never flashes
    // the empty state before hydration reconciles the real bag.
    const raf = requestAnimationFrame(() => setLoaded(true));
    return () => {
      window.removeEventListener(BAG_UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = useMemo(() => resolveBag(lines), [lines]);
  const subtotal = items.reduce((sum, item) => sum + item.linePrice, 0);
  const empty = loaded && items.length === 0;

  return (
    <Container className="pb-24 pt-16 lg:pt-24">
      <div className="flex flex-col gap-6 border-b border-border pb-10 lg:pb-14">
        <p className="type-nav flex items-center gap-3 text-foreground-muted">
          Checkout
          <span aria-hidden="true" className="h-px w-10 bg-border-strong" />
          SUS WEARS
        </p>
        <h1 className="type-display text-foreground">Checkout.</h1>
      </div>

      {!loaded ? (
        <div className="py-20">
          <p className="type-body text-foreground-secondary">Loading…</p>
        </div>
      ) : empty ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12">
          {/* Items */}
          <div className="lg:col-span-8">
            <h2 className="type-h3 mb-6 text-foreground">Your items</h2>
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <CheckoutItem key={`${item.product.id}::${item.variant.id}`} item={item} />
              ))}
            </ul>
          </div>

          {/* Summary */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-4 border border-border p-6">
              <h2 className="type-h3 text-foreground">Order summary</h2>
              <div className="flex items-center justify-between">
                <span className="type-metadata text-foreground-muted">Subtotal</span>
                <span className="type-price text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="type-nav text-foreground">Total</span>
                <span className="type-price text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="type-metadata text-foreground-muted">
                Shipping and any duties are calculated at checkout.
              </p>
            </div>

            {/* Coming soon notice */}
            <div className="border border-border-strong p-6">
              <p className="type-metadata mb-2 text-accent">Coming soon</p>
              <p className="type-body-small text-foreground-secondary">
                Online payment is not yet available. To place an order, contact us via WhatsApp or
                email with the items in your bag.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="mailto:suswears469@gmail.com"
                  className="type-button inline-flex h-12 items-center justify-center border border-border-strong px-6 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
                >
                  Email us
                </a>
                <Link
                  href="/cart"
                  className="type-button inline-flex h-12 items-center justify-center bg-accent px-6 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
                >
                  View bag
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
