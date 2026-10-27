/** Batas input form — dipakai di klien & server (tanpa zod agar bundle klien ringan). */
export const LIMITS = {
  name: 60,
  rsvpMessage: 300,
  wish: 500,
  maxGuests: 5,
} as const;
