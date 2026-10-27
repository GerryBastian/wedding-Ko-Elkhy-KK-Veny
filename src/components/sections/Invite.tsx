"use client";

import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { wedding } from "@/config/wedding";
import { couplePhotos } from "@/config/photos.generated";
import { Florals } from "@/components/decor/Florals";
import { HangingMedallions } from "@/components/decor/HangingMedallions";
import { PearlStrand, ScriptHeading } from "@/components/decor/Ornaments";
import { Particles } from "@/components/ui/Particles";
import { Reveal } from "@/components/ui/Reveal";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

/** Link "Tambahkan ke Google Calendar". */
function calendarLink() {
  const first = wedding.events[0];
  const last = wedding.events[wedding.events.length - 1];
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(first.startsAt);
  const end = new Date(new Date(last.startsAt).getTime() + 5 * 3600_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${wedding.groom.nickname} & ${wedding.bride.nickname}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: wedding.events.map((e) => `${e.title}: ${e.timeLabel} — ${e.venue}, ${e.address}`).join("\n"),
    location: `${first.venue}, ${first.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** "Kami Mengundang": teks undangan, liontin foto mempelai, hitung mundur. */
export function Invite() {
  const target = new Date(wedding.date).getTime();
  // undefined = belum ter-mount (hindari mismatch SSR), false = sudah lewat
  const [parts, setParts] = useState<Parts | false | undefined>(undefined);

  useEffect(() => {
    const tick = () => setParts(diff(target) ?? false);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const units = [
    { label: "Hari", value: parts ? parts.days : undefined },
    { label: "Jam", value: parts ? parts.hours : undefined },
    { label: "Menit", value: parts ? parts.minutes : undefined },
    { label: "Detik", value: parts ? parts.seconds : undefined },
  ];

  return (
    <section id="undangan" className="velvet overflow-hidden px-6 pb-24 pt-20">
      <Particles count={10} />
      <Florals variant="sprig" className="absolute -left-10 top-6 w-40 rotate-[-12deg] opacity-95" />

      <Reveal className="relative mx-auto max-w-md">
        <ScriptHeading script="Kami Mengundang" tone="dark" />
        <p className="mt-6 text-center text-[1.12rem] leading-relaxed text-pearl/85 text-balance">
          Dengan memohon rahmat dan berkat Tuhan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu di
          hari pernikahan kami. Kehadiran Anda adalah anugerah terindah bagi kami.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="relative mx-auto mt-8 max-w-sm">
        <HangingMedallions
          left={{ photo: couplePhotos.groom, name: wedding.groom.nickname, label: wedding.groom.fullName }}
          right={{ photo: couplePhotos.bride, name: wedding.bride.nickname, label: wedding.bride.fullName }}
          className="mx-auto w-full max-w-[22rem] drop-shadow-[0_18px_24px_rgb(0_0_0/0.4)]"
        />
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-14 max-w-md text-center">
        <p className="eyebrow text-champagne-soft/80">Menuju hari bahagia</p>
        {parts === false ? (
          <p className="mt-5 font-script text-5xl text-gold">Hari bahagia telah tiba</p>
        ) : (
          <div className="mt-5 grid grid-cols-4" role="timer" aria-live="off">
            {units.map((u, i) => (
              <div key={u.label} className="relative flex flex-col items-center">
                {i > 0 && <span className="absolute -left-1 top-2 font-display text-4xl text-champagne/60">:</span>}
                <span className="text-gold font-display text-[2.9rem] leading-none tabular-nums sm:text-6xl">
                  {u.value === undefined ? "––" : String(u.value).padStart(2, "0")}
                </span>
                <span className="mt-3 font-display text-[0.62rem] uppercase tracking-[0.28em] text-pearl/70">{u.label}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-8 font-display text-sm uppercase tracking-[0.3em] text-pearl/80">{wedding.dateLabel}</p>
        <a href={calendarLink()} target="_blank" rel="noopener noreferrer" className="btn-notched mt-7">
          <CalendarPlus className="h-4 w-4" />
          Simpan Tanggal
        </a>
        <PearlStrand className="mx-auto mt-12 w-64 opacity-90" sag={22} count={20} />
      </Reveal>
    </section>
  );
}
