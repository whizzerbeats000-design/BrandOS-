import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SUS_WORLD_TEASER } from "@/data/homepage";

export function SusWorldTeaser() {
  const teaser = SUS_WORLD_TEASER;

  return (
    <Section aria-labelledby="susworld-heading" padding="none">
      <div className="relative flex h-[80vh] min-h-[34rem] items-center overflow-hidden lg:h-[90vh]">
        <Media media={teaser.media} sizes="100vw" className="absolute inset-0" />
        <div aria-hidden="true" className="absolute inset-0 bg-background/55" />

        <Container className="relative z-10 flex flex-col items-center gap-5 text-center lg:gap-6">
          <Reveal>
            <p className="type-metadata text-accent">{teaser.eyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 id="susworld-heading" className="type-display max-w-4xl text-foreground">
              {teaser.title}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="type-body max-w-xl text-foreground-secondary">{teaser.statement}</p>
          </Reveal>
          <Reveal delay={300}>
            <Button href={teaser.cta.href} variant="outline" size="lg">
              {teaser.cta.label}
            </Button>
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
