import Image from "next/image";
import { Instagram } from "lucide-react";
import { wedding } from "@/config/wedding";
import { couplePhotos } from "@/config/photos.generated";
import type { Person, Photo } from "@/types";
import { Florals } from "@/components/decor/Florals";
import { GoldFlourish, ScriptHeading, WaxSeal } from "@/components/decor/Ornaments";
import { Amp } from "@/components/decor/Scrapbook";
import { GildedArchFrame } from "@/components/decor/GildedFrame";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";

/** Mempelai berdampingan (juga di HP) agar section tetap ringkas. */
export function Couple() {
  return (
    <section id="mempelai" className="paper overflow-hidden px-3 py-16 sm:px-5 lg:py-24">
      <Reveal>
        <ScriptHeading script="Mempelai" label="Putra & putri terkasih" />
      </Reveal>

      <div className="relative mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-3 sm:gap-x-10">
        <Profile person={wedding.groom} photo={couplePhotos.groom} role="Mempelai Pria" parentLabel="Putra dari" floralSide="left" />
        <Profile person={wedding.bride} photo={couplePhotos.bride} role="Mempelai Wanita" parentLabel="Putri dari" floralSide="right" />
        <Amp className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 text-4xl text-champagne sm:text-6xl" />
      </div>

      <Reveal className="relative mx-auto mt-14 max-w-sm px-2">
        <div className="relative border-[3px] border-double border-burgundy/50 bg-pearl px-6 pb-7 pt-10 text-center shadow-[0_18px_34px_-20px_rgb(30_5_10/0.6)]">
          <WaxSeal className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2" />
          <p className="eyebrow text-rose">Bapa &amp; Mama Saksi</p>
          <GoldFlourish className="mx-auto my-3 h-3 w-32" />
          <p className="font-display text-lg text-burgundy">{wedding.witnesses.father}</p>
          <p className="font-display text-lg text-burgundy">{wedding.witnesses.mother}</p>
        </div>
      </Reveal>
    </section>
  );
}

type ProfileProps = {
  person: Person;
  photo: Photo;
  role: string;
  parentLabel: string;
  floralSide: "left" | "right";
};

function Profile({ person, photo, role, parentLabel, floralSide }: ProfileProps) {
  return (
    <article className="text-center">
      {/* Bingkai lengkung emas barok */}
      <div className="relative mx-auto w-full max-w-[300px]">
        <ImageReveal className="relative">
          <GildedArchFrame>
            <Image
              src={photo.src}
              alt={`${role}: ${person.fullName}`}
              fill
              sizes="(min-width: 768px) 260px, 42vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              className="object-cover object-top transition duration-[1.6s] ease-out hover:scale-[1.04]"
            />
          </GildedArchFrame>
        </ImageReveal>
        <Florals
          variant="sprig"
          className={`absolute -bottom-[3%] w-[42%] ${floralSide === "left" ? "-left-[8%] -scale-x-100" : "-right-[8%]"}`}
        />
      </div>

      <Reveal delay={0.1} className="mt-3 px-0.5">
        <p className="eyebrow text-[0.5rem] tracking-[0.25em] text-rose sm:text-[0.62rem]">{role}</p>
        <p className="font-script text-[2.5rem] leading-[1.25] text-burgundy sm:text-6xl">{person.nickname}</p>
        <h3 className="font-display text-[0.68rem] font-medium uppercase leading-snug tracking-[0.08em] text-ink text-balance sm:text-sm">
          {person.fullName}
        </h3>
        <p className="mt-1.5 text-[0.8rem] italic leading-snug text-rose sm:text-base">{person.childOrder}</p>
        <p className="mt-2 text-[0.8rem] leading-snug text-ink/80 sm:text-base">
          <span className="italic text-ink/55">{parentLabel}</span>
          <br />
          {person.father}
          <br />
          &amp; {person.mother}
        </p>
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-burgundy"
          >
            <Instagram className="h-4 w-4" /> @{person.instagram}
          </a>
        )}
      </Reveal>
    </article>
  );
}
