import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "./BrandStatement";
import { CategoryShowcase } from "./CategoryShowcase";
import { CollectionShowcase } from "./CollectionShowcase";
import { NewDropSection } from "./NewDropSection";
import { FeaturedProducts } from "./FeaturedProducts";
import { CraftStory } from "./CraftStory";
import { QuietMoment } from "./QuietMoment";
import { StudioSection } from "./StudioSection";
import { EditorialMoment } from "./EditorialMoment";
import { NewsletterSection } from "./NewsletterSection";
import { WhatsAppCta } from "./WhatsAppCta";

/**
 * Homepage rhythm — cinematic editorial fashion house:
 *
 * HERO → STATEMENT → CATEGORIES → COLLECTIONS → NEW DROP → FEATURED →
 * CRAFT → QUIET MOMENT → STUDIO → EDITORIAL → NEWSLETTER → CONTACT
 *
 * Photography provides the dark material depth; the page breathes through
 * asymmetric compositions, varied section openings, and intentional quiet.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <CategoryShowcase />
      <CollectionShowcase />
      <NewDropSection />
      <FeaturedProducts />
      <CraftStory />
      <QuietMoment />
      <StudioSection />
      <EditorialMoment />
      <NewsletterSection />
      <WhatsAppCta />
    </>
  );
}
