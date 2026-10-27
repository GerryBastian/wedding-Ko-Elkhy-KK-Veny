"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const rest = galleryPhotos.slice(2); // 0 & 1 dipakai di pasangan utama

  return (
    <section id="galeri" className="paper overflow-hidden px-4 py-20 lg:py-28">
      <Reveal>
        <ScriptHeading script="Kisah Kami" label="Galeri" />
        <p className="mt-3 text-center text-sm italic text-ink/60">Ketuk foto untuk melihat lebih besar</p>
      </Reveal>

      {/* Pasangan polaroid utama */}
      <div className="relative mx-auto mt-12 h-[150vw] max-h-[660px] max-w-md">
        <Tile index={0} onOpen={setIndex} className="absolute left-[2%] top-0 w-[58%]" rotate={-6} tape />
        <Tile index={1} onOpen={setIndex} className="absolute right-[2%] top-[20%] w-[56%]" rotate={5} />
        <WaxSeal className="absolute left-[40%] top-[60%] z-10 w-[18%] rotate-[10deg]" />
        <Florals variant="bouquet" className="absolute -left-[8%] bottom-0 z-10 w-[48%] -scale-x-100" />
      </div>

      {/* Dinding polaroid */}
      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 lg:grid-cols-3">
        {rest.map((_, i) => {
          const idx = i + 2;
          const last = i === rest.length - 1 && rest.length % 2 === 1;
          return (
            <Tile
              key={idx}
              index={idx}
              onOpen={setIndex}
              rotate={TILT[i % TILT.length]}
              tape={i % 3 === 0}
              className={last ? "col-span-2 mx-auto w-1/2 lg:col-span-1 lg:w-full" : ""}
              delay={(i % 3) * 0.08}
            />
          );
        })}
      </div>

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
      className={`relative block text-[0.7rem] ${className ?? ""}`}
    >
      <Polaroid photo={galleryPhotos[index]} alt={alt(index)} sizes="(min-width: 1024px) 320px, 46vw" rotate={rotate} tape={tape} />
    </motion.button>
  );
}
