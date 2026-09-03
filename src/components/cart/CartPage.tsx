"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { BAG_UPDATE_EVENT, clearBag, getBag, setBag, type BagLine } from "@/lib/bag";
import { formatPrice } from "@/lib/format";
import { resolveBag, type BagLineDisplay } from "@/lib/bagMeta";
import { startCheckout } from "@/lib/checkout";
import { Container } from "@/components/ui/Container";

type ContactState = "idle" | "preparing" | "done" | "empty";

export function CartPage() {
  const [lines, setLines] = useState<BagLine[]>(() => getBag());
  const [loaded, setLoaded] = useState(false);
  const [contactState, setContactState] = useState<ContactState>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const sync = () => setLines(getBag());
    window.addEventListener(BAG_UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    // Defer the "empty" decision until after hydration reconciles the real
    // client bag, so SSR's empty shell never flashes or mismatches the
    // hydrated non-empty bag.
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

  const updateQuantity = (item: BagLineDisplay, delta: number) => {
    const next: BagLine[] = lines
      .map((line) => {
        if (line.variantId === item.variant.id && line.productId === item.product.id) {
          const q = line.quantity + delta;
          return q >= 1 && q <= 10 ? { ...line, quantity: q } : line;
        }
        return line;
      })
      .filter((line) => line.quantity >= 1);
    setLines(next);
    setBag(next);
  };

  const removeLine = (item: BagLineDisplay) => {
    const next = lines.filter(
      (line) => !(line.variantId === item.variant.id && line.productId === item.product.id),
    );
    setLines(next);
    setBag(next);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setConfirmClear(false);
    clearBag();
    setLines([]);
    setNotice(null);
  };

  const handleCheckout = async () => {
    setNotice(null);
    if (items.length === 0) {
      setContactState("empty");
      setNotice("Your bag is empty.");
      return;
    }
    setContactState("preparing");
    const result = await startCheckout(lines);
    setContactState("done");
    if (result.ok && result.result) {
      setNotice(result.message);
      window.location.href = result.result.href;
    } else {
      setNotice(result.message);
    }
  };

  return (
    <Container className="pb-24 pt-16 lg:pt-24">
      <div className="flex flex-col gap-6 border-b border-border pb-10 lg:pb-14">
        <p className="type-nav flex items-center gap-3 text-foreground-muted">
          Bag
          <span aria-hidden="true" className="h-px w-10 bg-border-strong" />
          SUS WEARS
        </p>
        <h1 className="type-display text-foreground">Your bag.</h1>
      </div>

      {!loaded ? (
        <div className="py-20">
          <p className="type-body text-foreground-secondary">Loading…</p>
        </div>
      ) : empty ? (
        <div className="flex flex-col items-start gap-6 py-20">
          <p className="type-body text-foreground-secondary">
            Your bag is empty. Add a piece from the collection.
          </p>
          <Link
            href="/shop"
            className="type-button inline-flex h-14 items-center justify-center bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
          >
            Shop the collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12">
          {/* Lines */}
          <ul className="flex flex-col divide-y divide-border lg:col-span-8">
            {items.map((item) => (
              <li key={`${item.product.id}::${item.variant.id}`} className="flex flex-col gap-5 py-8 sm:flex-row">
                <Link
                  href={item.url}
                  className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-surface sm:w-32"
                >
                  <NextImage
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 64rem) 12vw, 30vw"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
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
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(item)}
                      aria-label={`Remove ${item.product.name}`}
                      className="type-metadata text-foreground-muted underline underline-offset-4 transition-colors duration-standard ease-standard hover:text-error"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="inline-flex items-center border border-border-strong">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        onClick={() => updateQuantity(item, -1)}
                        disabled={item.line.quantity <= 1}
                        className="flex h-10 w-10 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span aria-live="polite" className="type-body w-12 text-center text-foreground">
                        {item.line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.product.name}`}
                        onClick={() => updateQuantity(item, 1)}
                        disabled={item.line.quantity >= 10}
                        className="flex h-10 w-10 items-center justify-center text-foreground-secondary transition-colors duration-standard ease-standard hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                    <p className="type-price text-foreground">{formatPrice(item.linePrice)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-4 border border-border p-6">
              <h2 className="type-h3 text-foreground">Summary</h2>
              <div className="flex items-center justify-between">
                <span className="type-metadata text-foreground-muted">Subtotal</span>
                <span className="type-price text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="type-nav text-foreground">Total</span>
                <span className="type-price text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="type-metadata text-foreground-muted">
                Shipping and any duties are confirmed with your order.
              </p>

              {notice ? (
                <p
                  aria-live="polite"
                  className="type-metadata border border-border-strong px-4 py-3 text-foreground-secondary"
                >
                  {notice}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={contactState === "preparing"}
                className="type-button h-14 w-full bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-50"
              >
                {contactState === "preparing" ? "Preparing your order…" : "Contact to order"}
              </button>
              <p className="type-metadata text-foreground-muted">
                We take pre-launch orders directly on WhatsApp. Your pieces stay safe in the bag.
              </p>

              <button
                type="button"
                onClick={handleClear}
                onBlur={() => setConfirmClear(false)}
                aria-expanded={confirmClear}
                className="type-metadata text-foreground-muted underline underline-offset-4 transition-colors duration-standard ease-standard hover:text-error"
              >
                {confirmClear ? "Confirm clear bag?" : "Clear bag"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}