export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

export function invitationPath(slug: string, token: string) {
  return `/undangan/${encodeURIComponent(slug)}/${encodeURIComponent(token)}`;
}

export function invitationUrl(slug: string, token: string, baseUrl = getSiteUrl()) {
  return `${baseUrl}${invitationPath(slug, token)}`;
}
