import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "./BrandStatement";
import { CraftStory } from "./CraftStory";
import { ImageMoment } from "./ImageMoment";
import { QuietMoment } from "./QuietMoment";
import { StudioSection } from "./StudioSection";
import { WhatsAppCta } from "./WhatsAppCta";

export function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <CraftStory />
      <ImageMoment />
      <QuietMoment />
      <StudioSection />
      <WhatsAppCta />
    </>
  );
}
