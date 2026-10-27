import { NextResponse } from "next/server";
import { wedding } from "@/config/wedding";
import { getEventId, getGuestByToken } from "@/lib/data";
import { firstError, rsvpSchema } from "@/lib/validation";
import { getSupabase } from "@/lib/supabase-server";
import { guardPublicPost, isUniqueViolation, jsonError, submittedTooFast } from "../_shared";

export async function POST(req: Request) {
  const guard = await guardPublicPost(req, "rsvp", 10);
  if ("error" in guard) return guard.error;

  const parsed = rsvpSchema.safeParse(guard.body);
  if (!parsed.success) return jsonError(firstError(parsed.error), 400);
  const input = parsed.data;
  if (input.website || submittedTooFast(input.startedAt)) return jsonError("Permintaan ditolak. Silakan coba lagi.", 400);

  try {
    const eventId = await getEventId(wedding.slug);
    if (!eventId) return jsonError("Data acara belum tersedia.", 503);

    const db = getSupabase();
    const row = {
      event_id: eventId,
      guest_name: input.name,
      attendance_status: input.attendance,
      guest_count: input.guestCount,
      message: input.message || null,
    };

    // ── Tamu dengan link pribadi: 1 RSVP per tamu, boleh diperbarui ──
    if (input.token) {
      const guest = await getGuestByToken(wedding.slug, input.token);
      if (!guest) return jsonError("Link undangan tidak valid.", 400);

      const update = () =>
        db.from("rsvps").update({ ...row, updated_at: new Date().toISOString() }).eq("guest_id", guest.id).select("id");

      const { data: updated, error: updErr } = await update();
      if (updErr) throw updErr;
      if (updated && updated.length > 0) return NextResponse.json({ ok: true, updated: true });

      const { error: insErr } = await db.from("rsvps").insert({ ...row, guest_id: guest.id });
      if (isUniqueViolation(insErr)) {
        // Kiriman ganda bersamaan — perbarui saja
        const { error } = await update();
        if (error) throw error;
        return NextResponse.json({ ok: true, updated: true });
      }
      if (insErr) throw insErr;
      return NextResponse.json({ ok: true, updated: false });
    }

    // ── Tamu dari link umum: duplikat nama ditolak ──
    const { error } = await db.from("rsvps").insert({ ...row, guest_id: null });
    if (isUniqueViolation(error)) {
      return jsonError(
        "Konfirmasi atas nama ini sudah kami terima. Jika ingin mengubahnya, silakan hubungi mempelai.",
        409,
      );
    }
    if (error) throw error;
    return NextResponse.json({ ok: true, updated: false });
  } catch (err) {
    console.error("[rsvp]", err);
    return jsonError("Maaf, terjadi kesalahan. Silakan coba lagi.", 500);
  }
}
