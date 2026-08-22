import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { DepthImage } from "@/components/editorial/DepthImage";
import { CRAFT_STORY } from "@/data/homepage";
import { EDITORIAL_FEATURE } from "@/data/editorial";

export function EditorialMoment() {
  const feature = EDITORIAL_FEATURE;

  return (
    <Section aria-labelledby="editorial-moment-heading" className="bg-surface-elevated section-depth">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-[var(--gutter)]">
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
          <Reveal>
            <p className="type-metadata text-foreground-muted">
              {feature.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 id="editorial-moment-heading" className="type-h1 text-foreground">
              {feature.title}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="type-editorial text-foreground">{CRAFT_STORY.statement}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="type-body text-foreground-secondary">{feature.intro}</p>
          </Reveal>
          <Reveal delay={300}>
            <Button href={feature.cta.href} variant="text" size="md" className="mt-2 self-start">
              {feature.cta.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="zoom">
            <DepthImage
              media={feature.media}
              tilt
              parallax
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="aspect-[16/10]"
            />
          </Reveal>
          <figure className="mt-8 border-l border-foreground/20 pl-6 lg:ml-[var(--gutter)]">
            <blockquote className="type-editorial text-foreground">{feature.pullQuote}</blockquote>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
