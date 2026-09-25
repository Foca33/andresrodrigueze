/**
 * npm run assets:prepare
 *
 * Put the raw files you were given in ./assets-src/ (any of .jpg .jpeg .png .webp .tif):
 *   hela-cover.*        front cover of HELA
 *   eric-wrap.*         the FULL ERIC image (back + spine + front). Only the RIGHT side (front cover) is kept.
 *                       If you already have the front cover alone, name it eric-cover.* instead.
 *   andres-portrait.*   author photo
 *
 * Output → ./public/assets/ (hela-cover.jpg, eric-cover.jpg, andres-portrait.jpg).
 * The site picks them up automatically (no code changes).
 * The portrait is converted to black-and-white here (source colour file is kept in assets-src).
 * The HELA cover source is small (624×992): it is upscaled 2× with Lanczos so it stays smooth when
 * the hero expands it. Replace it with the original high-resolution file when you have it.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets-src");
const OUT = path.resolve("public/assets");
const EXTS = [".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"];

fs.mkdirSync(OUT, { recursive: true });

const find = (base) => {
  if (!fs.existsSync(SRC)) return null;
  const hit = fs.readdirSync(SRC).find((f) => {
    const p = path.parse(f);
    return p.name.toLowerCase() === base && EXTS.includes(p.ext.toLowerCase());
  });
  return hit ? path.join(SRC, hit) : null;
};

const save = async (img, name, maxH = 3000, { upscaleBelow = 0 } = {}) => {
  const dest = path.join(OUT, `${name}.jpg`);
  const meta = await sharp(await img.clone().toBuffer()).metadata();
  const factor = upscaleBelow && meta.height < upscaleBelow ? 2 : 1;
  if (factor > 1) img = sharp(await img.resize({ height: meta.height * factor, kernel: "lanczos3" }).toBuffer());
  await img.resize({ height: maxH, withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
  const m = await sharp(dest).metadata();
  console.log(`✓ ${name}.jpg  ${m.width}×${m.height}`);
};

const hela = find("hela-cover");
if (hela) await save(sharp(hela).rotate().flatten({ background: "#000" }), "hela-cover", 3000, { upscaleBelow: 1500 });
else console.log("· hela-cover: not found in assets-src (skipped)");

const ericCover = find("eric-cover");
const ericWrap = find("eric-wrap");
if (ericCover) {
  await save(sharp(ericCover).rotate().flatten({ background: "#000" }), "eric-cover");
} else if (ericWrap) {
  const img = sharp(ericWrap).rotate();
  const { width, height } = await img.metadata();
  // Front cover = RIGHT half of a flat wrap (back | spine | front). Adjust CROP_FROM if the spine is wide.
  const CROP_FROM = Number(process.env.ERIC_CROP_FROM ?? 0.5);
  const left = Math.round(width * CROP_FROM);
  const buf = await img.extract({ left, top: 0, width: width - left, height }).toBuffer();
  await save(sharp(buf), "eric-cover");
  console.log(`  (cropped right ${Math.round((1 - CROP_FROM) * 100)}% — set ERIC_CROP_FROM=0.52 etc. to nudge)`);
} else console.log("· eric-cover / eric-wrap: not found (skipped)");

const portrait = find("andres-portrait");
if (portrait) {
  // Black & white, moody: the bright wall and sweater sink into the dark, the face stays lit.
  const base = sharp(portrait).rotate().grayscale().linear(1.14, -14);
  const { width: w, height: h } = await base.clone().metadata();
  const shade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <radialGradient id="v" cx="50%" cy="36%" r="74%" fx="50%" fy="36%">
          <stop offset="0.3" stop-color="#000" stop-opacity="0.12"/>
          <stop offset="0.66" stop-color="#000" stop-opacity="0.62"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.93"/>
        </radialGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
      <rect width="100%" height="100%" fill="url(#b)"/>
    </svg>`,
  );
  const bw = sharp(await base.composite([{ input: shade }]).png().toBuffer());
  await save(bw, "andres-portrait", 2400);
} else console.log("· andres-portrait: not found (skipped)");
