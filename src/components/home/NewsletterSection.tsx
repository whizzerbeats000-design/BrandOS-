"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { NEWSLETTER_COPY } from "@/data/homepage";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter your email address to stay in the world.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("That email doesn't look right — please check it and try again.");
      return;
    }
    setError(null);
    setAccepted(true);
  }

  return (
    <Section aria-labelledby="newsletter-heading">
      <Container>
        <div className="grid gap-10 border-t border-border pt-16 lg:grid-cols-2 lg:gap-[var(--gutter)] lg:pt-24">
          <Reveal>
            <div className="flex flex-col gap-5 lg:gap-6">
              <p className="type-metadata text-foreground-muted">
                {NEWSLETTER_COPY.eyebrow}
              </p>
              <h2 id="newsletter-heading" className="type-h2 text-foreground">
                {NEWSLETTER_COPY.title}
              </h2>
              <p className="type-body text-foreground-secondary">{NEWSLETTER_COPY.description}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 pt-2 lg:pt-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  className="h-12 w-full border border-border bg-background-secondary px-4 text-foreground transition-colors duration-standard ease-standard placeholder:text-foreground-muted focus:border-accent"
                />
                <Button type="submit" size="md" className="h-12 shrink-0 sm:w-auto">
                  Subscribe
                </Button>
              </div>

              <div aria-live="polite" className="min-h-5">
                {error ? (
                  <p id="newsletter-error" role="alert" className="type-body-small text-error">
                    {error}
                  </p>
                ) : null}
                {accepted ? (
                  <p className="type-body-small text-success">
                    Received — we&apos;ll write to you when subscriptions open.
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
