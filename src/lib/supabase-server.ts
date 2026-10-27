import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Klien Supabase dengan service role — HANYA untuk kode server.
 * RLS aktif tanpa policy publik, sehingga semua akses data wajib lewat sini.
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase belum dikonfigurasi (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  if (!client) {
    // Toleransi salah salin: "https://x.supabase.co/rest/v1/" → "https://x.supabase.co"
    const url = process.env.SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
    client = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
