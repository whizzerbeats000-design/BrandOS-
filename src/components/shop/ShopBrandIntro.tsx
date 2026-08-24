"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { FloatingCta } from "@/components/ui/FloatingCta";
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
    <Container className="flex flex-col gap-10 pb-16 lg:gap-16">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-5">
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

        <div className="grid gap-6 lg:col-span-7 lg:grid-cols-2">
          <Reveal delay={120}>
            <InfoCard
              eyebrow="The house"
              title={BRAND.legalName}
              description={`Founded in ${BRAND.foundedYear}. ${BRAND.descriptor} built on tailoring craft, contemporary style, and attention to detail.`}
            />
          </Reveal>
          <Reveal delay={200}>
            <InfoCard
              eyebrow="Contact"
              title="Real people, real cloth"
              description="Bespoke requests are welcome. Talk to us about a specific piece, a custom request, or simply ask a question."
            />
          </Reveal>
        </div>
      </div>

      <Reveal delay={280}>
        <FloatingCta
          eyebrow="Enquiry"
          title="Have something specific in mind?"
          description="The full catalogue is being prepared. In the meantime, reach out directly — we respond to every message."
          primaryAction={{
            label: primaryLabel,
            href: primaryHref,
          }}
        />
      </Reveal>
    </Container>
  );
}
