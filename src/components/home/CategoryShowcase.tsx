import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CATEGORY_SHOWCASE } from "@/data/homepage";
import { cn } from "@/lib/cn";

export function CategoryShowcase() {
  const [first, ...rest] = CATEGORY_SHOWCASE.items;

  return (
    <Section aria-labelledby="categories-heading" className="bg-background">
      <Container className="flex flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div className="flex flex-col gap-5 lg:gap-6">
              <p className="type-metadata text-foreground-muted">
                {CATEGORY_SHOWCASE.eyebrow}
              </p>
              <h2 id="categories-heading" className="type-h1 max-w-2xl text-foreground">
                {CATEGORY_SHOWCASE.title}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="type-body max-w-md text-foreground-secondary lg:pb-2">
              {CATEGORY_SHOWCASE.description}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-[var(--gutter)] lg:grid-cols-12 lg:items-start">
          <Reveal variant="zoom" className="lg:col-span-8">
            <CategoryTile item={first} priority layout="campaign" />
          </Reveal>

          <div className="flex flex-col gap-[var(--gutter)] lg:col-span-4 lg:pt-12">
            {rest.map((item, index) => (
              <Reveal key={item.id} variant="zoom" delay={120 * (index + 1)}>
                <CategoryTile item={item} layout="compact" />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CategoryTile({
  item,
  priority = false,
  layout = "compact",
}: {
  item: (typeof CATEGORY_SHOWCASE.items)[number];
  priority?: boolean;
  layout?: "campaign" | "compact";
}) {
  const isCampaign = layout === "campaign";
  return (
    <a
      href={item.href}
      className={cn(
        "group relative block overflow-hidden bg-surface",
        isCampaign ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/5]",
      )}
      aria-label={`${item.label} — ${item.description}`}
    >
      <Media
        media={item.media}
        sizes={isCampaign ? "(max-width: 1023px) 100vw, 62vw" : "(max-width: 1023px) 100vw, 30vw"}
        priority={priority}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent transition-opacity duration-standard ease-standard group-hover:opacity-70",
          isCampaign && "from-background/60 via-transparent to-transparent",
        )}
      />

      {isCampaign ? (
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
          <p className="type-metadata text-foreground-muted">{item.description}</p>
          <h3 className="type-display mt-2 max-w-xl text-foreground">{item.label}</h3>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="type-h3 text-foreground">{item.label}</h3>
            <p className="type-body-small text-foreground-secondary">{item.description}</p>
          </div>
          <span
            aria-hidden="true"
            className="type-nav text-foreground-muted transition-transform duration-standard ease-standard group-hover:translate-x-1 group-hover:text-foreground"
          >
            View →
          </span>
        </div>
      )}
    </a>
  );
}
