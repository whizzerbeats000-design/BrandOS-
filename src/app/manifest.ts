import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SUS WEARS — Contemporary Unisex Fashion, Lagos, Nigeria",
    short_name: "SUS WEARS",
    description:
      "Contemporary unisex fashion from Lagos, Nigeria — cut since 2019 to fit the body, not the catalogue.",
    start_url: "/",
    display: "standalone",
    background_color: "#0C0A09",
    theme_color: "#0C0A09",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
