import type { Metadata } from "next";
import { LogOut, MessageCircle, Trash2 } from "lucide-react";
import { wedding } from "@/config/wedding";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getEventId } from "@/lib/data";
import { headers } from "next/headers";
import { invitationUrl, siteUrlFromHeaders } from "@/lib/site";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase-server";
import { buildInviteMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatRelativeId } from "@/lib/format";
import { deleteGuestAction, logoutAction, setWishApprovalAction } from "./actions";
import { AddGuestForm, BulkAddForm, CopyButton, LoginForm } from "./AdminForms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Undangan", robots: { index: false, follow: false } };

type GuestRow = {
  id: string;
  guest_name: string;
  phone_number: string | null;
  category: string | null;
  token: string;
  attendance_status: "hadir" | "tidak_hadir" | null;
  guest_count: number | null;
  rsvp_message: string | null;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 text-ink sm:px-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <div className="mx-auto mt-20 max-w-md rounded-xl border border-espresso/10 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-burgundy">{title}</h1>
        <div className="mt-4 text-sm leading-relaxed text-ink/75">{children}</div>
      </div>
    </Shell>
  );
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <Notice title="Admin belum aktif">
        Isi <code>ADMIN_PASSWORD</code> (minimal 12 karakter) di environment variables, lalu jalankan ulang server.
      </Notice>
    );
  }
  if (!(await isAdmin())) {
    return (
      <Notice title="Masuk Admin">
        <LoginForm />
      </Notice>
    );
  }
  if (!isSupabaseConfigured()) {
    return (
      <Notice title="Supabase belum terhubung">
        Isi <code>SUPABASE_URL</code> dan <code>SUPABASE_SERVICE_ROLE_KEY</code>. Lihat README.
      </Notice>
    );
  }

  const eventId = await getEventId(wedding.slug);
  if (!eventId) {
    return (
      <Notice title="Data acara belum ada">
        Jalankan <code>supabase/migrations/001_init.sql</code> lalu <code>supabase/seed.sql</code> di Supabase SQL Editor.
      </Notice>
    );
  }

  const baseUrl = siteUrlFromHeaders(await headers());
  const db = getSupabase();
  const [{ data: guests }, { data: publicRsvps }, { data: wishes }] = await Promise.all([
    db
      .from("guest_rsvp_status")
      .select("id, guest_name, phone_number, category, token, attendance_status, guest_count, rsvp_message")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
    db
      .from("rsvps")
      .select("id, guest_name, attendance_status, guest_count, message, submitted_at")
      .eq("event_id", eventId)
      .is("guest_id", null)
      .order("submitted_at", { ascending: false }),
    db.from("wishes").select("id, guest_name, message, approved, created_at").eq("event_id", eventId).order("created_at", { ascending: false }).limit(200),
  ]);

  const list = (guests ?? []) as GuestRow[];
  const allRsvps = [
    ...list.filter((g) => g.attendance_status).map((g) => ({ status: g.attendance_status!, count: g.guest_count ?? 0 })),
    ...(publicRsvps ?? []).map((r) => ({ status: r.attendance_status as string, count: r.guest_count as number })),
  ];
  const attending = allRsvps.filter((r) => r.status === "hadir");
  const stats = [
    { label: "Tamu terdaftar", value: list.length },
    { label: "Konfirmasi hadir", value: attending.length },
    { label: "Total orang hadir", value: attending.reduce((s, r) => s + r.count, 0) },
    { label: "Berhalangan", value: allRsvps.filter((r) => r.status === "tidak_hadir").length },
    { label: "Belum konfirmasi", value: list.filter((g) => !g.attendance_status).length },
  ];

  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-rose">Admin Undangan</p>
          <h1 className="font-serif text-4xl italic text-burgundy">
            {wedding.groom.nickname} &amp; {wedding.bride.nickname}
          </h1>
        </div>
        <form action={logoutAction}>
          <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-espresso/15 px-4 text-sm hover:border-burgundy">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </form>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-espresso/10 bg-white p-4">
            <p className="font-serif text-3xl text-burgundy">{s.value}</p>
            <p className="mt-1 text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-espresso/10 bg-white p-5">
        <h2 className="font-serif text-2xl text-espresso">Tambah tamu</h2>
        <div className="mt-4">
          <AddGuestForm />
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-burgundy">Tambah banyak sekaligus</summary>
          <div className="mt-3">
            <BulkAddForm />
          </div>
        </details>
      </section>

      <section className="mt-8 rounded-xl border border-espresso/10 bg-white p-5">
        <h2 className="font-serif text-2xl text-espresso">Daftar tamu ({list.length})</h2>
        <p className="mt-1 text-xs text-ink/55">
          “Salin teks” menyalin pesan undangan lengkap berisi nama & link pribadi tamu. Tombol WhatsApp membuka chat dengan pesan yang sama — Anda tetap yang menekan kirim.
        </p>
        <div className="mt-4 divide-y divide-espresso/10">
          {list.length === 0 && <p className="py-6 text-sm text-ink/50">Belum ada tamu.</p>}
          {list.map((g) => {
            const url = invitationUrl(wedding.slug, g.token, baseUrl);
            const message = buildInviteMessage({
              guestName: g.guest_name,
              invitationUrl: url,
              groomName: wedding.groom.nickname,
              brideName: wedding.bride.nickname,
            });
            const wa = buildWhatsAppLink(g.phone_number, message);
            return (
              <div key={g.id} className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-espresso">
                    {g.guest_name}
                    {g.category && <span className="ml-2 rounded bg-champagne/25 px-1.5 py-0.5 text-[0.65rem] text-espresso">{g.category}</span>}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink/50">
                    {g.phone_number ? `+${g.phone_number}` : "Tanpa nomor"} · /{g.token} ·{" "}
                    {g.attendance_status === "hadir" ? (
                      <span className="text-emerald-700">Hadir ({g.guest_count})</span>
                    ) : g.attendance_status === "tidak_hadir" ? (
                      <span className="text-burgundy">Berhalangan</span>
                    ) : (
                      "Belum konfirmasi"
                    )}
                  </p>
                  {g.rsvp_message && <p className="mt-1 text-xs italic text-ink/60">“{g.rsvp_message}”</p>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-[#1f8f4e] px-3 text-xs font-medium text-white transition hover:bg-[#187540]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <CopyButton text={message} label="Salin teks" />
                  <CopyButton text={url} label="Salin link" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-burgundy underline-offset-2 hover:underline">
                    Buka
                  </a>
                  <form action={deleteGuestAction}>
                    <input type="hidden" name="id" value={g.id} />
                    <button aria-label={`Hapus ${g.guest_name}`} className="grid h-9 w-9 place-items-center rounded-md text-ink/40 transition hover:bg-burgundy/10 hover:text-burgundy">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-burgundy/80">Lihat teks undangan</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-[#faf7f2] p-3 font-sans text-xs leading-relaxed text-ink/80">{message}</pre>
              </details>
              </div>
            );
          })}
        </div>
      </section>

      {(publicRsvps?.length ?? 0) > 0 && (
        <section className="mt-8 rounded-xl border border-espresso/10 bg-white p-5">
          <h2 className="font-serif text-2xl text-espresso">RSVP dari link umum ({publicRsvps!.length})</h2>
          <ul className="mt-3 divide-y divide-espresso/10 text-sm">
            {publicRsvps!.map((r) => (
              <li key={r.id} className="py-3">
                <span className="font-medium">{r.guest_name}</span> —{" "}
                {r.attendance_status === "hadir" ? `Hadir (${r.guest_count})` : "Berhalangan"}
                {r.message && <span className="block text-xs italic text-ink/60">“{r.message}”</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-espresso/10 bg-white p-5">
        <h2 className="font-serif text-2xl text-espresso">Ucapan ({wishes?.length ?? 0})</h2>
        <ul className="mt-3 divide-y divide-espresso/10">
          {(wishes ?? []).map((w) => (
            <li key={w.id} className={`flex items-start justify-between gap-4 py-3 ${w.approved ? "" : "opacity-50"}`}>
              <div className="min-w-0 text-sm">
                <p className="font-medium">
                  {w.guest_name} <span className="text-xs font-normal text-ink/45">· {formatRelativeId(w.created_at)}</span>
                </p>
                <p className="mt-0.5 whitespace-pre-line break-words text-ink/75">{w.message}</p>
              </div>
              <form action={setWishApprovalAction}>
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="approved" value={String(!w.approved)} />
                <button className="min-h-9 shrink-0 rounded-md border border-espresso/15 px-3 text-xs hover:border-burgundy">
                  {w.approved ? "Sembunyikan" : "Tampilkan"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
