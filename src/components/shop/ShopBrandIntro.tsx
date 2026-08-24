"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { buildWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE, whatsappEnabled } from "@/lib/integrations";
import { CONTACT_EMAIL } from "@/data/nav";
import { BRAND } from "@/data/brand";

export function ShopBrandIntro() {
  const waEnabled = whatsappEnabled();
  const primaryHref = waEnabled
    ? buildWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE)
    : `mailto:${CONTACT_EMAIL}`;
  const primaryLabel = waEnabled ? "Chat with SUS" : "Email SUS WEARS";

  return (
    <Container className="flex flex-col gap-16 pb-16 lg:gap-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="type-metadata text-accent">The collection</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="type-display mt-4 text-foreground">
              Considered pieces<br />for every expression.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="type-body mt-6 max-w-md text-foreground-secondary">
              {BRAND.legalName} — cut unisex in {BRAND.location.city}, {BRAND.location.state}, {BRAND.location.country}. Every silhouette is drafted to sit on the body and move with it.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
          <Reveal delay={200}>
            <div className="border-t border-border pt-8">
              <p className="type-metadata text-foreground-muted">Enquiry</p>
              <p className="type-h3 mt-3 text-foreground">
                Have something specific in mind?
              </p>
              <p className="type-body mt-3 text-foreground-secondary">
                The full catalogue is being prepared. In the meantime, reach out directly — we respond to every message.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={primaryHref}
                  className="type-button inline-flex h-12 items-center justify-center bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
                >
                  {primaryLabel}
                </a>
                <a
                  href={waEnabled ? buildWhatsAppUrl("Custom request") : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Custom request")}`}
                  className="type-nav border-b border-foreground/30 pb-1 text-foreground transition-colors duration-standard ease-standard hover:border-accent hover:text-accent"
                >
                  Custom request
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
