"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { wedding } from "@/config/wedding";
import { isAdmin, login, logout } from "@/lib/admin-auth";
import { getEventId } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase-server";
import { generateToken } from "@/lib/token";
import { sanitizeText } from "@/lib/validation";
import { normalizePhoneNumber } from "@/lib/whatsapp";

export type ActionResult = { ok: boolean; message: string };

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Tidak diizinkan");
}

export async function loginAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`admin-login:${ip}`, 6, 15 * 60_000).ok) {
    return { ok: false, message: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
  }
  const ok = await login(String(formData.get("password") ?? ""));
  if (!ok) return { ok: false, message: "Kata sandi salah." };
  revalidatePath("/admin");
  return { ok: true, message: "Berhasil masuk." };
}

export async function logoutAction() {
  await logout();
  revalidatePath("/admin");
}

const guestSchema = z.object({
  name: z.string().transform(sanitizeText).pipe(z.string().min(1, "Nama wajib diisi").max(100)),
  phone: z.string().optional().default(""),
  category: z.string().optional().default("").transform(sanitizeText).pipe(z.string().max(40)),
});

async function insertGuests(rows: { name: string; phone: string; category: string }[]) {
  const eventId = await getEventId(wedding.slug);
  if (!eventId) throw new Error(`Event dengan slug "${wedding.slug}" belum ada. Jalankan supabase/seed.sql.`);
  const db = getSupabase();

  let created = 0;
  for (const row of rows) {
    const phone = row.phone ? normalizePhoneNumber(row.phone) : null;
    // Ulangi bila token kebetulan bentrok (sangat jarang)
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await db.from("guests").insert({
        event_id: eventId,
        guest_name: row.name,
        phone_number: phone,
        category: row.category || null,
        token: generateToken(6),
      });
      if (!error) {
        created++;
        break;
      }
      if (error.code !== "23505") throw error;
    }
  }
  return created;
}

export async function addGuestAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = guestSchema.safeParse({
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    category: formData.get("category") ?? "",
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  if (parsed.data.phone && !normalizePhoneNumber(parsed.data.phone)) {
    return { ok: false, message: "Nomor WhatsApp tidak valid. Contoh: 081234567890" };
  }
  try {
    await insertGuests([parsed.data]);
    revalidatePath("/admin");
    return { ok: true, message: `Tamu "${parsed.data.name}" ditambahkan.` };
  } catch (err) {
    console.error("[admin:add]", err);
    return { ok: false, message: err instanceof Error ? err.message : "Gagal menambah tamu." };
  }
}

/** Format per baris: Nama, Nomor WA (opsional), Kategori (opsional) */
export async function bulkAddGuestsAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const lines = String(formData.get("bulk") ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { ok: false, message: "Daftar kosong." };
  if (lines.length > 500) return { ok: false, message: "Maksimal 500 baris sekali tambah." };

  const rows = [];
  for (const [i, line] of lines.entries()) {
    const [name = "", phone = "", category = ""] = line.split(/[,;\t]/).map((s) => s.trim());
    const parsed = guestSchema.safeParse({ name, phone, category });
    if (!parsed.success) return { ok: false, message: `Baris ${i + 1}: ${parsed.error.issues[0]?.message}` };
    if (phone && !normalizePhoneNumber(phone)) return { ok: false, message: `Baris ${i + 1}: nomor "${phone}" tidak valid.` };
    rows.push(parsed.data);
  }
  try {
    const created = await insertGuests(rows);
    revalidatePath("/admin");
    return { ok: true, message: `${created} tamu ditambahkan.` };
  } catch (err) {
    console.error("[admin:bulk]", err);
    return { ok: false, message: err instanceof Error ? err.message : "Gagal menambah tamu." };
  }
}

export async function deleteGuestAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const { error } = await getSupabase().from("guests").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

export async function setWishApprovalAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const approved = formData.get("approved") === "true";
  const { error } = await getSupabase().from("wishes").update({ approved }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/");
}
