import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { WORLD_STORIES } from "@/data/world";
import type { WorldStory } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  people: "People",
  city: "City",
  sound: "Sound",
  culture: "Culture",
  style: "Style",
  art: "Art",
};

function WorldStoryCard({ story }: { story: WorldStory }) {
  return (
    <Reveal>
      <a href={`/sus-world/${story.slug}`} className="group block">
        <Media
          media={story.heroImage}
          sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
          className="aspect-[4/5] transition-transform duration-slow ease-accent group-hover:scale-[1.04]"
        />
        <div className="mt-4 flex flex-col gap-2">
          <p className="type-metadata text-foreground-muted">
            {CATEGORY_LABELS[story.category] ?? story.category}
          </p>
          <h2 className="type-h3 text-foreground transition-colors duration-standard ease-standard group-hover:text-accent">
            {story.title}
          </h2>
          <p className="type-body-small line-clamp-2 text-foreground-secondary">{story.excerpt}</p>
        </div>
      </a>
    </Reveal>
  );
}

export function SusWorldPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-background">
        <Container className="flex flex-col gap-6 py-16 lg:py-24">
          <Reveal variant="blur-reveal">
            <p className="type-metadata flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-accent/60" />
              SUS World
            </p>
          </Reveal>
          <Reveal variant="blur-reveal" delay={80}>
            <h1 className="type-hero max-w-3xl text-foreground">
              Houses, rituals, movement and sound.
            </h1>
          </Reveal>
          <Reveal variant="blur-reveal" delay={160}>
            <p className="type-editorial max-w-xl text-foreground-secondary">
              An ecosystem that began in one studio and now moves through the world — people,
              places, and the culture that connects them.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Stories grid */}
      <Section padding="small">
        <Container>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {WORLD_STORIES.map((story) => (
              <li key={story.id}>
                <WorldStoryCard story={story} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
