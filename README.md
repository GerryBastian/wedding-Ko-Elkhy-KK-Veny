# Undangan Digital — Elkhi & Veni

Undangan pernikahan digital **Ricardus Elkhi Layansari & Febronia Eli Manehat**
· Jumat, 06 November 2026 · Wemasa.

Konsep visual **Romantic Scrapbook (wine velvet)**, mengikuti moodboard: latar beludru wine berselang-seling dengan kertas krem, bingkai renda oval, polaroid miring, segel lilin, piringan hitam, medali gantung, jendela lengkung, mutiara, serta buket mawar burgundy dan hydrangea putih. Tipografinya Pinyon Script (kaligrafi), Bodoni Moda (kapital) dan Cormorant Garamond (isi). Semua ornamen digambar sebagai SVG/CSS (`src/components/decor/`), tanpa gambar stok.

**Teknologi:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Supabase (PostgreSQL), Lucide.

---

## Isi undangan

| # | Section | Keterangan |
|---|---|---|
| 01 | Amplop pembuka | Amplop kertas bertekstur, segel lilin realistis, dan label nama tamu. Saat segel diketuk: segel lepas, tutup terbuka (lapisan damask burgundy), kartu keluar lalu tamu langsung masuk ke undangan. Musik mulai di momen ini. |
| 02 | Kolase scrapbook | Kartu perangko, kartu tanggal, polaroid, piringan hitam (bisa diketuk untuk memutar/menjeda musik), catatan ayat Matius 19:6 |
| 03 | Kami Mengundang | Teks undangan, dua medali oval emas tergantung pada rantai halus berisi foto kedua mempelai, hitung mundur emas, tombol *Simpan Tanggal* |
| 04 | Mempelai | Foto dalam bingkai lengkung emas barok 3D (mahkota kerang, acanthus, untaian manik), orang tua, Bapa & Mama Saksi |
| 05 | Rangkaian Acara | Pemberkatan & Resepsi dalam panel lengkung, tombol *Petunjuk Arah* (peta embed muncul jika diisi) |
| 06 | Kisah Kami | Galeri polaroid, lightbox yang bisa digeser (swipe) |
| 07 | RSVP | Kartu kertas dengan foto oval; validasi, anti-duplikat, tersimpan di Supabase |
| 08 | Doa & Ucapan | Buku tamu dengan anti-spam |
| 09 | Turut Mengundang & Penutup | Daftar keluarga, polaroid penutup, monogram |

---

## 1. Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya (lihat langkah 2)
npm run dev                  # buka http://localhost:3000
```

> **Catatan Windows:** folder proyek ini mengandung tanda `&`. Karena itu script npm memanggil `node node_modules/...` secara langsung. Jangan pakai `npx next ...`, karena shim npx gagal di path yang mengandung `&`.

Script lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` | Build produksi |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm run lint` | ESLint |
| `npm run images` | Membuat ulang foto versi web dari foto asli (lihat bagian **Foto**) |

---

## 2. Supabase (database)

1. Buat project di <https://supabase.com>. Region **Singapore** adalah yang terdekat.
2. Buka **SQL Editor** → jalankan isi `supabase/migrations/001_init.sql`.
3. Lalu jalankan `supabase/seed.sql`. File ini membuat data acara `elkhi-veni` dan satu tamu uji (`uji123`).
4. Buka **Project Settings → API**, lalu salin ke `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # RAHASIA — hanya di server
NEXT_PUBLIC_SITE_URL=https://domain-anda.com
ADMIN_PASSWORD=kata-sandi-panjang-acak
```

**Keamanan:**
- RLS aktif di semua tabel dan **tidak ada policy publik**, sehingga browser tidak bisa membaca atau menulis database secara langsung.
- Semua akses lewat API server Next.js memakai *service role key*. Key ini tidak pernah dikirim ke browser.
- Nomor telepon tamu tidak pernah dikirim ke halaman undangan.

---

## 3. Mengelola tamu & mengirim undangan (WhatsApp)

1. Buka `https://domain-anda.com/admin` dan masuk dengan `ADMIN_PASSWORD`.
2. **Tambah tamu** satu per satu, atau gunakan **Tambah banyak sekaligus** dengan format satu tamu per baris:
   ```
   Bpk. Dominikus Atok, 081234567890, Keluarga
   Ibu Maria Bete, , Gereja
   ```
3. Setiap tamu otomatis mendapat link pribadi, contoh: `https://domain-anda.com/undangan/elkhi-veni/a8k2xm`
4. Tekan tombol **WhatsApp**. Chat terbuka dengan pesan undangan yang sudah terisi, lalu **Anda sendiri yang menekan kirim**. Tidak ada pengiriman otomatis atau massal.
5. Dari admin Anda juga bisa melihat status RSVP (hadir, jumlah orang, berhalangan, belum konfirmasi) dan menyembunyikan ucapan yang tidak pantas.

Teks pesan WhatsApp bisa diubah di `src/lib/whatsapp.ts` → `buildInviteMessage()`.

Link umum (`https://domain-anda.com/`) tetap bisa dipakai. Sapaannya menjadi "Tamu Undangan", dan RSVP dari link umum dicegah duplikat berdasarkan nama.

---

## 4. Mengubah konten

Semua teks ada di **`src/config/wedding.ts`**. Masih ada beberapa yang ditandai `TODO`:

- [ ] **Alamat lengkap** gereja & lokasi resepsi (kecamatan, kabupaten)
- [ ] **Link Google Maps** masing-masing lokasi (`mapsUrl`). Jika kosong, tombol arah memakai pencarian nama tempat.
- [ ] *(Opsional)* **URL embed peta** (`mapsEmbedUrl`): Google Maps → Bagikan → *Sematkan peta* → salin URL di dalam `src="..."`
- [ ] *(Opsional)* Akun **Instagram** mempelai

**Musik:** `public/music/wedding-song.mp3` diputar mulai menit **3:15** (`music.startAt = 195`). Setelah selesai, lagu kembali ke 3:15.

---

## 5. Foto

Foto asli kamera ada di `public/images/DJP_*.JPG` (±300 MB). Foto-foto ini **tidak ikut di-deploy** (sudah dimasukkan ke `.gitignore` dan `.vercelignore`).

Yang dipakai situs adalah versi web di `public/images/couple/` dan `public/images/gallery/`. Pilihan foto diatur di `scripts/optimize-images.mjs`. Semuanya dipilih dari foto yang **belum dipakai di undangan cetak**. Setelah mengubah pilihan, jalankan:

```bash
npm run images
```

Perintah ini membuat ulang file web, gambar pratinjau WhatsApp (`og.jpg`), dan `src/config/photos.generated.ts`.

---

## 6. Deploy ke Vercel

1. Push proyek ke GitHub. Foto asli otomatis tidak ikut.
2. Di <https://vercel.com>: **Add New → Project**, lalu import repo tersebut. Framework terdeteksi sebagai Next.js.
3. Isi **Environment Variables**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`.
4. Tekan **Deploy**.

**Domain sendiri:** buka Vercel → Project → **Settings → Domains** → tambahkan domain, lalu ikuti petunjuk DNS-nya (A record / CNAME). Setelah aktif, ubah `NEXT_PUBLIC_SITE_URL` ke domain tersebut dan **redeploy**. URL ini dipakai untuk link undangan dan gambar pratinjau WhatsApp.

---

## Struktur proyek

```
src/
  app/
    page.tsx                         undangan umum
    undangan/[slug]/[token]/page.tsx undangan personal (token divalidasi di server)
    api/rsvp, api/wishes             API publik (validasi + anti-spam)
    admin/                           kelola tamu, link WA, moderasi ucapan
  components/
    invitation/                      sampul, musik, scroll progress, shell
    sections/                        Hero, Couple, Countdown, Events, Gallery, ...
    ui/                              ornamen SVG, partikel, reveal, parallax
  config/wedding.ts                  ← SEMUA KONTEN
  lib/                               supabase, validasi, whatsapp, maps, token
supabase/migrations/001_init.sql     skema + RLS
```

## Anti-spam & validasi

- Validasi zod di server untuk semua input, dengan batas panjang (nama 60, pesan RSVP 300, ucapan 500 karakter).
- Honeypot tersembunyi, dan form yang dikirim kurang dari 2,5 detik ditolak.
- Rate limit per IP di memori, ditambah batas di database: maks. 3 ucapan per 10 menit per IP (IP disimpan sebagai hash).
- Ucapan berisi tautan dan ucapan identik ditolak.
- RSVP: 1 RSVP per tamu (bisa diperbarui lewat link pribadi). Duplikat nama dari link umum ditolak.
- API publik menolak permintaan lintas situs (cek header Origin).
