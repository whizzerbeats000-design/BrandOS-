import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { InfoCard } from "@/components/ui/InfoCard";
import { BRAND } from "@/data/brand";

const IDENTITY_FACTS = [
  {
    eyebrow: "The House",
    title: BRAND.legalName,
    description: `${BRAND.descriptor} — cut from a single language, made to fit the body, not the catalogue.`,
  },
  {
    eyebrow: "Origin",
    title: `Jos, ${BRAND.origin.state}`,
    description: `Founded in Lagos in ${BRAND.foundedYear}. The brand grew from practical tailoring experience and a clear sense of how people dress in one of Nigeria's most dynamic cities.`,
  },
  {
    eyebrow: "Contact",
    title: "Real people, real cloth",
    description: `Bespoke requests are welcome. WhatsApp ${BRAND.contact.whatsapp} or email ${BRAND.contact.email}.`,
  },
] as const;

export function BrandIdentity() {
  return (
    <Section aria-labelledby="identity-heading" className="bg-background">
      <Container>
        <div className="flex flex-col gap-10 lg:gap-16">
          <Reveal>
            <p className="type-metadata flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
              Brand identity
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {IDENTITY_FACTS.map((fact, index) => (
              <Reveal key={fact.title} delay={index * 100}>
                <InfoCard
                  eyebrow={fact.eyebrow}
                  title={fact.title}
                  description={fact.description}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
