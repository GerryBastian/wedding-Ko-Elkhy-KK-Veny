"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Heart, Loader2, Send } from "lucide-react";
import type { Wish } from "@/types";
import { LIMITS } from "@/lib/limits";
import { ScriptHeading, WaxSeal } from "@/components/decor/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  token: string | null;
  guestName: string | null;
  initialWishes: Wish[];
};

const PAGE = 3;

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function Wishes({ token, guestName, initialWishes }: Props) {
  const startedAt = useRef(Date.now());
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [visible, setVisible] = useState(PAGE);
  const [name, setName] = useState(guestName ?? "");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    if (name.trim().length < 2) return setError("Mohon isi nama Anda.");
    if (message.trim().length < 5) return setError("Ucapan minimal 5 karakter.");
    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token ?? undefined, name, message, website, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; wish?: Wish };
      if (!res.ok || !json.ok || !json.wish) throw new Error(json.error || "Ucapan gagal terkirim.");
      setWishes((w) => [json.wish!, ...w]);
      setVisible((v) => v + 1);
      setMessage("");
      setSent(true);
      startedAt.current = Date.now();
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Koneksi bermasalah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ucapan" className="paper overflow-hidden py-14 lg:py-24">
      <Reveal>
        <ScriptHeading script="Doa & Ucapan" label="Buku tamu" />
      </Reveal>

      <div className="mx-auto mt-8 grid max-w-5xl gap-12 px-5 lg:grid-cols-5 lg:px-10">
        <Reveal className="lg:col-span-2">
          <form onSubmit={onSubmit} noValidate className="relative border-[3px] border-double border-burgundy/40 bg-pearl px-6 pb-7 pt-9 shadow-[0_20px_40px_-26px_rgb(30_5_10/0.6)] lg:sticky lg:top-10">
            <WaxSeal className="absolute -top-7 right-6 h-14 w-14 rotate-12" />
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="eyebrow text-rose">Nama</span>
              <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name} placeholder="Nama Anda" autoComplete="name" />
            </label>
            <label className="mt-7 block">
              <span className="eyebrow text-rose">Ucapan &amp; doa</span>
              <textarea
                className="field mt-1 min-h-24 resize-none"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setSent(false);
                }}
                maxLength={LIMITS.wish}
                placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai"
              />
              <span className="mt-1 block text-right text-[0.65rem] text-ink/40">
                {message.length}/{LIMITS.wish}
              </span>
            </label>

            {error && (
              <p role="alert" className="mt-3 flex items-start gap-2 bg-burgundy/8 px-4 py-3 text-sm text-burgundy">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            {sent && !error && (
              <p role="status" className="mt-3 text-sm text-rose">
                Terima kasih! Ucapan Anda telah terkirim.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-burgundy px-6 py-4 font-display text-[0.72rem] uppercase tracking-[0.28em] text-pearl transition duration-500 hover:bg-burgundy-deep disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Mengirim…" : "Kirim Ucapan"}
            </button>
          </form>
        </Reveal>

        <div className="lg:col-span-3">
          <div className="flex items-baseline justify-between border-b border-champagne/60 pb-3">
            <p className="font-script text-[2rem] leading-tight text-burgundy">Doa dari orang terkasih</p>
            <p className="flex items-center gap-1.5 text-xs text-ink/55">
              <Heart className="h-3.5 w-3.5 fill-rose text-rose" /> {wishes.length}
            </p>
          </div>

          {wishes.length === 0 ? (
            <p className="py-12 text-center font-serif text-lg italic text-ink/50">Jadilah yang pertama mengirimkan doa restu.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              <AnimatePresence initial={false}>
                {wishes.slice(0, visible).map((w) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-pearl/80 px-5 py-5 shadow-[0_10px_24px_-18px_rgb(30_5_10/0.6)] before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:bg-gold"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-lg italic text-burgundy">{w.name}</p>
                      <p suppressHydrationWarning className="shrink-0 text-[0.65rem] uppercase tracking-wider text-ink/40">{timeAgo(w.createdAt)}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-line break-words text-[1.05rem] leading-relaxed text-ink/85">{w.message}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {wishes.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="mx-auto mt-4 block min-h-11 px-4 text-xs uppercase tracking-[0.22em] text-burgundy underline-offset-4 hover:underline"
            >
              Tampilkan lebih banyak
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
