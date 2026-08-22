import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

interface PagePlaceholderProps {
  title: string;
  kicker: string;
}

export function PagePlaceholder({ title, kicker }: PagePlaceholderProps) {
  return (
    <Section>
      <Container width="text" className="flex min-h-[50vh] flex-col justify-center gap-8">
        <Typography level="metadata" className="text-foreground-muted">
          {kicker}
        </Typography>
        <Typography level="h1">{title}</Typography>
        <Typography level="body" className="max-w-xl text-foreground-secondary">
          This page will be built in a later phase of the SUS WEARS project. The navigation shell is
          ready for it.
        </Typography>
      </Container>
    </Section>
  );
}
