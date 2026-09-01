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
              The first drop<br />is on its way.
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={120}>
            <p className="type-body text-foreground-secondary">
              Pieces are being cut and finished in the {BRAND.location.city} studio now.
              The catalogue will open here when the first run is ready.
            </p>
            <p className="type-body mt-6 text-foreground-secondary">
              In the meantime, reach out directly — we respond to every message.
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
