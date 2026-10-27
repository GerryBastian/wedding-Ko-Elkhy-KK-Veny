import { wedding } from "@/config/wedding";
import { couplePhotos, galleryPhotos } from "@/config/photos.generated";
import { Florals } from "@/components/decor/Florals";
import { GoldFlourish, PearlStrand, WaxSeal } from "@/components/decor/Ornaments";
import { Amp, Polaroid } from "@/components/decor/Scrapbook";
import { Particles } from "@/components/ui/Particles";
import { Reveal } from "@/components/ui/Reveal";

export function Closing() {
  return (
    <>
      <section id="penutup" className="velvet overflow-hidden px-6 pb-16 pt-10">
        <Particles count={10} />

        {/* Dua polaroid penutup */}
        <Reveal className="relative mx-auto h-[100vw] max-h-[460px] max-w-sm">
          <Polaroid
            photo={couplePhotos.closing}
            alt={`${wedding.groom.nickname} dan ${wedding.bride.nickname}`}
            sizes="(min-width: 400px) 220px, 56vw"
            rotate={-6}
            tape
            className="absolute left-[2%] top-[4%] w-[58%] text-[0.8rem]"
          />
          <Polaroid
            photo={galleryPhotos[7]}
            alt={`${wedding.groom.nickname} dan ${wedding.bride.nickname}`}
            sizes="(min-width: 400px) 210px, 54vw"
            rotate={5}
            className="absolute right-[2%] top-[22%] w-[54%] text-[0.8rem]"
          />
          <WaxSeal className="absolute bottom-[8%] left-[36%] z-10 w-[20%] rotate-[-8deg]" />
          <Florals variant="bouquet" className="absolute -right-[10%] bottom-0 z-10 w-[52%]" />
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-8 max-w-md text-center">
          <p className="mx-auto max-w-sm text-[1.12rem] italic leading-relaxed text-pearl/85 text-balance">{wedding.copy.closing}</p>
          <p className="mt-10 font-script text-3xl text-champagne-soft/90">Dengan penuh kasih,</p>
          <h2 className="mt-1 whitespace-nowrap font-script text-[3.6rem] leading-[1.3] text-gold sm:text-7xl">
            {wedding.groom.nickname} <Amp className="text-[0.6em]" /> {wedding.bride.nickname}
          </h2>
          <p className="mt-2 font-display text-[0.8rem] tracking-[0.42em] text-pearl/80">{wedding.dateShort.replace(/ · /g, ".")}</p>
          <PearlStrand className="mx-auto mt-10 w-56" sag={18} count={16} />
        </Reveal>
      </section>

      <footer className="bg-espresso-deep px-6 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] pt-12 text-center text-pearl/60">
        <p className="font-script text-5xl text-gold">E &amp; V</p>
        <GoldFlourish className="mx-auto my-4 h-3 w-32 opacity-70" />
        <p className="mx-auto max-w-xs italic text-pearl/65">“{wedding.verse.text}”</p>
        <p className="eyebrow mt-3 text-champagne/80">{wedding.verse.source}</p>
        <p className="mt-8 font-display text-[0.6rem] uppercase tracking-[0.3em]">
          {wedding.groom.nickname} &amp; {wedding.bride.nickname} · {wedding.dateLabel}
        </p>
      </footer>
    </>
  );
}
