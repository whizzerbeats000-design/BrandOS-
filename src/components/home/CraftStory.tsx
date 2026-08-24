import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CRAFT_STORY } from "@/data/homepage";

export function CraftStory() {
  return (
    <Section aria-labelledby="craft-heading" className="bg-background-secondary">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-[var(--gutter)]">
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
          <Reveal>
            <p className="type-metadata text-accent">
              {CRAFT_STORY.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 id="craft-heading" className="type-h1 text-foreground">
              {CRAFT_STORY.title}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="type-editorial text-foreground">{CRAFT_STORY.statement}</p>
          </Reveal>

          <Reveal delay={300}>
            <Button href={CRAFT_STORY.cta.href} variant="text" size="md" className="mt-2 self-start">
              {CRAFT_STORY.cta.label}
            </Button>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="wipe">
            <Media
              media={CRAFT_STORY.media}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="aspect-[3/4]"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}