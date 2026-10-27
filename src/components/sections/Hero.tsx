"use client";

import { motion } from "framer-motion";
import { wedding } from "@/config/wedding";
import { couplePhotos } from "@/config/photos.generated";
import { Florals } from "@/components/decor/Florals";
import { Bow, LaurelWreath, PearlStrand, WaxSeal } from "@/components/decor/Ornaments";
import { Amp, Polaroid } from "@/components/decor/Scrapbook";
import { Vinyl } from "@/components/decor/Vinyl";
import { useInvitationOpened } from "@/components/invitation/opened-context";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Kolase scrapbook pembuka — seluruh ukuran memakai cqw agar proporsional di semua layar. */
export function Hero() {
  const opened = useInvitationOpened();
  const drop = (delay: number) => ({
    initial: { opacity: 0, y: -24, scale: 0.96 },
    animate: opened ? { opacity: 1, y: 0, scale: 1 } : undefined,
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section id="hero" className="paper relative overflow-hidden pb-6 pt-8 sm:pt-14">
      <div className="@container relative mx-auto aspect-[390/800] w-full max-w-[540px]">
        {/* Kartu perangko burgundy */}
        <motion.div {...drop(0.2)} className="absolute left-[5%] top-[3%] w-[52%]">
          <div className="stamp-edge -rotate-[4deg]">
            <div className="stamp-inner p-[2.4cqw]">
            <div className="border border-champagne/60 px-[3cqw] py-[4.5cqw] text-center outline-1 outline-offset-[-1.6cqw] outline-champagne/30">
              <p className="font-script text-[5.4cqw] leading-none text-champagne-soft">kami mengundang Anda</p>
              <p className="mt-[1.5cqw] font-display text-[2.3cqw] uppercase tracking-[0.3em] text-pearl/80">ke pernikahan</p>
              <p className="mt-[2.5cqw] font-display text-[8.6cqw] font-medium uppercase leading-[0.95] text-pearl">
                {wedding.groom.nickname}
                <br />
                <Amp className="text-[6cqw] text-champagne-soft" />
                <br />
                {wedding.bride.nickname}
              </p>
            </div>
            </div>
          </div>
        </motion.div>
        <motion.div {...drop(0.5)} className="absolute left-[0%] top-[0.5%] w-[17%] -rotate-[24deg]">
          <Bow className="w-full" />
        </motion.div>

        {/* Kartu monogram */}
        <motion.div {...drop(0.35)} className="absolute right-[5%] top-[14%] w-[39%]">
          <div className="rotate-[5deg] border-[0.5cqw] border-double border-burgundy/70 bg-pearl px-[2.5cqw] pb-[4.5cqw] pt-[5cqw] text-center shadow-[0_16px_26px_-14px_rgb(30_5_10/0.55)]">
            <div className="relative mx-auto aspect-square w-[88%]">
              <LaurelWreath className="absolute inset-0 h-full w-full" />
              <p className="absolute inset-0 flex items-center justify-center pb-[6%] font-script text-[11cqw] leading-none text-burgundy">
                E<Amp className="mx-[0.5cqw] text-[6cqw] text-champagne" />V
              </p>
            </div>
            <p className="mt-[2cqw] font-display text-[2.4cqw] uppercase tracking-[0.3em] text-ink/75">Dua hati</p>
            <p className="font-script text-[6cqw] leading-tight text-burgundy">satu janji</p>
          </div>
        </motion.div>
        <motion.div {...drop(0.6)} className="absolute -right-[14%] -top-[4%] w-[44%]">
          <Florals variant="bouquet" className="w-full" />
        </motion.div>

        {/* Piringan hitam */}
        <motion.div {...drop(0.7)} className="absolute left-[6%] top-[46%] w-[34%] text-[3.4cqw]">
          <Vinyl className="w-full" />
        </motion.div>

        {/* Polaroid utama */}
        <motion.div {...drop(0.55)} className="absolute right-[5%] top-[38%] w-[53%] text-[3cqw]">
          <Polaroid
            photo={couplePhotos.hero}
            alt={`${wedding.groom.nickname} dan ${wedding.bride.nickname}`}
            sizes="(min-width: 540px) 290px, 55vw"
            rotate={4}
            tape
            caption={`${wedding.groom.nickname} & ${wedding.bride.nickname}`}
            imgClassName="object-[50%_25%]"
            priority
          />
        </motion.div>
        <motion.div {...drop(0.9)} className="absolute left-[43%] top-[70%] w-[15%]">
          <WaxSeal className="w-full rotate-[-12deg]" />
        </motion.div>

        {/* Catatan ayat */}
        <motion.div {...drop(0.8)} className="absolute left-[5%] top-[76%] w-[50%]">
          <div className="-rotate-[3deg] bg-pearl px-[4cqw] pb-[4cqw] pt-[5cqw] shadow-[0_14px_24px_-12px_rgb(30_5_10/0.5)] [clip-path:polygon(0_3%,6%_0,14%_2%,22%_0,32%_3%,42%_0,52%_2%,62%_0,72%_3%,82%_0,92%_2%,100%_0,100%_100%,0_100%)]">
            <p className="font-script text-[5cqw] leading-[1.15] text-burgundy">
              “Apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.”
            </p>
            <p className="mt-[2cqw] font-display text-[2.3cqw] uppercase tracking-[0.3em] text-rose">{wedding.verse.source}</p>
          </div>
        </motion.div>
        <motion.div {...drop(1)} className="absolute -right-[6%] bottom-[1%] w-[42%] -scale-x-100">
          <Florals variant="sprig" className="w-full" />
        </motion.div>
        <motion.div {...drop(1.05)} className="absolute right-[4%] top-[93%] w-[46%]">
          <PearlStrand className="w-full" sag={16} count={18} />
        </motion.div>
      </div>

    </section>
  );
}
