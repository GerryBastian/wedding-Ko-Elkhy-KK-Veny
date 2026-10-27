const strip = (url: string) => url.trim().replace(/\/+$/, "");
const isLocalHost = (value: string) => /(^|\/\/)(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(value);

/**
 * URL publik situs. Urutan: NEXT_PUBLIC_SITE_URL → domain produksi Vercel → URL deploy Vercel → localhost.
 * Di Vercel, nilai "localhost" (salah salin dari .env.local) diabaikan.
 */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured && !(process.env.VERCEL && isLocalHost(configured))) return strip(configured);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${strip(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`;
  if (process.env.VERCEL_URL) return `https://${strip(process.env.VERCEL_URL)}`;
  return "http://localhost:3000";
}

/**
 * URL dasar dari request yang sedang berjalan (dipakai di admin): link tamu selalu
 * mengikuti alamat tempat admin dibuka. Jika dibuka di localhost, kembali ke getSiteUrl().
 */
export function siteUrlFromHeaders(headers: Headers) {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host || isLocalHost(host)) return getSiteUrl();
  const proto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  return `${proto}://${host}`;
}

export function invitationPath(slug: string, token: string) {
  return `/undangan/${encodeURIComponent(slug)}/${encodeURIComponent(token)}`;
}

export function invitationUrl(slug: string, token: string, baseUrl = getSiteUrl()) {
  return `${baseUrl}${invitationPath(slug, token)}`;
}
