// Menyiapkan foto pilihan dari public/images (file asli kamera) menjadi versi web
// di public/images/couple dan public/images/gallery, lalu menulis manifest
// berisi ukuran + blur placeholder ke src/config/photos.generated.ts.
//
// Jalankan: npm run images
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/images");

/** Foto inti — dipilih yang BELUM dipakai di undangan cetak. */
const couple = {
  cover: "DJP_3125", // pembuka: burgundy & ivory, tirai cokelat
  hero: "DJP_3124",
  groom: "DJP_3152",
  bride: "DJP_3109",
  countdown: "DJP_3142",
  closing: "DJP_3217",
};

const gallery = [
  "DJP_3139", "DJP_3197", "DJP_3108", "DJP_3147", "DJP_3170", "DJP_3215",
  "DJP_3116", "DJP_3196", "DJP_3209", "DJP_3183", "DJP_3237", "DJP_3166",
  "DJP_3123", "DJP_3219", "DJP_3181", "DJP_3171", "DJP_3239",
];

const LONG_EDGE = 1800;

async function processOne(id, outDir, name) {
  const input = path.join(SRC, `${id}.JPG`);
  const output = path.join(outDir, `${name}.jpg`);
  const pipeline = sharp(input).rotate().resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true });
  const info = await pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(output);
  const blur = await sharp(input).rotate().resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  return {
    src: `/images/${path.basename(outDir)}/${name}.jpg`,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
    kb: Math.round(info.size / 1024),
  };
}

async function main() {
  const coupleDir = path.join(SRC, "couple");
  const galleryDir = path.join(SRC, "gallery");
  await fs.mkdir(coupleDir, { recursive: true });
  await fs.mkdir(galleryDir, { recursive: true });

  const coupleOut = {};
  for (const [key, id] of Object.entries(couple)) {
    coupleOut[key] = await processOne(id, coupleDir, key);
    console.log(`couple/${key}.jpg  ${coupleOut[key].width}x${coupleOut[key].height}  ${coupleOut[key].kb}KB`);
  }

  const galleryOut = [];
  for (const [i, id] of gallery.entries()) {
    const name = `${String(i + 1).padStart(2, "0")}-${id.replace("DJP_", "")}`;
    const res = await processOne(id, galleryDir, name);
    galleryOut.push(res);
    console.log(`gallery/${name}.jpg  ${res.width}x${res.height}  ${res.kb}KB`);
  }

  // Gambar pratinjau WhatsApp / Open Graph (1200x630)
  // Potong area wajah: lebar 1200, mulai ±230px dari atas (di bawah tirai).
  const ogBase = await sharp(path.join(SRC, `${couple.cover}.JPG`)).rotate().resize({ width: 1200 }).toBuffer();
  await sharp(ogBase)
    .extract({ left: 0, top: 240, width: 1200, height: 630 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(coupleDir, "og.jpg"));
  console.log("couple/og.jpg  1200x630");

  const strip = ({ kb: _kb, ...rest }) => rest;
  const ts = `// File ini dibuat otomatis oleh scripts/optimize-images.mjs — jangan diedit manual.
import type { Photo } from "@/types";

export const couplePhotos = ${JSON.stringify(Object.fromEntries(Object.entries(coupleOut).map(([k, v]) => [k, strip(v)])), null, 2)} satisfies Record<string, Photo>;

export const galleryPhotos: Photo[] = ${JSON.stringify(galleryOut.map(strip), null, 2)};
`;
  await fs.mkdir(path.join(ROOT, "src/config"), { recursive: true });
  await fs.writeFile(path.join(ROOT, "src/config/photos.generated.ts"), ts);
  console.log("manifest -> src/config/photos.generated.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
