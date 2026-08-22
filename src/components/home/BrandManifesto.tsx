import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MANIFESTO } from "@/data/homepage";

export function BrandManifesto() {
  return (
    <Section aria-labelledby="manifesto-heading" className="bg-background-secondary">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <Reveal>
          <p className="type-metadata flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
            {MANIFESTO.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h2 id="manifesto-heading" className="type-manifesto text-foreground">
            {MANIFESTO.lines[0]}
            <span className="block italic text-accent-muted">{MANIFESTO.lines[1]}</span>
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="type-body max-w-xl text-foreground-secondary">{MANIFESTO.supporting}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
