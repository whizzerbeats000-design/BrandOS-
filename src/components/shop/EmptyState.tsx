import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BRAND } from "@/data/brand";

export function EmptyState() {
  return (
    <Container className="flex flex-col gap-12 py-24 lg:gap-16 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="type-metadata text-accent">The collection</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="type-display mt-4 text-foreground">
              Considered pieces<br />for every expression.
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={120}>
            <p className="type-body text-foreground-secondary">
              {BRAND.legalName} — cut unisex in {BRAND.location.city}, {BRAND.location.state}, {BRAND.location.country}. Every silhouette is drafted to sit on the body and move with it.
            </p>
            <p className="type-body mt-6 text-foreground-secondary">
              The full catalogue is being prepared. In the meantime, reach out directly — we respond to every message.
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
