import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { EDITORIAL_ENTRIES, EDITORIAL_FEATURE, type EditorialEntry } from "@/data/editorial";

function EditorialHero() {
  return (
    <Section className="relative overflow-hidden bg-background">
      <Container className="relative z-10 grid gap-8 py-16 lg:grid-cols-12 lg:items-center lg:gap-[var(--gutter)] lg:py-24">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Reveal variant="blur-reveal">
            <p className="type-metadata flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
              {EDITORIAL_FEATURE.eyebrow}
            </p>
          </Reveal>
          <Reveal variant="blur-reveal" delay={80}>
            <h1 className="type-hero text-foreground">{EDITORIAL_FEATURE.title}</h1>
          </Reveal>
          <Reveal variant="blur-reveal" delay={160}>
            <p className="type-editorial max-w-lg text-foreground-secondary">
              {EDITORIAL_FEATURE.intro}
            </p>
          </Reveal>
          <Reveal variant="blur-reveal" delay={240}>
            <blockquote className="border-l-2 border-accent pl-5">
              <p className="type-h3 italic text-foreground">{EDITORIAL_FEATURE.pullQuote}</p>
            </blockquote>
          </Reveal>
        </div>
        <Reveal variant="zoom" delay={120} className="lg:col-span-7">
          <Media
            media={EDITORIAL_FEATURE.media}
            sizes="(min-width: 64rem) 58vw, 100vw"
            className="aspect-[4/5] lg:aspect-[16/10]"
          />
        </Reveal>
      </Container>
    </Section>
  );
}

function EditorialCard({ entry }: { entry: EditorialEntry }) {
  return (
    <Reveal>
      <a href={`/editorial/${entry.slug}`} className="group block">
        <Media
          media={entry.heroImage}
          sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
          className="aspect-[4/5] transition-transform duration-slow ease-accent group-hover:scale-[1.04]"
        />
        <div className="mt-4 flex flex-col gap-2">
          <p className="type-metadata text-foreground-muted">{entry.eyebrow}</p>
          <h2 className="type-h3 text-foreground transition-colors duration-standard ease-standard group-hover:text-accent">
            {entry.title}
          </h2>
          <p className="type-body-small line-clamp-2 text-foreground-secondary">{entry.excerpt}</p>
        </div>
      </a>
    </Reveal>
  );
}

export function EditorialPage() {
  const entries = EDITORIAL_ENTRIES.filter((e) => e.id !== EDITORIAL_FEATURE.id);

  return (
    <>
      <EditorialHero />

      <Section padding="small">
        <Container>
          <div className="border-t border-border pt-10">
            <Typography level="metadata" className="mb-8 text-foreground-muted">
              More stories
            </Typography>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <EditorialCard entry={entry} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
