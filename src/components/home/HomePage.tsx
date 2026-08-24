import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "./BrandStatement";
import { BrandIdentity } from "./BrandIdentity";
import { CraftStory } from "./CraftStory";
import { QuietMoment } from "./QuietMoment";
import { ImageMoment } from "./ImageMoment";
import { StudioSection } from "./StudioSection";
import { WhatsAppCta } from "./WhatsAppCta";

export function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <BrandIdentity />
      <CraftStory />
      <ImageMoment />
      <QuietMoment />
      <StudioSection />
      <WhatsAppCta />
    </>
  );
}
