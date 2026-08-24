import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/data/brand";
import { FOOTER_NAV, SOCIAL_NAV, CONTACT_EMAIL } from "@/data/nav";
import { buildWhatsAppUrl, whatsappEnabled } from "@/lib/integrations";

const LINK_CLASSES =
  "type-nav text-foreground-muted transition-colors duration-standard ease-standard hover:text-foreground";

export function Footer() {
  const whatsappOn = whatsappEnabled();

  return (
    <footer className="border-t border-border bg-background pb-safe">
      <Container className="pt-[var(--space-12)] pb-[var(--space-10)] lg:pt-[var(--space-16)] lg:pb-[var(--space-12)]">
        <div className="flex flex-col gap-[var(--space-4)]">
          <p className="type-label text-foreground-muted">
            Est. {BRAND.foundedYear} · {BRAND.location.city}, {BRAND.location.state}, {BRAND.location.country}
          </p>
          <h2 className="type-quote max-w-2xl text-foreground">
            &ldquo;{BRAND.tagline}.&rdquo;
          </h2>
          <p className="type-body max-w-xl text-foreground-muted">
            {BRAND.name} — {BRAND.legalName}. {BRAND.descriptor} from {BRAND.location.flat}, cut unisex
            for men and women since {BRAND.foundedYear}.
          </p>
          <p className="type-body text-foreground-muted">
            {BRAND.location.address}
          </p>
        </div>
      </Container>

      <Container className="border-t border-border py-[var(--space-12)] lg:py-[var(--space-16)]">
        <div className="grid gap-[var(--space-10)] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[var(--space-8)]">
          <nav aria-label="Footer">
            <p className="type-metadata mb-[var(--space-4)] text-foreground-muted">Explore</p>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK_CLASSES}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer">
            <p className="type-metadata mb-[var(--space-4)] text-foreground-muted">Customer</p>
            <ul className="flex flex-col gap-[var(--space-3)]">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASSES}>
                  Contact
                </a>
              </li>
              {whatsappOn ? (
                <li>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASSES}
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              <li>
                <Link href="/shop" className={LINK_CLASSES}>
                  Shopping
                </Link>
              </li>
            </ul>
          </nav>

          {SOCIAL_NAV.length > 0 ? (
            <div>
              <p className="type-metadata mb-[var(--space-4)] text-foreground-muted">Follow</p>
              <ul className="flex flex-col gap-[var(--space-3)]">
                {SOCIAL_NAV.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASSES}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-[var(--space-3)] border-t border-border py-[var(--space-6)] sm:flex-row sm:items-center sm:justify-between">
          <p className="type-metadata text-foreground-muted">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
