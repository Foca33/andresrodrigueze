import "server-only";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import type { AssetInfo, SiteAssets } from "./assets-types";

const DIR = path.join(process.cwd(), "public", "assets");
const EXT = ["avif", "webp", "jpg", "jpeg", "png"];

async function find(base: string): Promise<AssetInfo | null> {
  for (const ext of EXT) {
    const file = path.join(DIR, `${base}.${ext}`);
    if (!fs.existsSync(file)) continue;
    try {
      const img = sharp(file);
      const meta = await img.metadata();
      const blurBuf = await img.resize(24).blur(2).jpeg({ quality: 50 }).toBuffer();
      return {
        src: `/assets/${base}.${ext}`,
        width: meta.width ?? 1200,
        height: meta.height ?? 1800,
        blur: `data:image/jpeg;base64,${blurBuf.toString("base64")}`,
      };
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Looks for the real art in /public/assets. Missing files → null → the UI renders
 * clearly-marked provisional stand-ins. Drop the files in and rebuild; nothing else changes.
 *
 *   hela-cover.{jpg,webp,png}      front cover of HELA
 *   eric-cover.{jpg,webp,png}      FRONT (right side) cover of ERIC only
 *   andres-portrait.{jpg,webp,png} portrait (treated to B/W in CSS)
 */
export async function getAssets(): Promise<SiteAssets> {
  const [helaCover, ericCover, portrait] = await Promise.all([
    find("hela-cover"),
    find("eric-cover"),
    find("andres-portrait"),
  ]);
  return { helaCover, ericCover, portrait };
}
