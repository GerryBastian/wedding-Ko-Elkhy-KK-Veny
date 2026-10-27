import "server-only";
import { NextResponse } from "next/server";
import { MIN_FILL_MS } from "@/lib/validation";
import { getClientIp, isSameOrigin } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/** Pemeriksaan umum untuk semua POST publik. Mengembalikan Response bila harus ditolak. */
export async function guardPublicPost(req: Request, scope: string, limit: number) {
  if (!isSameOrigin(req)) return { error: jsonError("Permintaan ditolak.", 403) };
  const ip = getClientIp(req);
  const rl = rateLimit(`${scope}:${ip}`, limit, 10 * 60_000);
  if (!rl.ok) return { error: jsonError("Terlalu banyak percobaan. Silakan coba lagi beberapa menit lagi.", 429) };
  if (!isSupabaseConfigured()) return { error: jsonError("Layanan sedang belum tersedia. Silakan coba lagi nanti.", 503) };

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { error: jsonError("Format data tidak valid.", 400) };
  }
  return { body, ip };
}

/** Bot biasanya mengirim form seketika. */
export function submittedTooFast(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  return elapsed < MIN_FILL_MS || elapsed > 1000 * 60 * 60 * 24 * 2;
}

export const isUniqueViolation = (err: { code?: string } | null) => err?.code === "23505";
