"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { galleryPhotos } from "@/config/photos.generated";
import { wedding } from "@/config/wedding";
import { Florals } from "@/components/decor/Florals";
import { ScriptHeading, WaxSeal } from "@/components/decor/Ornaments";
import { Polaroid } from "@/components/decor/Scrapbook";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "./Lightbox";

const alt = (i: number) => `Foto prewedding ${wedding.groom.nickname} & ${wedding.bride.nickname} ${i + 1}`;
// Rotasi & selotip bergantian agar terasa ditempel tangan
const TILT = [-3, 2.5, -1.5, 3, -2.5, 1.5];

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const preview = galleryPhotos.slice(2, 8); // 0 & 1 dipakai di pasangan utama

  return (
    <section id="galeri" className="paper overflow-hidden px-4 py-16 lg:py-24">
      <Reveal>
        <ScriptHeading script="Kisah Kami" label="Galeri" />
      </Reveal>

      {/* Pasangan polaroid utama */}
      <div className="relative mx-auto mt-8 h-[112vw] max-h-[500px] max-w-md">
        {/* Posisi di pembungkus: tombol Tile sendiri ber-class "relative" */}
        <div className="absolute left-[3%] top-0 w-[52%]">
          <Tile index={0} onOpen={setIndex} rotate={-6} tape />
        </div>
        <div className="absolute right-[3%] top-[20%] w-[50%]">
          <Tile index={1} onOpen={setIndex} rotate={5} />
        </div>
        <WaxSeal className="absolute left-[40%] top-[62%] z-10 w-[17%] rotate-[10deg]" />
        <Florals variant="bouquet" className="absolute -left-[8%] bottom-0 z-10 w-[44%] -scale-x-100" />
      </div>

      {/* Cuplikan dinding polaroid — sisanya lewat tombol, agar tidak terlalu panjang */}
      <div className="mx-auto mt-2 grid max-w-3xl grid-cols-3 gap-x-2.5 gap-y-5 sm:gap-x-5">
        {preview.map((_, i) => {
          const idx = i + 2;
          return (
            <Tile key={idx} index={idx} onOpen={setIndex} rotate={TILT[i % TILT.length]} tape={i % 3 === 1} delay={(i % 3) * 0.08} />
          );
        })}
      </div>

      <Reveal className="mt-9 text-center">
        <button type="button" onClick={() => setIndex(0)} className="btn-notched px-7">
          <Images className="h-4 w-4" />
          Lihat semua {galleryPhotos.length} foto
        </button>
      </Reveal>

      <Lightbox photos={galleryPhotos} index={index} onChange={setIndex} altFor={alt} />
    </section>
  );
}

type TileProps = {
  index: number;
  onOpen: (i: number) => void;
  rotate: number;
  tape?: boolean;
  className?: string;
  delay?: number;
};

function Tile({ index, onOpen, rotate, tape, className, delay = 0 }: TileProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
      aria-label={`Buka foto ${index + 1}`}
      className={`relative block w-full text-[0.55rem] sm:text-[0.7rem] ${className ?? ""}`}
    >
      <Polaroid photo={galleryPhotos[index]} alt={alt(index)} sizes="(min-width: 1024px) 320px, 46vw" rotate={rotate} tape={tape} />
    </motion.button>
  );
}
