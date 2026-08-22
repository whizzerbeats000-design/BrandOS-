import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialHeading } from "@/components/editorial/EditorialHeading";
import { MagneticLink } from "@/components/editorial/MagneticLink";
import { DepthImage } from "@/components/editorial/DepthImage";
import { COLLECTIONS } from "@/data/collections";

/**
 * Collections — three art-directed acts, not a repeating row.
 *
 *   Act I    Signature — tall image plane bleeding past the right edge,
 *            copy set low against it.
 *   Act II   After Dark — the plane bleeds off the left edge and drops,
 *            while the copy holds the top-right corner.
 *   Act III  Limited — an edge-to-edge photographic band with a printed
 *            ivory panel floating over its lower-left corner.
 */
export function CollectionShowcase() {
  const [first, second, third] = COLLECTIONS;

  return (
    <Section
      aria-labelledby="collections-heading"
      padding="none"
      className="bg-background"
    >
      <h2 id="collections-heading" className="sr-only">
        Collections
      </h2>

      <Container className="flex flex-col">
        <ActOne collection={first} />
        <ActTwo collection={second} />
      </Container>

      {third ? <ActThree collection={third} /> : null}
    </Section>
  );
}

function ActOne({ collection }: { collection: (typeof COLLECTIONS)[number] }) {
  return (
    <article className="grid grid-cols-12 items-start gap-x-[var(--gutter)] gap-y-10">
      <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:col-start-1 lg:gap-7 lg:pt-24">
        <EditorialHeading as="h3" size="h1" lines={[collection.name]} />
        <p className="type-editorial max-w-sm text-foreground-secondary">
          {collection.shortDescription}
        </p>
        <p className="type-metadata text-foreground-muted">
          {collection.season} · {collection.tagline}
        </p>
        <MagneticLink href={collection.cta.href}>{collection.cta.label}</MagneticLink>
      </Reveal>

      <Reveal
        delay={100}
        className="col-span-12 lg:col-span-7 lg:col-start-6"
      >
        <DepthImage
          media={collection.heroImage}
          tilt
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="aspect-[4/5] lg:aspect-[3/4]"
        />
      </Reveal>
    </article>
  );
}

function ActTwo({ collection }: { collection: (typeof COLLECTIONS)[number] }) {
  return (
    <article className="grid grid-cols-12 items-start gap-x-[var(--gutter)] gap-y-10">
      <Reveal
        delay={100}
        className="col-span-12 lg:col-span-7 lg:col-start-1 lg:mt-24"
      >
        <DepthImage
          media={collection.heroImage}
          parallax
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="aspect-[3/4]"
        />
      </Reveal>

      <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:col-start-10 lg:gap-7">
        <p className="type-display text-foreground-muted">02</p>
        <EditorialHeading as="h3" size="h1" lines={[collection.name]} />
        <p className="type-editorial max-w-sm text-foreground-secondary">
          {collection.shortDescription}
        </p>
        <MagneticLink href={collection.cta.href}>{collection.cta.label}</MagneticLink>
      </Reveal>
    </article>
  );
}

function ActThree({ collection }: { collection: (typeof COLLECTIONS)[number] }) {
  return (
    <section className="relative mt-28 lg:mt-44" aria-label={collection.name}>
      <div className="plane plane--deep">
        <Media
          media={collection.heroImage}
          sizes="100vw"
          className="aspect-[16/10] lg:aspect-[21/9]"
        />
      </div>

      <div className="relative z-10 mx-gutter -mt-20 max-w-xl bg-background p-8 lg:absolute lg:bottom-12 lg:left-gutter lg:m-0 lg:p-12 lg:shadow-[var(--shadow-plane-md)]">
        <p className="type-display text-foreground-muted">03</p>
        <EditorialHeading as="h3" size="h2" lines={[collection.name]} className="mt-4" />
        <p className="type-editorial mt-4 max-w-md text-foreground-secondary">
          {collection.shortDescription}
        </p>
        <MagneticLink href={collection.cta.href} className="mt-6">
          {collection.cta.label}
        </MagneticLink>
      </div>

      <p className="absolute bottom-14 right-gutter hidden type-metadata text-ivory-secondary lg:block">
        {collection.tagline}
      </p>
    </section>
  );
}
