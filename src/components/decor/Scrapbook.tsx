import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/types";

/** "&" dalam italic serif — ampersand bawaan Pinyon Script kurang terbaca. */
export function Amp({ className }: { className?: string }) {
  return <span className={`font-serif italic ${className ?? ""}`}>&amp;</span>;
}

type PolaroidProps = {
  photo: Photo;
  alt: string;
  sizes: string;
  rotate?: number;
  tape?: boolean;
  caption?: string;
  aspect?: string;
  className?: string;
  style?: CSSProperties;
  imgClassName?: string;
  priority?: boolean;
};

/** Foto polaroid miring dengan selotip — inti gaya scrapbook. */
export function Polaroid({
  photo,
  alt,
  sizes,
  rotate = 0,
  tape = false,
  caption,
  aspect = "aspect-[4/5]",
  className,
  style,
  imgClassName,
  priority,
}: PolaroidProps) {
  return (
    <figure className={`polaroid ${className ?? ""}`} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      {tape && <span className="tape" aria-hidden="true" />}
      <div className={`relative overflow-hidden bg-ivory-deep ${aspect}`}>
        <Image
          src={photo.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className={`object-cover ${imgClassName ?? ""}`}
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgb(40_10_15/0.25)]" />
      </div>
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-[3%] text-center font-script text-[1.35em] leading-none text-burgundy">
          {caption.split("&").map((part, i) => (
            <span key={i}>
              {i > 0 && <Amp className="text-[0.7em]" />}
              {part}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
