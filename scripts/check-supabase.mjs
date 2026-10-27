// Cek koneksi Supabase & kesiapan tabel tanpa menampilkan isi key.
// Jalankan: npm run check:db
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.resolve(import.meta.dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("✗ File .env.local tidak ditemukan.");
  process.exit(1);
}
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);

const url = (env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const key = env.SUPABASE_SERVICE_ROLE_KEY || "";

let ok = true;
const fail = (msg) => {
  ok = false;
  console.log(`✗ ${msg}`);
};

if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)) fail(`SUPABASE_URL tidak valid: "${url}"`);
else console.log(`✓ SUPABASE_URL: ${url}`);

if (!key) fail("SUPABASE_SERVICE_ROLE_KEY masih kosong.");
else if (key.startsWith("sb_publishable_")) fail("Key yang diisi adalah publishable key — gunakan secret / service_role key.");
else if (key.startsWith("eyJ")) {
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
    if (payload.role !== "service_role") fail(`Key ini ber-role "${payload.role}" — gunakan key service_role, bukan anon.`);
    else console.log("✓ Key service_role terdeteksi.");
  } catch {
    fail("Key tidak dapat dibaca — pastikan disalin utuh.");
  }
} else if (key.startsWith("sb_secret_")) console.log("✓ Secret key (sb_secret_) terdeteksi.");
else fail("Format key tidak dikenali.");

const pw = env.ADMIN_PASSWORD || "";
if (pw.length < 12) fail("ADMIN_PASSWORD kurang dari 12 karakter.");
else console.log("✓ ADMIN_PASSWORD terisi.");

if (ok) {
  const db = createClient(url, key, { auth: { persistSession: false } });
  for (const table of ["events", "guests", "rsvps", "wishes"]) {
    const { error, count } = await db.from(table).select("*", { count: "exact", head: true });
    if (error) fail(`Tabel "${table}": ${error.message}${error.code === "42P01" || /does not exist|schema cache/.test(error.message) ? " → jalankan supabase/migrations/001_init.sql" : ""}`);
    else console.log(`✓ Tabel ${table} (${count ?? 0} baris)`);
  }
  if (ok) {
    const { data } = await db.from("events").select("slug").eq("slug", "elkhi-veni").maybeSingle();
    if (!data) fail('Data acara "elkhi-veni" belum ada → jalankan supabase/seed.sql');
    else console.log('✓ Data acara "elkhi-veni" ada.');
  }
}

console.log(ok ? "\nSemua siap. Jalankan ulang `npm run dev`, lalu buka /admin." : "\nPerbaiki poin bertanda ✗ di atas.");
process.exit(ok ? 0 : 1);
