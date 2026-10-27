-- Data acara Elkhi & Veni (dari undangan cetak) + 1 tamu uji coba (token: uji123).
-- Jalankan setelah migrations/001_init.sql.

insert into public.events (slug, groom_name, bride_name, groom_parents, bride_parents, wedding_date, venue, address, cover_image)
values (
  'elkhi-veni',
  'Ricardus Elkhi Layansari',
  'Febronia Eli Manehat, S.Pd., Gr.',
  'Bapak Lambertus Fouk Layansari (Alm.) & Ibu Beatrix Tulasi',
  'Bapak Mikhael Manehat (Alm.) & Ibu Maria Bete Kore',
  '2026-11-06 09:00:00+08',
  'Gereja Paroki St. Laurensius Wemasa',
  'Wemasa',
  '/images/couple/cover.jpg'
)
on conflict (slug) do nothing;

-- Tamu contoh untuk uji coba — hapus/ganti sebelum undangan disebar.
insert into public.guests (event_id, guest_name, category, token)
select id, 'Tamu Uji Coba', 'Uji', 'uji123' from public.events where slug = 'elkhi-veni'
on conflict (token) do nothing;
