import "server-only";
import { createHash } from "node:crypto";

export function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

/** IP tidak disimpan mentah — hanya hash bergaram untuk deteksi spam. */
export function hashIp(ip: string) {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-16) ?? "wedding";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Tolak permintaan lintas situs (proteksi CSRF ringan untuk API publik). */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
