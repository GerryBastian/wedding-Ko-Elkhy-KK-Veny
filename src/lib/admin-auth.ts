import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function sessionValue() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) return null;
  return createHmac("sha256", password).update("wedding-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function isAdminConfigured() {
  return sessionValue() !== null;
}

export async function isAdmin() {
  const expected = sessionValue();
  if (!expected) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value && safeEqual(value, expected));
}

export async function login(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  const session = sessionValue();
  if (!expected || !session || !safeEqual(password, expected)) return false;
  (await cookies()).set(COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
