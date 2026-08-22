import { BRAND } from "@/data/brand";
import { BRAND_INTRO } from "@/data/homepage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function BrandIntro() {
  return (
    <Section aria-labelledby="brand-intro-heading" className="bg-background">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <Reveal>
          <p className="type-metadata flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
            {BRAND_INTRO.eyebrow} · {BRAND_INTRO.facts[0].value}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-3">
            <h2 id="brand-intro-heading" className="type-display text-foreground">
              {BRAND_INTRO.title}
            </h2>
            <p className="type-h3 text-foreground-secondary">{BRAND_INTRO.intro}</p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="type-editorial max-w-3xl text-foreground">{BRAND_INTRO.statement}</p>
        </Reveal>

        <Reveal delay={280}>
          <p className="type-body max-w-xl text-foreground-secondary">{BRAND_INTRO.supporting}</p>
        </Reveal>

        <Reveal delay={360}>
          <dl className="grid grid-cols-1 gap-6 border-t border-border pt-10 sm:grid-cols-3 lg:pt-12">
            {BRAND_INTRO.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2">
                <dt className="type-metadata text-foreground-muted">{fact.label}</dt>
                <dd className="type-body text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <p className="sr-only">
          {BRAND.name} — {BRAND.legalName}. Founded in Lagos, Nigeria.
        </p>
      </Container>
    </Section>
  );
}