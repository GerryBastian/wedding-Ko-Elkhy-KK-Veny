export type Photo = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export type Person = {
  nickname: string;
  fullName: string;
  /** contoh: "Putra ketiga dari enam bersaudara" */
  childOrder: string;
  father: string;
  mother: string;
  instagram?: string;
};

export type WeddingEvent = {
  key: "pemberkatan" | "resepsi";
  title: string;
  /** ISO 8601 dengan offset zona waktu, contoh 2026-11-06T09:00:00+08:00 */
  startsAt: string;
  timeLabel: string;
  venue: string;
  address: string;
  /** Link Google Maps lengkap (opsional). Jika kosong, dibuat dari nama tempat + alamat. */
  mapsUrl?: string;
  /** URL embed Google Maps (Bagikan → Sematkan peta). Peta hanya tampil jika diisi. */
  mapsEmbedUrl?: string;
};

/** Data tamu yang aman dikirim ke browser — TANPA nomor telepon. */
export type PublicGuest = {
  id: string;
  name: string;
  category: string | null;
  token: string;
};

export type AttendanceStatus = "hadir" | "tidak_hadir";

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};
