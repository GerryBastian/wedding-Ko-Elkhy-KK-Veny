/**
 * Membuat link WhatsApp Click-to-Chat (wa.me) dengan pesan undangan terisi otomatis.
 * Pengiriman tetap dilakukan manual oleh pengguna — tidak ada otomatisasi / kirim massal.
 */

/** Normalisasi nomor Indonesia: "0812-3456 789" / "+62812..." → "62812..." */
export function normalizePhoneNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export type InviteMessageInput = {
  guestName: string;
  invitationUrl: string;
  groomName: string;
  brideName: string;
  dateLabel: string;
};

export function buildInviteMessage({ guestName, invitationUrl, groomName, brideName, dateLabel }: InviteMessageInput) {
  return [
    `Kepada Yth.`,
    `*${guestName}*`,
    ``,
    `Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan hari pernikahan kami:`,
    ``,
    `*${groomName} & ${brideName}*`,
    dateLabel,
    ``,
    `Silakan buka undangan pribadi Anda melalui tautan berikut:`,
    invitationUrl,
    ``,
    `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`,
    ``,
    `Terima kasih.`,
    `Kami yang berbahagia,`,
    `${groomName} & ${brideName}`,
  ].join("\n");
}

/** Jika nomor tidak ada/tidak valid, link membuka WhatsApp untuk memilih kontak sendiri. */
export function buildWhatsAppLink(phone: string | null | undefined, message: string) {
  const number = normalizePhoneNumber(phone);
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function buildWhatsAppInvite(input: InviteMessageInput & { phone?: string | null }) {
  return buildWhatsAppLink(input.phone, buildInviteMessage(input));
}
