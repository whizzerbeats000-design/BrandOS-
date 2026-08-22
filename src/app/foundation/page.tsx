import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { SusImage } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { IMAGES } from "@/data/images";

const TYPOGRAPHY = [
  { level: "display", label: "Display — campaign statements" },
  { level: "hero", label: "Hero — page openings" },
  { level: "h1", label: "Heading 1" },
  { level: "h2", label: "Heading 2" },
  { level: "h3", label: "Heading 3" },
  { level: "editorial", label: "Editorial — long-form voice" },
  { level: "body", label: "Body copy" },
  { level: "body-small", label: "Body small" },
  { level: "nav", label: "Navigation" },
  { level: "metadata", label: "Metadata & labels" },
  { level: "price", label: "Price" },
] as const;

const SWATCHES = [
  { name: "Background", token: "bg", value: "#0b0a09" },
  { name: "Surface", token: "surface", value: "#171513" },
  { name: "Foreground", token: "fg", value: "#f2ede4" },
  { name: "Foreground muted", token: "fg-muted", value: "#8a8375" },
  { name: "Border", token: "border", value: "#2a2620" },
  { name: "Accent", token: "accent", value: "#c2a878" },
] as const;

export default function Home() {
  return (
    <>
      <Section padding="small">
        <Container className="flex max-w-[var(--max-width-text)] flex-col gap-8">
          <Typography level="display">Foundation</Typography>
          <Typography level="editorial">
            Dark luxury, editorial, and uncompromising. This page verifies the design system —
            tokens, typography, primitives, imagery, and motion — before any real storefront work
            begins.
          </Typography>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container className="flex flex-col gap-12">
          <Typography level="h2">Typography</Typography>
          <div className="flex flex-col">
            {TYPOGRAPHY.map(({ level, label }) => (
              <div
                key={level}
                className="grid gap-2 border-t border-border py-6 md:grid-cols-[16rem_1fr] md:gap-10"
              >
                <Typography level="metadata" className="pt-2 text-foreground-muted">
                  {label}
                </Typography>
                <Typography level={level}>{level}</Typography>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container className="flex flex-col gap-12">
          <Typography level="h2">Colour</Typography>
          <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
            {SWATCHES.map(({ name, token, value }) => (
              <div key={token} className="flex flex-col bg-background">
                <div className="h-28" style={{ backgroundColor: value }} />
                <div className="flex flex-col gap-1 border-t border-border p-4">
                  <Typography level="metadata">{name}</Typography>
                  <Typography level="body-small" className="text-foreground-muted">
                    {value}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container className="flex flex-col gap-12">
          <Typography level="h2">Primitives</Typography>

          <div className="flex flex-col gap-6">
            <Typography level="metadata" className="text-foreground-muted">
              Buttons
            </Typography>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Shop now</Button>
              <Button variant="outline">Explore collection</Button>
              <Button variant="ghost">Wishlist</Button>
              <Button variant="text" href="#">
                View all
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Typography level="metadata" className="text-foreground-muted">
              Badges
            </Typography>
            <div className="flex flex-wrap gap-4">
              <Badge>New season</Badge>
              <Badge variant="accent">Limited</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Typography level="metadata" className="text-foreground-muted">
              Input
            </Typography>
            <div className="max-w-sm">
              <Input id="newsletter" label="Email address" type="email" placeholder="you@example.com" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Typography level="metadata" className="text-foreground-muted">
              Imagery
            </Typography>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <SusImage {...IMAGES.product} sizes="(max-width: 768px) 100vw, 33vw" />
              <SusImage {...IMAGES.editorial} sizes="(max-width: 768px) 100vw, 33vw" />
              <SusImage {...IMAGES.product} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container className="flex flex-col gap-12">
          <Typography level="h2">Motion</Typography>
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal variant="fade">
              <div className="border border-border p-8">
                <Typography level="h3">Fade</Typography>
              </div>
            </Reveal>
            <Reveal variant="reveal" delay={120}>
              <div className="border border-border p-8">
                <Typography level="h3">Reveal</Typography>
              </div>
            </Reveal>
            <Reveal variant="zoom" delay={240}>
              <div className="border border-border p-8">
                <Typography level="h3">Zoom</Typography>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
