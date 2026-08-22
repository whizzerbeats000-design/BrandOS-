import type { Metadata } from "next";
import { SusWorldPage } from "@/components/sus-world/SusWorldPage";

export const metadata: Metadata = {
  title: "SUS World",
  description:
    "Houses, rituals, movement and sound — an ecosystem that began in one studio and moves through the world.",
  alternates: {
    canonical: "/sus-world",
  },
};

export default function SusWorldRoute() {
  return <SusWorldPage />;
}
