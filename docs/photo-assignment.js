const realPhotos = [
  "/images/campaign/campaign-01-editorial.webp", // 960x1200 portrait
  "/images/campaign/campaign-01-hero-mobile.webp", // 1080x1920 portrait tall
  "/images/campaign/campaign-01-mobile.webp", // 768x1024 portrait
  "/images/campaign/campaign-02-editorial.webp", // 960x1200 portrait
  "/images/campaign/campaign-02-hero-mobile.webp", // 1080x1920 portrait tall
  "/images/campaign/campaign-02-mobile.webp", // 768x1024 portrait
  "/images/ai/editorial/sus-editorial-lagos-01.webp", // 768x1024 portrait
  "/images/ai/editorial/sus-editorial-lagos-02.webp", // 768x1024 portrait
  "/images/ai/editorial/sus-editorial-western-01.webp", // 1024x1280 portrait
  "/images/ai/editorial/sus-editorial-western-02.webp", // 1024x1280 portrait
  "/images/ai/heroes/sus-hero-04b-nvidia-test.webp", // 768x1024 portrait
  "/images/campaign/campaign-01-desktop-1600.webp", // 1600x914 landscape
  "/images/campaign/campaign-01-desktop.webp", // 1344x768 landscape
  "/images/campaign/campaign-02-desktop-1600.webp", // 1600x914 landscape
  "/images/campaign/campaign-02-desktop.webp", // 1344x768 landscape
  "/images/ai/heroes/sus-hero-signature-01.webp", // 1344x768 landscape
  "/images/ai/heroes/sus-hero-04b-final-check.webp", // 1344x768 landscape
];

const products = [
  "bone-crew-tee",
  "noir-crew-tee",
  "graphite-long-sleeve-tee",
  "olive-crew-tee",
  "burgundy-long-sleeve-tee",
  "ink-crew-tee",
  "clay-pullover-hoodie",
  "noir-zip-hoodie",
  "steel-pullover-hoodie",
  "espresso-zip-hoodie",
  "bone-pullover-hoodie",
  "graphite-zip-hoodie",
  "sand-trench-coat",
  "noir-bomber-jacket",
  "espresso-trench-coat",
  "olive-bomber-jacket",
  "steel-trench-coat",
  "burgundy-bomber-jacket",
  "ink-cap",
  "bone-beanie",
  "espresso-tote",
  "clay-leather-belt",
  "steel-scarf",
  "noir-socks-three-pack"
];

console.log(`Assigning ${realPhotos.length} real photos to ${products.length} products`);
products.forEach((slug, idx) => {
  const photo = realPhotos[idx % realPhotos.length];
  console.log(`${slug.padEnd(25)} → ${photo}`);
});
