"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/types";

type Props = {
  photos: Photo[];
  index: number | null;
  onChange: (i: number | null) => void;
  altFor: (i: number) => string;
};

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

/** Lightbox layar penuh: geser kiri/kanan, tombol panah, Esc untuk menutup. */
export function Lightbox({ photos, index, onChange, altFor }: Props) {
  const open = index !== null;
  const directionRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      directionRef.current = delta;
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, onChange]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
    else if (Math.abs(info.offset.y) > 120) onChange(null);
  };

  if (!mounted) return null;

  // Portal ke <body> agar tidak terkurung stacking context section
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] flex flex-col bg-espresso-deep/97 text-ivory backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <p className="font-serif text-lg tracking-widest text-champagne">
              {index + 1} <span className="text-ivory/40">/ {photos.length}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onChange(null)}
              aria-label="Tutup galeri"
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition hover:bg-ivory/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence initial={false} custom={directionRef.current} mode="popLayout">
              <motion.div
                key={index}
                custom={directionRef.current}
                initial={{ opacity: 0, x: directionRef.current * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: directionRef.current * -80 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                className="absolute inset-3 touch-none sm:inset-8"
              >
                <Image
                  src={photos[index].src}
                  alt={altFor(index)}
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={photos[index].blurDataURL}
                  className="pointer-events-none select-none object-contain"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto sebelumnya"
              className="grid h-12 w-12 place-items-center rounded-full border border-champagne/40 text-champagne transition hover:bg-champagne hover:text-espresso"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ivory/45">Geser untuk berpindah</p>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto berikutnya"
              className="grid h-12 w-12 place-items-center rounded-full border border-champagne/40 text-champagne transition hover:bg-champagne hover:text-espresso"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
