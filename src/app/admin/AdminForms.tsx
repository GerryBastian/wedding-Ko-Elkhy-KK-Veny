"use client";

import { useActionState, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { addGuestAction, bulkAddGuestsAction, loginAction, type ActionResult } from "./actions";

const inputCls =
  "w-full rounded-md border border-espresso/15 bg-white px-3 py-2.5 text-base text-ink outline-none transition focus:border-burgundy sm:text-sm";
const btnCls =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-burgundy px-5 text-sm font-medium text-ivory transition hover:bg-burgundy-deep disabled:opacity-60";

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-burgundy"}`}>
      {state.message}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm text-ink/70">
        Kata sandi admin
        <input name="password" type="password" required autoComplete="current-password" className={`${inputCls} mt-1`} />
      </label>
      <button className={`${btnCls} w-full`} disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
      </button>
      <Feedback state={state} />
    </form>
  );
}

export function AddGuestForm() {
  const [state, action, pending] = useActionState(addGuestAction, null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[2fr_1.5fr_1fr_auto] sm:items-end">
      <label className="text-xs text-ink/60">
        Nama tamu*
        <input name="name" required maxLength={100} placeholder="Bpk. Yohanes & Keluarga" className={`${inputCls} mt-1`} />
      </label>
      <label className="text-xs text-ink/60">
        No. WhatsApp
        <input name="phone" inputMode="tel" placeholder="0812xxxxxxx" className={`${inputCls} mt-1`} />
      </label>
      <label className="text-xs text-ink/60">
        Kategori
        <input name="category" maxLength={40} placeholder="Keluarga" className={`${inputCls} mt-1`} />
      </label>
      <button className={btnCls} disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Tambah
      </button>
      <div className="sm:col-span-4">
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function BulkAddForm() {
  const [state, action, pending] = useActionState(bulkAddGuestsAction, null);
  return (
    <form action={action} className="space-y-3">
      <textarea
        name="bulk"
        rows={5}
        placeholder={"Satu tamu per baris — Nama, No. WA, Kategori\nBpk. Dominikus Atok, 081234567890, Keluarga\nIbu Maria, , Gereja"}
        className={`${inputCls} font-mono text-xs`}
      />
      <div className="flex items-center gap-3">
        <button className={btnCls} disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Tambah semua
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function CopyButton({ text, label = "Salin link" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          window.prompt("Salin link berikut:", text);
        }
      }}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-espresso/15 px-2.5 text-xs text-espresso transition hover:border-burgundy hover:text-burgundy"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Tersalin" : label}
    </button>
  );
}
