// Generates optimized SUS WEARS campaign WebP variants from the approved
// source PNGs in "/mnt/sdcard/sus wears images".
//   - desktop  : native 7:4-ish landscape (1600 wide) + 1344×768 standard
//   - hero-mobile : 9:16 full-bleed hero derived from the PORTRAIT source
//   - mobile   : 3:4 portrait smart-crop (768×1024) from the portrait source
//   - editorial: 4:5 crop (used by editorial/card sections)
// Each campaign has a landscape file (desktop) and a portrait file (mobile).
// Writes to public/images/campaign/.
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SOURCES = [
  {
    id: "campaign-01",
    file: "/mnt/sdcard/sus wears images/sus wears 1.png",
    portraitFile: "/mnt/sdcard/sus wears images/file_0000000052a881f4b25bdb69ce3d37fa.png",
  },
  {
    id: "campaign-02",
    file: "/mnt/sdcard/sus wears images/sus wears 2.png",
    portraitFile: "/mnt/sdcard/sus wears images/file_0000000069988211bf72a01a57d5b064.png",
  },
];

const OUT = "public/images/campaign";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  for (const src of SOURCES) {
    const meta = await sharp(src.file).metadata();
    console.log(`\n== ${src.id} (${meta.width}×${meta.height}) ==`);

    const jobs = [
      // desktop hero — near-native wide landscape, model right/center-right
      { name: `${src.id}-desktop-1600`, w: 1600, h: 914, fit: "cover", pos: sharp.strategy.attention, src: src.file },
      // desktop standard — 1344×768 (matches stage aspect)
      { name: `${src.id}-desktop`, w: 1344, h: 768, fit: "cover", pos: sharp.strategy.attention, src: src.file },
      // hero mobile — 9:16 derived from the PORTRAIT source (same campaign, properly framed)
      { name: `${src.id}-hero-mobile`, w: 1080, h: 1920, fit: "cover", pos: sharp.strategy.attention, src: src.portraitFile },
      // mobile portrait — 3:4 from the portrait source (used by card/editorial contexts)
      { name: `${src.id}-mobile`, w: 768, h: 1024, fit: "cover", pos: sharp.strategy.attention, src: src.portraitFile },
      // editorial / cards — 4:5 from the portrait source
      { name: `${src.id}-editorial`, w: 960, h: 1200, fit: "cover", pos: sharp.strategy.attention, src: src.portraitFile },
    ];

    for (const job of jobs) {
      const buf = await sharp(job.src)
        .resize({ width: job.w, height: job.h, fit: job.fit, position: job.pos })
        .webp({ quality: 90, effort: 6 })
        .toBuffer();
      const out = path.join(OUT, `${job.name}.webp`);
      fs.writeFileSync(out, buf);
      const sizeKB = (buf.length / 1024).toFixed(0);
      console.log(`  ${job.name}.webp  ${job.w}×${job.h}  ${sizeKB}KB`);
    }
  }
  console.log("\nDone.");
})();