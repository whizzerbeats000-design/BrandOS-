import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "./BrandStatement";
import { CollectionShowcase } from "./CollectionShowcase";
import { CraftStory } from "./CraftStory";
import { ImageMoment } from "./ImageMoment";
import { QuietMoment } from "./QuietMoment";
import { StudioSection } from "./StudioSection";
import { WhatsAppCta } from "./WhatsAppCta";

export function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        SUS WEARS — Contemporary unisex fashion brand from Lagos, Nigeria
      </h1>
      <Hero />
      <BrandStatement />
      <CollectionShowcase />
      <CraftStory />
      <ImageMoment />
      <QuietMoment />
      <StudioSection />
      <WhatsAppCta />
    </>
  );
}
