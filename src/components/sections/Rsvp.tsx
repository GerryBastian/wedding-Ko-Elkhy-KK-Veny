"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Loader2, Minus, Plus, Send } from "lucide-react";
import type { AttendanceStatus } from "@/types";
import { LIMITS } from "@/lib/limits";
import Image from "next/image";
import { galleryPhotos } from "@/config/photos.generated";
import { Florals } from "@/components/decor/Florals";
import { Reveal } from "@/components/ui/Reveal";
import { GoldFlourish } from "@/components/decor/Ornaments";

const rsvpPhoto = galleryPhotos[1];

type Existing = { attendance: AttendanceStatus; guestCount: number; message: string } | null;

type Props = {
  token: string | null;
  guestName: string | null;
  existing: Existing;
};

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success"; updated: boolean } | { kind: "error"; message: string };

export function Rsvp({ token, guestName, existing }: Props) {
  const startedAt = useRef(Date.now());
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState<AttendanceStatus | null>(existing?.attendance ?? null);
  const [count, setCount] = useState(existing && existing.guestCount > 0 ? existing.guestCount : 1);
  const [message, setMessage] = useState(existing?.message ?? "");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<{ name?: string; attendance?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Mohon isi nama Anda (minimal 2 karakter).";
    if (!attendance) next.attendance = "Mohon pilih status kehadiran.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === "loading" || !validate()) return;
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token ?? undefined,
          name,
          attendance,
          guestCount: attendance === "hadir" ? count : 0,
          message,
          website,
          startedAt: startedAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; updated?: boolean };
      if (!res.ok || !json.ok) throw new Error(json.error || "Gagal mengirim konfirmasi. Silakan coba lagi.");
      setStatus({ kind: "success", updated: Boolean(json.updated) });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Koneksi bermasalah. Periksa internet Anda lalu coba lagi." });
    }
  };

  return (
    <section id="rsvp" className="velvet overflow-hidden px-5 py-20 lg:py-28">
      <Florals variant="bouquet" className="absolute -right-12 top-10 w-48 rotate-[10deg]" />
      <Reveal className="relative mx-auto max-w-lg">
        <div className="paper relative px-6 pb-10 pt-10 shadow-[0_40px_70px_-30px_rgb(0_0_0/0.8)] sm:px-10">
          <div className="pointer-events-none absolute inset-3 border border-burgundy/25" aria-hidden="true" />
          <div className="relative text-center">
            <h2 className="font-display text-[2.6rem] font-normal uppercase tracking-[0.35em] text-burgundy">RSVP</h2>
            <div className="relative mx-auto mt-5 aspect-[3/4] w-40 overflow-hidden rounded-[50%] ring-1 ring-burgundy/40 ring-offset-4 ring-offset-ivory">
              <Image
                src={rsvpPhoto.src}
                alt=""
                fill
                sizes="160px"
                placeholder="blur"
                blurDataURL={rsvpPhoto.blurDataURL}
                className="object-cover object-[50%_20%]"
              />
            </div>
            <p className="mx-auto mt-6 max-w-xs text-[1.08rem] italic leading-relaxed text-ink/75 text-balance">
              Kehadiran dan doa restu Anda merupakan kebahagiaan bagi kami. Mohon konfirmasi kehadiran Anda.
            </p>
          </div>
          <div className="relative mt-8">
          <AnimatePresence mode="wait">
            {status.kind === "success" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
                role="status"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-burgundy text-champagne">
                  <Check className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-script text-5xl leading-tight text-burgundy">Terima kasih, {name.trim()}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/75">
                  {attendance === "hadir"
                    ? `Konfirmasi kehadiran untuk ${count} orang telah kami terima. Sampai jumpa di hari bahagia kami!`
                    : "Konfirmasi Anda telah kami terima. Terima kasih atas doa restunya."}
                </p>
                {status.updated && <p className="mt-2 text-xs text-rose">Konfirmasi sebelumnya telah diperbarui.</p>}
                {token && (
                  <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-6 min-h-11 text-xs uppercase tracking-[0.2em] text-burgundy underline-offset-4 hover:underline">
                    Ubah konfirmasi
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate>
                {existing && (
                  <p className="mb-6 rounded-sm bg-champagne/15 px-4 py-3 text-center text-xs leading-relaxed text-espresso">
                    Anda sudah mengirim konfirmasi sebelumnya. Anda dapat memperbaruinya di bawah ini.
                  </p>
                )}

                {/* Honeypot — disembunyikan dari manusia */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>

                <label className="block">
                  <span className="eyebrow text-rose">Nama</span>
                  <input
                    className="field mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    placeholder="Nama lengkap Anda"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "rsvp-name-err" : undefined}
                  />
                  {errors.name && <span id="rsvp-name-err" className="mt-1.5 block text-xs text-burgundy">{errors.name}</span>}
                </label>

                <fieldset className="mt-8">
                  <legend className="eyebrow text-rose">Kehadiran</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup">
                    {(
                      [
                        { value: "hadir", label: "Akan Hadir" },
                        { value: "tidak_hadir", label: "Berhalangan" },
                      ] as const
                    ).map((opt) => {
                      const active = attendance === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setAttendance(opt.value)}
                          className={`min-h-14 border px-3 py-3 font-display text-[0.95rem] tracking-wide transition duration-300 ${
                            active
                              ? "border-burgundy bg-burgundy text-ivory shadow-[0_10px_25px_-12px_rgb(112_44_59/0.9)]"
                              : "border-burgundy/25 text-burgundy hover:border-burgundy/60"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.attendance && <span className="mt-1.5 block text-xs text-burgundy">{errors.attendance}</span>}
                </fieldset>

                <AnimatePresence initial={false}>
                  {attendance === "hadir" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-8 flex items-center justify-between">
                        <span className="eyebrow text-rose" id="rsvp-count-label">Jumlah tamu</span>
                        <div className="flex items-center gap-1" aria-labelledby="rsvp-count-label">
                          <button
                            type="button"
                            onClick={() => setCount((c) => Math.max(1, c - 1))}
                            disabled={count <= 1}
                            aria-label="Kurangi jumlah tamu"
                            className="grid h-11 w-11 place-items-center rounded-full border border-burgundy/30 text-burgundy transition hover:bg-burgundy hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-burgundy"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <output className="w-12 text-center font-serif text-3xl text-espresso" aria-live="polite">{count}</output>
                          <button
                            type="button"
                            onClick={() => setCount((c) => Math.min(LIMITS.maxGuests, c + 1))}
                            disabled={count >= LIMITS.maxGuests}
                            aria-label="Tambah jumlah tamu"
                            className="grid h-11 w-11 place-items-center rounded-full border border-burgundy/30 text-burgundy transition hover:bg-burgundy hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-burgundy"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="mt-8 block">
                  <span className="eyebrow text-rose">Pesan (opsional)</span>
                  <textarea
                    className="field mt-1 min-h-24 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={LIMITS.rsvpMessage}
                    placeholder="Tulis pesan singkat untuk mempelai"
                  />
                  <span className="mt-1 block text-right text-[0.65rem] text-ink/40">
                    {message.length}/{LIMITS.rsvpMessage}
                  </span>
                </label>

                {status.kind === "error" && (
                  <p role="alert" className="mt-4 flex items-start gap-2 bg-burgundy/8 px-4 py-3 text-sm text-burgundy">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {status.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status.kind === "loading"}
                  className="mt-8 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-burgundy px-6 py-4 font-display text-[0.72rem] uppercase tracking-[0.28em] text-pearl shadow-[0_12px_24px_-12px_rgb(110_26_44/0.9)] transition duration-500 hover:bg-burgundy-deep disabled:cursor-wait disabled:opacity-80"
                >
                  {status.kind === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Mengirim…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-champagne" /> Kirim Konfirmasi
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          </div>
          <GoldFlourish className="mx-auto mt-8 h-4 w-40" />
        </div>
      </Reveal>
    </section>
  );
}
