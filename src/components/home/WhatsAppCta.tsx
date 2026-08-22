import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import {
  buildWhatsAppUrl,
  WHATSAPP_DEFAULT_MESSAGE,
  whatsappEnabled,
} from "@/lib/integrations";
import { CONTACT_EMAIL } from "@/data/nav";
import { CONTACT_CTA } from "@/data/homepage";

/**
 * The deep moment — a warm charcoal band that closes the page.
 * WhatsApp when a business number is configured; otherwise a plain
 * mail fallback. The number is never rendered in the UI.
 */
export function WhatsAppCta() {
  const waEnabled = whatsappEnabled();
  const primary = waEnabled
    ? { label: CONTACT_CTA.primary.label, href: buildWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE) }
    : { label: "Email SUS WEARS", href: `mailto:${CONTACT_EMAIL}` };
  const secondary = waEnabled
    ? { ...CONTACT_CTA.secondary, href: buildWhatsAppUrl(CONTACT_CTA.secondary.label) }
    : {
        label: CONTACT_CTA.secondary.label,
        href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Custom request")}`,
      };

  return (
    <Section aria-labelledby="contact-heading" className="bg-deep section-depth">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex max-w-3xl flex-col gap-5 lg:gap-7">
          <Reveal>
            <p className="type-metadata text-ivory-secondary">{CONTACT_CTA.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="contact-heading" className="type-display text-pretty text-ivory">
              {CONTACT_CTA.title}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="type-body max-w-xl text-ivory-secondary">{CONTACT_CTA.description}</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Reveal delay={220}>
            <a
              href={primary.href}
              className="type-button inline-flex h-12 items-center justify-center bg-ivory px-8 text-deep transition-colors duration-standard ease-standard hover:bg-[#FFFFFF]"
            >
              {primary.label}
            </a>
          </Reveal>
          <Reveal delay={280}>
            <a
              href={secondary.href}
              className="type-nav border-b border-ivory/40 pb-1 text-ivory transition-colors duration-standard ease-standard hover:border-ivory"
            >
              {secondary.label}
            </a>
          </Reveal>
        </div>

        {waEnabled ? null : (
          <Reveal delay={340}>
            <p className="type-body-small max-w-lg text-ivory-secondary">
              {CONTACT_CTA.secondary.note} Email: {CONTACT_EMAIL}
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}