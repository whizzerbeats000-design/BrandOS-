import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <Container className="flex flex-col items-start justify-center gap-8">
        <p className="type-metadata text-accent">404</p>
        <h1 className="type-h1 text-foreground">Page not found.</h1>
        <p className="type-body max-w-md text-foreground-secondary">
          The piece you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/shop"
          className="type-button inline-flex h-14 items-center justify-center bg-accent px-8 text-accent-contrast transition-colors duration-standard ease-standard hover:bg-accent-hover"
        >
          Back to shop
        </Link>
      </Container>
    </Section>
  );
}
