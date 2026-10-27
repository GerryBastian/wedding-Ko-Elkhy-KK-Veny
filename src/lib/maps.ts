import type { WeddingEvent } from "@/types";

const query = (e: Pick<WeddingEvent, "venue" | "address">) => encodeURIComponent(`${e.venue}, ${e.address}`);

/** Link untuk membuka lokasi di Google Maps. */
export function mapsLink(e: Pick<WeddingEvent, "venue" | "address" | "mapsUrl">) {
  return e.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${query(e)}`;
}

/** Link navigasi (petunjuk arah) Google Maps. Jika link Maps resmi diisi, link itu yang dipakai. */
export function directionsLink(e: Pick<WeddingEvent, "venue" | "address" | "mapsUrl">) {
  return e.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${query(e)}&travelmode=driving`;
}

/** Hanya URL embed resmi Google Maps yang diizinkan untuk iframe. */
export function safeEmbedUrl(url: string | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const ok = u.protocol === "https:" && /(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname.startsWith("/maps/embed");
    return ok ? u.toString() : null;
  } catch {
    return null;
  }
}
