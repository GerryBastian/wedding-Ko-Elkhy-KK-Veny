-- ═══════════════════════════════════════════════════════════════════
-- Undangan Digital Elkhi & Veni — skema database
-- Jalankan di Supabase Dashboard → SQL Editor (sekali saja).
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ─── EVENTS ─────────────────────────────────────────────────────────
create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  groom_name     text not null,
  bride_name     text not null,
  groom_parents  text,
  bride_parents  text,
  wedding_date   timestamptz not null,
  venue          text,
  address        text,
  maps_url       text,
  cover_image    text,
  created_at     timestamptz not null default now()
);

-- ─── GUESTS ─────────────────────────────────────────────────────────
create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events(id) on delete cascade,
  guest_name    text not null check (char_length(guest_name) between 1 and 100),
  phone_number  text check (phone_number is null or phone_number ~ '^[0-9]{10,15}$'),
  category      text check (category is null or char_length(category) <= 40),
  token         text not null unique check (token ~ '^[a-z0-9]{6,12}$'),
  created_at    timestamptz not null default now()
);
create index if not exists guests_event_idx on public.guests(event_id);

-- ─── RSVPS ──────────────────────────────────────────────────────────
-- guest_id terisi untuk tamu dengan link pribadi (1 tamu = 1 RSVP, bisa diperbarui).
-- guest_id NULL untuk tamu dari link umum; duplikat dicegah per nama.
create table if not exists public.rsvps (
  id                 uuid primary key default gen_random_uuid(),
  event_id           uuid not null references public.events(id) on delete cascade,
  guest_id           uuid references public.guests(id) on delete cascade,
  guest_name         text not null check (char_length(guest_name) between 2 and 60),
  attendance_status  text not null check (attendance_status in ('hadir', 'tidak_hadir')),
  guest_count        smallint not null default 1 check (guest_count between 0 and 5),
  message            text check (message is null or char_length(message) <= 300),
  submitted_at       timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint rsvp_count_matches_status check (
    (attendance_status = 'hadir' and guest_count >= 1) or
    (attendance_status = 'tidak_hadir' and guest_count = 0)
  )
);
create unique index if not exists rsvps_one_per_guest
  on public.rsvps(guest_id) where guest_id is not null;
create unique index if not exists rsvps_one_per_public_name
  on public.rsvps(event_id, lower(guest_name)) where guest_id is null;

-- ─── WISHES ─────────────────────────────────────────────────────────
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events(id) on delete cascade,
  guest_id    uuid references public.guests(id) on delete set null,
  guest_name  text not null check (char_length(guest_name) between 2 and 60),
  message     text not null check (char_length(message) between 5 and 500),
  approved    boolean not null default true,
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index if not exists wishes_feed_idx on public.wishes(event_id, approved, created_at desc);
create index if not exists wishes_ip_idx on public.wishes(ip_hash, created_at desc);

-- ─── RINGKASAN TAMU + STATUS RSVP (untuk admin) ─────────────────────
create or replace view public.guest_rsvp_status
with (security_invoker = true) as
select g.id, g.event_id, g.guest_name, g.phone_number, g.category, g.token, g.created_at,
       r.attendance_status, r.guest_count, r.message as rsvp_message, r.updated_at as rsvp_updated_at
from public.guests g
left join public.rsvps r on r.guest_id = g.id;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────
-- RLS aktif & TIDAK ada policy untuk anon/authenticated:
-- browser tidak bisa membaca/menulis apa pun secara langsung.
-- Semua akses lewat API server Next.js memakai service role key.
alter table public.events  enable row level security;
alter table public.guests  enable row level security;
alter table public.rsvps   enable row level security;
alter table public.wishes  enable row level security;

revoke all on public.events, public.guests, public.rsvps, public.wishes, public.guest_rsvp_status from anon, authenticated;
