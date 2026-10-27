"use client";

import { useRef, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { Music2, VolumeX } from "lucide-react";
import { wedding } from "@/config/wedding";
import { GoldFlourish, WaxSeal } from "@/components/decor/Ornaments";
import { Amp } from "@/components/decor/Scrapbook";

type Props = {
  guestName: string | null;
  musicEnabled: boolean;
  musicAvailable: boolean;
  onToggleMusic: () => void;
  /** Dipanggil tepat saat segel diketuk (gesture pengguna → musik boleh diputar). */
  onOpen: () => void;
  /** Dipanggil saat kartu mulai membesar — undangan di belakang mulai ditampilkan. */
  onReveal: () => void;
  /** Animasi selesai, amplop dilepas. */
  onDone: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

/** Shading tipis agar tiap lipatan amplop terasa punya ketebalan. */
const FLAP_SHADOW = "drop-shadow(0 1px 1.5px rgb(90 70 50 / 0.35)) drop-shadow(0 6px 10px rgb(60 40 25 / 0.18))";

export function EnvelopeIntro({ guestName, musicEnabled, musicAvailable, onToggleMusic, onOpen, onReveal, onDone }: Props) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const flapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();

  const open = async () => {
    if (busy) return;
    setBusy(true);
    onOpen();

    if (reduce) {
      onReveal();
      await animate(scope.current, { opacity: 0 }, { duration: 0.5 });
      onDone();
      return;
    }

    // 1. Segel ditekan lalu terlepas
    animate(".env-hint", { opacity: 0 }, { duration: 0.3 });
    await animate(".env-seal", { scale: [1, 0.92, 1.18, 0.3], opacity: [1, 1, 1, 0], rotate: [0, 0, -8, -40] }, { duration: 0.8, ease: "easeInOut" });

    // 2. Amplop mundur sedikit agar ada ruang untuk kartu
    await animate(".env", { scale: 0.74, y: "17%" }, { duration: 0.9, ease: EASE });

    // 3. Tutup amplop terbuka (berputar pada engsel atas)
    animate(".env-flap", { rotateX: 180 }, { duration: 1.1, ease: [0.5, 0, 0.2, 1] });
    await wait(0.55);
    if (flapRef.current) flapRef.current.style.zIndex = "1"; // setelah 90°, tutup berada di belakang kartu
    await wait(0.45);

    // 4. Kartu undangan naik keluar
    await animate(".env-letter", { y: "-60%" }, { duration: 1.1, ease: EASE });
    await wait(0.25);

    // 5. Kartu membesar, amplop turun — sampul terlihat
    onReveal();
    await Promise.all([
      animate(".env-letter", { scale: 1.8, y: "-36%", opacity: 0 }, { duration: 1, ease: [0.6, 0, 0.8, 0.4] }),
      animate(".env-part", { y: "75%", opacity: 0 }, { duration: 0.9, ease: [0.6, 0, 0.8, 0.4] }),
      animate(scope.current, { opacity: 0 }, { duration: 0.6, delay: 0.55 }),
    ]);
    onDone();
  };

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[70] overflow-hidden bg-[radial-gradient(120%_80%_at_50%_30%,#5d1323,#2a0710)]"
      aria-label="Amplop undangan"
      role="dialog"
    >
      <div className="env absolute inset-0 origin-center [perspective:1800px]">
        {/* Bagian dalam amplop (terlihat saat tutup terbuka) */}
        <div className="env-part envelope-liner absolute inset-0 shadow-[inset_0_30px_60px_rgb(0_0_0/0.45)]" />

        {/* Kartu undangan di dalam amplop */}
        <div className="env-letter absolute inset-x-[7%] top-[5%] z-[2] h-[62%]">
          <div className="paper relative flex h-full flex-col items-center justify-center px-6 text-center shadow-[0_-10px_30px_-10px_rgb(0_0_0/0.4)]">
            <div className="pointer-events-none absolute inset-3 border border-champagne/80" />
            <div className="pointer-events-none absolute inset-[18px] border border-champagne/40" />
            <WaxSeal className="h-14 w-14" />
            <p className="eyebrow mt-4 text-rose">The Wedding Of</p>
            <p className="mt-2 font-script text-[3.2rem] leading-[1.2] text-burgundy">
              {wedding.groom.nickname} <Amp className="text-[0.6em] text-champagne" /> {wedding.bride.nickname}
            </p>
            <GoldFlourish className="mt-2 h-4 w-40" />
            <p className="mt-3 font-display text-[0.75rem] tracking-[0.4em] text-ink/80">{wedding.dateShort.replace(/ · /g, ".")}</p>
            <p className="mt-5 text-[0.8rem] italic text-ink/70">Kepada Yth.</p>
            <p className="font-display text-[1.05rem] italic text-burgundy text-balance">{guestName ?? "Bapak/Ibu/Saudara/i"}</p>
          </div>
        </div>

        {/* Kantong depan: lipatan kiri, kanan, bawah */}
        <div className="env-part pointer-events-none absolute inset-0 z-[3]">
          <div className="absolute inset-0" style={{ filter: FLAP_SHADOW }}>
            <div className="envelope-paper absolute inset-0 [clip-path:polygon(0_0,55%_55%,0_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(120_95_70/0.10),rgb(255_255_255/0.06)_60%,rgb(110_85_60/0.16))]" />
            </div>
          </div>
          <div className="absolute inset-0" style={{ filter: FLAP_SHADOW }}>
            <div className="envelope-paper absolute inset-0 [clip-path:polygon(100%_0,45%_55%,100%_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(270deg,rgb(120_95_70/0.12),rgb(255_255_255/0.05)_60%,rgb(110_85_60/0.16))]" />
            </div>
          </div>
          <div className="absolute inset-0" style={{ filter: FLAP_SHADOW }}>
            <div className="envelope-paper absolute inset-0 [clip-path:polygon(0_100%,50%_47%,100%_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(110_85_60/0.14),rgb(255_255_255/0.08)_40%,rgb(255_255_255/0)_100%)]" />
            </div>
          </div>

          {/* Label alamat tamu */}
          <div className="env-hint absolute inset-x-0 bottom-[14%] flex justify-center px-8 [@media(max-height:700px)]:bottom-[16%]">
            <div className="relative w-full max-w-[18.5rem] -rotate-[1.2deg] bg-pearl px-5 lg:max-w-[24rem] lg:py-5 pb-3 pt-3.5 text-center shadow-[0_10px_22px_-10px_rgb(60_30_20/0.55),0_1px_0_rgb(255_255_255/0.8)_inset]">
              <div className="pointer-events-none absolute inset-[5px] border-[3px] border-double border-burgundy/45" />
              <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-burgundy">Kepada Yth.</p>
              <p className="mt-0.5 text-[0.82rem] italic text-ink/80">Bapak/Ibu/Saudara/i</p>
              <p className="mt-1 font-script text-[2.1rem] leading-[1.15] text-burgundy-deep text-balance lg:text-[2.8rem] [@media(max-height:700px)]:text-[1.8rem]">
                {guestName ?? "Tamu Undangan"}
              </p>
            </div>
          </div>
        </div>

        {/* Tutup amplop: depan kertas, belakang lapisan damask */}
        <div
          ref={flapRef}
          className="env-flap env-part absolute inset-x-0 top-0 z-[4] h-[60%] origin-top [transform-style:preserve-3d] [@media(max-height:700px)]:h-[54%]"
        >
          <div className="absolute inset-0 [backface-visibility:hidden]" style={{ filter: "drop-shadow(0 4px 5px rgb(70 50 35 / 0.35)) drop-shadow(0 14px 18px rgb(50 30 20 / 0.2))" }}>
            <div className="envelope-paper absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),rgb(120_95_70/0.08)_70%,rgb(110_85_60/0.18))]" />
            </div>
          </div>
          <div className="envelope-liner absolute inset-0 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)] [transform:rotateX(180deg)]" />
        </div>

        {/* Segel lilin */}
        {/* Posisi di pembungkus; transform animasi hanya di tombol agar tidak saling menimpa */}
        <div className="absolute left-1/2 top-[60%] z-[5] -translate-x-1/2 -translate-y-1/2 [@media(max-height:700px)]:top-[54%]">
          <button
            type="button"
            onClick={open}
            disabled={busy}
            aria-label="Buka amplop undangan"
            className="env-seal group relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            {!busy && (
              <span className="absolute inset-[10%] rounded-full bg-burgundy/15 motion-safe:animate-ping [animation-duration:2.4s]" aria-hidden="true" />
            )}
            <WaxSeal className="relative h-[min(34vw,9.5rem)] w-[min(34vw,9.5rem)] transition duration-500 group-hover:scale-105" />
          </button>
        </div>
      </div>

      {/* Petunjuk & pilihan musik */}
      <div className="env-hint absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[6] flex flex-col items-center">
        <motion.p
          animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full bg-burgundy-deep/90 px-5 py-2 font-display text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-pearl shadow-[0_6px_14px_-6px_rgb(40_5_12/0.7)]"
        >
          Ketuk segel untuk membuka
        </motion.p>
        {musicAvailable && (
          <button
            type="button"
            onClick={onToggleMusic}
            aria-pressed={musicEnabled}
            className="mt-1 flex min-h-10 items-center gap-2 px-3 text-[0.85rem] italic text-ink/80 transition hover:text-ink"
          >
            {musicEnabled ? <Music2 className="h-3.5 w-3.5 text-burgundy" /> : <VolumeX className="h-3.5 w-3.5" />}
            {musicEnabled ? "Dengan musik · ketuk untuk mematikan" : "Tanpa musik · ketuk untuk menyalakan"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
