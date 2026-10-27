import { NextResponse } from "next/server";
import { wedding } from "@/config/wedding";
import { getEventId, getGuestByToken, listApprovedWishes } from "@/lib/data";
import { hashIp } from "@/lib/request";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase-server";
import { firstError, wishSchema } from "@/lib/validation";
import { guardPublicPost, jsonError, submittedTooFast } from "../_shared";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, wishes: [] });
  try {
    return NextResponse.json({ ok: true, wishes: await listApprovedWishes() });
  } catch (err) {
    console.error("[wishes:get]", err);
    return jsonError("Gagal memuat ucapan.", 500);
  }
}

export async function POST(req: Request) {
  const guard = await guardPublicPost(req, "wish", 5);
  if ("error" in guard) return guard.error;

  const parsed = wishSchema.safeParse(guard.body);
  if (!parsed.success) return jsonError(firstError(parsed.error), 400);
  const input = parsed.data;
  if (input.website || submittedTooFast(input.startedAt)) return jsonError("Permintaan ditolak. Silakan coba lagi.", 400);

  try {
    const eventId = await getEventId(wedding.slug);
    if (!eventId) return jsonError("Data acara belum tersedia.", 503);
    const db = getSupabase();
    const ipHash = hashIp(guard.ip);

    // Lapis kedua anti-spam (tahan restart server): maks. 3 ucapan / 10 menit / IP
    const since = new Date(Date.now() - 10 * 60_000).toISOString();
    const { count, error: cntErr } = await db
      .from("wishes")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (cntErr) throw cntErr;
    if ((count ?? 0) >= 3) return jsonError("Terlalu banyak ucapan dalam waktu singkat. Coba lagi nanti.", 429);

    // Tolak ucapan identik yang dikirim ulang
    const { data: dup, error: dupErr } = await db
      .from("wishes")
      .select("id")
      .eq("event_id", eventId)
      .eq("message", input.message)
      .limit(1);
    if (dupErr) throw dupErr;
    if (dup && dup.length > 0) return jsonError("Ucapan yang sama sudah terkirim. Terima kasih!", 409);

    const guest = input.token ? await getGuestByToken(wedding.slug, input.token) : null;

    const { data, error } = await db
      .from("wishes")
      .insert({ event_id: eventId, guest_id: guest?.id ?? null, guest_name: input.name, message: input.message, ip_hash: ipHash })
      .select("id, guest_name, message, created_at")
      .single();
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      wish: { id: data.id, name: data.guest_name, message: data.message, createdAt: data.created_at },
    });
  } catch (err) {
    console.error("[wishes:post]", err);
    return jsonError("Maaf, ucapan gagal terkirim. Silakan coba lagi.", 500);
  }
}
