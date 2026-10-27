import { wedding } from "@/config/wedding";

export function formatDateTimeId(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("id-ID", { timeZone: wedding.timezone, ...opts }).format(new Date(iso));
}

export function formatRelativeId(iso: string) {
  return formatDateTimeId(iso, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
