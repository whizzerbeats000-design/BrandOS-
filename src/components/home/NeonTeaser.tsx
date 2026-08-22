import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { AI_NEON, neonEnabled, neonVisible } from "@/lib/integrations";
import { NEON_TEASER } from "@/data/homepage";

/** Homepage entry point for the Neon style concierge.
 *  Hidden entirely unless the Neon gateway is visible+configured. */
export function NeonTeaser() {
  if (!neonVisible() || !neonEnabled()) return null;

  return (
    <Section aria-labelledby="neon-heading" className="bg-background">
      <Container className="flex max-w-3xl flex-col items-start gap-5 lg:gap-6">
        <Reveal>
          <p className="type-metadata flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
            {NEON_TEASER.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="neon-heading" className="type-display text-foreground">
            {NEON_TEASER.name}
            <span className="block italic text-accent-muted">{NEON_TEASER.title}</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="type-body max-w-xl text-foreground-secondary">{NEON_TEASER.description}</p>
        </Reveal>
        <Reveal delay={300}>
          <Button href={NEON_TEASER.cta.href} variant="outline" size="lg">
            {NEON_TEASER.cta.label}
          </Button>
        </Reveal>
        <p className="sr-only">{AI_NEON.role}</p>
      </Container>
    </Section>
  );
}