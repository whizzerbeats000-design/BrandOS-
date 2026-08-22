import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EDITORIAL_FEATURE } from "@/data/editorial";

export function EditorialFeature() {
  const feature = EDITORIAL_FEATURE;

  return (
    <Section aria-labelledby="editorial-heading">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="flex flex-col justify-end gap-5 lg:col-span-4 lg:gap-6 lg:pb-12">
          <Reveal>
            <p className="type-metadata flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
              {feature.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 id="editorial-heading" className="type-h1 text-foreground">
              {feature.title}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="type-body text-foreground-secondary">{feature.intro}</p>
          </Reveal>
          <Reveal delay={300}>
            <Button href={feature.cta.href} variant="text" size="md" className="mt-2">
              {feature.cta.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal variant="zoom">
            <Media
              media={feature.media}
              sizes="(max-width: 1023px) 100vw, 60vw"
              className="aspect-[4/3] lg:aspect-[16/11]"
            />
          </Reveal>
          <figure className="mt-8 border-l-2 border-accent pl-6 lg:ml-[var(--gutter)]">
            <blockquote className="type-editorial text-foreground">{feature.pullQuote}</blockquote>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
