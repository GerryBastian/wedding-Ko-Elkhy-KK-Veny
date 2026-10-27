import { z } from "zod";
import { LIMITS } from "./limits";

/** Buang tag HTML, karakter kontrol, dan spasi berlebih. */
export function sanitizeText(input: string) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const cleanString = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} wajib diisi` })
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(min, `${label} minimal ${min} karakter`)
        .max(max, `${label} maksimal ${max} karakter`),
    );

const countLinks = (s: string) => (s.match(/https?:\/\/|www\./gi) ?? []).length;

/** Field anti-spam yang dikirim setiap form publik. */
const antiSpam = {
  /** Honeypot: input tersembunyi, manusia tidak mengisinya */
  website: z.string().max(0, "Permintaan ditolak").optional().default(""),
  /** Waktu (ms) form mulai ditampilkan — bot biasanya mengirim instan */
  startedAt: z.number().int().positive(),
};

export const MIN_FILL_MS = 2500;

export { LIMITS };

export const rsvpSchema = z
  .object({
    token: z.string().regex(/^[a-z0-9]{6,12}$/, "Link undangan tidak valid").optional(),
    name: cleanString(2, LIMITS.name, "Nama"),
    attendance: z.enum(["hadir", "tidak_hadir"], { errorMap: () => ({ message: "Pilih status kehadiran" }) }),
    guestCount: z.coerce.number().int().min(0).max(LIMITS.maxGuests, `Maksimal ${LIMITS.maxGuests} orang`),
    message: z
      .string()
      .optional()
      .default("")
      .transform(sanitizeText)
      .pipe(z.string().max(LIMITS.rsvpMessage, `Pesan maksimal ${LIMITS.rsvpMessage} karakter`)),
    ...antiSpam,
  })
  .refine((d) => d.attendance === "tidak_hadir" || d.guestCount >= 1, {
    path: ["guestCount"],
    message: "Jumlah tamu minimal 1 orang",
  })
  .transform((d) => ({ ...d, guestCount: d.attendance === "tidak_hadir" ? 0 : d.guestCount }));

export const wishSchema = z.object({
  token: z.string().regex(/^[a-z0-9]{6,12}$/, "Link undangan tidak valid").optional(),
  name: cleanString(2, LIMITS.name, "Nama"),
  message: cleanString(5, LIMITS.wish, "Ucapan").refine((m) => countLinks(m) === 0, "Ucapan tidak boleh berisi tautan"),
  ...antiSpam,
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Data tidak valid";
}
