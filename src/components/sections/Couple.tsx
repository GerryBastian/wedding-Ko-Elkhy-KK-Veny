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

export function Couple() {
  return (
    <section id="mempelai" className="paper overflow-hidden px-5 py-20 lg:py-28">
      <Reveal>
        <ScriptHeading script="Mempelai" label="Putra & putri terkasih" />
        <p className="mx-auto mt-5 max-w-sm text-center text-[1.08rem] italic leading-relaxed text-ink/75 text-balance">
          Dengan memohon rahmat dan berkat Tuhan, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-16 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8">
        <Profile person={wedding.groom} photo={couplePhotos.groom} role="Mempelai Pria" parentLabel="Putra dari" floralSide="right" />

        <Reveal className="flex items-center justify-center md:mt-56" aria-hidden="true">
          <Amp className="text-7xl text-champagne" />
        </Reveal>

        <Profile person={wedding.bride} photo={couplePhotos.bride} role="Mempelai Wanita" parentLabel="Putri dari" floralSide="left" />
      </div>

      <Reveal className="relative mx-auto mt-20 max-w-sm">
        <div className="relative border-[3px] border-double border-burgundy/50 bg-pearl px-6 pb-8 pt-10 text-center shadow-[0_18px_34px_-20px_rgb(30_5_10/0.6)]">
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
      <div className="relative mx-auto w-[84%] max-w-[330px]">
        <div className="pointer-events-none absolute -inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(214_176_106/0.35),transparent)] blur-xl" aria-hidden="true" />
        <ImageReveal className="relative">
          <GildedArchFrame>
            <Image
              src={photo.src}
              alt={`${role}: ${person.fullName}`}
              fill
              sizes="(min-width: 768px) 260px, 62vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              className="object-cover object-top transition duration-[1.6s] ease-out hover:scale-[1.04]"
            />
          </GildedArchFrame>
        </ImageReveal>
        <Florals
          variant="sprig"
          className={`absolute -bottom-[4%] w-[44%] ${floralSide === "right" ? "-right-[16%]" : "-left-[16%] -scale-x-100"}`}
        />
      </div>

      <Reveal delay={0.1} className="mt-8 px-2">
        <p className="eyebrow text-rose">{role}</p>
        <p className="mt-1 font-script text-[4rem] leading-[1.2] text-burgundy">{person.nickname}</p>
        <h3 className="font-display text-[1.05rem] font-medium uppercase leading-snug tracking-[0.14em] text-ink text-balance">{person.fullName}</h3>
        <p className="mt-3 italic text-rose">{person.childOrder}</p>
        <GoldFlourish className="mx-auto my-4 h-3 w-36" />
        <p className="eyebrow text-[0.6rem] text-ink/50">{parentLabel}</p>
        <p className="mt-2 text-[1.08rem] leading-relaxed text-ink/85">
          {person.father}
          <br />
          &amp; {person.mother}
        </p>
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-burgundy/30 text-burgundy transition hover:border-burgundy"
          >
            <Instagram className="h-4 w-4" /> @{person.instagram}
          </a>
        )}
      </Reveal>
    </article>
  );
}
