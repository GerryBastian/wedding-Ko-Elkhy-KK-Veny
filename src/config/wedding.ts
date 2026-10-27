import type { Person, WeddingEvent } from "@/types";

/**
 * SUMBER UTAMA KONTEN UNDANGAN.
 * Semua data diambil dari undangan cetak Elkhi & Veni.
 * Nilai yang belum tersedia ditandai `TODO` — isi sebelum undangan disebar.
 */
export const wedding = {
  /** Dipakai di URL: /undangan/<slug>/<token> — harus sama dengan events.slug di Supabase */
  slug: "elkhi-veni",
  timezone: "Asia/Makassar", // WITA (UTC+8)
  timezoneLabel: "WITA",

  groom: {
    nickname: "Elkhi",
    fullName: "Ricardus Elkhi Layansari",
    childOrder: "Putra ketiga dari enam bersaudara",
    father: "Bapak Lambertus Fouk Layansari (Alm.)",
    mother: "Ibu Beatrix Tulasi",
    instagram: undefined, // TODO (opsional): contoh "elkhi.layansari" tanpa @
  } satisfies Person,

  bride: {
    nickname: "Veni",
    fullName: "Febronia Eli Manehat, S.Pd., Gr.",
    childOrder: "Putri kedua dari dua bersaudara",
    father: "Bapak Mikhael Manehat (Alm.)",
    mother: "Ibu Maria Bete Kore",
    instagram: undefined, // TODO (opsional)
  } satisfies Person,

  /** Bapa & Mama Saksi */
  witnesses: {
    father: "Bapak Gregorius Tuas, S.Pd.",
    mother: "Mama Viktoria Muti Seran, S.Pd.",
  },

  verse: {
    text: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
    source: "Matius 19:6",
  },

  /** Waktu acara pertama — dipakai untuk hitung mundur */
  date: "2026-11-06T09:00:00+08:00",
  dateLabel: "Jumat, 06 November 2026",
  dateShort: "06 · 11 · 2026",

  events: [
    {
      key: "pemberkatan",
      title: "Pemberkatan Nikah",
      startsAt: "2026-11-06T09:00:00+08:00",
      timeLabel: "09.00 WITA – selesai",
      venue: "Gereja Paroki St. Laurensius Wemasa",
      address: "Wemasa", // TODO: lengkapi alamat (desa, kecamatan, kabupaten)
      mapsUrl: undefined, // TODO: tempel link Google Maps gereja
      mapsEmbedUrl: undefined, // TODO (opsional): URL embed peta
    },
    {
      key: "resepsi",
      title: "Resepsi Pernikahan",
      startsAt: "2026-11-06T13:00:00+08:00",
      timeLabel: "13.00 WITA – selesai",
      venue: "Welaksakar",
      address: "Desa Litamali (Wemasa)", // TODO: lengkapi kecamatan & kabupaten
      mapsUrl: undefined, // TODO: tempel link Google Maps lokasi resepsi
      mapsEmbedUrl: undefined, // TODO (opsional)
    },
  ] satisfies WeddingEvent[],

  /** Turut mengundang */
  families: {
    groom: [
      "Keluarga Besar Suku Umamalae",
      "Keluarga Besar Suku Manlea",
      "Keluarga Besar Liem – Tulasi",
      "Keluarga Besar Layansari",
    ],
    bride: [
      "Keluarga Besar Liubein – Manufahi",
      "Keluarga Besar Manehat – Anfotis",
      "Bapak Dominikus Atok",
      "Bapak David Manek",
      "Bapak Linus Manek",
      "Bapak Aloysius Kehi",
      "Bapak Ludovikus Boi Seran",
      "Bapak Ferdinandus H. Manek",
      "Bapak Hengki Nahak",
      "Bapak Yustinus Bau",
      "Keluarga Besar SMPN 1 Kobalima",
    ],
  },

  music: {
    src: "/music/wedding-song.mp3",
    title: "The Way You Look At Me",
    artist: "Nyoman Paul & Andi Rianto",
    /** Mulai dari menit 3:15 */
    startAt: 195,
  },

  copy: {
    openingInvite: "Dengan penuh sukacita, kami mengundang Anda untuk merayakan hari pernikahan kami.",
    heroIntro:
      "Dua perjalanan yang dipertemukan oleh kasih-Nya, kini dipersatukan dalam satu janji suci di hadapan Tuhan.",
    closing:
      "Tiada rangkaian kata yang lebih indah selain ucapan terima kasih dari hati yang tulus atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i.",
    defaultGuest: "Bapak/Ibu/Saudara/i",
  },
} as const;

export type WeddingConfig = typeof wedding;
