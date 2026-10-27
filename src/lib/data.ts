import "server-only";
import { cache } from "react";
import { wedding } from "@/config/wedding";
import type { AttendanceStatus, PublicGuest, Wish } from "@/types";
import { getSupabase, isSupabaseConfigured } from "./supabase-server";
import { isValidTokenFormat } from "./token";

export const getEventId = cache(async (slug: string = wedding.slug): Promise<string | null> => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabase().from("events").select("id").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
});

/** Validasi token di server. Mengembalikan data tamu TANPA nomor telepon. */
export const getGuestByToken = cache(async (slug: string, token: string): Promise<PublicGuest | null> => {
  if (!isValidTokenFormat(token) || !isSupabaseConfigured()) return null;
  const eventId = await getEventId(slug);
  if (!eventId) return null;
  const { data, error } = await getSupabase()
    .from("guests")
    .select("id, guest_name, category, token")
    .eq("event_id", eventId)
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { id: data.id, name: data.guest_name, category: data.category, token: data.token };
});

export type ExistingRsvp = { attendance: AttendanceStatus; guestCount: number; message: string };

export async function getRsvpForGuest(guestId: string): Promise<ExistingRsvp | null> {
  const { data, error } = await getSupabase()
    .from("rsvps")
    .select("attendance_status, guest_count, message")
    .eq("guest_id", guestId)
    .maybeSingle();
  if (error) throw error;
  return data ? { attendance: data.attendance_status, guestCount: data.guest_count, message: data.message ?? "" } : null;
}

export async function listApprovedWishes(limit = 60): Promise<Wish[]> {
  const eventId = await getEventId();
  if (!eventId) return [];
  const { data, error } = await getSupabase()
    .from("wishes")
    .select("id, guest_name, message, created_at")
    .eq("event_id", eventId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((w) => ({ id: w.id, name: w.guest_name, message: w.message, createdAt: w.created_at }));
}

/** Untuk halaman publik: jangan sampai error DB merusak tampilan undangan. */
export async function safeListApprovedWishes() {
  try {
    return await listApprovedWishes();
  } catch (err) {
    console.error("[wishes] gagal memuat:", err);
    return [];
  }
}
