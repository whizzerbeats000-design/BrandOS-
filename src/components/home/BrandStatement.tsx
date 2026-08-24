import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EditorialHeading } from "@/components/editorial/EditorialHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Media } from "@/components/ui/Media";
import { GlassCard } from "@/components/ui/GlassCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { BRAND } from "@/data/brand";

const BRAND_FACTS = [
  { label: "Founded", value: String(BRAND.foundedYear) },
  { label: "Legal name", value: BRAND.legalName },
  { label: "Based in", value: BRAND.location.flat },
] as const;

export function BrandStatement() {
  return (
    <Section
      aria-labelledby="brand-statement-heading"
      padding="section"
      className="relative overflow-hidden bg-background section-depth"
    >
      {/* Subtle mobile background image — visual continuity from hero */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <Media
          media={{
            desktop: "/images/home/brand-statement.webp",
            mobile: "/images/campaign/campaign-01-hero-mobile.webp",
            alt: "",
            focalPoint: { x: 55, y: 40 },
          }}
          sizes="100vw"
          className="h-full w-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10">
          <Reveal className="col-span-12 lg:col-span-3 lg:col-start-10">
            <p className="type-metadata text-foreground-muted">01 — The House</p>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-9">
            <EditorialHeading
              as="h2"
              id="brand-statement-heading"
              size="display"
              lines={["Clothing with", "a point of view."]}
              italicLine={1}
            />
          </Reveal>

          <Reveal
            delay={120}
            className="col-span-12 lg:col-span-4 lg:col-start-6"
          >
            <p className="type-body text-foreground-secondary">
              SUS WEARS is an independent Nigerian fashion brand cut from a
              single language. Men and women, one wardrobe — made to fit the
              body, not the catalogue.
            </p>
            <p className="type-metadata mt-8 text-foreground-muted">
              {BRAND.legalName} · Est. {BRAND.foundedYear} · {BRAND.location.city},{" "}
              {BRAND.location.state}, {BRAND.location.country}
            </p>
          </Reveal>

          {/* Desktop glass info surface — verified brand facts only */}
          <Reveal delay={200} className="col-span-12 lg:col-span-3 lg:col-start-10">
            <GlassCard intensity="thin" className="hidden lg:block">
              <div className="flex flex-col gap-5">
                {BRAND_FACTS.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1">
                    <span className="type-metadata text-foreground-muted">{fact.label}</span>
                    <span className="type-body text-foreground">{fact.value}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-4">
                  <span className="type-metadata text-foreground-muted">Contact</span>
                  <span className="type-body block text-foreground">{BRAND.contact.email}</span>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}