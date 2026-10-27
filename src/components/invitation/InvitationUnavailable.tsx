import Image from "next/image";
import Link from "next/link";
import { wedding } from "@/config/wedding";
import { couplePhotos } from "@/config/photos.generated";
import { OrnamentalFrame } from "@/components/ui/Ornaments";

type Props = { reason?: "not-found" | "error" };

/** Ditampilkan untuk token tidak valid / tidak ditemukan. */
export function InvitationUnavailable({ reason = "not-found" }: Props) {
  return (
    <main className="velvet grid min-h-[100svh] place-items-center overflow-hidden px-8 text-center">
      <Image
        src={couplePhotos.cover.src}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={couplePhotos.cover.blurDataURL}
        className="object-cover object-[50%_28%] opacity-25 blur-[2px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-espresso-deep/70 to-espresso-deep" />
      <OrnamentalFrame />
      <div className="relative max-w-sm">
        <p className="eyebrow text-champagne">The Wedding Of</p>
        <p className="mt-4 font-script text-6xl leading-tight text-gold">
          {wedding.groom.nickname} <span className="text-champagne">&amp;</span> {wedding.bride.nickname}
        </p>
        <div className="gold-rule mx-auto my-8 w-24" />
        <h1 className="font-display text-xl uppercase tracking-[0.2em]">
          {reason === "error" ? "Undangan sedang tidak dapat dimuat" : "Undangan tidak tersedia"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ivory/70">
          {reason === "error"
            ? "Mohon maaf, terjadi gangguan sementara. Silakan muat ulang halaman ini beberapa saat lagi."
            : "Tautan undangan ini tidak valid atau sudah tidak berlaku. Mohon periksa kembali tautan yang Anda terima."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center rounded-full border border-champagne/60 px-7 text-[0.7rem] uppercase tracking-[0.25em] text-champagne transition hover:bg-champagne hover:text-espresso"
        >
          Lihat undangan umum
        </Link>
      </div>
    </main>
  );
}
